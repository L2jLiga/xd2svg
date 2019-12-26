/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { convertXd } from './cli/convert-xd';
import { Options }   from './common';

const options: Options = JSON.parse(process.argv.pop());
const inputFile = process.argv.pop();

convertXd(inputFile, options)
  .catch(() => process.exit(-1));
