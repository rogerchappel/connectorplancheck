export function toJson(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function toMarkdown(report) {
  const rows = report.results.map(result => `| ${result.status} | ${result.severity} | ${result.id} | ${result.label} |`).join('\n');
  return `# connectorplancheck report\n\nSource: ${report.source}\nClassification: ${report.classification}\nFailed: ${report.failed}\nWarnings: ${report.warnings}\n\n| Status | Severity | Rule | Detail |\n|---|---|---|---|\n${rows}\n`;
}
