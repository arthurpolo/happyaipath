import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

function jsonLd(file) {
  const html = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return { html, data: blocks.map(([, json]) => JSON.parse(json)) };
}

test('homepage identifies Happy AI Path as a professional service and educational organization', () => {
  const { data } = jsonLd('index.html');
  const entities = data.flatMap((item) => item['@graph'] ?? [item]);
  const business = entities.find((item) => item['@id'] === 'https://happyaipath.com/#organization');

  assert.ok(business, 'homepage should define the primary organization with a stable @id');
  assert.ok(Array.isArray(business['@type']), 'organization should support multiple schema types');
  assert.ok(business['@type'].includes('ProfessionalService'));
  assert.ok(business['@type'].includes('EducationalOrganization'));
  assert.equal(business.name, 'Happy AI Path');
  assert.equal(business.url, 'https://happyaipath.com/');
});

test('Services exposes one FAQPage whose questions are visible to visitors', () => {
  const { html, data } = jsonLd('services.html');
  const entities = data.flatMap((item) => item['@graph'] ?? [item]);
  const faqs = entities.filter((item) => item['@type'] === 'FAQPage');

  assert.equal(faqs.length, 1);
  assert.ok(faqs[0].mainEntity.length >= 3);
  for (const question of faqs[0].mainEntity) {
    assert.equal(question['@type'], 'Question');
    assert.equal(question.acceptedAnswer?.['@type'], 'Answer');
    assert.ok(question.acceptedAnswer?.text);
    assert.ok(html.includes(question.name), `visible page is missing FAQ question: ${question.name}`);
    assert.ok(html.includes(question.acceptedAnswer.text), `visible page is missing FAQ answer: ${question.name}`);
  }
});
