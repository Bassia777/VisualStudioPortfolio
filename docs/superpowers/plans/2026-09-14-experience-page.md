# Configurable Experience Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a theme-compatible `/experience` page with company tabs, a concise selected-experience panel, and an accessible modal whose body is configured as arbitrary text, list, or tag sections.

**Architecture:** Typed data in `data/experiences.ts` is the only content source. A client-side `ExperiencePage` owns selection and modal state, delegates the summary and dialog to focused components, and is mounted by the App Router page. Existing navigation receives additive `/experience` entries; no existing route is removed or behavior replaced.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS Modules, React Icons, Vitest, React Testing Library, jsdom

**Spec:** `docs/superpowers/specs/2026-09-14-experience-page-design.md`

## Global Constraints

- Preserve all existing home, about, contact, projects, articles, GitHub, and settings routes and behavior.
- Use existing CSS custom properties for backgrounds, text, borders, and accent colors.
- Do not add an external UI or modal library.
- Experience content must be editable only through `data/experiences.ts`.
- Empty configured sections are omitted and no visible experiences produces `No experience configured yet.`.
- The modal supports close control, backdrop click, Escape, focus containment, focus restoration, internal scrolling, and a mobile bottom-sheet layout.

---

### Task 1: Add Test Harness and Typed Experience Configuration

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `tests/experiences.test.ts`
- Create: `data/experiences.ts`

**Interfaces:**
- Produces: `Experience`, `ExperienceSection`, `experiences`, `getVisibleExperiences(items)`, and `getRenderableSections(sections)`.
- `ExperienceSection` is a discriminated union: text sections contain a string; list and tags sections contain string arrays.

- [ ] **Step 1: Read the applicable bundled Next.js 16 documentation**

Read these files before writing implementation code:

```text
node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md
node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md
node_modules/next/dist/docs/03-architecture/accessibility.md
```

- [ ] **Step 2: Install the test dependencies and add scripts**

Run:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Configure Vitest and browser matchers**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  test: { environment: 'jsdom', setupFiles: ['./tests/setup.ts'] },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 4: Write failing data-filter tests**

Create `tests/experiences.test.ts` with assertions that:

```ts
expect(getVisibleExperiences([visible, hidden])).toEqual([visible]);
expect(getRenderableSections([blankText, validText, emptyList, validTags]))
  .toEqual([validText, validTags]);
```

The fixtures must cover `visible: false`, whitespace-only text, empty arrays,
and arrays containing only whitespace.

- [ ] **Step 5: Run the focused test and observe failure**

Run: `npm test -- tests/experiences.test.ts`

Expected: FAIL because `data/experiences.ts` does not exist.

- [ ] **Step 6: Implement the typed data model and sample content**

Create `data/experiences.ts` with:

```ts
export type ExperienceSection =
  | { id: string; title: string; type: 'text'; content: string }
  | { id: string; title: string; type: 'list' | 'tags'; content: string[] };

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  summary: string;
  highlights?: string[];
  sections?: ExperienceSection[];
  visible?: boolean;
}

export const getVisibleExperiences = (items: Experience[]) =>
  items.filter((item) => item.visible !== false);

export const getRenderableSections = (sections: ExperienceSection[] = []) =>
  sections.filter((section) =>
    typeof section.content === 'string'
      ? section.content.trim().length > 0
      : section.content.some((item) => item.trim().length > 0)
  );
```

Add three explicitly labeled sample experience records. Each record uses
different section counts and types so the configuration is self-documenting.

- [ ] **Step 7: Run the focused test**

