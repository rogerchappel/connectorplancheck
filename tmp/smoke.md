# connectorplancheck report

Source: fixtures/safe-plan.json
Classification: ready
Failed: 0
Warnings: 0

| Status | Severity | Rule | Detail |
|---|---|---|---|
| pass | fail | dry-run | Plan is explicitly dry-run |
| pass | fail | approval | Approval is absent or pending, not assumed granted |
| pass | fail | target | Connector target and account are named |
| pass | fail | actions | At least one action is described |
| pass | fail | idempotency | Every action has an idempotency key |
| pass | warn | data-boundary | Data classification is declared |
| pass | warn | rollback | Rollback or undo notes exist |
| pass | fail | no-secrets | Plan does not include obvious secrets |
