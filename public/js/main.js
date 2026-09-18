/**
 * Reads config.js and fills the page in.
 * You shouldn't need to edit this file — edit config.js instead.
 */
import { SITE_CONFIG } from "../config.js";

/* ---- helpers -------------------------------------------------------- */

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

function fillTextBindings() {
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const value = getPath(SITE_CONFIG, el.dataset.cfg);
    if (value != null) el.textContent = value;
  });
}

function fillCtaBindings() {
  document.querySelectorAll("[data-cta]").forEach((el) => {
    const cta = getPath(SITE_CONFIG, el.dataset.cta);
    if (!cta) return;
    el.textContent = cta.label;
    // The sentinel keeps the phone number in exactly one place in config.
    el.href = cta.href === "WHATSAPP" ? whatsappUrl() : cta.href;
    if (cta.href === "WHATSAPP") {
      el.target = "_blank";
      el.rel = "noopener";
    }
  });
}

function whatsappUrl() {
  return SITE_CONFIG.contact?.whatsapp?.url || "#contact";
}

function renderWhatsAppCtas() {
  const wa = SITE_CONFIG.contact?.whatsapp;
  document.querySelectorAll("[data-whatsapp-cta]").forEach((el) => {
    if (!wa?.url) {
      el.remove();
      return;
    }
    el.textContent = wa.label || "WhatsApp us";
    el.href = wa.url;
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---- Simple list sections -------------------------------------------- */

function renderTrustStrip() {
  const host = document.querySelector("[data-trust]");
  if (!host) return;
  const items = SITE_CONFIG.trust?.items || [];
  if (items.length === 0) {
    host.closest(".trust-strip")?.remove();
    return;
  }
  host.innerHTML = items.map((t) => `<li>${t}</li>`).join("");
}

function renderAudience() {
  const host = document.querySelector("[data-audience]");
  if (!host) return;
  host.innerHTML = (SITE_CONFIG.audience?.items || [])
    .map(
      (item) => `
      <div class="audience-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>`
    )
    .join("");
}

function renderWhy() {
  const host = document.querySelector("[data-why]");
  if (!host) return;
  host.innerHTML = (SITE_CONFIG.why?.items || [])
    .map(
      (item) => `
      <div class="why-card">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>`
    )
    .join("");
}

/* ---- brand ---------------------------------------------------------- */

function renderBrand() {
  const { brand } = SITE_CONFIG;

  // The lockup is composed here rather than shipped as one flat image, so
  // the wordmark stays real text — crisp at any size, selectable, and
  // readable by search engines and screen readers.
  document.querySelectorAll("[data-wordmark]").forEach((el) => {
    const mark = brand.markImage
      ? `<img class="brand-mark" src="${brand.markImage}" alt="" aria-hidden="true">`
      : "";
    el.innerHTML = `${mark}<span class="brand-text">${brand.wordmark}</span>`;
  });

  document.querySelectorAll("[data-brand-name]").forEach((el) => {
    el.textContent = brand.name;
  });

  // The static <title> already carries the brand name — prepending it
  // here too produced "Molten Studios — Molten Studios — ...". Leaving
  // the markup to own the title also means crawlers that do not run JS
  // see the right thing.

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---- header behaviour ----------------------------------------------- */

function initHeader() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  // Solid white bar once you scroll off the hero, so navigation is always
  // findable — a deliberate departure from the pure editorial reference.
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }
}

/* ---- scroll-driven motion -------------------------------------------
   One requestAnimationFrame loop drives both the reading-progress bar
   and the badge rotation. The badge eases toward a target angle derived
   from scroll position, so it turns while you scroll and glides to a
   stop when you stop — rather than spinning on a timer.
   -------------------------------------------------------------------- */

/* ---- Motion policy ---------------------------------------------------
   The OS "reduce animations" setting is honoured only when the config
   opts in. With respectReducedMotion false the site animates for
   everyone, which is what a motion-led design usually wants — at the
   cost of overriding a setting some people rely on.
   -------------------------------------------------------------------- */

function prefersReduced() {
  if (!SITE_CONFIG.motion?.respectReducedMotion) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function applyMotionPolicy() {
  document.body.classList.toggle("reduce-motion", prefersReduced());
}

/* ---- Hero: cycling phrase -------------------------------------------
   The second line of the headline swaps through a list of phrases,
   blurring out and back in on the shared easing curve.
   -------------------------------------------------------------------- */

function initHeroPhrases() {
  const el = document.getElementById("hero-phrase");
  if (!el) return;

  const phrases = SITE_CONFIG.hero.headlinePhrases || [];
  if (phrases.length === 0) return;

  let index = 0;
  el.textContent = phrases[0];

  // A single phrase, or reduced motion, means no cycling at all.
  if (phrases.length === 1) return;
  if (prefersReduced()) return;

  const hold = SITE_CONFIG.hero.phraseIntervalMs || 3200;

  // Must match the .line-phrase transition duration in the stylesheet.
  const SWAP_MS = 420;

  setInterval(() => {
    el.classList.add("swapping");
    // Swap the text at the midpoint, while it's invisible.
    setTimeout(() => {
      index = (index + 1) % phrases.length;
      el.textContent = phrases[index];
      el.classList.remove("swapping");
    }, SWAP_MS);
  }, hold);
}

/* ---- Section rail ----------------------------------------------------
   Fixed labels down the edge. Clicking one scrolls to that section;
   scrolling highlights whichever section currently fills the view.
   -------------------------------------------------------------------- */

function initSectionRail() {
  const rail = document.getElementById("section-rail");
  if (!rail) return;

  const cfg = SITE_CONFIG.sectionNav || {};
  if (!cfg.enabled || !cfg.items) {
    rail.style.display = "none";
    return;
  }

  // Only keep entries whose section actually exists on the page.
  const items = cfg.items.filter((item) => document.getElementById(item.id));
  if (items.length === 0) {
    rail.style.display = "none";
    return;
  }

  // The readout lives in the markup and must survive this rebuild.
  const readout = rail.querySelector(".rail-readout");
  rail.innerHTML = items
    .map(
      (item) => `
      <a class="rail-item" href="#${item.id}" data-rail="${item.id}">
        <span class="rail-label">${item.label}</span>
        <span class="rail-tick"></span>
      </a>`
    )
    .join("");
  if (readout) rail.prepend(readout);

  const links = new Map(
    [...rail.querySelectorAll("[data-rail]")].map((el) => [el.dataset.rail, el])
  );

  function setActive(id) {
    links.forEach((el, key) => el.classList.toggle("active", key === id));
  }

  // Whichever section covers the middle of the viewport wins.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
  );

  items.forEach((item) => observer.observe(document.getElementById(item.id)));
  setActive(items[0].id);
}

/* ---- The molten canvas ------------------------------------------------
   Five photographic stages behind the whole page, cross-fading as you
   scroll: liquid pour → turbulence → crusting → ember → set.

   Each layer owns a point on the 0..1 scroll track and fades out as you
   move away from it, so at any moment you are seeing at most two stages
   blended. Layers also drift vertically and breathe in scale, which is
   what stops a fixed background from feeling like a static wallpaper.
   -------------------------------------------------------------------- */

const CANVAS_DRIFT_PX = 70; // vertical travel of a layer across its band

// Safari still has no requestIdleCallback, so fall back to a timeout.
function requestIdleCallbackShim(fn) {
  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(fn, { timeout: 2500 });
  } else {
    setTimeout(fn, 600);
  }
}

function initMoltenCanvas() {
  const layers = [...document.querySelectorAll(".molten-layer")];
  if (layers.length === 0) return;

  const readout = document.getElementById("rail-readout");
  const last = layers.length - 1;
  const band = last > 0 ? 1 / last : 1;
  let lastStage = null;

  // Attach the deferred stages once the page has settled. The hero's
  // stage is already in the markup; the rest are full-quality files and
  // would otherwise compete with first paint on a slow connection.
  function loadDeferredStages() {
    layers.forEach((layer) => {
      const src = layer.dataset.bg;
      if (!src) return;
      const img = new Image();
      img.onload = () => {
        layer.style.backgroundImage = `url('${src}')`;
      };
      img.src = src;
      delete layer.dataset.bg;
    });
  }

  if (document.readyState === "complete") {
    requestIdleCallbackShim(loadDeferredStages);
  } else {
    window.addEventListener("load", () => requestIdleCallbackShim(loadDeferredStages), {
      once: true,
    });
  }

  // The first stage is visible before any scrolling happens.
  layers[0].style.opacity = "1";

  function paint(progress) {
    let strongest = 0;
    let strongestOpacity = -1;

    layers.forEach((layer, i) => {
      const center = last > 0 ? i / last : 0;
      // How far this layer is from being the active one, in bands.
      const distance = Math.abs(progress - center) / band;
      const opacity = Math.max(0, 1 - distance);

      layer.style.opacity = opacity.toFixed(3);

      if (opacity > strongestOpacity) {
        strongestOpacity = opacity;
        strongest = i;
      }

      // Local position within this layer's band, -1 → 1.
      const local = Math.max(-1, Math.min(1, (progress - center) / band));
      const shift = -local * CANVAS_DRIFT_PX;
      const scale = 1.06 + Math.abs(local) * 0.05;
      layer.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    });

    if (readout) {
      const stage = layers[strongest].dataset.stage || "";
      if (stage !== lastStage) {
        readout.textContent = stage;
        lastStage = stage;
      }
    }
  }

  if (prefersReduced()) {
    // Still crossfade with scroll position, just without the drift.
    const sync = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      paint(max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0);
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return;
  }

  // Eased so the material lags the scroll slightly rather than tracking
  // it exactly — the same patience the rest of the motion has.
  let smoothed = 0;
  onFrame((delta, eased) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    smoothed = eased(smoothed, target, 0.09, delta);
    paint(smoothed);
  });
}

