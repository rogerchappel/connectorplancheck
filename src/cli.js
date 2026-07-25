import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { loadPlan, validatePlan } from './validate.js';
import { toJson, toMarkdown } from './report.js';
import pkg from '../package.json' with { type: 'json' };

const usage = 'Usage: connectorplancheck <plan.json> [--format markdown|json] [--out file]\n';

function argumentError(message) {
  return new Error(`${message}\n${usage.trimEnd()}`);
}

export function parseArgs(argv) {
  const args = [...argv];
  const file = args.shift();
  const options = { file, format: 'markdown', out: null };
  const seen = new Set();

  while (args.length > 0) {
    const option = args.shift();
    if (option !== '--format' && option !== '--out') {
      const kind = option.startsWith('-') ? 'Unknown option' : 'Unexpected argument';
      throw argumentError(`${kind}: ${option}`);
    }
    if (seen.has(option)) throw argumentError(`Duplicate option: ${option}`);
    seen.add(option);

    const value = args.shift();
    if (value === undefined || value.startsWith('-')) {
      throw argumentError(`Missing value for ${option}`);
    }
    if (option === '--format') options.format = value;
    if (option === '--out') options.out = value;
  }

  if (!['markdown', 'json'].includes(options.format)) {
    throw argumentError(`Unsupported format: ${options.format}`);
  }
  return options;
}

export async function run(argv) {
  const file = argv[0];
  if (file === '--version' || file === '-v') {
    if (argv.length > 1) throw argumentError(`Unexpected argument: ${argv[1]}`);
    return { code: 0, output: `${pkg.version}\n` };
  }
  if (!file || file === '--help' || file === '-h') {
    if (argv.length > 1) throw argumentError(`Unexpected argument: ${argv[1]}`);
    return { code: 0, output: usage };
  }
  if (file.startsWith('-')) throw argumentError(`Unknown option: ${file}`);
  const { format, out } = parseArgs(argv);
  const report = validatePlan(await loadPlan(file), file);
  const output = format === 'json' ? toJson(report) : toMarkdown(report);
  if (out) {
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, output);
    return { code: report.classification === 'blocked' ? 1 : 0, output: `${out}\n` };
  }
  return { code: report.classification === 'blocked' ? 1 : 0, output };
}
