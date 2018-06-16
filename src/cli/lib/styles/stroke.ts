/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Fill, fillParser } from './fill';
import { Parser } from './index';

export const stroke: Parser = {
  name: 'stroke',
  parse: strokeParser,
};

export interface Stroke extends Fill {
  width: number;
}

function strokeParser(src: Stroke, parentElement, uuid, resources) {
  return fillParser(src, parentElement, uuid, resources) + `;stroke-width:${src.width}px`;
}
