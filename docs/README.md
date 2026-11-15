# RentKit — Endterm

Equipment rental website for Web Technologies 1, developed from the existing Midterm project. This README is stored in docs/; all website and asset paths below are relative to the repository root. English interface; five original pages and the original visual identity are retained.

## Run locally

Open `index.html` directly, or use VS Code Live Server. For a consistent local origin and persistent packing checklist, prefer an HTTP server:

```sh
python -m http.server 8000
```

Visit `http://localhost:8000`. No npm, build step, backend, CDN or API key is required. Bootstrap, jQuery, fonts and images are local.

On the development computer, Python is also available as `C:/msys64/ucrt64/bin/python.exe` if the Windows `python` alias does not work.

## Pages and structure

| Path | Purpose |
| --- | --- |
| `index.html` | Introduction, featured kits, rental steps and clearly fictional example stories |
| `kits.html` | Eight DOM-generated cards; search, category, budget and sorting |
| `kit-details.html` | Equipment contents, preparation guidance and 1/3/7-day price comparison |
| `order.html` | Validated demo booking, live calculator, return date and packing checklist |
| `rent.html` | Rental process, conditions and animated accessible FAQ |
| `css/` | Shared design and page-specific styles |
| `js/data.js` | Eight kit objects, search, calculation, date and validation functions |
| `js/catalog.js` | Catalogue cards, quick view dialog, saved kits filter, compare bar and compare table |
| `js/details.js` | Kits 5–8 sections (with illustrations) and the shared-data price table |
| `js/home.js` | Home statistics calculated from the data, animated with jQuery |
| `js/order.js` | Form, inline errors, summary and local packing checklist |
| `js/site.js` | Saved kits store, dark/light theme, toast, back-to-top, sticky header; jQuery FAQ, message fade and anchor scrolling |
| `tests/` | `data.test.js` (Node unit tests) and `browser_check.py` (optional Playwright smoke test) |
| `images/`, `fonts/`, `vendor/` | Existing local assets, dependencies and licenses |
| `docs/screenshots/` | 15 screenshots of the current version (desktop, dark theme, mobile) |
| `docs/` | README, credits, updated report text, editable Word report and archived Midterm document |

## Changes after Midterm

- Preserved all five pages, four original kits, package prices, URL kit preselection, delivery fee and device preparation guidance.
- Expanded to eight kits with genuinely different contents and budgets. Shared family illustrations are explicitly labelled; the text lists the exact included items.
- Replaced static catalogue cards with DOM generation, case-insensitive multiword search, category and daily-budget filters, sorting, reset, result count and empty state.
- Centralized prices so the catalogue, price table and calculator use the same dataset. A 3-day package uses its package price; delivery adds 2,000 KZT once.
- Added phone validation, field-level required/error messages, Kazakhstan date checks, return date, focus on the first error, success feedback and form reset.
- Added a personal packing checklist, saved per kit in `localStorage`. Only anonymous check marks are saved; contact details are neither stored nor sent. Storage failure does not prevent booking.
- Added three jQuery effects (`slideToggle`, `fadeIn`, `animate`), queue cleanup with `stop(true, true)`, reduced-motion support and visible hover/focus/error/success/empty states.
- Added documentation and performed automated checks during development. The test utilities and result log were later removed from this submission.

## Endterm update 2 (15.11.2026)

- **Bug fixed:** on *Inside the Kits* the four smaller kits (Light & Tripod, Solo Recording, Projector Essentials, Presenter Accessories) were rendered without a picture. They now use the same layout as kits 1–4, with their own illustration, checklist and booking link.
- **New illustrations:** `light-kit.svg`, `solo-kit.svg`, `projector-kit.svg`, `speaker-kit.svg` — every kit now has a unique picture. The branded projector photo was replaced by an original illustration.
- **Quick view:** a two-column dialog with rating, included items, setup steps, “good for” chips, a 1/3/7-day period picker with total and savings, optional delivery, previous/next kit (buttons or ← →), save button; jQuery `fadeTo`/`animate`, focus trap, Esc and overlay close, focus returned to the trigger. Its *Book* link passes kit, days and delivery to the order form.
- **Saved kits (♥):** stored in `localStorage`, counter in the header, “Saved only” filter and `kits.html?saved=1` link.
- **Compare:** tick up to three kits; a sliding bar opens a comparison table that highlights the lowest price and best rating.
- **Design refresh:** sticky blurred header, card hover lift and image zoom, ratings, item chips, setup time, “Popular” badges, toasts, back-to-top button, per-day prices in the price table.
- **Pickup / delivery address:** choosing *Pickup* shows our pickup point (Kabanbay Batyr Ave 62, Astana, hours, map link); choosing *Delivery* slides open an address form (street and building, apartment, time window, courier note) with validation. The summary and confirmation show the chosen address.
- **Navigation always on top:** the header is sticky on every screen size; below 900 px the links fold behind a ☰ menu button (jQuery `slideDown`/`slideUp`, `aria-expanded`, Esc closes).
- **Dark theme:** toggle in the header; remembers the choice and follows the system setting by default.
- **Home statistics:** number of kits, average rating, reviews and lowest price are calculated from `data.js` and counted up with jQuery `animate`.
- **Tests:** `node --test tests/*.test.js` (6 unit test groups, no packages needed) and `python tests/browser_check.py` (5 pages × 3 widths: JS errors, broken images, horizontal scroll, plus the quick view / saved / compare / order flows).

## Verification status

Latest run (15.11.2026): `node --test tests/*.test.js` — 7 passed, 0 failed; `tests/browser_check.py` in headless Chrome — 0 failures across 375, 768 and 1280 px. An earlier development run completed 181 static checks with 0 errors and 220 browser assertions with 0 failures. It covered the five pages at 375, 768 and 1280 CSS pixels. These are historical results, not a fresh verification of the current copy.

Repeatable tests are included again in `tests/`. Fifteen current screenshots are in `docs/screenshots/`.

For a current manual check, load all five pages, test search/filter/sort and empty results, submit an incomplete form and correct its errors, confirm a valid demo booking, check package prices and delivery, reload a marked checklist, and inspect the browser console and the three target viewport sizes. Earlier checks used headless Chrome, not physical devices or a full screen-reader audit.

## Project links and submission

Repository: https://github.com/issait1701-code/RentKIT

Publication URL: **to be filled in after the team verifies its deployment**. No publication, commit or push is performed by these changes. Do not infer a live URL from the repository name.

See `docs/ENDTERM-REPORT-updated.md`, `docs/RentKIT_Endterm_Report_updated.docx` and `docs/CREDITS.md`. The responsibility split is approximately equal: Saitov Islambek covers catalogue/data and jQuery; Jomart Akylbek covers booking/calculations and responsive styling. The jQuery part belongs to Saitov Islambek. Verify individual contributions before submission.

## Demo scope

Prices, availability, example customer stories and business details are fictional. Confirming the form creates an on-screen demo summary only. There are no real reservations, payments, emails or server-side storage. A production service would require a backend, authoritative availability/pricing and server-side validation.
