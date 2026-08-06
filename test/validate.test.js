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

test('blocks non-object plan roots without throwing', () => {
  for (const plan of [null, [], 'plan', 42, true]) {
    const report = validatePlan(plan, 'malformed');
    assert.equal(report.classification, 'blocked');
    assert.ok(report.failed > 0);
  }
});

test('blocks truthy values with invalid plan field types', () => {
  const report = validatePlan({
    dryRun: true,
    approval: { status: 'pending' },
    target: { connector: {}, accountId: [] },
    actions: [{ idempotencyKey: {} }],
    data: { classification: 'public' },
    rollback: { notes: {} },
  }, 'invalid-types');

  assert.equal(report.classification, 'blocked');
  assert.ok(report.failed > 0);
  assert.ok(report.warnings > 0);
  assert.equal(report.results.find(result => result.id === 'target')?.status, 'fail');
  assert.equal(report.results.find(result => result.id === 'idempotency')?.status, 'fail');
  assert.equal(report.results.find(result => result.id === 'rollback')?.status, 'warn');
});
