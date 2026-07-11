# PRD: connectorplancheck

Status: in-progress
Decision: build now

## Pitch

A deterministic preflight gate for connector action plans that helps agents prove a plan is still a dry run before touching Slack, CRM, GitHub, project-management, or other external systems.

## V1 Scope

- Read JSON connector action plans.
- Validate dry-run flag, approval state, idempotency key, target/account boundaries, data classification, and rollback notes.
- Emit Markdown and JSON reports.
- Include fixtures, tests, smoke checks, and agent skill instructions.

## Out of Scope

- Executing connector actions.
- Storing credentials.
- Calling live external APIs.
