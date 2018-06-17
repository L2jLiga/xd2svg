/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */
import { Color } from '../styles/models';

export function colorTransformer(fillColor: Color = {}): string {
  /* TODO: Add support for another modes */
  switch (fillColor.mode) {
    case 'RGB':
      if (fillColor.alpha) {
        return 'rgba(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ',' + fillColor.alpha + ')';
      } else {
        return 'rgb(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ')';
      }
    case 'HSL':
      if (fillColor.alpha) {
        return 'hsla(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ',' + fillColor.alpha + ')';
      } else {
        return 'hsl(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ')';
      }
    default:
      return 'white';
  }
}
