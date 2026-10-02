# Site-Wide Privacy Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every Happy AI Path public page follow one conservative consent and privacy standard, then add Meta Pixel `1437466048330303` only after explicit Marketing consent.

**Architecture:** Replace the custom single-category banner with a maintained CMP configured for global prior opt-in. Keep vendor loading outside page templates: the CMP controls Google Analytics and Meta, while automated tests inventory every HTML route, verify privacy controls, and reject unclassified third-party trackers. Netlify continues hosting and form processing; its Content Security Policy expands only after consent behavior passes locally.

**Tech Stack:** Static HTML, vanilla JavaScript, Node.js test runner, Netlify Forms and headers, Termly Pro+ CMP (recommended), Google Analytics 4, Meta Pixel.

**Spec:** `docs/superpowers/specs/2026-10-01-site-privacy-compliance.md`

## Global Constraints

- Do not activate Meta Pixel until the CMP account, privacy notice, tests, and attorney review are complete.
- Meta Pixel ID is exactly `1437466048330303`.
- Necessary processing is always enabled; Analytics and Marketing are denied by default.
- Global Privacy Control always disables Marketing and targeted-advertising/sale/share processing.
- Never transmit contact-form values, quiz answers, booking data, or URL query parameters to analytics or advertising vendors.
- Do not add Meta's unconditional `noscript` image.
- Preserve existing Netlify security headers and the native contact form.
- All existing and new privacy tests must pass before deployment.

## Review Focus

- A visitor changes Accept All to Reject All: future events stop, removable cookies clear, and rejection persists; Task 4 tests this.
- GPC appears after prior acceptance: Marketing is forced off and cannot silently reactivate; Task 4 tests this.
- A page is added without controls: the inventory test fails and names the file; Task 2 tests this.
- An unclassified third-party endpoint appears: deployment tests fail; Task 3 tests this.
- The CMP is blocked or storage is unavailable: the site works and optional tracking stays denied; Task 4 tests this.

---

### Task 1: Establish the CMP and compliance record

**Files:**
- Create: `docs/privacy/cmp-configuration.md`
- Create: `docs/privacy/vendor-inventory.md`
- Create: `docs/privacy/data-retention.md`

**Interfaces:**
- Consumes: The site-wide privacy specification and current production services.
- Produces: A real CMP configuration, exact installation snippet, category assignments, vendor list, and retention rules used by Tasks 3–7.

- [ ] **Step 1: Create the Termly Pro+ site configuration**

Configure `happyaipath.com` for global prior opt-in, equally prominent Accept All/Reject All/Manage Choices, Necessary/Analytics/Marketing categories, GPC enforcement, consent records, scheduled scans, and a persistent privacy-settings control. Do not install the production script yet.

- [ ] **Step 2: Record exact CMP settings**

In `docs/privacy/cmp-configuration.md`, record the account owner, domain, real site identifier, category defaults, GPC behavior, logging/scan cadence, banner text, and exact installation snippet copied from the dashboard.

- [ ] **Step 3: Inventory vendors and purposes**

Create `docs/privacy/vendor-inventory.md` with:

```markdown
| Vendor | Service | Category | Purpose | Pre-consent |
|---|---|---|---|---|
| Netlify | Hosting and contact form | Necessary | Site delivery, security, inquiry submission | Yes |
| Google Fonts | Typography | Necessary | Font delivery | Yes |
| rss2json | Public blog feed | Functional | Retrieve public posts; no visitor fields | Only on /blog |
| Google Analytics | Audience measurement | Analytics | Page/device measurement | No |
| Meta | Pixel 1437466048330303 | Marketing | PageView and approved campaign events | No |
```

- [ ] **Step 4: Define retention**

In `docs/privacy/data-retention.md`, set contact inquiries for annual review/deletion when no longer needed, consent records for the CMP's documented evidence period, and Google/Meta retention to the shortest business-usable setting. Document deletion propagation to processors.

- [ ] **Step 5: Obtain legal review**

Give these documents and `privacy.html` to a privacy attorney. Record review date, reviewer, approved changes, and applicability conclusions. This is a production activation gate.

- [ ] **Step 6: Commit**

```bash
git add docs/privacy
git commit -m "docs: define privacy compliance configuration"
```

