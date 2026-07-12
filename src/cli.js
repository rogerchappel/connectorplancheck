import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { loadPlan, validatePlan } from './validate.js';
import { toJson, toMarkdown } from './report.js';
import pkg from '../package.json' with { type: 'json' };

export async function run(argv) {
  const args = [...argv];
  const file = args.shift();
  if (file === '--version' || file === '-v') {
    return { code: 0, output: `${pkg.version}\n` };
  }
  if (!file || file === '--help' || file === '-h') {
    return { code: 0, output: 'Usage: connectorplancheck <plan.json> [--format markdown|json] [--out file]\n' };
  }
  const formatIndex = args.indexOf('--format');
  const format = formatIndex >= 0 ? args[formatIndex + 1] : 'markdown';
  const outIndex = args.indexOf('--out');
  const out = outIndex >= 0 ? args[outIndex + 1] : null;
  if (!['markdown', 'json'].includes(format)) throw new Error(`Unsupported format: ${format}`);
  const report = validatePlan(await loadPlan(file), file);
  const output = format === 'json' ? toJson(report) : toMarkdown(report);
  if (out) {
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, output);
    return { code: report.classification === 'blocked' ? 1 : 0, output: `${out}\n` };
  }
  return { code: report.classification === 'blocked' ? 1 : 0, output };
}
