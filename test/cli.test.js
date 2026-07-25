import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { run } from '../src/cli.js';
import pkg from '../package.json' with { type: 'json' };

const fixture = 'fixtures/safe-plan.json';
const usage = /Usage: connectorplancheck/;

function invoke(args) {
  return spawnSync(process.execPath, ['bin/connectorplancheck.js', ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });
}

test('keeps documented help and version flows compatible', async () => {
  assert.match((await run([])).output, usage);
  assert.match((await run(['--help'])).output, usage);
  assert.equal((await run(['--version'])).output.trim(), pkg.version);
});

test('renders documented markdown and JSON commands', async () => {
  const markdown = await run([fixture, '--format', 'markdown']);
  const json = await run([fixture, '--format', 'json']);

  assert.equal(markdown.code, 0);
  assert.match(markdown.output, /connectorplancheck report/);
  assert.equal(json.code, 0);
  assert.equal(JSON.parse(json.output).classification, 'ready');
});

test('writes a report for the documented output-file command', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'connectorplancheck-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const outputPath = join(directory, 'report.json');

  const result = await run([fixture, '--format', 'json', '--out', outputPath]);

  assert.equal(result.code, 0);
  assert.equal(result.output, `${outputPath}\n`);
  assert.equal(JSON.parse(await readFile(outputPath, 'utf8')).classification, 'ready');
});

for (const [name, args, error] of [
  ['unknown options', [fixture, '--formt', 'json'], /Unknown option: --formt/],
  ['missing --format values', [fixture, '--format'], /Missing value for --format/],
  ['missing --out values', [fixture, '--out'], /Missing value for --out/],
  ['duplicate --format options', [fixture, '--format', 'json', '--format', 'markdown'], /Duplicate option: --format/],
  ['duplicate --out options', [fixture, '--out', 'a.md', '--out', 'b.md'], /Duplicate option: --out/],
  ['unexpected positional arguments', [fixture, 'extra.json'], /Unexpected argument: extra.json/],
]) {
  test(`rejects ${name} with usage guidance`, async () => {
    await assert.rejects(() => run(args), (caught) => {
      assert.match(caught.message, error);
      assert.match(caught.message, usage);
      return true;
    });
  });
}

test('entrypoint rejects a misspelled option with a nonzero exit', () => {
  const result = invoke([fixture, '--formt', 'json']);

  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Unknown option: --formt/);
  assert.match(result.stderr, usage);
});

test('entrypoint rejects --out without a path with a nonzero exit', () => {
  const result = invoke([fixture, '--out']);

  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Missing value for --out/);
  assert.match(result.stderr, usage);
});