Run: `npm test -- tests/experiences.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit the data layer**

```bash
git add package.json package-lock.json vitest.config.ts tests/setup.ts tests/experiences.test.ts data/experiences.ts
git commit -m "feat: add configurable experience data"
```

### Task 2: Build the Accessible Dynamic Experience Modal

**Files:**
- Create: `tests/ExperienceModal.test.tsx`
- Create: `components/ExperienceModal.tsx`
- Create: `styles/ExperienceModal.module.css`

**Interfaces:**
- Consumes: `Experience` and `getRenderableSections` from `data/experiences.ts`.
- Produces: `ExperienceModal({ experience, onClose, returnFocusRef })`.

- [ ] **Step 1: Write failing modal rendering and interaction tests**

Create `tests/ExperienceModal.test.tsx`. Render one experience with custom
headings `主要项目` and `交付结果`, plus text/list/tags content. Assert:

```ts
expect(screen.getByRole('dialog', { name: /测试开发工程师/ })).toBeVisible();
expect(screen.getByRole('heading', { name: '主要项目' })).toBeVisible();
expect(screen.getByText('接口自动化测试平台')).toBeVisible();
expect(screen.getByText('Python')).toBeVisible();
```

Also assert that whitespace-only sections are absent, clicking the close
button calls `onClose`, Escape calls `onClose`, backdrop click calls
`onClose`, clicking inside does not close, initial focus lands on the close
button, Tab/Shift+Tab wrap inside the dialog, and unmount restores focus to
`returnFocusRef`.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `npm test -- tests/ExperienceModal.test.tsx`

Expected: FAIL because `ExperienceModal` does not exist.

- [ ] **Step 3: Implement minimal dialog behavior**

Create `components/ExperienceModal.tsx` as a client component. Use
`role="dialog"`, `aria-modal="true"`, an `aria-labelledby` title, a close
button with `aria-label="Close experience details"`, and a `useEffect` that:

```ts
const previousOverflow = document.body.style.overflow;
document.body.style.overflow = 'hidden';
closeButtonRef.current?.focus();

const onKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') onClose();
  if (event.key === 'Tab') trapFocus(event, dialogRef.current);
};

return () => {
  document.body.style.overflow = previousOverflow;
  returnFocusRef.current?.focus();
};
```

Render `getRenderableSections(experience.sections)` in configured order:

- `text` as a paragraph
- `list` as an unordered list after trimming blank entries
- `tags` as compact spans after trimming blank entries

- [ ] **Step 4: Add theme-native modal styling**

Create `styles/ExperienceModal.module.css` using `var(--main-bg)`,
`var(--sidebar-bg)`, `var(--text-color)`, `var(--accent-color)`,
`var(--accent-color-rgb)`, and `var(--explorer-border)`. Implement a fixed
backdrop, centered panel capped at `720px`, internal body scrolling, subtle
fade/translate animations, and a mobile bottom sheet at `max-width: 640px`.
Honor `prefers-reduced-motion: reduce` by disabling animation.

- [ ] **Step 5: Run the modal tests**

Run: `npm test -- tests/ExperienceModal.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit the modal**

```bash
git add tests/ExperienceModal.test.tsx components/ExperienceModal.tsx styles/ExperienceModal.module.css
git commit -m "feat: add accessible experience detail modal"
```

### Task 3: Build the Company-Tab Experience Page

**Files:**
- Create: `tests/ExperiencePage.test.tsx`
- Create: `components/ExperiencePage.tsx`
- Create: `components/ExperienceDetail.tsx`
- Create: `styles/ExperiencePage.module.css`
- Create: `app/experience/page.tsx`

**Interfaces:**
- Consumes: `experiences`, `getVisibleExperiences`, and `Experience`.
- Produces: `/experience`, `ExperiencePage({ items? })`, and
  `ExperienceDetail({ experience, onOpen })`.

- [ ] **Step 1: Write failing page-state tests**

Create `tests/ExperiencePage.test.tsx` with two fixtures. Assert that the first
visible company is selected initially, a hidden fixture is not shown, clicking
the second company updates role/period/summary, and clicking `View Experience`
opens a dialog containing the selected company's dynamic sections. Render
`<ExperiencePage items={[]} />` and assert the exact empty-state text.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `npm test -- tests/ExperiencePage.test.tsx`

Expected: FAIL because the page components do not exist.

- [ ] **Step 3: Implement the stateful page and summary component**

`ExperiencePage` filters items, initializes the selected id from the first
visible item, renders company tabs as buttons with `role="tab"`,
`aria-selected`, and `aria-controls`, and stores the modal experience plus the
trigger button ref. `ExperienceDetail` renders role, company, period,
location, summary, optional highlights, and the `View Experience` button.

- [ ] **Step 4: Add the App Router entry point**

Create `app/experience/page.tsx`:

