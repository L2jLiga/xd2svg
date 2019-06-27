/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Artboard } from '../../models';
import { ElementBuilder } from './element-builder';
import { GroupBuilder } from './group-builder';
import { ShapeBuilder } from './shape-builder';
import { TextBuilder } from './text-builder';

export const elementBuilders: Array<ElementBuilder<Artboard>> = [
  new ShapeBuilder(),
  new TextBuilder(),
  new GroupBuilder(),
];
