import { readFile } from 'node:fs/promises';

const required = ['README.md', 'SKILL.md', 'docs/PRD.md', 'docs/TASKS.md', 'docs/ORCHESTRATION.md'];
for (const file of required) {
  const text = await readFile(file, 'utf8');
  if (text.trim().length < 40) throw new Error(`${file} is too short`);
}
JSON.parse(await readFile('fixtures/safe-plan.json', 'utf8'));
JSON.parse(await readFile('fixtures/unsafe-plan.json', 'utf8'));
console.log('check ok');
