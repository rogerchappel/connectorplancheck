# connectorplancheck

`connectorplancheck` is a local-first CLI for reviewing agent connector action plans before any live system is touched. It validates dry-run intent, approvals, idempotency, data boundaries, and rollback notes from JSON plan files.

## Quickstart

```bash
npm install -g connectorplancheck
connectorplancheck --help
connectorplancheck --version
connectorplancheck ./plan.json --format markdown
```

For local development:

```bash
npm install
npm run release:check
npm test
npm run smoke
node bin/connectorplancheck.js fixtures/safe-plan.json --format markdown
node bin/connectorplancheck.js fixtures/safe-plan.json --format json --out tmp/report.json
```

## Plan Shape

A useful plan declares `dryRun`, `approval.status`, `target.connector`, `target.accountId`, action `idempotencyKey` values, data classification, and rollback notes.

## Safety Notes

This tool never executes connector actions, reads credentials, sends messages, updates CRMs, or calls external APIs. It only reads local JSON and optionally writes a report.

## Limitations

V1 supports deterministic JSON plan checks. It does not replace human approval for external writes and does not infer hidden destination policy.
