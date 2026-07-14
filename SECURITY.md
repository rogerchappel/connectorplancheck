# Security Policy

`connectorplancheck` is designed for local review of JSON plan files. It does not execute connector actions, call external APIs, read credentials, or send data to remote services.

## Reporting Issues

Please report suspected security issues privately to the maintainer instead of opening a public issue with sensitive details.

Include:

- the affected version or commit
- the command and input shape involved
- whether any private plan data, account identifiers, or credentials may have been exposed

## Handling Plan Data

Use synthetic fixtures when sharing examples publicly. If a real connector plan is needed for debugging, redact account IDs, destination names, access tokens, emails, and any user-provided payloads before attaching it to an issue or pull request.

