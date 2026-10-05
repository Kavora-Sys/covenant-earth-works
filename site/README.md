# Covenant Earth Works Works — site handover

Static site. No build step, no framework, no dependencies. Open `index.html` and it works.
Total payload is ~2.7 MB of images and a single small stylesheet.

---

## 1. Fill these in before launch

Every placeholder is wrapped in a dashed gold chip so it's visible on the page. Search the
files for `[` to find them all, or find-and-replace the tokens below.

| Token | Where | Notes |
|---|---|---|
| `[PHONE]` | all 6 pages | Appears 3× per page. Also fix every `tel:0000000000` — search for `tel:0`. |
| `[EMAIL]` | footer × 6, `contact.html` form, meta descriptions | Search `[EMAIL]`. |
| `[ADDRESS]` | `contact.html` | Street address. |
| `[HOURS]` | `contact.html` | Mon–Fri hours. |
| `[PROJECT NAME]` | `projects.html` × 6 | Real project names, or delete the chip and the clause around it. |
| `[LOCATION]` | `projects.html` × 6 | Same. |
| `[CONFIRM CERT # / LEVEL]` | `safety/index.html` | COR certificate number and level. |
| `[TESTIMONIAL]` | `index.html` × 3 | Real client quotes — **biggest remaining conversion gap**, see §4b. |
| `[CLIENT NAME]` / `[CLIENT NAME · COMPANY]` / `[JOB TYPE · LOCATION]` | `index.html` × 3 | Attribution for each quote. |

Verify with: `grep -oh '\[[A-Z][A-Z ]*[A-Z]\]' *.html | sort | uniq -c`

Already filled from the owner's supplied details: **Barry Porter** (name and bio), 25 years
experience (20 construction + 5 logging), 45 machines owned (25 construction + 20 logging).

### The quote form needs an email address

`contact.html` has `data-email="[EMAIL]"` on the form. Until that is replaced with a real address
the form validates, then tells the visitor it isn't connected yet rather than opening a mail
client pointed at an address that doesn't exist. That's deliberate.

Once a real address is in, the form composes a formatted email and opens the visitor's mail
client. **For submissions to arrive without a mail client, wire a real backend** — Formspree,
Netlify Forms, or a Worker. See §4.

---

## 2. Things to verify before you claim them

I wrote the safety and trust copy because this trade needs it, but two claims are assertions,
not facts I could verify:

- **COR certified** — appears in the trust strip on the homepage, on `safety.html`, and in the
  meta description. If the business does not hold COR through ACSA, delete it. It's a real and
  meaningful certification in Alberta, which is exactly why it must not be claimed lightly.
- **ISNetworld** — listed under documentation on `safety.html`. Only if actually registered.

**WCB Alberta** coverage is safe to keep — every Alberta contractor with employees must carry it.

The service list (12 services) is a realistic set for this trade and matches the photos, but
prune anything you don't actually take on. `services.html` has a section called "What we don't
pretend to do" that's built on that honesty — if you remove a service from the grid, check that
list still reads true.

---

## 3. Structure

```
site/
├── index.html          hero, entity definition, trust strip, the-ground argument, services,
│                       work, fleet, owner, service area, FAQ, CTA
├── services.html       12 services in two divisions, plus what's explicitly out of scope
├── projects.html       6 photo-led project entries from real job photos
├── about.html          Barry Porter feature, by-the-numbers, standards, why owner-operated
├── safety.html         program, site-specific hazards, documentation
├── contact.html        quote form, contact block, service area, what-happens-next
├── llms.txt            summary for LLM crawlers (the emerging llms.txt standard)
├── llms-full.txt       full plain-text extract of the entire site
├── robots.txt          explicitly welcomes AI crawlers
├── sitemap.xml
└── assets/
    ├── css/style.css   design system + all layout
    ├── js/main.js      nav, reveal, form validation (~5 KB, no deps)
    └── img/            10 images, 2.8 MB total
```

### Design tokens

Change these at the top of `assets/css/style.css` and the whole site follows.

```css
--ink-950: #08090B;   /* page ground */
--ochre:   #C9903A;   /* primary accent — prairie ochre */
--clay:    #A8502E;   /* secondary — Red Deer clay, currently unused */
--bone:    #EDE8DE;   /* body text, warm not white */
```

Fonts are Instrument Serif (display) and Archivo (UI/body), loaded from Google Fonts.

The palette came out of central Alberta ground rather than a generic dark theme: black topsoil,
prairie ochre, Red Deer clay. `--clay` is defined but unused — it's there if you want a second
accent for a section or a highlight.

The gold horizontal-rule divider (`.strata`) is the site's signature motif and ties to the logo.
It's a thin rule plus a fainter one beneath it — the same idea as the mark in the wordmark.

---

## 4. Upgrades worth making

**A real form backend.** Highest-value change. Anything that takes email works:

- Formspree — paste the endpoint into a `fetch()` in `main.js`, replace the `mailto:` block
- Netlify Forms — add `netlify` to the `<form>` tag and a hidden `form-name` input
- Cloudflare Worker — you already have the account, this is a 20-line endpoint

