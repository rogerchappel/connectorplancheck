# Changelog

All notable changes to `connectorplancheck` will be documented here.

## 0.1.0 - Release Candidate

- Provides a local-only CLI for reviewing connector action plans before live execution.
- Checks dry-run intent, approval status, connector target metadata, idempotency keys, data classification, and rollback notes.
- Includes markdown and JSON report output for release review evidence.
- Rejects ambiguous or malformed CLI arguments with actionable usage errors.
- Adds package smoke coverage for the CLI entrypoint, validation code, fixtures, docs, skill file, README, and license.
- Loads package metadata without experimental JSON modules on supported Node.js versions.
- Verifies the installed CLI on Node.js 18, 20, 22, and 24 in CI.
