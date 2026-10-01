import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const contact = readFileSync(new URL('../contact.html', import.meta.url), 'utf8');
const privacy = readFileSync(new URL('../privacy.html', import.meta.url), 'utf8');

test('contact page contains a Netlify-detectable form with spam protection', () => {
  assert.match(contact, /<form[^>]+name="happy-ai-path-contact"[^>]+method="POST"[^>]+data-netlify="true"/);
  assert.match(contact, /netlify-honeypot="bot-field"/);
  assert.match(contact, /name="form-name" value="happy-ai-path-contact"/);
  assert.match(contact, /<p class="contact-honeypot"[^>]+hidden>/);
  assert.match(contact, /name="bot-field"/);
  assert.match(contact, /<form[^>]+aria-labelledby="contact-form-heading"/);

  for (const field of ['name', 'email', 'organization', 'role', 'interest', 'message']) {
    assert.match(contact, new RegExp(`name="${field}"`));
  }
  for (const field of ['name', 'email', 'interest']) {
    assert.match(contact, new RegExp(`(?:input|select|textarea)[^>]+name="${field}"[^>]+required`));
  }
  assert.match(contact, /<label for="contact-message">What else should Jim know\? \(For example, which AI tools you can access, your preferred training timeline, or any other relevant context\.\)<\/label>/);
  assert.doesNotMatch(contact, /<textarea[^>]+name="message"[^>]+required/);
});

test('contact page offers direct booking with a meeting-invitation reminder', () => {
  assert.match(contact, /href="https:\/\/outlook\.office\.com\/book\/HappyAIPath@happyaipath\.com\/\?ismsaljsauthenabled"/);
  assert.match(contact, /spam or junk folder/i);
});

test('contact form uses accessible inline submission feedback', () => {
  assert.match(contact, /id="contact-form-status"[^>]+role="status"[^>]+aria-live="polite"/);
  assert.match(contact, /fetch\('\/'/);
  assert.match(contact, /application\/x-www-form-urlencoded/);
  assert.match(contact, /Thanks[^<]*Your message has been sent/i);
});

test('contact interest options use the approved labels and submitted values', () => {
  const contact = readFileSync(new URL('../contact.html', import.meta.url), 'utf8');
  for (const value of [
    'One-on-one AI coaching',
    'Team AI training or private workshop',
    'Speaking or facilitation',
    'Something else',
  ]) {
    assert.match(contact, new RegExp(`<option value="${value}">${value}</option>`));
  }
  assert.doesNotMatch(contact, /value="Executive AI coaching"|value="Private corporate workshop"/);
});

test('JotForm is completely removed from the site contact flow', () => {
  assert.doesNotMatch(contact, /jotform/i);
  assert.doesNotMatch(privacy, /jotform/i);
  assert.match(privacy, /Netlify/i);
});
