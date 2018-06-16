/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Parser } from './index';

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

export interface Font {
  style: string;
  family: string;
  size: string;
}

function fontParser(src: Font) {
  const fontStyle = fontWeightVariants[src.style];

  return `;font-family:${src.family}
  ;font-size:${src.size}px
  ;font-weight:${fontStyle}`;
}