/* ---- Scroll motion --------------------------------------------------- */

// Anything registered here runs once per animation frame, so the whole
// site shares a single requestAnimationFrame loop.
// (The scroll badge is NOT here — it spins on a plain CSS animation.)
const frameTasks = [];
function onFrame(fn) {
  frameTasks.push(fn);
}

// Per-frame easing factor, normalised below so the feel stays identical
// on 60Hz and 120Hz screens.
const PROGRESS_EASE = 0.14;

function initScrollMotion() {
  const reduced = prefersReduced();

  let progressValue = 0;
  let lastWrittenProgress = null;
  let lastFrameTime = performance.now();
  let running = false;

  function scrollFraction() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  }

  // Frame-rate independent easing: without this, a 120Hz display eases
  // twice as fast as a 60Hz one and the motion feels different per machine.
  function eased(current, target, factor, deltaMs) {
    const steps = deltaMs / (1000 / 60);
    return current + (target - current) * (1 - Math.pow(1 - factor, steps));
  }

  function write() {
    const value = Number(progressValue.toFixed(4));
    if (value === lastWrittenProgress) return;
    // Set on the root so anything can read it — the top progress bar and
    // the heat gauge fill both derive their size from this one value.
    document.documentElement.style.setProperty("--progress", value);
    lastWrittenProgress = value;
  }

  function tick(now) {
    if (!running) return;

    // Cap the delta so a backgrounded tab doesn't cause a huge jump
    // on return.
    const delta = Math.min(now - lastFrameTime, 64);
    lastFrameTime = now;

    // Scroll position is sampled here, inside the frame, rather than in
    // a scroll listener. Scroll events fire irregularly and can batch;
    // sampling once per frame keeps the motion perfectly even.
    progressValue = eased(progressValue, scrollFraction(), PROGRESS_EASE, delta);

    write();

    // Anything else that needs a frame (the cursor orb and the hover
    // bubble) rides along on this same loop.
    for (const task of frameTasks) task(delta, eased);

    requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    lastFrameTime = performance.now();
    requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
  }

  if (reduced) {
    // Snap the progress bar straight to position, no glide.
    const sync = () => {
      progressValue = scrollFraction();
      write();
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return;
  }

  // Start already settled so nothing sweeps in on first paint.
  progressValue = scrollFraction();
  write();
  start();

  // Don't burn frames while the tab is in the background.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
}

