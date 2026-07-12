import test from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../src/cli.js';
import pkg from '../package.json' with { type: 'json' };
import { toJson, toMarkdown } from '../src/report.js';

const report = { source: 'plan.json', classification: 'ready', failed: 0, warnings: 0, results: [{ id: 'dry-run', label: 'Dry run', severity: 'fail', status: 'pass' }] };

test('renders json report', () => {
  assert.equal(JSON.parse(toJson(report)).classification, 'ready');
});

test('renders markdown report', () => {
  assert.match(toMarkdown(report), /connectorplancheck report/);
  assert.match(toMarkdown(report), /dry-run/);
});

test('prints package version for CLI smoke checks', async () => {
  const result = await run(['--version']);
  assert.equal(result.code, 0);
  assert.equal(result.output.trim(), pkg.version);
});
