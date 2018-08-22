export function error(message: string, ...args: any[]) {
  console.error(`\u001b[31m
${bold('ERROR HAPPENS!')}
${'='.repeat(75)}
${message}\u001b[39m`, ...args);
}

export function bold(s: string) {
  return `\u001b[1m${s}\u001b[22m`;
}

export function red(s: string) {
  return `\u001b[31m${s}\u001b[39m`;
}

export function blue(s: string) {
  return `\u001b[34m${s}\u001b[39m`;
}