/* ---- reveal on scroll ------------------------------------------------ */

function initReveals() {
  const targets = document.querySelectorAll(
    ".section-head, .deliverables, .package-grid, .steps, .faq-list, .demo-inner, .contact-inner, .package-note, [data-work] > *"
  );

  // Stagger direct children of grid/list containers.
  document
    .querySelectorAll(".deliverables, .package-grid, .steps, .faq-list")
    .forEach((container) => {
      container.classList.add("reveal-stagger");
      [...container.children].forEach((child, i) => {
        child.style.setProperty("--i", i);
      });
    });

  targets.forEach((el) => {
    if (!el.classList.contains("reveal-stagger")) el.classList.add("reveal");
  });

  // Safety net: if the browser can't observe intersections, show
  // everything immediately rather than leaving the page blank.
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
      el.classList.add("in");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
    observer.observe(el);
  });
}

/* ---- sections ------------------------------------------------------- */

function renderDeliverables() {
  const host = document.querySelector("[data-deliverables]");
  if (!host) return;
  // Not numbered: these are four things you get, not four steps in an
  // order. Numbering them would dress a list up as a sequence and imply
  // a progression that isn't there. The process section IS a sequence,
  // and keeps its numbers.
  host.innerHTML = SITE_CONFIG.deliverables.items
    .map(
      (item) => `
      <div class="deliverable">
        <h3>${item.title}</h3>
        <p>${item.body}</p>
      </div>`
    )
    .join("");
}

