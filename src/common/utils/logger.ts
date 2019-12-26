/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

export function error(message: string, ...args: any[]): void {
  console.error(`\u001b[31m
${bold('ERROR HAPPENS!')}
${'='.repeat(75)}
${message}\u001b[39m`, ...args);
}

export function bold(s: string): string {
  return `\u001b[1m${s}\u001b[22m`;
}

export function red(s: string): string {
  return `\u001b[31m${s}\u001b[39m`;
}

export function blue(s: string): string {
  return `\u001b[34m${s}\u001b[39m`;
}
