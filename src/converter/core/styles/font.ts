/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Font, Parser } from './models';

// tslint:disable:object-literal-sort-keys
const fontWeightVariants: any = {
  Light: 200,
  Semilight: 300,
  Medium: 500,
  Semibold: 600,
  Bold: 700,
  Extrabold: 800,
  Black: 900,
};
// tslint:enable:object-literal-sort-keys

export const font: Parser = {parse: fontParser};

function fontParser(src: Font) {
  const cssArr: string[] = [];
  const fontFamilies: string[] = [];

  if (src.postscriptName) fontFamilies.push(src.postscriptName);
  if (src.family) fontFamilies.push(src.family);
  if (fontFamilies.length) cssArr.push(`font-family: ${fontFamilies.join(', ')}`);
  if (src.size) cssArr.push(`font-size: ${src.size}px`);
  cssArr.push(...parseFontStyle(src.style));

  return cssArr.join(';');
}

function parseFontStyle(fontStyle: string = ''): string[] {
  const parsed = [];
  fontStyle = fontStyle.trim();

  if (/condensed/i.test(fontStyle)) {
    fontStyle = fontStyle.replace(/condensed/i, '').trim();

    parsed.push(`font-stretch: condensed`);
  }

  if (/italic/i.test(fontStyle)) {
    fontStyle = fontStyle.replace(/italic/i, '').trim();

    parsed.push(`font-style: italic`);
  }

  const weight = fontWeightVariants[fontStyle];
  if (weight) {
    parsed.push(`font-weight: ${weight}`);
  }

  return parsed;
}
