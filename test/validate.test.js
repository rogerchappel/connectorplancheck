import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPlan, validatePlan } from '../src/validate.js';

test('accepts safe dry-run connector plans', async () => {
  const report = validatePlan(await loadPlan('fixtures/safe-plan.json'), 'safe');
  assert.equal(report.classification, 'ready');
  assert.equal(report.failed, 0);
});

test('blocks unsafe live connector plans', async () => {
  const report = validatePlan(await loadPlan('fixtures/unsafe-plan.json'), 'unsafe');
  assert.equal(report.classification, 'blocked');
  assert.ok(report.failed >= 3);
});