### Task 2: Inventory every public page in automated tests

**Files:**
- Create: `tests/privacy-page-inventory.test.mjs`

**Interfaces:**
- Produces: `PUBLIC_HTML_FILES`, reused by Tasks 3 and 5.

- [ ] **Step 1: Write the failing test**

```js
export const PUBLIC_HTML_FILES = [
  '404.html', 'about.html', 'blog-post-template.html', 'blog.html',
  'contact.html', 'events.html', 'guide.html', 'index.html',
  'pricing.html', 'privacy.html', 'quiz.html', 'services.html', 'tips.html'
];

test('every public page loads the CMP and exposes privacy choices', () => {
  for (const file of PUBLIC_HTML_FILES) {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    assert.match(html, /data-privacy-cmp/, `${file} must load the CMP`);
    assert.match(html, /data-privacy-choices/, `${file} must expose privacy choices`);
    assert.match(html, /href=["']\/privacy["']/, `${file} must link to privacy notice`);
  }
});
```

- [ ] **Step 2: Verify failure**

Run: `node --test tests/privacy-page-inventory.test.mjs`

Expected: FAIL because current pages use `consent.js`, not the CMP marker.

- [ ] **Step 3: Add a discovery guard**

Read root `*.html` files and assert the sorted names exactly equal `PUBLIC_HTML_FILES`. A new page must fail until deliberately classified.

- [ ] **Step 4: Commit failing tests**

```bash
git add tests/privacy-page-inventory.test.mjs
git commit -m "test: inventory privacy controls on public pages"
```

### Task 3: Enforce a tracker and endpoint allowlist

**Files:**
- Create: `privacy-vendors.json`
- Create: `tests/privacy-vendors.test.mjs`
- Modify: `netlify.toml`

**Interfaces:**
- Consumes: `PUBLIC_HTML_FILES` and the vendor inventory.
- Produces: A machine-readable domain/category allowlist and matching CSP source list.

- [ ] **Step 1: Write the failing endpoint test**

