/* Covenant Earth Works — site behaviour. No dependencies. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- sticky header state ---------- */
  var header = document.querySelector(".header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  if (burger && drawer) {
    var setOpen = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      drawer.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      setOpen(burger.getAttribute("aria-expanded") !== "true");
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1080 && drawer.classList.contains("is-open")) setOpen(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".rv");
  if (reveals.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- quote form → Netlify Forms ---------- */
  var form = document.getElementById("quote-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var ta = form.querySelector("textarea");
  var counter = form.querySelector(".field__count");
  var EMAIL = (form.getAttribute("data-email") || "").trim();
  var TEL   = (form.getAttribute("data-tel") || "").trim();
  var btn = form.querySelector('button[type="submit"]');

  if (ta && counter) {
    var max = parseInt(ta.getAttribute("maxlength") || "1200", 10);
    var sync = function () { counter.textContent = ta.value.length + " / " + max; };
    ta.addEventListener("input", sync);
    sync();
  }

  var say = function (msg) {
    status.textContent = msg;
    status.classList.add("is-shown");
    status.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  };

  var setBusy = function (on) {
    if (!btn) return;
    btn.disabled = on;
    btn.style.opacity = on ? "0.6" : "";
    btn.style.pointerEvents = on ? "none" : "";
  };

  var fail = function (msg) { say(msg); setBusy(false); };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = new FormData(form);
    var name = (data.get("name") || "").toString().trim();
    var phone = (data.get("phone") || "").toString().trim();
    var email = (data.get("email") || "").toString().trim();
    var scope = (data.get("scope") || "").toString();
    var location = (data.get("location") || "").toString().trim();
    var notes = (data.get("notes") || "").toString().trim();

    // Honeypot filled = bot. Silently accept so it learns nothing.
    if ((data.get("company-website") || "").toString().trim()) {
      say("Thanks — we'll be in touch.");
      form.reset();
      return;
    }

    if (!name) return fail("Please give us a name so we know who to reply to.");
    if (!phone && !email) return fail("Please leave a phone number or an email address — one is enough to reach you.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return fail("That email address doesn't look right. Please check it, or just leave a phone number.");
    }

    setBusy(true);

    // Netlify expects urlencoded POST to the site root.
    var payload = new URLSearchParams();
    payload.append("form-name", "quote-request");
    // Hand the enquiry to the visitor's own mail client, pre-filled and addressed
    // to the business inbox. No backend, no API key, works on any host.
    var subject = "Quote request \u2014 " + (scope || "general site work") +
                  (name ? " (" + name + ")" : "");
    var body = [
      "Project enquiry via covenantearthworks.ca",
      "",
      "Name:      " + (name || "\u2014"),
      "Company:   " + ((data.get("company") || "").toString().trim() || "\u2014"),
      "Phone:     " + (phone || "\u2014"),
      "Email:     " + (email || "\u2014"),
      "Scope:     " + (scope || "\u2014"),
      "Location:  " + (location || "\u2014"),
      "",
      "Details:",
      notes || "\u2014",
      "",
      "--",
      "Sent from the quote form at covenantearthworks.ca"
    ].join("\n");

    var href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);

    form.reset();
    if (ta && counter) counter.textContent = "0 / 1200";
    setBusy(false);

    window.location.href = href;
    status.innerHTML =
      "Your email app should have opened with the details filled in \u2014 just hit send. " +
      "If nothing happened, email us at " +
      "<a href=\"" + href.split("?")[0] + "\">" + EMAIL + "</a> " +
      "or call <a href=\"tel:" + (TEL || "+13688873947") + "\"><strong>(368) 887-3947</strong></a>.";
    status.classList.add("is-shown");
    status.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  });
})();