import { access, mkdir, writeFile } from 'node:fs/promises';

await access('bin/connectorplancheck.js');
await access('src/cli.js');
await mkdir('dist', { recursive: true });
await writeFile('dist/package-manifest.txt', 'connectorplancheck build artifact\n');
console.log('build ok');
