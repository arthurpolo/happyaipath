# Site-Wide Privacy Compliance Specification

## Objective

Apply one conservative privacy standard across every Happy AI Path public page before Meta Pixel is enabled. The implementation should reduce exposure under GDPR/UK GDPR, CCPA/CPRA, Colorado and other U.S. state privacy laws without claiming that software alone guarantees legal compliance.

## Product decisions

- Use a maintained commercial Consent Management Platform (CMP); Termly Pro+ is the recommended default for this small static site because it combines consent management, regional rules, consent logs, cookie scans, policy support, and data-subject request tooling.
- Apply prior opt-in globally instead of maintaining weaker state-by-state defaults.
- Present equally prominent **Accept all**, **Reject all**, and **Manage choices** actions.
- Separate **Necessary**, **Analytics**, and **Marketing** categories. Necessary is always active; Analytics and Marketing are off by default.
- Google Analytics belongs to Analytics. Meta Pixel belongs to Marketing.
- Honor Global Privacy Control as an automatic rejection of Marketing and any sale/share or targeted-advertising processing.
- Do not use Meta's unconditional `noscript` tracking image.
- Do not send form contents, quiz answers, email addresses, names, organization names, booking details, or URL parameters to Google or Meta.
- Offer access, correction, deletion, portability, and targeted-advertising/sale/share opt-out requests through a visible privacy request mechanism.
- Preserve the site's existing security headers and restrict new Meta network access to the minimum domains actually required.
- Obtain final policy/configuration review from a qualified privacy attorney before production activation.

## Public page inventory

- `/` from `index.html`
- `/services` from `services.html`
- `/pricing` from `pricing.html`
- `/quiz` from `quiz.html`
- `/prompting-lab` from `tips.html`
- `/blog` from `blog.html`
- Blog article output from `blog-post-template.html`
- `/events` from `events.html`
- `/about` from `about.html`
- `/contact` from `contact.html`
- `/privacy` from `privacy.html`
- `/guide` from `guide.html`
- `/404.html` from `404.html`

## Page-specific rules

- Every page must load the CMP before any optional analytics or marketing technology.
- Every page footer must expose **Privacy Notice** and **Your Privacy Choices**.
- The contact form remains a necessary, user-requested Netlify service and must never be copied into advertising events.
- Quiz answers remain browser-local and must never be sent to analytics or marketing services.
- Blog RSS retrieval from `api.rss2json.com` must be disclosed as a functional external request and must not contain visitor identifiers.
- Search submissions to `blog.happyaipath.com` are user-initiated external navigation and must be described in the privacy notice.
- The privacy page and 404 page must remain usable when all optional processing is rejected.

## Compliance operations

- Maintain a current tracker/vendor inventory and a written retention schedule.
- Re-scan the site after every new third-party script or material feature.
- Retain evidence of consent configuration and tests without collecting unnecessary personal information.
- Re-review the privacy notice at least annually and whenever vendors, purposes, or retention periods change.
- Document the legal applicability assessment separately from the technical implementation.

## Acceptance criteria

- No request to Google Analytics or Meta occurs before affirmative category consent.
- Reject All and GPC cause no Analytics or Marketing requests, cookies, pixels, or events.
- Withdrawing prior consent stops future events and removes first-party tracker cookies where technically possible.
- Marketing-only consent loads Meta but not Google Analytics; Analytics-only consent loads Google Analytics but not Meta.
- Every public page provides working privacy controls and passes keyboard/accessibility checks.
- Production response headers permit only the reviewed vendor endpoints.
- Privacy disclosures match actual network behavior and vendor configuration.
