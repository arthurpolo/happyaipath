# Netlify Contact Form Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the gated JotForm iframe with a native, accessible Netlify contact form that submits without leaving the page.

**Architecture:** Keep the form in the statically rendered `contact.html` so Netlify can detect it during deployment. Submit URL-encoded form data to the site root with progressive enhancement: ordinary POST remains available, while JavaScript displays accessible sending, success, and error states. Use Netlify's honeypot plus Akismet filtering and retain direct email and booking alternatives.

**Tech Stack:** Static HTML, vanilla JavaScript, CSS, Netlify Forms, Node test runner, Playwright CLI.

---

### Task 1: Specify the contact-form contract

**Files:**
- Create: `tests/contact-form.test.mjs`
- Test: `contact.html`

1. Add failing assertions for Netlify form detection, required fields, honeypot protection, booking link, accessible status messaging, and removal of all JotForm code.
2. Run `node --test tests/contact-form.test.mjs` and confirm it fails because the current page still contains JotForm.

### Task 2: Replace JotForm with the native form

**Files:**
- Modify: `contact.html`
- Modify: `styles.css`

1. Add a visible booking choice and spam-folder reminder.
2. Add a static `happy-ai-path-contact` form with name, email, organization, role, interest, and message fields.
3. Add a hidden `form-name`, a honeypot field, and a version-controlled email-notification subject.
4. Add an accessible live status region and submit the form with URL-encoded `fetch` while retaining ordinary POST behavior.
5. Remove the JotForm iframe loader and all JotForm-specific messaging.
6. Add restrained responsive form styling consistent with the editorial design.
7. Run the contact-form test and confirm it passes.

### Task 3: Align privacy documentation

**Files:**
- Modify: `privacy.html`
- Test: `tests/contact-form.test.mjs`

1. Add a failing assertion that the privacy notice describes Netlify form processing and contains no JotForm reference.
2. Update the visible privacy copy to describe form submission storage and processing accurately.
3. Run the focused test and confirm it passes.

### Task 4: Verify the user experience

**Files:**
- Test: `tests/contact-form.test.mjs`
- Test: `tests/navigation-urls.test.mjs`
- Test: `tests/structured-data.test.mjs`

1. Run all Node tests and `git diff --check`.
2. Use Playwright at desktop and mobile widths to verify labels, required fields, booking link, focus behavior, and form status states.
3. Confirm no browser console errors.
4. Keep the changes unpublished until explicit production approval.
