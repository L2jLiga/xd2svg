/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Font, Parser } from './models';

// tslint:disable:object-literal-sort-keys
const fontWeightVariants = {
  Light: 300,
  Regular: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  Black: 900,
};
// tslint:enable:object-literal-sort-keys

export const font: Parser = {parse: fontParser};

function fontParser(src: Font) {
  const cssArr: string[] = [];
  const fontFamilies: string[] = [];
  const fontStyle = fontWeightVariants[src.style];

  if (src.postscriptName) fontFamilies.push(src.postscriptName);
  if (src.family) fontFamilies.push(src.family);
  if (fontFamilies.length) cssArr.push(`font-family: ${fontFamilies.join(', ')}`);
  if (fontStyle) cssArr.push(`font-weight: ${fontStyle}`);
  if (src.size) cssArr.push(`font-size: ${src.size}px`);

  return cssArr.join(';');
}