function renderPackages() {
  const host = document.querySelector("[data-packages]");
  if (!host) return;

  host.innerHTML = SITE_CONFIG.packages.tiers
    .map(
      (tier) => `
      <div class="package tone-${tier.tone || "quiet"}${tier.featured ? " featured" : ""}">
        <div class="package-tag">${tier.name}</div>
        <div class="package-price">${tier.price}</div>
        <div class="price-note">${tier.priceNote}</div>
        <p class="package-summary">${tier.summary}</p>
        <ul class="package-features">
          ${tier.features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
        <a href="${tier.cta.href}" class="btn ${
        tier.featured ? "btn-solid-inverse" : "btn-ghost-light"
      }">${tier.cta.label}</a>
        <span class="package-glow" aria-hidden="true"></span>
      </div>`
    )
    .join("");
}

// Deposit terms. Numbered, because unlike the deliverables these really
// are a sequence — what you pay, what it buys, what comes off, what
// happens if you stop. Reading them out of order loses the argument.
function renderDeposit() {
  const host = document.querySelector("[data-deposit]");
  if (!host) return;
  const dep = SITE_CONFIG.packages.deposit;
  if (!dep || !dep.points?.length) {
    host.style.display = "none";
    return;
  }

  const points = dep.points
    .map(
      (pt, i) => `
      <li class="deposit-point">
        <span class="deposit-num">${String(i + 1).padStart(2, "0")}</span>
        <h4>${pt.title}</h4>
        <p>${pt.body}</p>
      </li>`
    )
    .join("");

  host.innerHTML = `
    <div class="deposit-head">
      <div class="deposit-figure">
        <p class="deposit-amount">${dep.amount}</p>
        ${dep.amountNote ? `<p class="deposit-amount-note">${dep.amountNote}</p>` : ""}
      </div>
      <div>
        <h3 class="deposit-heading">${dep.heading}</h3>
        ${dep.intro ? `<p class="deposit-intro">${dep.intro}</p>` : ""}
      </div>
    </div>
    <ol class="deposit-points">${points}</ol>`;
}

// The deposit button only appears once a payment link is pasted into
// config.js. Until then this stays hidden — nothing to build yet.
function renderDepositLink() {
  const slot = document.querySelector("[data-deposit-slot]");
  if (!slot) return;
  const { depositLink, depositLabel } = SITE_CONFIG.payment;
  if (!depositLink) {
    slot.style.display = "none";
    return;
  }
  slot.innerHTML = `<a href="${depositLink}" class="btn btn-solid" target="_blank" rel="noopener">${depositLabel}</a>`;
}

function renderSteps() {
  const host = document.querySelector("[data-steps]");
  if (!host) return;
  host.innerHTML = SITE_CONFIG.process.steps
    .map(
      (step, i) => `
      <div class="step">
        <span class="num">${String(i + 1).padStart(2, "0")}</span>
        <h3>${step.title}</h3>
        <p>${step.body}</p>
      </div>`
    )
    .join("");
}

