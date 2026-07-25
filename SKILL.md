# connectorplancheck

Use this skill when an agent is preparing to use a connector or tool that can write, send, update, delete, approve, schedule, or otherwise affect an external system.

## Inputs

- A JSON action plan with `dryRun`, `approval`, `target`, `actions`, and `rollback` fields.
- The intended connector and destination account or workspace.

## Side Effects

The CLI reads local plan files and optionally writes reports. It never executes connector actions, reads credentials, or sends data to external services.

## Workflow

1. Ask the agent to draft a connector action plan.
2. Run `connectorplancheck plan.json --format markdown`.
3. Fix failed checks or keep the action in dry-run mode.
4. Use JSON output for CI or automated release gates.

Treat exit status 2 as a command-usage failure. The CLI rejects unknown or
repeated options, missing `--format` or `--out` values, and extra positional
arguments instead of silently falling back to Markdown output.

## Verification

Run `npm test`, `npm run check`, `npm run build`, and `npm run smoke`.
