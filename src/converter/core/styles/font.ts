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

export const font: Parser = {
  parse: (src: Font) => new FontParser(src).getStyle(),
};

class FontParser {
  private parsed = [];

  constructor(private input: Font) {
    this.fontFamily();
    this.fontSize();
    this.fontStretch();
    this.fontStyle();
    this.fontWeight();
  }

  public getStyle() {
    return this.parsed.join(';');
  }

  private fontFamily() {
    const {postscriptName, family} = this.input;

    const families = [postscriptName, family].filter(Boolean);

    if (families.length) {
      this.parsed.push(`font-family: ${families.join(', ')}`);
    }
  }

  private fontSize() {
    if (this.input.size) {
      this.parsed.push(`font-size: ${this.input.size}px`);
    }
  }

  private fontStretch() {
    if (/condensed/i.test(this.input.style)) {
      this.input.style = this.input.style.replace(/condensed/i, '').trim();

      this.parsed.push(`font-stretch: condensed`);
    }
  }

  private fontStyle() {
    if (!/italic/i.test(this.input.style)) return;

    this.input.style = this.input.style.replace(/italic/i, '').trim();
    this.parsed.push(`font-style: italic`);
  }

  private fontWeight() {
    const weight = fontWeightVariants[this.input.style];

    if (weight) {
      this.parsed.push(`font-weight: ${weight}`);
    }
  }
}
