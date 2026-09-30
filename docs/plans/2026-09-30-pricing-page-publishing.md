# Pricing Page and Discovery Updates Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reviewable pricing page and prepare every navigation, SEO, AIEO, LLM discovery, URL, and image dependency required for a safe production release.

**Architecture:** Add one static `pricing.html` page that reuses the site's shared stylesheet and scripts. Treat visible copy as the source of truth, mirror its claims in JSON-LD, expose the page through site navigation and Services links, and register the clean `/pricing` URL in Netlify and discovery files.

**Tech Stack:** Static HTML, CSS, JSON-LD, Netlify redirects, Node test runner, Playwright.

**Spec:** `docs/plans/2026-09-30-pricing-page-design.md`

---

### Task 1: Define pricing-page contracts

**Files:**
- Create: `tests/pricing-page.test.mjs`
- Modify: `tests/navigation-urls.test.mjs`

**Steps:**
1. Add failing tests for the approved page copy, starting prices, hands-on pre-work, navigation placement, Services links, canonical URL, structured data, image metadata, sitemap, `llms.txt`, and Netlify redirect.
2. Run `node --test tests/pricing-page.test.mjs tests/navigation-urls.test.mjs` and confirm failure because `pricing.html` and links do not yet exist.

### Task 2: Build the page and shared navigation

**Files:**
- Create: `pricing.html`
- Modify: `styles.css`
- Modify: all public `.html` navigation templates
- Modify: `services.html`

**Steps:**
1. Build semantic sections from the approved copy with Training first and Coaching second.
2. Add Pricing after Services in desktop and mobile navigation, with active-page treatment on Pricing.
3. Add Services links to `/pricing` for training and coaching.
4. Use `jim-perry-teaching-home.webp` with descriptive alt text, intrinsic dimensions, lazy loading below the first viewport, and consistent social metadata.
5. Run the focused tests and confirm they pass.

### Task 3: Complete SEO, AIEO, and discovery updates

**Files:**
- Modify: `pricing.html`
- Modify: `sitemap.xml`
- Modify: `llms.txt`
- Modify: `netlify.toml`
- Review unchanged: `robots.txt`, `ads.txt`

**Steps:**
1. Add unique title, description, canonical, robots, Open Graph, and Twitter metadata.
2. Add JSON-LD for `WebPage`, `BreadcrumbList`, two `Service` entities, USD starting-price specifications, and Jim Perry's relevant credentials.
3. Add `/pricing` to the sitemap with the current release date.
4. Add pricing and hands-on preparation details to `llms.txt`, and remove any stale privacy description.
5. Add the permanent `/pricing.html` to `/pricing` redirect.
6. Confirm `robots.txt` already permits the page and `ads.txt` is unrelated, so neither receives a content-only change.

### Task 4: Verify the release candidate

**Files:**
- Test: `tests/*.test.mjs`

**Steps:**
1. Run `node --test tests/*.test.mjs` and `git diff --check`.
2. Render `/pricing` at 1440 by 900, 1366 by 768, tablet, and mobile sizes.
3. Verify page identity, visible content, navigation, image loading, no horizontal overflow, keyboard focus, reduced motion, and zero relevant console errors.
4. Validate the JSON-LD parses and its offers match the visible starting prices.
5. Present screenshots and the exact release diff for approval.

### Task 5: Publish after approval

**Files:**
- No additional source changes expected.

**Steps:**
1. Confirm the approved commit contains no Playwright artifacts or temporary files.
2. Push the approved commit to the production `main` branch.
3. Wait for Netlify to deploy and verify `/pricing`, `/pricing.html` redirection, navigation, Services links, social image response, sitemap, `llms.txt`, and contact CTA on the public domain.
4. Submit or refresh the sitemap in search tooling when available and monitor indexing, traffic, and pricing-page conversion behavior.

## Review Focus

- Claims must not imply a maximum engagement price.
- Coaching must not be framed as discounted troubleshooting.
- Training must clearly state that every engagement is hands-on and uses participant pre-work.
- Structured data must match visible claims exactly.
- The ninth desktop navigation item must not wrap or collide at laptop widths.
- No generic AI imagery or pricing-tier cards may be introduced.
