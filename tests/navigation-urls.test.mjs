import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const pages = [
  ['index.html', '/'],
  ['services.html', '/services'],
  ['pricing.html', '/pricing'],
  ['quiz.html', '/quiz'],
  ['tips.html', '/prompting-lab'],
  ['blog.html', '/blog'],
  ['events.html', '/events'],
  ['about.html', '/about'],
  ['contact.html', '/contact'],
  ['privacy.html', '/privacy'],
  ['guide.html', '/guide'],
];

const expectedNavigation = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/pricing', 'Pricing'],
  ['/quiz', 'Quiz'],
  ['/prompting-lab', 'Prompting Lab'],
  ['/blog', 'Blog'],
  ['/events', 'Events'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

function primaryNavigation(html) {
  const nav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
  return [...nav.matchAll(/<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
    .map(([, href, label]) => [href, label.trim()])
    .filter(([, label]) => expectedNavigation.some(([, expected]) => label === expected));
}

for (const [file, cleanPath] of pages) {
  test(`${file} uses the standard navigation and clean canonical URL`, () => {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const links = primaryNavigation(html);
    assert.deepEqual(links.slice(0, expectedNavigation.length), expectedNavigation);
    assert.deepEqual(links.slice(expectedNavigation.length, expectedNavigation.length * 2), expectedNavigation);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://happyaipath\\.com${cleanPath === '/' ? '/' : cleanPath}">`));
    assert.doesNotMatch(html, /href="(?:index|services|quiz|tips|blog|events|about|contact)\.html"/);
    assert.doesNotMatch(html, />Playbook<\/a>/);
    assert.match(html, /class="[^"]*desktop-nav[^"]*"/);
    assert.match(html, /class="[^"]*mobile-nav-toggle[^"]*"/);
    assert.match(html, /id="mobile-menu" class="[^"]*mobile-nav-panel[^"]*"/);
  });
}

test('Netlify permanently redirects legacy URLs and serves Prompting Lab at its canonical path', () => {
  const config = readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');
  for (const [legacy, clean] of [
    ['/index.html', '/'],
    ['/services.html', '/services'],
    ['/pricing.html', '/pricing'],
    ['/quiz.html', '/quiz'],
    ['/tips', '/prompting-lab'],
    ['/tips.html', '/prompting-lab'],
    ['/blog.html', '/blog'],
    ['/events.html', '/events'],
    ['/about.html', '/about'],
    ['/contact.html', '/contact'],
    ['/privacy.html', '/privacy'],
    ['/guide.html', '/guide'],
  ]) {
    assert.match(config, new RegExp(`from = "${legacy.replace('.', '\\.')}"\\s+to = "${clean}"\\s+status = 301`));
  }
  assert.match(config, /from = "\/prompting-lab"\s+to = "\/tips\.html"\s+status = 200/);
});

test('the cookie notice links to the clean privacy URL', () => {
  const script = readFileSync(new URL('../consent.js', import.meta.url), 'utf8');
  assert.match(script, /href="\/privacy"/);
  assert.doesNotMatch(script, /href="privacy\.html"/);
});

test('blog post template keeps the shared pricing navigation responsive', () => {
  const html = readFileSync(new URL('../blog-post-template.html', import.meta.url), 'utf8');
  const links = primaryNavigation(html);
  assert.deepEqual(links.slice(0, expectedNavigation.length), expectedNavigation);
  assert.deepEqual(links.slice(expectedNavigation.length, expectedNavigation.length * 2), expectedNavigation);
  assert.match(html, /class="[^"]*desktop-nav[^"]*"/);
  assert.match(html, /class="[^"]*mobile-nav-toggle[^"]*"/);
  assert.match(html, /id="mobile-menu" class="[^"]*mobile-nav-panel[^"]*"/);
});
