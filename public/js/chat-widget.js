/**
 * Floating chat widget. Talks to /api/chat, a small serverless function
 * that calls Claude on the server — the API key never reaches the browser.
 */
import { SITE_CONFIG } from "../config.js";

function buildWidgetHTML() {
  const cfg = SITE_CONFIG.chatbot;
  return `
    <div class="chat-panel" id="chat-panel" role="dialog" aria-label="Chat">
      <div class="chat-header">
        <div>
          <div class="title">${cfg.assistantName}</div>
          <div class="subtitle">Live demo · replies in seconds</div>
        </div>
        <button class="chat-close" id="chat-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-quick-actions" id="chat-quick-actions"></div>
      <form class="chat-input-row" id="chat-form">
        <input type="text" id="chat-input" placeholder="Ask anything…" autocomplete="off" />
        <button type="submit" id="chat-send">Send</button>
      </form>
    </div>
    <button class="chat-launcher" id="chat-launcher" aria-label="Open chat">
      <span class="dot"></span> Ask our AI
    </button>
  `;
}

function addBubble(container, text, who) {
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${who}`;
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function addTypingBubble(container) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble bot typing";
  bubble.innerHTML = "<span></span><span></span><span></span>";
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
  return bubble;
}

function initChatWidget() {
  if (!SITE_CONFIG.chatbot.enabled) return;

  const root = document.createElement("div");
  root.id = "chat-widget";
  root.innerHTML = buildWidgetHTML();
  document.body.appendChild(root);

  const launcher = root.querySelector("#chat-launcher");
  const panel = root.querySelector("#chat-panel");
  const closeBtn = root.querySelector("#chat-close");
  const messages = root.querySelector("#chat-messages");
  const form = root.querySelector("#chat-form");
  const input = root.querySelector("#chat-input");
  const sendBtn = root.querySelector("#chat-send");
  const quickActions = root.querySelector("#chat-quick-actions");

  const history = [];
  let opened = false;

  function openPanel() {
    panel.classList.add("open");
    // Next frame, so the browser has a starting state to animate from.
    requestAnimationFrame(() => panel.classList.add("visible"));
    if (!opened) {
      addBubble(messages, SITE_CONFIG.chatbot.greeting, "bot");
      renderQuickActions();
      opened = true;
    }
    input.focus();
  }

  function closePanel() {
    panel.classList.remove("visible");
    // Wait for the fade-out before removing it from the layout.
    setTimeout(() => panel.classList.remove("open"), 500);
  }

  function renderQuickActions() {
    const questions = SITE_CONFIG.chatbot.quickQuestions || [];
    quickActions.innerHTML = questions
      .map((q, i) => `<button type="button" data-q="${i}">${q}</button>`)
      .join("");
    quickActions.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = questions[Number(btn.dataset.q)];
        quickActions.innerHTML = "";
        sendMessage(q);
      });
    });
  }

  launcher.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);

  // The "Open the chat" button in the demo section on the page.
  const pageCta = document.getElementById("open-chat-cta");
  if (pageCta) {
    pageCta.addEventListener("click", (e) => {
      e.preventDefault();
      openPanel();
    });
  }

  async function sendMessage(text) {
    addBubble(messages, text, "user");
    history.push({ role: "user", content: text });
    input.value = "";
    sendBtn.disabled = true;

    const typing = addTypingBubble(messages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
      });
      const data = await res.json();
      typing.remove();

      if (!res.ok || data.error) {
        addBubble(
          messages,
          `Sorry, I'm having trouble responding right now. You can message us on WhatsApp at ${SITE_CONFIG.contact.whatsapp.display}.`,
          "bot"
        );
      } else {
        addBubble(messages, data.reply, "bot");
        history.push({ role: "assistant", content: data.reply });
      }
    } catch {
      typing.remove();
      addBubble(
        messages,
        `Sorry, something went wrong. You can message us on WhatsApp at ${SITE_CONFIG.contact.whatsapp.display}.`,
        "bot"
      );
    } finally {
      sendBtn.disabled = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendMessage(text);
  });
}

document.addEventListener("DOMContentLoaded", initChatWidget);
