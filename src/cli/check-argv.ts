/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */
import * as logger from '../utils/logger';

export function checkArgv(): void {
  if (process.argv[2]) return;

  console.log(`${logger.bold('Usage:')} xd2svg-cli InputFile.xd [options]
  ${logger.bold('options:')}
  ${logger.bold('-o, --output')}       - specify output path (default FileName directory or FileName.svg)
  ${logger.bold('-s, --single')}       - specify does output should be single file with all artboards or directory with separated each other (default: true)
  ${logger.bold('-d, --disable-svgo')} - option to disable SVGO optimizations

  For additional information: man xd2svg-cli`);

  process.exit(0);
}
