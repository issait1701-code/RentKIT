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
| `js/catalog.js` | Catalogue DOM rendering and event handlers |
| `js/details.js` | Additional kit descriptions and shared-data price table |
| `js/order.js` | Form, inline errors, summary and local packing checklist |
| `js/site.js` | jQuery FAQ, message fade and anchor scrolling |
| `images/`, `fonts/`, `vendor/` | Existing local assets, dependencies and licenses |
| `screenshots/endterm/` | New browser screenshots; original Midterm screenshots retained |
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

## Verification status

An earlier development run completed 181 static checks with 0 errors and 220 browser assertions with 0 failures. It covered the five pages at 375, 768 and 1280 CSS pixels. These are historical results, not a fresh verification of the current copy.

The automated test scripts, result log and separate testing notes have been removed. The current workspace contains no repeatable automated test suite. Fifteen screenshots remain in `screenshots/endterm/`. Restore the tests separately if they are required as submission deliverables.

For a current manual check, load all five pages, test search/filter/sort and empty results, submit an incomplete form and correct its errors, confirm a valid demo booking, check package prices and delivery, reload a marked checklist, and inspect the browser console and the three target viewport sizes. Earlier checks used headless Chrome, not physical devices or a full screen-reader audit.

## Project links and submission

Repository: https://github.com/issait1701-code/RentKIT

Publication URL: **to be filled in after the team verifies its deployment**. No publication, commit or push is performed by these changes. Do not infer a live URL from the repository name.

See `docs/ENDTERM-REPORT-updated.md`, `docs/RentKIT_Endterm_Report_updated.docx` and `docs/CREDITS.md`. The responsibility split is approximately equal: Saitov Islambek covers catalogue/data and jQuery; Jomart Akylbek covers booking/calculations and responsive styling. The jQuery part belongs to Saitov Islambek. Verify individual contributions before submission.

## Demo scope

Prices, availability, example customer stories and business details are fictional. Confirming the form creates an on-screen demo summary only. There are no real reservations, payments, emails or server-side storage. A production service would require a backend, authoritative availability/pricing and server-side validation.
