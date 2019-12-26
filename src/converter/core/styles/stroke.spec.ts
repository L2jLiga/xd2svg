/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { strictEqual }                  from 'assert';
import * as builder                     from 'xmlbuilder';
import { gradients }                    from '../utils';
import { Color, GradientFill, Pattern } from './models';
import { stroke }                       from './stroke';

describe(`Core > Styles parsers > Stroke`, () => {
  const pattern: Pattern = {
    height: 1,
    href: 'href',
    meta: {
      ux: {
        hrefLastModifiedDate: 1,
        scaleBehavior: 'fill',
        uid: 'uid',
      },
    },
    width: 1,
  };

  it(`should return none when type is none`, () => {
    const type = 'none';

    const result = stroke.parse({ type });

    strictEqual(result, type);
  });

  it(`should return color when type is color`, () => {
    const type = 'color';
    const color: Color = { value: 123456 };

    const result = stroke.parse({ type, fill: { color } });

    strictEqual(result, `#${color.value.toString(16)}`);
  });

  it(`should return color when type is solid`, () => {
    const type = 'solid';
    const color: Color = { value: 123456 };

    const result = stroke.parse({ type, color });

    strictEqual(result, `#${color.value.toString(16)}`);
  });

  it(`should return empty string when type is unknown`, () => {
    const fillSrc = {};
    const result = stroke.parse(fillSrc);

    strictEqual(result, '');
  });

  it(`should return ref to gradient when type is gradient`, () => {
    const defs = builder.begin();
    const gradientInfo: GradientFill['gradient'] = {
      ref: 'ref',
      units: 'objectBoundingBox',
      x1: 1,
      x2: 3,
      y1: 2,
      y2: 4,
    };
    gradients[gradientInfo.ref] = builder.begin().element('gradient');

    const result = stroke.parse({ type: 'gradient', gradient: gradientInfo }, defs);

    strictEqual(result, `url(#gradient-${Object.values(gradientInfo).join('-')})`);
  });

  it(`should append pattern element to defs and return ref to this pattern if type is pattern`, () => {
    const defs: any = builder.create('svg');
    pattern.meta.ux.scaleBehavior = 'fill';

    const result = stroke.parse({ type: 'pattern', pattern }, defs);

    strictEqual(result, `url(#${pattern.meta.ux.uid})`);
  });

  it(`should add stroke width if it present`, () => {
    const type = 'color';
    const color: Color = { value: 123456 };

    const result = stroke.parse({ type, fill: { color }, width: 1 });

    strictEqual(result, `#${color.value.toString(16)};stroke-width:1px`);
  });

  it('should add stroke-dasharray style property if dash array is present', () => {
    const result = stroke.parse({ type: 'none', dash: [10, 20] });

    strictEqual(result, 'none;stroke-dasharray:10 20');
  });

  it('should add stroke-linecap style property if stroke cap is present', () => {
    const result = stroke.parse({ type: 'none', cap: 'square' });

    strictEqual(result, 'none;stroke-linecap: square');
  });

  it('should add stroke-linecap style property if stroke cap is present', () => {
    const result = stroke.parse({ type: 'none', join: 'bevel' });

    strictEqual(result, 'none;stroke-linejoin: bevel');
  });
});
