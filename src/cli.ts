/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { fork }        from 'child_process';
import { checkArgv }   from './cli/check-argv';
import { CliOptions }  from './cli/models';
import { parseParams } from './cli/parse-params';
import * as logger     from './utils/logger';

checkArgv();

const filesToProceed: Array<[string, CliOptions]> = parseParams();

console.log(logger.blue(logger.bold('XD2SVG starts their work\n')));
filesToProceed.forEach( ([inputFile, options]) => {
  console.log(
    logger.blue('filename: ') + '%s\n' +
    logger.blue('output type: ') + '%s\n' +
    logger.blue('output path: ') + '%s\n',
    inputFile,
    options.single ? 'single' : 'multiple',
    options.output,
  );

  fork(__dirname + '/runner.js', [inputFile, JSON.stringify(options)]);
});
