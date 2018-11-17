/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Color }   from './color';
import { Pattern } from './pattern';

export interface ColorFill {
  type: 'color';
  fill: {
    color: Color;
  };
}

export interface SolidFill {
  type: 'solid';
  color: Color;
}

export interface GradientFill {
  type: 'gradient';

  gradient: {
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
}

export interface PatternFill {
  type: 'pattern';
  pattern: Pattern;
}

export interface NoneFill {
  type: 'none';
}

export type Fill = ColorFill | SolidFill | GradientFill | PatternFill | NoneFill;
