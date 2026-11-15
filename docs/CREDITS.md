# RentKit Credits

This file lists the external resources used in the RentKit student project.

## Images

All images are original SVG illustrations made for this project. The earlier projector photograph (`images/projector-photo.jpg`) was removed in the second Endterm update because the picture showed a manufacturer's branded product and could not be matched to the credited source; the home page now uses the original `images/projector-kit.svg` illustration instead.

## SVG Illustrations

The following SVG illustrations were created specifically for the RentKit project with AI assistance:

- `images/hero-case.svg`
- `images/video-kit.svg`
- `images/podcast-kit.svg`
- `images/movie-kit.svg`
- `images/presentation-kit.svg`
- `images/light-kit.svg`, `images/solo-kit.svg`, `images/projector-kit.svg`, `images/speaker-kit.svg` (added in Endterm update 2, one per smaller kit; created with Claude, Anthropic)
- `images/favicon.svg`


## Fonts

### Manrope

Manrope is used for the main body text of the website.

- Source: https://fonts.google.com/specimen/Manrope
- Files:
  - `fonts/manrope.ttf`
  - `fonts/manrope-bold.ttf`
- License: SIL Open Font License 1.1

### Space Grotesk

Space Grotesk is used for headings, prices and brand elements.

- Source: https://fonts.google.com/specimen/Space+Grotesk
- File:
  - `fonts/space-grotesk.ttf`
- License: SIL Open Font License 1.1

Fallback fonts are Arial and system sans-serif fonts.

## Bootstrap

Bootstrap is used for the responsive grid, forms and interface components.

- Version: Bootstrap 5.3.8
- Source: https://getbootstrap.com/docs/5.3/
- Local file: `vendor/bootstrap.min.css`
- License: MIT

Bootstrap components were customized with the project's own CSS.

No downloaded Bootstrap theme or website template was used.

## AI Assistance

OpenAI Codex was used as an assistant for project ideas and implementation. Its assistance included:

- developing the equipment-rental concept, suggesting kit ideas and useful interactive features;
- creating the original project-specific SVG illustrations;
- reviewing the repository and helping preserve its layout and visual identity;
- generating and revising HTML, CSS and JavaScript for the shared kit data, DOM catalogue, search, filters and sorting;
- helping implement form validation, rental calculations, return dates and the personal packing checklist;
- suggesting CSS styling, responsive adjustments and accessibility improvements;
- assisting with jQuery integration, effect logic, animation queue handling and code explanations;
- helping debug code and perform the earlier automated checks;
- drafting and revising the README, credits, report, Word document and English defense material.

AI assistance included implementation code as well as suggestions and explanations. External images, fonts and libraries are credited separately. The team is responsible for checking the final submission and understanding the code it presents.

## AI assistance — Endterm update 2 (15.11.2026)

Claude (Anthropic) was used for the second Endterm update: fixing the missing illustrations of kits 5–8 on the details page, drawing four new kit SVGs, the redesigned quick-view dialog (based on the team's own `openDetail` draft), saved kits, kit comparison, dark theme, home statistics, the Node unit tests and browser smoke test, screenshots and this documentation update. The team reviewed the changes and is responsible for explaining them.

## Team responsibility split

The following is an approximately equal allocation of responsibility for the project and defense; it is not a claim of exclusive authorship of every line of code.

| Participant | Areas of responsibility |
| --- | --- |
| Saitov Islambek | Catalogue and shared equipment data; DOM cards, search, filters and sorting; catalogue and rental-process pages; jQuery effects and their explanation (`slideToggle`, `fadeIn`, `animate`, `stop(true,true)`). |
| Jomart Akylbek | Booking form and validation; rental calculator, delivery and return dates; packing checklist and local storage; home and equipment-details pages; shared styling, responsive layouts and accessibility. |

Both participants share responsibility for reviewing integration, checking links and user scenarios, and preparing the report and presentation. The jQuery part is assigned to Saitov Islambek, as specified by the team.

## jQuery (Endterm addition)

- Version: 3.7.1
- Downloaded file: https://code.jquery.com/jquery-3.7.1.min.js
- License text downloaded from: https://raw.githubusercontent.com/jquery/jquery/3.7.1/LICENSE.txt
- Local file: `vendor/jquery-3.7.1.min.js`; its copyright/license reference remains in the bundled header. The separate downloaded license text is no longer present in this copy.
- Copyright: OpenJS Foundation and other contributors; MIT license.

Each of the eight kits now has its own illustration. No downloaded website theme was used.

## Source provenance

The photo, SVG, font and Bootstrap credits above were present in the repository before the Endterm revision and have been preserved. Their origins were not independently reverified during this local implementation. jQuery and its license were downloaded from the exact URLs listed above. Earlier automated checks used Python's standard library and the locally installed Chrome browser; no third-party test code was copied. Those test utilities and their result log are no longer included in the workspace.

## Demo Content

RentKit is a student project.

The following information is fictional and used only for demonstration purposes:

- rental prices;
- customer reviews;
- customer names;
- booking information;
- equipment availability;
- business operations.

No real bookings or payments are processed by the website.
