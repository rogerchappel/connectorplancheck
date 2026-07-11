import test from 'node:test';
import assert from 'node:assert/strict';
import { toJson, toMarkdown } from '../src/report.js';

const report = { source: 'plan.json', classification: 'ready', failed: 0, warnings: 0, results: [{ id: 'dry-run', label: 'Dry run', severity: 'fail', status: 'pass' }] };

test('renders json report', () => {
  assert.equal(JSON.parse(toJson(report)).classification, 'ready');
});

test('renders markdown report', () => {
  assert.match(toMarkdown(report), /connectorplancheck report/);
  assert.match(toMarkdown(report), /dry-run/);
});
