import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');

test('Services uses the approved plain-language service copy and links', () => {
  const html = read('services.html');
  assert.match(html, /Hands-on AI training for teams and one-on-one coaching for leaders and professionals, built around real work\. Led by Jim Perry\./);
  assert.match(html, /AI training and coaching built around your real work\./);
  assert.match(html, /There are two ways to work together\./);
  assert.match(html, /One-on-One AI Coaching/);
  assert.match(html, /Discuss team training/);
  assert.match(html, /Talk with Jim about coaching/);
  assert.ok((html.match(/>View pricing<\/a>/g) ?? []).length >= 2);
  assert.match(html, /href="\/contact"[^>]*>Discuss team training<\/a>/);
  assert.match(html, /href="\/contact"[^>]*>Talk with Jim about coaching<\/a>/);
  assert.doesNotMatch(html, /Executive AI Coaching|high-ROI|drive growth|master AI/i);
});

test('Homepage uses approved descriptions, proof, pricing links, and testimonials', () => {
  const html = read('index.html');
  const description = 'Practical AI training and coaching for leaders and teams, built around real work. Led by Jim Perry, Fortune 100 technology leader and The Ohio State University Fisher College of Business lecturer.';
  assert.ok((html.match(new RegExp(description.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length >= 3);
  assert.match(html, /<h3 class="display-face">One-on-One AI Coaching<\/h3>/);
  assert.match(html, /Focused, confidential support for leaders and professionals who want to finish an AI project, improve an important workflow, or apply AI to their own decisions\./);
  assert.ok((html.match(/href="\/pricing"[^>]*>View pricing<\/a>/g) ?? []).length >= 2);
  assert.match(html, /Since January 2025, Jim has trained more than 1,000 professionals, including sessions with more than 300 participants\./);
  assert.doesNotMatch(html, /100% revolutionize our company/);
  assert.doesNotMatch(html, /TODO\(Jim\): add role and company type to each testimonial\.|Course participant/);
  assert.equal((html.match(/<footer>Trainee<\/footer>/g) ?? []).length, 2);
});

test('Contact uses approved copy and Netlify interest values', () => {
  const html = read('contact.html');
  assert.match(html, /Book a conversation with Jim Perry about AI training or coaching for your team\./);
  assert.match(html, /<h1[^>]*>Tell me what your team is working through\.<\/h1>/);
  assert.match(html, /Book a time on Jim's calendar or send a short message below\. Either way, Jim will follow up personally\./);
  assert.match(html, /id="contact-form-heading"[^>]*>Send a message<\/h2>/);
  for (const value of [
    'One-on-one AI coaching',
    'Team AI training or private workshop',
    'Speaking or facilitation',
    'Something else',
  ]) {
    assert.match(html, new RegExp(`<option value="${value}">${value}</option>`));
  }
});

test('About contains the approved corrections', () => {
  const html = read('about.html');
  assert.match(html, /from streamlining operations to improving decision-making\./);
  assert.match(html, /As a <span[^>]*>Lecturer/);
  assert.match(html, /meta name="keywords" content="[^"]*AI Coach/);
  assert.doesNotMatch(html, /As an <span|Executive AI Coach|unlocking new growth opportunities/);
});

test('One-on-One AI Coaching is the service name across discovery copy', () => {
  const text = read('llms.txt');
  assert.match(text, /\[One-on-One AI Coaching\]/);
  assert.doesNotMatch(text, /Executive AI Coaching/);
});

test('only Contact links directly to Outlook booking', () => {
  const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html'));
  const occurrences = htmlFiles.flatMap((file) => {
    const matches = read(file).match(/https:\/\/outlook\.office\.com\/book\/HappyAIPath@happyaipath\.com\/\?ismsaljsauthenabled/g) ?? [];
    return matches.map(() => file);
  });
  assert.deepEqual(occurrences, ['contact.html']);
  assert.match(read('contact.html'), /href="https:\/\/outlook\.office\.com\/book\/HappyAIPath@happyaipath\.com\/\?ismsaljsauthenabled"[^>]*>Book time with Jim<\/a>/);
});

test('Events uses the full university and college names', () => {
  const events = read('events.html');
  const llms = read('llms.txt');

  assert.doesNotMatch(events, /OSU Fisher|with Ohio State|through Ohio State/);
  assert.doesNotMatch(llms, /OSU Fisher/);
  assert.match(events, /Fisher College of Business Executive Education at The Ohio State University/);
});

test('Pricing page remains byte-for-byte unchanged', () => {
  const hash = createHash('sha256').update(read('pricing.html')).digest('hex');
  assert.equal(hash, '2197771bb7a504290dd429992acf8311908bde3b701a20b2578612b17a11cab3');
});
