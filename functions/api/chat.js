/**
 * Cloudflare Pages Function — serverless endpoint at /api/chat
 *
 * The only place the Anthropic API key is used. Everything the chatbot
 * knows is built from config.js, so there is one source of truth —
 * edit config.js, not this file.
 *
 * Set ANTHROPIC_API_KEY as a secret in the Cloudflare Pages project
 * (or in .dev.vars for local testing).
 */
import { SITE_CONFIG } from "../../public/config.js";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 400;
const MAX_HISTORY_TURNS = 10;
const MAX_MESSAGE_LENGTH = 800;

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/;

function buildSystemPrompt() {
  const cfg = SITE_CONFIG;

  const packagesBlock = cfg.packages.tiers
    .map(
      (t) =>
        `- ${t.name} — ${t.price} ${t.priceNote}. ${t.summary}\n  Includes: ${t.features.join("; ")}`
    )
    .join("\n");

  const processBlock = cfg.process.steps
    .map((s, i) => `${i + 1}. ${s.title} — ${s.body}`)
    .join("\n");

  const faqBlock = cfg.faq.items
    .map((f, i) => `${i + 1}. Q: ${f.q}\n   A: ${f.a}`)
    .join("\n");

  const deliverablesBlock = cfg.deliverables.items
    .map((d) => `- ${d.title}: ${d.body}`)
    .join("\n");

  // Deposit terms are the one thing the bot must never improvise on, so
  // they go into the prompt as their own labelled block.
  const dep = cfg.packages.deposit;
  const depositBlock = dep
    ? `${dep.intro}` +
      dep.points.map((pt) => `\n- ${pt.title}: ${pt.body}`).join("")
    : "";

  return `You are the AI assistant on the website of ${cfg.brand.name}, a studio that builds websites, AI chatbots, and AI content for small businesses.

You are also a live demonstration of the product itself: visitors are told "the chatbot in the corner is the product." Be genuinely useful and sharp, because how well you answer is part of what sells the service.

Answer in 2-4 sentences using ONLY the information below. If you don't know something, say so honestly and offer to pass the question to a human — never invent prices, dates, guarantees, or policies.

WHAT THEY DO:
${deliverablesBlock}

PACKAGES AND PRICING:
${packagesBlock}

PAYMENT AND TERMS:
${cfg.packages.note}

THE DEMO OFFER${dep ? ` (${dep.amount})` : ""} — quote these terms as written. Never soften the refund position:
${depositBlock}

HOW THE PROCESS WORKS:
${processBlock}

FREQUENTLY ASKED QUESTIONS:
${faqBlock}

CONTACT:
Email: ${cfg.contact.email}
${cfg.contact.bookingUrl ? `Booking link: ${cfg.contact.bookingUrl}` : ""}

HOW TO HANDLE SPECIFIC SITUATIONS:
- If asked about price, give the actual number from the packages above. Never deflect to "it depends" or "contact us for a quote" — visible pricing is deliberate here.
- If asked how fast: 3-5 working days to a working demo of their own site that they can open themselves, counted from when we have their content. Lead with the demo — it is the strongest thing on offer.
- Never push for the S$150 unprompted. If they ask what it costs to start, answer plainly and frame it as what it buys: a real working demo, not a mockup, and it comes off the package price rather than being added to it.
- If asked about refunds or what happens if they don't like the result, use the terms above. The S$150 is not refunded because it paid for the demo they keep, and the right to publish transfers on full payment. Never turn that into a refund or a money-back guarantee, and never imply there is one.
- If asked about services beyond websites, chatbots, and content (for example video, ads, or automation work), say it's worth asking about and take their email so a human can answer properly. Don't promise a service or a price that isn't listed above.
- If asked whether they work with clients outside Singapore, the answer is yes — everything is remote.
- If asked about crypto: card, bank transfer, and crypto (USDT/USDC) are all accepted, priced in SGD, settled in SGD or USD.
- If someone seems ready to start, ask for their email so a human can follow up within one working day.
- If someone asks to speak to a real person, ask for their name and email and confirm a human will reply directly.
- If the message is off-topic or spam, redirect politely: "I can help with pricing, timelines, and how the build works — what would you like to know?"
- When a visitor shares an email address, thank them and confirm someone will be in touch.

ADDITIONAL INSTRUCTIONS:
${cfg.chatbot.systemPromptExtra}

Keep replies short, direct, and human. No corporate filler, no exclamation marks, no emoji.`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function forwardLead(email, message, history) {
  const endpoint = SITE_CONFIG.contact.formspreeEndpoint;
  if (!endpoint) return;

  const recent = (history || [])
    .slice(-6)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        name: "(from website chatbot)",
        email,
        message: `Lead captured from the website chatbot.\n\nTheir message: "${message}"\n\nRecent conversation:\n${recent || "(none)"}`,
      }),
    });
  } catch (err) {
    console.error("Lead forward failed:", err);
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Chat is not configured yet. Missing ANTHROPIC_API_KEY." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) return json({ error: "Message is required." }, 400);
  if (message.length > MAX_MESSAGE_LENGTH) return json({ error: "Message is too long." }, 400);

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
        )
        .slice(-MAX_HISTORY_TURNS)
    : [];

  const messages = [...history, { role: "user", content: message }];
  const email = message.match(EMAIL_PATTERN)?.[0] || null;

  let reply;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(),
        messages,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("Anthropic API error:", res.status, errBody);
      return json({ error: "Chat service is temporarily unavailable." }, 502);
    }

    const data = await res.json();

    if (data.stop_reason === "refusal") {
      reply = `I'm not able to help with that. Feel free to email ${SITE_CONFIG.contact.email}.`;
    } else {
      const textBlock = Array.isArray(data.content)
        ? data.content.find((b) => b.type === "text")
        : null;
      reply = textBlock?.text?.trim() || "Sorry, I couldn't come up with a response — please try again.";
    }
  } catch (err) {
    console.error("Chat function error:", err);
    return json({ error: "Something went wrong." }, 500);
  }

  if (email) {
    const task = forwardLead(email, message, history);
    if (context.waitUntil) context.waitUntil(task);
    else await task;
  }

  return json({ reply });
}
