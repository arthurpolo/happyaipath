import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const publicPages = [
  'index.html', 'services.html', 'quiz.html', 'tips.html', 'blog.html',
  'events.html', 'about.html', 'contact.html', 'privacy.html', 'guide.html',
];

for (const file of publicPages) {
  test(`${file} uses the official Happy AI Path logo in its header`, () => {
    const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const primaryNav = html.match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert.match(primaryNav, /<img src="HappyAIPath\.svg" alt="Happy AI Path" class="site-logo">/);
    assert.doesNotMatch(primaryNav, /brand-smile-stack|brand-wordmark/);
  });
}

test('homepage restores the original three-face hero motion', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');

  assert.match(html, /class="hero-stage editorial-logo-motion" aria-hidden="true"/);
  assert.equal((html.match(/class="smile-face"/g) ?? []).length, 3);
  assert.match(styles, /animation:\s*orbitSpin 6\.8s cubic-bezier\(0\.65, 0, 0\.35, 1\) both/);
  assert.doesNotMatch(styles, /animation:\s*orbitSpin[^;]*infinite/);
  assert.match(styles, /\.smile-face:nth-child\(3\)[\s\S]*?--face-color:\s*#f3b63f/);
});

test('logo motion respects reduced-motion preferences', () => {
  const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.smile-orbit[\s\S]*?animation:\s*none !important/);
});
