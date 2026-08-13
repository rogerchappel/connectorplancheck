# connectorplancheck

`connectorplancheck` is a local-first CLI for reviewing agent connector action plans before any live system is touched. It validates dry-run intent, approvals, idempotency, data boundaries, and rollback notes from JSON plan files.

## Quickstart

```bash
npm test
npm run smoke
node bin/connectorplancheck.js fixtures/safe-plan.json --format markdown
node bin/connectorplancheck.js fixtures/safe-plan.json --format json --out tmp/report.json
```

The CLI accepts one plan path, one optional `--format` value, and one optional
`--out` path. Unknown options, missing option values, repeated options, and
extra positional arguments are usage errors: the CLI prints an actionable
message and usage summary to standard error, then exits with status 2. This
prevents a misspelled JSON-output option from silently producing Markdown.

## Plan Shape

The plan root and nested records must be JSON objects. `dryRun` must be the
boolean `true`; `approval.status` must be the string `"pending"` or
`"not-requested"`; `target.connector`, `target.accountId`, every action
`idempotencyKey`, and `rollback.notes` must be non-empty strings. `actions`
must be a non-empty array of objects. `data.classification` must be the string
`"public"`, `"internal"`, or `"sensitive"`.

```json
{
  "dryRun": true,
  "approval": { "status": "pending" },
  "target": { "connector": "example", "accountId": "sandbox" },
  "actions": [{ "idempotencyKey": "example-create-1" }],
  "data": { "classification": "public" },
  "rollback": { "notes": "Delete the dry-run artifact." }
}
```

Malformed roots and required field types produce a deterministic blocked or
review report; object and array values are not accepted in place of strings.

## Verification

Run the same checks used for release-readiness before publishing or opening a release PR:

```bash
npm run check
npm test
npm run build
npm run smoke
npm run release:check
npm pack --dry-run
```

The package supports Node.js 22 and later. CI runs the complete release check,
including an installed-package CLI smoke test, on Node.js 22, 24, and 26.

## Safety Notes

This tool never executes connector actions, reads credentials, sends messages, updates CRMs, or calls external APIs. It only reads local JSON and optionally writes a report.

## Limitations

V1 supports deterministic JSON plan checks. It does not replace human approval for external writes and does not infer hidden destination policy.

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for the current release-candidate notes and verification scope.