```tsx
import type { Metadata } from 'next';
import ExperiencePage from '@/components/ExperiencePage';

export const metadata: Metadata = { title: 'Experience' };

export default function Page() {
  return <ExperiencePage />;
}
```

- [ ] **Step 5: Add responsive page styling**

Use a `max-width: 760px` centered container and the same header hierarchy as
the current project without copying the project timeline. Desktop uses a
`150px minmax(0, 1fr)` company-tab/detail grid. The active company receives a
two-pixel accent border and a restrained tinted background. At `640px`, tabs
become a horizontal scroll row and the detail panel moves below.

- [ ] **Step 6: Run the page tests**

Run: `npm test -- tests/ExperiencePage.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit the page**

```bash
git add tests/ExperiencePage.test.tsx components/ExperiencePage.tsx components/ExperienceDetail.tsx styles/ExperiencePage.module.css app/experience/page.tsx
git commit -m "feat: add company-tab experience page"
```

### Task 4: Add Experience to Every Navigation Surface

**Files:**
- Create: `tests/experience-navigation.test.tsx`
- Modify: `components/Explorer.tsx`
- Modify: `components/Tabsbar.tsx`
- Modify: `components/Sidebar.tsx`
- Modify: `components/Layout.tsx`
- Modify: `components/CommandPalette.tsx`
- Modify: `components/Terminal.tsx`

**Interfaces:**
- Consumes: `/experience` route and existing navigation patterns.
- Produces: additive visual, command-palette, terminal, and `G E` keyboard
  access to the experience page.

- [ ] **Step 1: Write failing navigation tests**

Mock `next/navigation` pathname/router, render Explorer, Tabsbar, Sidebar, and
an open CommandPalette, and assert each exposes a link or command for
`/experience`. Assert the visible filename is `experience.ts` and the command
label is `Go to Experience` with shortcut `G E`.

- [ ] **Step 2: Run the focused test and observe failure**

Run: `npm test -- tests/experience-navigation.test.tsx`

Expected: FAIL because navigation does not contain Experience.

- [ ] **Step 3: Add the route without changing existing entries**

- Explorer: insert `experience.ts` after `about.html`, using the existing
  TypeScript/React-compatible icon asset.
- Tabsbar: insert the matching tab after `about.html`.
- Sidebar: add `VscBriefcase` pointing to `/experience` after About/Home-related
  navigation while retaining every existing icon.
- Layout: add `e: '/experience'` to `navigationRoutes`.
- CommandPalette: add `Go to Experience`, `G E`, and `VscBriefcase`.
- Terminal: include `experience/` in `ls` and add an `experience` command that
  lists configured company/role pairs.

- [ ] **Step 4: Run navigation and complete test suite**

Run: `npm test -- tests/experience-navigation.test.tsx`

Expected: PASS.

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 5: Commit navigation**

```bash
git add tests/experience-navigation.test.tsx components/Explorer.tsx components/Tabsbar.tsx components/Sidebar.tsx components/Layout.tsx components/CommandPalette.tsx components/Terminal.tsx
git commit -m "feat: add experience navigation"
```

### Task 5: Build and Visual Verification

**Files:**
- Modify only files required by issues found during verification.

**Interfaces:**
- Consumes: completed experience feature.
- Produces: build-verified, visually inspected feature with existing routes
  intact.

- [ ] **Step 1: Run static and production verification**

Run:

```bash
npm test
npm run build
git diff --check
```

Expected: tests pass, production build completes, and diff check emits no
errors. The known DEV.to `401` log is acceptable only when no API key is
configured and the articles page still builds its existing empty state.

- [ ] **Step 2: Inspect the live page**

Start `npm run dev`, open `/experience`, and verify desktop and mobile widths:

- company switching updates the detail panel
- modal renders configured headings and all three content types
- close button, backdrop, and Escape work
- long content scrolls inside the modal
- focus returns to `View Experience`
- current theme changes remain reflected in the page

- [ ] **Step 3: Smoke-test existing routes**

Verify `/`, `/about`, `/projects`, `/contact`, `/articles`, `/github`, and
`/settings` still load and remain present in navigation.

- [ ] **Step 4: Commit verification fixes if any**

If verification required code changes, stage the exact files changed in that
step and commit them with `git commit -m "fix: polish experience page verification issues"`.
If no changes were required, do not create an empty commit.
