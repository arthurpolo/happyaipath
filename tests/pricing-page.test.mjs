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
  assert.equal((html.match(/<h2[^>]*class="display-face">Engagements start at \$5,000<\/h2>/g) ?? []).length, 2);
  assert.match(html, /Every training engagement is hands-on and designed specifically for your team\./);
  assert.match(html, /participants complete guided preparation based on their current responsibilities, workflows, and business challenges/i);
  assert.match(html, /Most training sessions run between two and four hours\./);
  assert.match(html, /Longer, more in-depth sessions and multi-session programs are available/);
  assert.doesNotMatch(html, /\$15,000|\$30,000/);
  assert.doesNotMatch(html, /—/);
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
