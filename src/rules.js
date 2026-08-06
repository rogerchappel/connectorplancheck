const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmptyString = value => typeof value === 'string' && value.trim().length > 0;

export const rules = [
  { id: 'plan-object', label: 'Plan root is a JSON object', severity: 'fail', test: plan => isObject(plan) },
  { id: 'dry-run', label: 'Plan is explicitly dry-run', severity: 'fail', test: plan => isObject(plan) && plan.dryRun === true },
  { id: 'approval', label: 'Approval is absent or pending, not assumed granted', severity: 'fail', test: plan => isObject(plan?.approval) && ['pending', 'not-requested'].includes(plan.approval.status) },
  { id: 'target', label: 'Connector target and account are named', severity: 'fail', test: plan => isObject(plan?.target) && isNonEmptyString(plan.target.connector) && isNonEmptyString(plan.target.accountId) },
  { id: 'actions', label: 'At least one action is described', severity: 'fail', test: plan => Array.isArray(plan?.actions) && plan.actions.length > 0 && plan.actions.every(isObject) },
  { id: 'idempotency', label: 'Every action has an idempotency key', severity: 'fail', test: plan => Array.isArray(plan?.actions) && plan.actions.every(action => isObject(action) && isNonEmptyString(action.idempotencyKey)) },
  { id: 'data-boundary', label: 'Data classification is declared', severity: 'warn', test: plan => isObject(plan?.data) && ['public', 'internal', 'sensitive'].includes(plan.data.classification) },
  { id: 'rollback', label: 'Rollback or undo notes exist', severity: 'warn', test: plan => isObject(plan?.rollback) && isNonEmptyString(plan.rollback.notes) },
  { id: 'no-secrets', label: 'Plan does not include obvious secrets', severity: 'fail', test: plan => !String(JSON.stringify(plan)).match(/(api[_-]?key|secret|token|password)\s*[:=]/i) }
];
