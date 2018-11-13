/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Color }   from './color';
import { Pattern } from './pattern';

export interface Fill {
  type: string;
  fill?: {
    color: Color;
  };
  gradient?: {
    // Common gradients
    units: 'objectBoundingBox' | 'userSpaceOnUse';
    ref: string;

    // Linear gradients
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;

    // Radial gradients
    cx?: number;
    cy?: number;
    r?: number;
  };
  pattern?: Pattern;
  color?: Color;
}