Test every external `script`, `img`, `iframe`, `form action`, `fetch`, and preconnect URL in public HTML/JS. Normalize hostnames and require each in `privacy-vendors.json`. Assert Google hosts are Analytics, Meta hosts are Marketing, and form/query values never enter tracking payloads.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/privacy-vendors.test.mjs`

Expected: FAIL because the allowlist does not exist.

- [ ] **Step 3: Create the allowlist**

```json
{
  "fonts.googleapis.com": "necessary",
  "fonts.gstatic.com": "necessary",
  "api.rss2json.com": "functional",
  "blog.happyaipath.com": "user-initiated-navigation",
  "www.googletagmanager.com": "analytics",
  "www.google-analytics.com": "analytics",
  "connect.facebook.net": "marketing",
  "www.facebook.com": "marketing"
}
```

- [ ] **Step 4: Test the CSP**

Require `netlify.toml` to contain only necessary Google/Meta hosts in `script-src`, `connect-src`, and `img-src`. Do not broaden `default-src`, `frame-src`, or use `*`.

- [ ] **Step 5: Verify and commit**

Run: `node --test tests/privacy-vendors.test.mjs`

```bash
git add privacy-vendors.json tests/privacy-vendors.test.mjs netlify.toml
git commit -m "test: enforce privacy vendor allowlist"
```

### Task 4: Normalize consent and withdrawal behavior

**Files:**
- Create: `privacy-consent.js`
- Create: `tests/privacy-consent.test.mjs`
- Modify: `styles.css`
- Delete after migration: `consent.js`

**Interfaces:**
- Consumes: CMP category-change callbacks from Task 1.
- Produces: `HappyAIPathPrivacy.getState()`, `canLoad(category)`, and `happy-ai-path:privacy-change`.

- [ ] **Step 1: Write state tests**

Cover initial denial, Analytics-only, Marketing-only, Accept All, Reject All, withdrawal, GPC overriding prior consent, corrupt storage, unavailable storage, and unavailable CMP. Assert:

```js
{ necessary: true, analytics: false, marketing: false, source: 'default' }
```

- [ ] **Step 2: Verify failure**

Run: `node --test tests/privacy-consent.test.mjs`

Expected: FAIL because `privacy-consent.js` does not exist.

- [ ] **Step 3: Implement failure-safe defaults**

Return false for Analytics/Marketing until the CMP sends affirmative category consent. GPC forces Marketing false even after earlier acceptance. Never treat inactivity, scrolling, dismissal, or storage failure as consent.

- [ ] **Step 4: Implement withdrawal cleanup**

On Analytics withdrawal, stop events and remove `_ga`, `_ga_*`, and `_gid` where possible. On Marketing withdrawal, revoke Meta consent, stop events, and remove `_fbp`/`_fbc` where possible. Failure to remove inaccessible cookies must not prevent saved rejection.

- [ ] **Step 5: Verify and commit**

Run: `node --test tests/privacy-consent.test.mjs`

```bash
git add privacy-consent.js tests/privacy-consent.test.mjs styles.css
git commit -m "feat: add category-based privacy consent adapter"
```

### Task 5: Install the CMP on every page

**Files:**
- Modify: `404.html`, `about.html`, `blog-post-template.html`, `blog.html`, `contact.html`, `events.html`, `guide.html`, `index.html`, `pricing.html`, `privacy.html`, `quiz.html`, `services.html`, `tips.html`
- Modify: `tests/privacy-page-inventory.test.mjs`

**Interfaces:**
- Consumes: The exact CMP snippet and `privacy-consent.js`.
- Produces: Identical privacy controls across all public pages.

- [ ] **Step 1: Replace the old loader**

Load `privacy-consent.js` before the exact CMP script and mark the CMP script with `data-privacy-cmp`. Remove `consent.js` references and the hard-coded `index.html` banner.

- [ ] **Step 2: Standardize footer controls**

```html
<a href="/privacy" class="privacy-footer-link">Privacy Notice</a>
<button type="button" class="privacy-choices-link" data-privacy-choices>Your Privacy Choices</button>
```

The button reopens settings without changing consent.

- [ ] **Step 3: Protect page-specific data**

Assert quiz answers never leave the browser, contact fields go only to same-origin Netlify Forms, and URL query strings are excluded from tracking PageViews.

- [ ] **Step 4: Verify all pages**

Run: `node --test tests/privacy-page-inventory.test.mjs tests/privacy-vendors.test.mjs tests/contact-form.test.mjs`

Expected: PASS for all 13 public HTML files.

- [ ] **Step 5: Remove retired code and commit**

After `rg -n 'consent\.js' --glob '*.html' .` returns no matches:

```bash
git add 404.html about.html blog-post-template.html blog.html contact.html events.html guide.html index.html pricing.html privacy.html quiz.html services.html tips.html privacy-consent.js styles.css tests/privacy-page-inventory.test.mjs
git rm consent.js
git commit -m "feat: apply managed privacy choices to every page"
```

### Task 6: Gate Google Analytics and Meta separately

**Files:**
- Create: `privacy-trackers.js`
- Create: `tests/privacy-trackers.test.mjs`
- Modify: `privacy-consent.js`
- Modify: `privacy-vendors.json`

**Interfaces:**
- Consumes: `canLoad(category)` and `happy-ai-path:privacy-change`.
- Produces: Idempotent `loadGoogleAnalytics()` and `loadMetaPixel()`; no page may create vendor scripts directly.

- [ ] **Step 1: Write gating tests**

Prove neither vendor loads in default, rejected, GPC, or CMP-failure states; Analytics-only loads GA; Marketing-only loads Meta; retries create one script; withdrawal stops events. Assert Meta uses only ID `1437466048330303` and initial event `PageView`.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/privacy-trackers.test.mjs`

Expected: FAIL because `privacy-trackers.js` does not exist.

- [ ] **Step 3: Implement loaders**

Move GA loading out of `consent.js`. Add Meta's JavaScript loader without the `noscript` image. Send canonical pathname only—never query strings, fragments, forms, quiz values, email, or custom user data.

- [ ] **Step 4: Handle consent changes**

Load each vendor only when its category becomes true. When false, invoke revocation and suppress all later calls until a new affirmative choice.

- [ ] **Step 5: Verify and commit**

Run: `node --test tests/privacy-trackers.test.mjs tests/privacy-vendors.test.mjs tests/privacy-consent.test.mjs`

