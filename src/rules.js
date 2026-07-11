export const rules = [
  { id: 'dry-run', label: 'Plan is explicitly dry-run', severity: 'fail', test: plan => plan.dryRun === true },
  { id: 'approval', label: 'Approval is absent or pending, not assumed granted', severity: 'fail', test: plan => ['pending', 'not-requested'].includes(plan.approval?.status) },
  { id: 'target', label: 'Connector target and account are named', severity: 'fail', test: plan => Boolean(plan.target?.connector && plan.target?.accountId) },
  { id: 'actions', label: 'At least one action is described', severity: 'fail', test: plan => Array.isArray(plan.actions) && plan.actions.length > 0 },
  { id: 'idempotency', label: 'Every action has an idempotency key', severity: 'fail', test: plan => Array.isArray(plan.actions) && plan.actions.every(action => Boolean(action.idempotencyKey)) },
  { id: 'data-boundary', label: 'Data classification is declared', severity: 'warn', test: plan => ['public', 'internal', 'sensitive'].includes(plan.data?.classification) },
  { id: 'rollback', label: 'Rollback or undo notes exist', severity: 'warn', test: plan => Boolean(plan.rollback?.notes) },
  { id: 'no-secrets', label: 'Plan does not include obvious secrets', severity: 'fail', test: plan => !JSON.stringify(plan).match(/(api[_-]?key|secret|token|password)\s*[:=]/i) }
];
