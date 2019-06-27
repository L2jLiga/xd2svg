/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as logger from '../common/utils/logger';

export function checkArgv(): void {
  if (process.argv[2]) return;

  const helpMessage = `
${logger.bold('Usage:')} xd2svg [Input] [options]

  ${logger.bold('options:')}
  ${logger.bold('-o, --output')}             output path [Default: directory or file name]
  ${logger.bold('-s, --single')}             single file output [Default: false]
  ${logger.bold('-p, --pretty-print')}       pretty printed output [Default: false]
  ${logger.bold('--prefer-compound-path')}   use compound path instead of source objects [Default: true]
`;

  console.log(helpMessage);

  process.exit(0);
}
