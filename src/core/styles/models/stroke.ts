/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as fill from './fill';

interface PatternStroke extends fill.PatternFill {
  width: number;
}

interface GradientStroke extends fill.GradientFill {
  width: number;
}

interface ColorStroke extends fill.ColorFill {
  width: number;
}

interface NoneStroke extends fill.NoneFill {
  width: number;
}

export type Stroke = PatternStroke | GradientStroke | ColorStroke | NoneStroke;
