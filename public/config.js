/**
 * ============================================================
 *  SITE CONFIG — the ONE file to edit for your own site
 * ============================================================
 * Everything on the site (name, prices, packages, copy, chatbot
 * knowledge) is set here. You shouldn't need to touch the HTML,
 * CSS, or JS files to change any of it.
 * ============================================================
 */

export const SITE_CONFIG = {
  // ---- Brand identity -------------------------------------------------
  brand: {
    name: "Molten Studios",
    wordmark: "MOLTEN STUDIOS", // how it appears in the top-left nav
    // Domain not secured yet — update once you've registered one.
    domain: "moltenstudios.co",
    // The circular brand mark that sits beside the wordmark. The wordmark
    // itself stays as text, so the pair scales cleanly. null hides the mark.
    markImage: "assets/brand-mark.png",
  },

  // ---- Hero -----------------------------------------------------------
  hero: {
    eyebrow: "Web design · Enquiries & bookings · AI where it helps",
    // The headline is a fixed first line plus a second line that cycles.
    // The first phrase is the primary message — the rest are variations
    // on the same outcome, so the sentence always reads as a promise
    // about the business rather than about the tooling.
    headlineLead: "Websites built to",
    headlinePhrases: [
      "grow your business.",
      "win you customers.",
      "bring in enquiries.",
      "get you taken seriously.",
    ],
    phraseIntervalMs: 3800, // how long each phrase holds before swapping
    subhead:
      "Design, copy and setup handled end to end, so your business looks credible and turns visitors into enquiries. We use AI where it genuinely saves you time — not for the sake of it.",
    primaryCta: { label: "See packages", href: "#packages" },
    secondaryCta: { label: "WhatsApp us", href: "WHATSAPP" },
  },

  // ---- Trust strip ------------------------------------------------------
  // Short, checkable facts. Everything here must stay literally true —
  // a strip like this is worthless the moment one item is a stretch.
  trust: {
    items: [
      "Singapore-based",
      "Clear, published pricing",
      "Real client work",
      "Accounts stay in your name",
      "Third-party costs shown upfront",
    ],
  },

  // ---- Motion -----------------------------------------------------------
  motion: {
    // Windows and macOS both have a system-wide "reduce animations"
    // setting. With this false the site animates for everyone regardless.
    // Set it to true to honour that setting instead — some people enable
    // it because motion makes them genuinely unwell.
    respectReducedMotion: false,
  },

  // ---- Side section rail ------------------------------------------------
  // Fixed labels down the edge of the screen that jump to a section and
  // highlight whichever one you're currently looking at.
  sectionNav: {
    enabled: true,
    items: [
      { id: "hero", label: "Intro" },
      { id: "work", label: "Work" },
      { id: "what", label: "What we build" },
      { id: "audience", label: "Who we build for" },
      { id: "packages", label: "Packages" },
      { id: "why", label: "Why Molten" },
      { id: "process", label: "Process" },
      { id: "demo", label: "Live demo" },
      { id: "faq", label: "FAQs" },
      { id: "contact", label: "Contact" },
    ],
  },

  // ---- What we build --------------------------------------------------
  deliverables: {
    heading: "What we build.",
    intro:
      "One flat price covers design, copy, setup and handover. No retainer required, and no surprise invoices afterwards.",
    items: [
      {
        title: "A site that makes you look established",
        body: "Fast, mobile-first design that holds up next to far bigger competitors. Most people judge a business by its site before they ever call — this is that first impression.",
      },
      {
        title: "Enquiries and bookings that actually arrive",
        body: "Contact form, WhatsApp button and booking link wired up and tested on day one, going straight to your inbox and phone. No lost leads sitting in a form nobody checks.",
      },
      {
        title: "Words that sound like you",
        body: "Service descriptions, About copy and FAQs written for you and edited until they read like your business, not a template.",
      },
      {
        title: "AI automation, only where it earns its place",
        body: "An optional chatbot trained on your pricing and policies, answering customers at midnight and capturing their details. Skip it entirely if it would not pay for itself.",
      },
    ],
  },

  // ---- Who we build for -------------------------------------------------
  audience: {
    heading: "Who we build for.",
    intro:
      "Small teams where the website has a job to do. If a site would not move the needle for you, we will say so.",
    items: [
      {
        title: "Service businesses",
        body: "Clinics, salons, trades, tutors, contractors — anyone who needs to be found, trusted and then contacted.",
      },
      {
        title: "Startups",
        body: "Early teams who need a credible front door for customers and investors before there is budget for an agency.",
      },
      {
        title: "Creators and freelancers",
        body: "A portfolio and enquiry flow that works harder than a link in bio, and actually belongs to you.",
      },
      {
        title: "Local SMEs",
        body: "Established businesses running on word of mouth, a Facebook page, or a site that has aged badly.",
      },
    ],
  },

  // ---- Why Molten -------------------------------------------------------
  why: {
    heading: "Why Molten.",
    items: [
      {
        title: "Fast by design",
        body: "A focused build, not a three-month agency process. Most sites are live within a week of getting your content.",
      },
      {
        title: "Clear pricing",
        body: "Prices published on this page. You know the number before you speak to anyone, and it does not move.",
      },
      {
        title: "Built around your business",
        body: "We start from how you actually get customers, then design to that — rather than fitting you into a template.",
      },
      {
        title: "AI where it makes sense",
        body: "Used to save you time and money, and left out when it would only add cost. We will tell you which applies to you.",
      },
    ],
  },

  // ---- Packages / pricing ---------------------------------------------
  // Prices are shown exactly as written here — edit freely.
  packages: {
    heading: "Simple packages. Prices up front.",
    intro:
      "No quotes, and no discovery call before you know the number. Read the prices, take your time, and talk to us when something fits.",
    note: "Prices in SGD. Overseas clients welcome — pay in SGD, USD, or crypto (USDT/USDC). Nothing is billed monthly unless you take the care package, and nothing is due until you have seen a working demo of your own site — see How it works below.",
    // Stated plainly and near the prices, because an unexpected cost after
    // the invoice is the fastest way to lose a small business client.
    thirdPartyNote:
      "Domain, hosting, AI usage and any third-party services (booking, forms, payments) are paid directly by you, to those providers, on accounts in your name. We set everything up and connect it — you keep the logins and the billing. Typical running cost for a small site is a few dollars a month, plus your domain.",
    // The deposit is a contract point, not fine print. A prospect reads
    // "deposit" and immediately wants to know three things: how much, is
    // it extra, and what happens if they walk. Answering all three in the
    // open — next to the prices, not buried in the FAQ — is what makes
    // asking for money up front reasonable rather than suspicious.
    // Reframed away from "deposit". Money asked for before any value is
    // shown reads as a toll gate no matter how fairly it is worded — so
    // this leads with what the S$150 buys (a real working demo in 3-5
    // days) and lets the terms follow. It also sits after the process
    // rather than under the prices, for the same reason.
    deposit: {
      amount: "S$150",
      amountNote: "comes off your price",
      heading: "See your actual site before you commit.",
      intro:
        "Most studios show you a mockup and ask for half the fee. We would rather build the real thing first — your homepage and one key page, properly built, in 3 to 5 working days, for S$150 that comes off your price.",
      points: [
        {
          title: "A working demo, not a slide deck",
          body: "Inside 3 to 5 working days your homepage and one key page are properly built — real design, real copy, real buttons — on a private link you open on your own phone. The rest of the site is mapped out beside it so you can see where it goes. Not a mockup, not a template with your logo dropped in.",
        },
        {
          title: "It comes off your price, never added to it",
          body: "The S$150 is part of your package, just paid early. Starter Site leaves S$650. Site + AI Chatbot leaves S$1,350. If you take the demo no further, that is the whole of what you have spent.",
        },
        {
          title: "You decide once you have seen it",
          body: "Nothing else is due while you think about it. We finish the build, hand it over, and invoice the balance then. Once that is settled the site goes live on your domain, every login moves to you, and your round of changes begins.",
        },
        {
          title: "It is a slice, not the whole site",
          body: "Enough to judge the work, not a finished site you could launch — that is deliberate, and it is what lets us build something real for S$150 instead of sending a mockup. Stop after the demo and you keep it and owe nothing more, though the S$150 is not refunded, since it paid for the days behind it. Ownership of the full build passes to you when the balance is settled.",
        },
      ],
    },

    // `tone` controls each card's colour temperature:
    //   "quiet"    — restrained, minimal colour (entry option)
    //   "hot"      — amber into oxblood, the most saturated card
    //   "cool"     — sage green, deliberately contrasting the hot card
    tiers: [
      {
        name: "Starter Site",
        tone: "quiet",
        price: "S$800",
        priceNote: "one-time",
        summary: "A clean, fast website for a business that just needs to exist online properly.",
        features: [
          "Up to 4 pages",
          "AI-written copy, human-edited",
          "Contact form to your inbox",
          "Booking link setup",
          "Live in 5 working days",
        ],
        cta: { label: "Start with this", href: "#contact" },
        featured: false,
      },
      {
        name: "Site + AI Chatbot",
        tone: "hot",
        price: "S$1,500",
        priceNote: "one-time",
        summary:
          "The full package — a website plus a trained AI chatbot answering your customers day and night.",
        features: [
          "Everything in Starter Site",
          "AI chatbot trained on your business",
          "Automatic lead capture to your inbox",
          "Chat transcripts so you see what customers ask",
          "Live in 3–5 working days",
        ],
        cta: { label: "Most popular — start here", href: "#contact" },
        featured: true,
      },
      {
        name: "AI Content & Care",
        tone: "cool",
        price: "from S$350",
        priceNote: "per month",
        summary:
          "Ongoing work once you're live — content, updates, and sharpening the chatbot as you learn what customers ask.",
        features: [
          "Monthly content and page updates",
          "Chatbot tuning from real conversations",
          "Performance and enquiry reporting",
          "Priority turnaround on changes",
          "Cancel any time, no lock-in",
        ],
        cta: { label: "Add after launch", href: "#contact" },
        featured: false,
      },
    ],
  },

  // ---- How it works ---------------------------------------------------
  process: {
    heading: "Live in a week. Usually less.",
    steps: [
      {
        title: "Tell us about your business",
        body: "One short form or a 20-minute call. We collect your services, pricing, and the questions customers always ask you. Ask anything you want before committing to a package.",
      },
      {
        title: "We build the demo",
        body: "Three to five working days later your homepage and one key page are built and sitting on a private link, designed around how you actually get customers. This is the part the S$150 covers.",
      },
      {
        title: "You review, we settle up",
        body: "We hand over the finished build and invoice the balance — your package price less the S$150 already paid. Once it clears, your included round of changes begins: send one consolidated list and we work through it.",
      },
      {
        title: "Go live",
        body: "We publish it, connect your domain, hand over every login, and show you how to update it. It is yours from that day.",
      },
    ],
  },

  // ---- Live demo callout ----------------------------------------------
  demo: {
    eyebrow: "Try it now",
    heading: "The chatbot in the corner is the product.",
    body:
      "It isn't a canned script or a video. It's the same AI chatbot your customers would get, trained on this business the same way yours would be trained on yours. Ask it anything — pricing, timelines, what happens if you don't like the design.",
    cta: { label: "Open the chat", href: "#" },
  },

  // ---- Proof / selected work ------------------------------------------
  // Each project takes: name, category, status, summary, image, url.
  // `status` is shown as a badge — say plainly where the build actually
  // is. Claiming something is live when it isn't is the fastest way to
  // lose a prospect who clicks through and finds a preview.
  work: {
    heading: "Real builds, not mockups.",
    intro: "Open one and click through it yourself — the same link the client got.",
    emptyNote:
      "First client sites are being built now. This space will hold live links you can open and test yourself — not screenshots.",
    // Shown under the list while the roster is still short.
    moreNote: "More builds in progress. New work lands here as it ships.",
    projects: [
      {
        name: "Lucky Card Co.",
        category: "Website · Interactive demo",
        status: "Launching soon",
        summary:
          "$1 Pokémon card vending machines in Singapore. Built the full site — an interactive try-a-pull demo, a machine finder, and an enquiry form for shops that want a machine on site.",
        image: "assets/work-luckycardco.jpg",
        url: "https://luckycardco.pages.dev",
        // What was actually built, as scannable tags. These do the job a
        // paragraph can't: a prospect reads four of these in a second and
        // knows whether you can build the thing they need.
        tags: [
          "Interactive Demo",
          "Location Finder",
          "WhatsApp Enquiries",
          "Lead Capture",
        ],
        // A named client quote is the strongest proof a new studio can
        // show — it outperforms any amount of copy about yourself. Ask
        // for one sentence: what they needed, and how it went. Leave
        // blank and the block simply doesn't render.
        // Client-approved on 19 Sep 2026. Deliberately says nothing about
        // results — Lucky Card Co. had not launched, so there were none to
        // claim. It speaks only to what they personally experienced.
        quote: "We came with a rough idea and got back a finished site with the card-pull demo, a machine finder and an enquiry form already working. Easy to deal with and quick to make changes.",
        quoteAttribution: "Lucky Card Co."
      },
    ],
  },

  // ---- FAQ ------------------------------------------------------------
  faq: {
    heading: "The questions we get most.",
    items: [
      {
        q: "How fast can you actually deliver?",
        a: "Three to five working days to a working demo you can open yourself, counted from the moment we have your content. Most builds go from demo to live within the same week.",
      },
      {
        q: "What does it cost to run once it's live?",
        a: "A domain is roughly S$15–30 a year, paid to the registrar. Hosting for a site this size is usually a few dollars a month or less, and on some plans nothing at all — it depends on the provider and your traffic. If you take the AI chatbot, its usage typically runs S$2–15 a month. All of it is billed to you directly, so you always see the real numbers.",
      },
      {
        q: "Who pays for the domain, hosting and other services?",
        a: "You do, directly to those providers, on accounts in your own name. We set them up with you and connect everything, but we never put your business behind our billing. It costs you the same either way and means you are never locked to us.",
      },
      {
        q: "Do I own the site?",
        a: "Yes, completely. The site, the domain, the hosting account and every login are yours from handover day. There is no lock-in, no monthly fee holding it hostage, and you can take it to another developer whenever you like.",
      },
      {
        q: "I already have a domain. Can you use it?",
        a: "Yes. If you own one already we point it at the new site during launch, usually with a few minutes of downtime at most. You keep it registered wherever it is now — no need to move it to us.",
      },
      {
        q: "I have an old website. Can you redesign it instead?",
        a: "Yes, and it is often faster than starting cold because the content already exists. Tell us what is working, what is not, and what must carry over. Same packages, same prices.",
      },
      {
        q: "What exactly is in the S$150 demo?",
        a: "Your homepage and one key page — whichever one matters most to your business, usually your main service or booking page — designed and written properly, working on a private link you can open on your phone and send to anyone. The remaining pages are mapped out beside it so you can see the shape of the finished site. It is a slice, deliberately: enough to judge whether we are any good, built in days rather than weeks.",
      },
      {
        q: "How many rounds of changes do I get?",
        a: "One full round is included in every package — that means a consolidated list of changes, not one tweak. Most clients use it on wording. Beyond that, further changes are quoted, or covered by the monthly care package if you take it.",
      },
      {
        q: "What if I don't like it?",
        a: "You walk away and owe nothing beyond the S$150 already paid — no invoice, no argument, and the demo is yours to keep. That S$150 is not refunded, because it paid for the demo itself rather than acting as a holding fee. The demo is a slice of the site rather than the finished thing, so it is there to judge the work by, not to launch on; ownership of the full build passes to you when the balance is settled.",
      },
      {
        q: "Why S$150 before you start?",
        a: "Because the first thing we hand you is a real, working page of your own site rather than a proposal — and building that takes days of work. Keeping the demo to your homepage and one key page is what makes S$150 possible: small enough that you are not gambling on us, large enough that we can build something real instead of sending a mockup. It comes straight off your package price, so it is not an extra cost.",
      },
      {
        q: "What does the AI chatbot actually cost?",
        a: "The build is included in the Site + AI Chatbot package. Running it costs whatever it uses, typically S$2–15 a month for a small business, billed to your own account. If your enquiries are low enough that it would not pay for itself, we will tell you to skip it.",
      },
      {
        q: "Who maintains it after launch?",
        a: "You can — we hand over the site and show you how to change text and prices yourself. If you would rather not, the AI Content & Care package covers updates, chatbot tuning and priority changes from S$350 a month, and you can cancel it any time.",
      },
      {
        q: "Do you work with clients outside Singapore?",
        a: "Yes. Everything is done remotely over email and video calls, and timezones have not been a problem so far.",
      },
      {
        q: "How do I pay? Do you take crypto?",
        a: "Card, bank transfer, or crypto (USDT/USDC). Prices are listed in SGD and can be settled in SGD or USD. S$150 covers the demo and comes off your price; the balance is invoiced once the finished build is delivered.",
      },
    ],
  },

  // ---- Contact --------------------------------------------------------
  contact: {
    heading: "Have a business. Need a website?",
    body: "Tell us what the business does and which package fits. You'll get a reply within one working day — or message us on WhatsApp and get one sooner.",
    // Left blank deliberately: moltenstudios.co was never registered, so
    // this address bounced. The contact row hides itself while this is
    // empty. Fill it in the moment the real domain and mailbox exist.
    email: "",
    // Singapore mobile. `url` is what every WhatsApp button points at —
    // wa.me needs the country code and no plus sign or spaces.
    whatsapp: {
      display: "+65 8765 6647",
      url: "https://wa.me/6587656647",
      label: "WhatsApp us",
    },
    // Free form service — see notes in README. Leave as-is until you set one up.
    formspreeEndpoint: "", // e.g. "https://formspree.io/f/abc123xy"
    // Optional booking link (Calendly or similar). Leave blank to hide the button.
    bookingUrl: "",
  },

  // ---- Payment (set up later — nothing to build now) -------------------
  // When you land your first client, create a Stripe Payment Link (or
  // PayPal.me link) in their dashboard and paste the URL here. The deposit
  // button appears automatically. Leave blank and it stays hidden.
  payment: {
    depositLink: "",
    depositLabel: "Start my demo — S$150",
    acceptsCrypto: true,
  },

  // ---- Chatbot --------------------------------------------------------
  chatbot: {
    enabled: true,
    assistantName: "Molten AI",
    greeting:
      "Hi — I'm the same AI chatbot you'd get on your own site. Ask me about pricing, timelines, or how this works.",
    quickQuestions: [
      "How much does it cost?",
      "How fast can you build it?",
      "Do you accept crypto?",
    ],
    // Extra instructions appended to the chatbot's system prompt.
    systemPromptExtra:
      "You are selling a website + AI service. Be direct and confident, never pushy. If someone seems ready, ask for their email so a human can follow up.",
  },
};
