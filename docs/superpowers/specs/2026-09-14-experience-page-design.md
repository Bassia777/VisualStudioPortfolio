# Experience Page Design

## Goal

Add a configurable work-experience page to the existing VS Code-themed
portfolio without removing or changing the existing home, about, contact,
projects, articles, GitHub, or settings pages.

The new page must feel native to the existing project: dark editor surfaces,
thin borders, restrained spacing, monospaced supporting text, theme-aware
accent colors, and minimal motion.

## Navigation

Add `/experience` to all existing navigation surfaces:

- Explorer file list as `experience.ts`
- Top tab bar as `experience.ts`
- Activity sidebar with an appropriate VS Code icon
- Keyboard navigation map
- Command palette when it exposes page navigation

Existing navigation entries remain unchanged.

## Page Layout

The page uses a two-column company-tab layout inspired by the information
hierarchy of Brittany Chiang's high-star portfolio, adapted to the current
VS Code visual system.

- Left column: company tabs ordered exactly as configured.
- Right column: selected experience summary containing period, role, company,
  location, summary, concise highlights, and a `View Experience` action.
- The first visible experience is selected initially.
- On narrow screens, company tabs become a horizontally scrollable row above
  the detail panel.

This layout is intentionally different from the numbered project cards on the
projects page.

## Detail Modal

Selecting `View Experience` opens a centered, accessible detail modal.

- Header: company, role, period, location, and close control.
- Body: a configurable sequence of content sections.
- Close methods: close control, backdrop click, and Escape.
- While open, document scrolling is locked.
- Keyboard focus moves into the modal, remains inside it, and returns to the
  triggering control after close.
- Long bodies scroll inside the modal.
- On mobile, the modal becomes a near-full-screen bottom sheet.
- Animation is limited to a short fade and subtle translation.

## Configurable Content

All experience content lives in `data/experiences.ts`. Each experience has:

- `id`
- `company`
- `role`
- `period`
- optional `location`
- `summary`
- optional summary `highlights`
- optional `visible` flag, defaulting to visible
- optional `sections`

The modal body is not fixed to predefined headings. Each section supplies its
own `title`, `type`, and `content`. Supported types are:

- `text`: a paragraph string
- `list`: a list of strings
- `tags`: a list of compact labels

The number, names, order, and types of sections are controlled entirely by the
configuration. Empty sections are skipped. An experience without sections
still displays its header and summary.

Initial content uses clearly marked, replaceable sample entries and does not
claim to represent the user's real employment history.

## Components

- `app/experience/page.tsx`: page metadata and page entry point.
- `components/ExperiencePage.tsx`: selected-company and modal state.
- `components/ExperienceDetail.tsx`: selected experience summary.
- `components/ExperienceModal.tsx`: accessible dialog and dynamic sections.
- `data/experiences.ts`: typed experience configuration and sample data.
- `styles/ExperiencePage.module.css`: page and responsive layout.
- `styles/ExperienceModal.module.css`: dialog presentation and motion.

Small shared navigation definitions may be introduced if this avoids repeated
experience-route entries while preserving current behavior.

## Empty and Invalid Content

- If no visible experiences exist, render `No experience configured yet.` in
  the standard subdued editor style.
- Skip sections whose text is blank or whose list/tag collection is empty.
- TypeScript rejects unsupported section types and missing required fields at
  build time.
- The page performs no external requests and remains available offline.

## Verification

- Test initial selection and company-tab switching.
- Test modal open and all close methods.
- Test focus movement, focus containment, and focus restoration.
- Test configurable text, list, and tag sections and omission of empty blocks.
- Test empty-experience rendering.
- Inspect desktop and mobile layouts under the existing themes.
- Run the production build and verify existing routes remain available.

