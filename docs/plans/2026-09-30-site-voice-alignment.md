# Happy AI Path Voice Alignment Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Align service names, descriptions, contact language, and calls to action with the approved Pricing page voice without changing Pricing or the site design.

**Architecture:** Update copy in the existing static HTML pages and the LLM discovery file. Preserve markup, accessibility, analytics, forms, and existing components. Add source-level regression tests for approved copy, booking-link scope, banned language, and the unchanged Pricing page.

**Tech Stack:** Static HTML, CSS classes already in the site, Netlify Forms, JSON-LD, Node test runner.

---

### Task 1: Add regression coverage

**Files:**
- Create: `tests/site-voice.test.mjs`
- Modify: `tests/contact-form.test.mjs`

1. Add assertions for the approved Services, Homepage, Contact, About, and `llms.txt` language.
2. Assert that the Outlook booking URL appears only once across public HTML and only on Contact.
3. Assert that the four contact interest values match their approved labels.
4. Record and assert the current `pricing.html` SHA-256 checksum.
5. Run `node --test tests/site-voice.test.mjs tests/contact-form.test.mjs` and confirm it fails for missing changes.

### Task 2: Align Services and discovery copy

**Files:**
- Modify: `services.html`
- Modify: `llms.txt`

1. Replace Services metadata, visible introduction, cards, calls to action, FAQ copy, and matching JSON-LD.
2. Rename coaching to One-on-One AI Coaching and keep the existing customization FAQ unchanged.
3. Route Services booking links to `/contact` and pricing links to `/pricing`.
4. Update `llms.txt` service naming and remove em dashes in touched lines.
5. Run the focused tests and confirm they pass for Services.

### Task 3: Align Homepage, Contact, and About copy

**Files:**
- Modify: `index.html`
- Modify: `contact.html`
- Modify: `about.html`

1. Replace homepage descriptions and coaching copy, add pricing links, add the supplied proof line, and remove the prohibited testimonial.
2. Add the requested testimonial maintenance comment without changing the two retained quotes.
3. Replace Contact metadata, headings, intro, and option labels and values while retaining the single booking button.
4. Fix the About typo, paragraph ending, and keyword.
5. Run focused tests and confirm they pass.

### Task 4: Verify the release

**Files:**
- Test: `tests/*.test.mjs`

1. Run the full Node test suite.
2. Verify all changed internal links against the local preview.
3. Search edited source files for banned words and em dashes, excluding CSS property names and untouched article titles.
4. Recompute the `pricing.html` checksum and confirm it matches the recorded value.
5. Run `git diff --check` and inspect the final diff for layout or accessibility changes.
