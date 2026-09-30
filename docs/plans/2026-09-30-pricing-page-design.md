# Pricing Page Design

## Purpose

Create a clear, indexable pricing page that helps organizational buyers understand the starting investment, the custom nature of the work, and the difference between hands-on training and one-on-one coaching.

## Information architecture

The page uses this order:

1. Editorial hero with the starting-price message and a direct contact action.
2. Custom AI Training and Workshops, presented first as the primary organizational offer.
3. One-on-One AI Coaching as a substantial follow-on or standalone engagement.
4. The Happy AI Path learning environment and privacy safeguards.
5. Jim Perry's relevant credentials.
6. A final invitation to start a conversation.

Pricing appears in the primary navigation immediately after Services. The Services page links to Pricing from both the training and coaching offers.

## Visual direction

Reuse the current editorial system, Fraunces display typography, restrained teal accents, generous whitespace, and real Happy AI Path photography. Avoid tier cards, comparison tables, badges, gradients, and generic pricing-page patterns. Use `jim-perry-teaching-home.webp` as the page's primary image and social-sharing image because it shows the real hands-on learning experience and is already optimized as WebP.

## Search and answer-engine coverage

The page has one clean canonical URL at `/pricing`, a unique title and description, Open Graph and Twitter metadata, and JSON-LD for `WebPage`, `Service`, `Offer`, `Person`, and `BreadcrumbList`. Starting prices are represented as `PriceSpecification` values in USD without implying an upper limit. Visible copy and structured data remain consistent.

Update `sitemap.xml` and `llms.txt`. Review `robots.txt` and `ads.txt`; do not change them unless the new page requires a real directive or advertising record. Add `/pricing.html` to the clean-URL redirects in `netlify.toml`.

## Release boundary

Build and verify locally first. Publishing is a separate production action after user review. The release check covers desktop, 1366 by 768, tablet, mobile, navigation, structured data parsing, clean URLs, image loading, accessibility, and the contact call to action.
