/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

interface RgbColor {
  mode: 'RGB';
  alpha?: number;
  value: {
    r: number;
    g: number;
    b: number;
  };
}

interface HslColor {
  mode: 'HSL';
  alpha?: number;
  value: {
    h: number;
    s: number;
    l: number;
  };
}

interface HexColor {
  mode?: '';
  value?: number;
}

export type Color = RgbColor | HslColor | HexColor;
