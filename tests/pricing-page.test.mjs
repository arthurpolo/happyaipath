import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const rootUrl = new URL('../', import.meta.url);

function read(relativePath) {
  const url = new URL(relativePath, rootUrl);
  assert.equal(existsSync(url), true, `${relativePath} must exist`);
  return readFileSync(url, 'utf8');
}

test('pricing page communicates approved starting prices and hands-on preparation', () => {
  const html = read('pricing.html');
  assert.match(html, /<h1[^>]*>Engagements &amp; Pricing<\/h1>/);
  assert.match(html, /<h2[^>]*class="display-face">Training starts at \$5,000<\/h2>/);
  assert.match(html, /<h2[^>]*class="display-face">Coaching starts at \$5,000<\/h2>/);
  assert.match(html, /Your team brings real work to the session\./);
  assert.match(html, /Participants complete guided preparation in advance/);
  assert.match(html, /Most training sessions run two to four hours\./);
  assert.match(html, /Longer sessions and multi-session programs are available/);
  assert.doesNotMatch(html, /\$15,000|\$30,000/);
  assert.doesNotMatch(html, /—/);
});

test('pricing page uses the shared editorial fonts, surface, and visible primary buttons', () => {
  const html = read('pricing.html');
  const css = read('styles.css');

  assert.match(html, /family=Newsreader:[^"&]+&family=Source\+Sans\+3:/);
  assert.match(html, /<main id="main-content" class="home-editorial pricing-page">/);
  assert.match(css, /\.pricing-page\s*{[^}]*background:\s*var\(--editorial-paper\)/s);
  assert.match(css, /\.editorial-button-primary\s*{[^}]*background:\s*var\(--editorial-teal\)/s);
  assert.equal((html.match(/class="editorial-button editorial-button-primary"/g) ?? []).length, 2);
});

test('pricing page presents training and coaching as an immediate two-column comparison', () => {
  const html = read('pricing.html');
  assert.match(html, /class="[^"]*pricing-options-grid[^"]*"/);
  assert.equal((html.match(/<article[^>]+class="pricing-option(?: pricing-option-accent)?"/g) ?? []).length, 2);
  assert.match(html, /Final pricing depends on whether the training is virtual or in person/);
  assert.match(html, /Final pricing depends on the length of the engagement/);
  assert.doesNotMatch(html, /class="pricing-outcomes"/);
  assert.doesNotMatch(html, /<h3>Participants leave with<\/h3>|<h3>Clients leave with<\/h3>/);
});

test('pricing page has complete search, social, image, and structured data metadata', () => {
  const html = read('pricing.html');
  assert.match(html, /<title>AI Training and Coaching Pricing \| Happy AI Path<\/title>/);
  assert.match(html, /<link rel="canonical" href="https:\/\/happyaipath\.com\/pricing">/);
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/happyaipath\.com\/pricing">/);
  assert.match(html, /<meta property="og:image" content="https:\/\/happyaipath\.com\/jim-perry-teaching-home\.webp">/);
  assert.match(html, /<meta name="twitter:image" content="https:\/\/happyaipath\.com\/jim-perry-teaching-home\.webp">/);
  assert.match(html, /<img[^>]+src="jim-perry-teaching-home\.webp"[^>]+width="1620"[^>]+height="810"[^>]+alt="Jim Perry leading hands-on AI training for business professionals"/);

  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json));
  assert.ok(jsonScripts.length > 0);
  const graph = jsonScripts.flatMap((entry) => entry['@graph'] ?? [entry]);
  assert.ok(graph.some((entry) => entry['@type'] === 'WebPage' && entry.url === 'https://happyaipath.com/pricing'));
  assert.ok(graph.some((entry) => entry['@type'] === 'BreadcrumbList'));
  const services = graph.filter((entry) => entry['@type'] === 'Service');
  assert.equal(services.length, 2);
  for (const service of services) {
    assert.equal(service.offers.priceSpecification.minPrice, '5000');
    assert.equal(service.offers.priceSpecification.priceCurrency, 'USD');
  }
  assert.ok(graph.some((entry) => entry['@type'] === 'Person' && /Ohio State University/.test(entry.description)));
});

test('services, sitemap, llms, and Netlify expose the clean pricing URL', () => {
  const services = read('services.html');
  assert.ok((services.match(/href="\/pricing"/g) ?? []).length >= 2);

  const sitemap = read('sitemap.xml');
  assert.match(sitemap, /<loc>https:\/\/happyaipath\.com\/pricing<\/loc>/);

  const llms = read('llms.txt');
  assert.match(llms, /\[Engagements and Pricing\]\(https:\/\/happyaipath\.com\/pricing\)/);
  assert.match(llms, /hands-on/i);
  assert.match(llms, /guided preparation/i);

  const netlify = read('netlify.toml');
  assert.match(netlify, /from = "\/pricing\.html"\s+to = "\/pricing"\s+status = 301/);
});

test('text discovery files are reviewed without inventing unrelated directives', () => {
  const robots = read('robots.txt');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/happyaipath\.com\/sitemap\.xml/);

  const ads = read('ads.txt');
  assert.doesNotMatch(ads, /pricing/i);
});
