# Contributing

Thanks for improving `connectorplancheck`.

## Local Checks

Run the release-candidate gate before opening a pull request:

```bash
npm install
npm run release:check
```

For smaller changes, these commands are useful while iterating:

```bash
npm run check
npm test
npm run smoke
npm run package:smoke
```

## Fixture Guidelines

- Keep fixtures synthetic and minimal.
- Prefer deterministic JSON examples that cover one approval or safety behavior at a time.
- Do not commit real connector account IDs, credentials, customer payloads, or production rollback instructions.

