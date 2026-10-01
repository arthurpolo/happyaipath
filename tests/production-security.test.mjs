import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const publicHtmlFiles = [
  '404.html',
  'about.html',
  'blog-post-template.html',
  'blog.html',
  'contact.html',
  'events.html',
  'guide.html',
  'index.html',
  'pricing.html',
  'privacy.html',
  'quiz.html',
  'services.html',
  'tips.html',
];

const sharedStylesheetFiles = publicHtmlFiles.filter((file) => file !== '404.html');

test('public pages contain no retired JotForm integration or runtime Tailwind compiler', () => {
  for (const file of publicHtmlFiles) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /jotform/i, `${file} contains retired JotForm content`);
    assert.doesNotMatch(html, /cdn\.tailwindcss\.com/i, `${file} loads the Tailwind runtime CDN`);
  }
  for (const file of sharedStylesheetFiles) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /href="\/?styles\.css"/, `${file} must load the local production stylesheet`);
  }
});

test('Netlify applies the required browser security headers', () => {
  const config = readFileSync('netlify.toml', 'utf8');
  for (const header of [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ]) {
    assert.match(config, new RegExp(header), `netlify.toml missing ${header}`);
  }
});

test('Git ignores environment files while allowing sanitized examples', () => {
  const gitignore = readFileSync('.gitignore', 'utf8');
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
  assert.match(gitignore, /^!\.env\.sample$/m);
});
