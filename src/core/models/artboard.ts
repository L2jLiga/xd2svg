/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Shape } from './shape';
import { Text }  from './text';

interface CommonArtboard {
  id?: string;
  name?: string;
  type?: string;
  children: Artboard[];
  artboard?: Artboard;
  visible?: boolean;
  style: { [style: string]: any };
  transform: { [transform: string]: any };
}

interface ShapeArtboard extends CommonArtboard {
  type: 'shape';
  shape: Shape;
}

interface TextArtboard extends CommonArtboard {
  type: 'text';
  text: Text;
}

interface GroupArtboard extends CommonArtboard {
  type: 'group';
  group: Artboard;
}

export type Artboard = ShapeArtboard | TextArtboard | GroupArtboard;