**Form tracking.** Nothing is currently recorded. If you wire a Worker endpoint, log the POST
and you'll know which services and which pages get quotes.

**Google Business Profile.** Match the site wording exactly — service names, service area, and
"Earthworks contractor" as the primary category. Keep the phone identical in both places.

**Analytics.** Nothing is installed. Add it only with consent handling — Alberta's PIPA applies
to personal information, and cookie-based tracking needs consent.

**Real photography.** The current photos are genuine job photos, which is a genuine advantage
over competitors using staged stock — but they're shot on phones, with visible dust, glare and
cab interiors. Two or three properly shot photos of the crew at work on a clear day would lift
the site further than any amount of layout work. Worth recommending to the client.

---

## 5. Notes on the copy

The competitive research was unambiguous: almost every earthworks site in the region leads with
"quality, reliability, commitment," and none of it converts. The one that stood out named its
actual ground conditions — clay, high water tables, frost-susceptible soils.

So the homepage argues a specific position: **central Alberta doesn't hold still, and most site
failures are decided before the first machine arrives.** Freeze–thaw, clay that won't drain,
topsoil worth more than what's under it, water that has to go somewhere.

That argument is the site's main differentiator. It works because it's true, unglamorous, and
specific to the service area — which is precisely what the competition is avoiding. If you edit
the copy, keep the specificity. "Highest quality workmanship" would undo the whole thing.

The "What we don't pretend to do" section on `services.html` is deliberate too. Naming what you
*don't* do is strong trust content in a trade full of contractors who claim everything.

---

## 4b. Testimonials — the biggest remaining gap

The site has **zero social proof**. For a local trade that is the single largest conversion lever
left, and it is the one thing on this site nobody can write except the client.

Three slots are in place on the homepage (`04 / What They Say`). Replace each `[TESTIMONIAL]` with
a real quote and fill in the attribution under it.

**How to collect them:** ask for a one-sentence review at the moment the job goes well — while the
machine is still on site. A specific sentence about timing, communication, or a problem that got
flagged before it became expensive is worth far more than a polished paragraph. Two or three real
ones beat ten generic ones. If reviews can't be collected, a Google Business Profile with review
volume is the next best thing.

Do not let anyone write them on the client's behalf. Invented testimonials are a legal liability
and the fastest way to lose a local trade customer who drives past a real job.

---

## 5. AEO and GEO

Answer Engine Optimization (voice assistants, featured snippets) and Generative Engine
Optimization (ChatGPT, Perplexity, AI Overviews, Copilot).

**What's in place:**

- **Entity definition** — a plain-prose paragraph directly under the hero stating who the company
  is, who owns it, how long it has operated and how big the fleet is. This is the single most
  quotable block on the site and it's written to be lifted verbatim.
- **JSON-LD `@graph`** on `index.html` — `Organization`, `Person` (Barry Porter, with
  `worksFor` back to the org), `GeneralContractor` with geo coordinates, `WebSite`, and
  `FAQPage`. Credentials are modelled as `hasCredential` with `recognizedBy`.
- **`BreadcrumbList`** on all five interior pages.
- **FAQ** — 10 questions in visible `<details>` elements on the homepage, mirrored exactly in
  `FAQPage` schema. Native `<details>` means it works with JavaScript disabled.
- **`llms.txt`** and **`llms-full.txt`** — the emerging standard for telling language models what a
  site is and how to cite it. `llms-full.txt` is a 10 KB plain-text extract of the whole site.
- **`robots.txt`** explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot,
  Google-Extended, Applebot-Extended, CCBot and others. All content is server-rendered static HTML,
  so nothing is hidden behind JavaScript.
- **Statistics** — 25 years, 20 + 5 split, 45 machines. The GEO research is consistent that
  quotable numbers and named credentials measurably increase the chance a model cites you. These
  came from the owner and are repeated identically on the site, in the schema and in `llms.txt` —
  contradiction between sources is the fastest way to lose trust with an answer engine.
- **`alternateName`** — "Covenant Earth", "Covenant Earth Works Red Deer" — so the brand still
  matches when people search the short form.

**Two things to preserve:**

1. **The FAQ schema and the visible FAQ must stay identical.** Google penalises the mismatch, and
   an answer engine quoting text that isn't on the page is the worst outcome. If you edit one
   answer, edit both. `../verify_seo.py` checks this and will tell you if they drift.
2. **Facts must stay consistent across all four surfaces** — page copy, JSON-LD, `llms.txt` and
   `llms-full.txt`. The same script checks that too.

**What is deliberately *not* done:**

- No FAQ on the services page. One authoritative FAQ per topic beats thin duplication.
- No `Speakable` schema — it was deprecated by Google and adds nothing now.
- No keyword stuffing. `llms.txt` exists to be quoted accurately, not to rank.

**Run the check after any content edit:**

```bash
cd ~/builders/COVENANT-EARTH && python3 verify_seo.py
```

---

## 6. Local preview

```bash
cd site
python3 -m http.server 8000
# open http://localhost:8000
```

A server matters — opening `index.html` directly over `file://` will block the Google Fonts
request and give you a false read on the typography.