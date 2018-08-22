/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { checkArgv }   from './cli/check-argv';
import { convertXd }   from './cli/convert-xd';
import { CliOptions }  from './cli/models';
import { parseParams } from './cli/parse-params';
import * as logger     from './utils/logger';

checkArgv();

const options: CliOptions = parseParams();

console.log(logger.blue(logger.bold('XD2SVG starts their work, given input:')) +
  logger.blue('filename: ') + '%s\n' +
  logger.blue('output type: ') + '%s\n' +
  logger.blue('output path: ') + '%s',
  process.argv[2],
  options.single ? 'single' : 'multiple',
  options.output,
);

convertXd(process.argv[2], options);
