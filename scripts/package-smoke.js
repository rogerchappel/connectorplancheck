#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const directory = mkdtempSync(join(tmpdir(), 'connectorplancheck-package-'));
process.on('exit', () => rmSync(directory, { recursive: true, force: true }));

const result = spawnSync('npm', ['pack', '--json', '--pack-destination', directory], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const [pack] = JSON.parse(result.stdout);
const packedFiles = new Set(pack.files.map((file) => file.path));
const requiredFiles = [
  'bin/connectorplancheck.js',
  'src/cli.js',
  'src/validate.js',
  'fixtures/safe-plan.json',
  'docs/RELEASE_CANDIDATE.md',
  'SKILL.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'package.json',
];
const forbiddenFiles = [
  'tmp/smoke.md',
  'test/report.test.js',
  'test/validate.test.js',
];

const missing = requiredFiles.filter((file) => !packedFiles.has(file));
const forbidden = forbiddenFiles.filter((file) => packedFiles.has(file));
if (missing.length > 0 || forbidden.length > 0) {
  if (missing.length > 0) console.error(`Package smoke failed; missing: ${missing.join(', ')}`);
  if (forbidden.length > 0) console.error(`Package smoke failed; unexpectedly packed: ${forbidden.join(', ')}`);
  process.exit(1);
}

const archive = join(directory, pack.filename);
const install = join(directory, 'install');
const packageMetadata = JSON.parse(readFileSync('package.json', 'utf8'));
const packedPackage = pack.files.find((file) => file.path === 'package.json');
const packedReadme = pack.files.find((file) => file.path === 'README.md');
if (packageMetadata.engines?.node !== '>=22') {
  console.error(`Package smoke failed; expected engines.node to be >=22, got ${packageMetadata.engines?.node ?? 'undefined'}`);
  process.exit(1);
}
if (!packedPackage || !packedReadme) {
  console.error('Package smoke failed; package metadata or README is missing from the archive.');
  process.exit(1);
}

const installed = spawnSync('npm', [
  'install', '--ignore-scripts', '--no-audit', '--no-fund', '--prefix', install, archive,
], { encoding: 'utf8' });
if (installed.status !== 0) {
  process.stderr.write(installed.stderr);
  process.exit(installed.status ?? 1);
}

const executable = join(install, 'node_modules', '.bin', 'connectorplancheck');
const fixture = join(install, 'node_modules', 'connectorplancheck', 'fixtures', 'safe-plan.json');
const installedRoot = join(install, 'node_modules', 'connectorplancheck');
const installedMetadata = JSON.parse(readFileSync(join(installedRoot, 'package.json'), 'utf8'));
const installedReadme = readFileSync(join(installedRoot, 'README.md'), 'utf8');
if (installedMetadata.engines?.node !== packageMetadata.engines.node) {
  console.error('Package smoke failed; installed package has a different Node.js engine policy.');
  process.exit(1);
}
if (!installedReadme.includes('Node.js 22 and later') || !installedReadme.includes('Node.js 22, 24, and 26')) {
  console.error('Package smoke failed; README does not report the supported Node.js policy and CI majors.');
  process.exit(1);
}

const expectedVersion = packageMetadata.version;
for (const [label, args, expected] of [
  ['help', ['--help'], /Usage: connectorplancheck/],
  ['version', ['--version'], new RegExp(`^${expectedVersion.replaceAll('.', '\\.') }\\n$`)],
  ['plan validation', [fixture, '--format', 'json'], /"classification": "ready"/],
]) {
  const invocation = spawnSync(executable, args, { encoding: 'utf8' });
  if (invocation.status !== 0 || !expected.test(invocation.stdout)) {
    process.stderr.write(`Installed CLI ${label} smoke failed.\n${invocation.stderr}`);
    process.exit(invocation.status ?? 1);
  }
}

console.log(`Package smoke passed with ${pack.files.length} files and an installed CLI.`);
