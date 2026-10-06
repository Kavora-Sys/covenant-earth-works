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
    payload.append("name", name);
    payload.append("company", (data.get("company") || "").toString());
    payload.append("phone", phone);
    payload.append("email", email);
    payload.append("scope", scope);
    payload.append("location", location);
    payload.append("notes", notes);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: payload.toString()
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      if (ta && counter) counter.textContent = "0 / 1200";
      say("Thanks — that's with us. You'll hear back within a business day, usually sooner. " +
          "If it's urgent, call the number at the top of the page.");
      setBusy(false);
    }).catch(function () {
      // Netlify's form backend is unreachable. Two reasons this happens:
      // running the site locally, or form detection switched off on the site.
      // Never dead-end a visitor on the one thing they came here to do.
      if (EMAIL && !/[\[\]]/.test(EMAIL)) {
        var subject = "Quote request — " + (scope || "general site work") + " (" + name + ")";
        var body = [
          "Project enquiry via covenantearthworks.ca", "",
          "Name:      " + name,
          "Phone:     " + (phone || "—"),
          "Email:     " + (email || "—"),
          "Scope:     " + (scope || "—"),
          "Location:  " + (location || "—"), "",
          "Details:", notes || "—"
        ].join("\n");
        window.location.href = "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
        return;
      }

      // No usable email configured, so give them the one channel that works.
      var telHref = "tel:" + (TEL || "+13688873947");
      var mailHref = "mailto:" + (EMAIL || "info@covenantearthworks.ca");
      status.innerHTML =
        "We couldn&rsquo;t send that automatically just now. " +
        "Call <a href=\"" + telHref + "\"><strong>(368) 887-3947</strong></a> " +
        "and we&rsquo;ll take your details straight away, " +
        "or email <a href=\"" + mailHref + "\">" +
        (EMAIL || "info@covenantearthworks.ca") + "</a>.";
      status.classList.add("is-shown");
      status.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
      setBusy(false);
    });
  });
})();