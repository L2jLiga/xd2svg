/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { clipPath } from './clip-path';
import { fill } from './fill';
import { filters } from './filters';
import { font } from './font';
import { opacity } from './opacity';
import { stroke } from './stroke';
import { textAttributes } from './text-attributes';

const parsers: { [parser: string]: Parser } = {
  clipPath,
  fill,
  filters,
  font,
  opacity,
  stroke,
  textAttributes,
};

export interface Parser {
  name?: string;
  parse: (...args) => string;
}

export default parsers;
