/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as fill from './fill';

interface CommonStroke {
  width: number;
  dash: [number, number];
  cap: string;
  join: string;
}

type PatternStroke = fill.PatternFill & CommonStroke;
type GradientStroke = fill.GradientFill & CommonStroke;
type ColorStroke = fill.ColorFill & CommonStroke;
type NoneStroke = fill.NoneFill & CommonStroke;

export type Stroke = PatternStroke | GradientStroke | ColorStroke | NoneStroke;
