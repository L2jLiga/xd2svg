/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode }  from 'xmlbuilder';
import { Options }  from '../../../../common';
import { Artboard } from '../../models';

export interface ElementBuilder<T> {
  supports(svgObject: Artboard): boolean;

  convert(svgObject: T, parent: XMLNode, defs: XMLNode, options: Options): XMLNode;
}
