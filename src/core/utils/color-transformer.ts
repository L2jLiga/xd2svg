/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */
import { Color } from '../styles/models';

export function colorTransformer(color: Color = {}): string {
  switch (color.mode) {
    case 'RGB':
      if (color.alpha) {
        return 'rgba(' + color.value.r + ',' + color.value.g + ',' + color.value.b + ',' + color.alpha + ')';
      } else {
        return 'rgb(' + color.value.r + ',' + color.value.g + ',' + color.value.b + ')';
      }
    case 'HSL':
      if (color.alpha) {
        return 'hsla(' + color.value.h + ',' + color.value.s + ',' + color.value.l + ',' + color.alpha + ')';
      } else {
        return 'hsl(' + color.value.h + ',' + color.value.s + ',' + color.value.l + ')';
      }
    default:
      return '#' + (color.value ?
        color.value.toString(16)
        : 'fff');
  }
}
