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

checkArgv();

const options: CliOptions = parseParams();

console.log(`Proceed file %s with options\n%O`, process.argv[2], options);

convertXd(process.argv[2], options);
