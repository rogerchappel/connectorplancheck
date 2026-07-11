import { readFile } from 'node:fs/promises';
import { rules } from './rules.js';

export async function loadPlan(file) {
  const text = await readFile(file, 'utf8');
  return JSON.parse(text);
}

export function validatePlan(plan, source = 'inline') {
  const results = rules.map(rule => {
    const passed = Boolean(rule.test(plan));
    return { id: rule.id, label: rule.label, severity: rule.severity, status: passed ? 'pass' : rule.severity };
  });
  const failed = results.filter(result => result.status === 'fail').length;
  const warnings = results.filter(result => result.status === 'warn').length;
  const classification = failed > 0 ? 'blocked' : warnings > 0 ? 'review' : 'ready';
  return { source, classification, failed, warnings, results };
}