function renderWork() {
  const host = document.querySelector("[data-work]");
  if (!host) return;
  const { projects, emptyNote, intro, moreNote } = SITE_CONFIG.work;

  if (!projects || projects.length === 0) {
    host.innerHTML = `<div class="work-empty"><p>${emptyNote}</p></div>`;
    return;
  }

  // Every field except name and url is optional, so a bare entry still
  // renders sensibly if one gets added in a hurry later.
  const cards = projects
    .map((p) => {
      const shot = p.image
        ? `<a class="work-shot" href="${p.url}" target="_blank" rel="noopener"
              aria-label="Open the ${p.name} site in a new tab">
             <img src="${p.image}" alt="The ${p.name} website" loading="lazy" decoding="async" />
           </a>`
        : "";

      const status = p.status ? `<span class="work-status">${p.status}</span>` : "";
      const tags = p.tags?.length
        ? `<ul class="work-tags">${p.tags.map((t) => `<li>${t}</li>`).join("")}</ul>`
        : "";
      const category = p.category ? `<p class="work-category">${p.category}</p>` : "";
      const summary = p.summary ? `<p class="work-summary">${p.summary}</p>` : "";

      // Renders only once a real quote exists. An empty pull-quote frame
      // looks worse than no quote at all.
      const quote = p.quote
        ? `<blockquote class="work-quote">
             <p>${p.quote}</p>
             ${p.quoteAttribution ? `<cite>${p.quoteAttribution}</cite>` : ""}
           </blockquote>`
        : "";

      return `
        <article class="work-card work-case">
          ${shot}
          <div class="work-body">
            <div class="work-top">
              <h3 class="work-name">${p.name}</h3>
              ${status}
            </div>
            ${category}
            ${summary}
            ${tags}
            ${quote}
            <a class="work-link" href="${p.url}" target="_blank" rel="noopener">
              Open the site
              <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </article>`;
    })
    .join("");

  const more = moreNote ? `<p class="work-more">${moreNote}</p>` : "";

  host.innerHTML =
    `<p class="lede work-intro">${intro}</p>` + cards + more;
}

function renderFaq() {
  const host = document.querySelector("[data-faq]");
  if (!host) return;

  host.innerHTML = SITE_CONFIG.faq.items
    .map(
      (item, i) => `
      <div class="faq-item">
        <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${i}">${item.q}</button>
        <div class="faq-a" id="faq-a-${i}"><p>${item.a}</p></div>
      </div>`
    )
    .join("");

  host.querySelectorAll(".faq-q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

/* ---- contact -------------------------------------------------------- */

function renderContact() {
  const { contact, packages } = SITE_CONFIG;

  // Publishing an address that bounces is worse than publishing none, so
  // the whole row is pulled when there is no working address to show.
  document.querySelectorAll("[data-contact-email]").forEach((el) => {
    const row = el.closest("dl, .contact-aside") || el.parentElement;
    if (!contact.email) {
      if (row) row.style.display = "none";
      return;
    }
    el.textContent = contact.email;
    el.href = `mailto:${contact.email}`;
  });

  const select = document.querySelector("[data-package-options]");
  if (select) {
    select.innerHTML =
      `<option value="">Not sure yet</option>` +
      packages.tiers
        .map((t) => `<option value="${t.name}">${t.name} — ${t.price}</option>`)
        .join("");
  }
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector(".form-status");
  const endpoint = SITE_CONFIG.contact.formspreeEndpoint;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // No form service connected yet, so the enquiry goes to WhatsApp with
    // the answers already written out. The previous fallback opened a
    // mailto: to an address on a domain that does not resolve, so every
    // enquiry submitted through this form bounced. WhatsApp is the one
    // channel that works today, and it is where most Singapore enquiries
    // would rather land anyway.
    if (!endpoint) {
      const data = new FormData(form);
      const lines = [
        "Hi Molten Studios — enquiry from your website.",
        "",
        "Name: " + data.get("name"),
        "Email: " + data.get("email"),
        "Package: " + (data.get("package") || "Not sure yet"),
        "",
        data.get("message"),
      ];
      const text = encodeURIComponent(lines.join(String.fromCharCode(10)));
      window.open(whatsappUrl() + "?text=" + text, "_blank", "noopener");
      status.textContent = "Opening WhatsApp with your details filled in…";
      status.className = "form-status";
      return;
    }

    status.textContent = "Sending…";
    status.className = "form-status";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("failed");
      form.reset();
      status.textContent = "Thanks — you'll get a reply within one working day.";
      status.className = "form-status";
    } catch {
      status.textContent = `Something went wrong. Please message us on WhatsApp at ${SITE_CONFIG.contact.whatsapp.display}.`;
      status.className = "form-status error";
    }
  });
}

/* ---- boot ----------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  applyMotionPolicy();
  renderBrand();
  fillTextBindings();
  fillCtaBindings();
  initHeader();
  initHeroPhrases();
  renderTrustStrip();
  renderAudience();
  renderWhy();
  renderWhatsAppCtas();
  renderDeliverables();
  renderPackages();
  renderDeposit();
  renderDepositLink();
  renderSteps();
  renderWork();
  renderFaq();
  renderContact();
  initContactForm();

  // These run last: reveals and the rail need the rendered content
  // to exist first.
  initSectionRail();
  // Registers a frame task, so it must run before the loop starts.
  initMoltenCanvas();
  initScrollMotion();
  initReveals();
});

export { SITE_CONFIG };