```bash
git add privacy-trackers.js privacy-consent.js privacy-vendors.json tests/privacy-trackers.test.mjs
git commit -m "feat: gate analytics and Meta by consent category"
```

### Task 7: Expand the privacy center and request process

**Files:**
- Modify: `privacy.html`
- Create: `privacy-request.html`
- Create: `tests/privacy-notice.test.mjs`
- Modify: `netlify.toml`
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: Vendor inventory, retention schedule, and attorney-approved language.
- Produces: Accurate disclosures and a Netlify-backed privacy request channel.

- [ ] **Step 1: Write disclosure tests**

Require the notice to name Netlify, Google Analytics, Meta, Google Fonts, and rss2json; explain categories, purposes, legal basis, recipients, retention, GPC, withdrawal, and access/correction/deletion/portability/opt-out rights. Require a minimal request form with honeypot and no advertising instrumentation.

- [ ] **Step 2: Verify failure**

Run: `node --test tests/privacy-notice.test.mjs`

Expected: FAIL because Meta, retention, category controls, and the request page are absent.

- [ ] **Step 3: Update the notice**

Use attorney-approved text. Distinguish service providers from targeted-advertising recipients, avoid an unqualified “we do not sell” statement if Meta is treated as sale/share, explain GPC, and provide effective/updated dates.

- [ ] **Step 4: Add the request form**

Create Netlify form `happy-ai-path-privacy-request` collecting only name, email, request type, state/country, and optional details. Do not request identity documents initially; request more securely only if necessary for verification.

- [ ] **Step 5: Add routing and verify**

Add `/privacy-request` routing, canonical URL, sitemap entry, and a link from `privacy.html`.

Run: `node --test tests/privacy-notice.test.mjs tests/contact-form.test.mjs tests/navigation-urls.test.mjs`

- [ ] **Step 6: Commit**

```bash
git add privacy.html privacy-request.html tests/privacy-notice.test.mjs netlify.toml sitemap.xml
git commit -m "feat: add privacy notice and rights request center"
```

### Task 8: Verify, preview, approve, and deploy

**Files:**
- Create: `docs/privacy/production-verification.md`

**Interfaces:**
- Consumes: All prior tasks and a Netlify preview.
- Produces: Evidence for every page and consent state.

- [ ] **Step 1: Run the complete suite**

Run: `node --test tests/*.test.mjs`

Expected: zero failures.

- [ ] **Step 2: Test browser states**

Inspect network/cookies for: new visitor, Accept All, Reject All, Analytics-only, Marketing-only, withdrawal, GPC, blocked localStorage, blocked CMP, mobile, and keyboard-only operation. The site must remain usable in all states.

- [ ] **Step 3: Prove no personal data reaches trackers**

Submit synthetic contact/privacy forms and complete the quiz. Confirm Google/Meta receive no names, email, organization, messages, quiz answers, booking data, query strings, or fragments.

- [ ] **Step 4: Verify accessibility**

Check focus order/return, visible focus, screen-reader labels, Escape behavior, equal Accept/Reject prominence, and no blocked access after rejection.

- [ ] **Step 5: Deploy a Netlify preview**

Test the preview's network behavior and response headers. The CSP must permit required resources and reject unreviewed endpoints.

- [ ] **Step 6: Approve production**

Only after Jim and the privacy reviewer approve the preview, merge to `main`; then confirm Netlify deployment and live behavior.

- [ ] **Step 7: Record evidence and commit**

Document commit, timestamp, CMP version, tested pages/states, vendor requests, cookies, CSP, and reviewer sign-off in `docs/privacy/production-verification.md`.

```bash
git add docs/privacy/production-verification.md
git commit -m "docs: record privacy compliance verification"
```

## Self-review results

- Spec coverage: every public page, current external service, consent state, request right, disclosure, security header, and deployment gate maps to a task.
- Placeholder scan: no implementation placeholder is accepted; Task 1 creates and records the real external CMP configuration before integration.
- Interface consistency: Tasks 4/6 share `HappyAIPathPrivacy` and `happy-ai-path:privacy-change`; Tasks 2/3/5 share the page inventory and vendor allowlist.
- Review Focus coverage: withdrawal and GPC are tested in Task 4; missing pages in Task 2; new endpoints in Task 3; CMP/storage failure in Task 4.
