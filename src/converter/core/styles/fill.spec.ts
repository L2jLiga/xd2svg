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
import { fill }                         from './fill';
import { Color, GradientFill, Pattern } from './models';

describe(`Core > Styles parsers > Fill`, () => {
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

    const result = fill.parse({ type });

    strictEqual(result, type);
  });

  it(`should return color when type is color`, () => {
    const type = 'color';
    const color: Color = { value: 123456 };

    const result = fill.parse({ type, fill: { color } });

    strictEqual(result, `#${color.value.toString(16)}`);
  });

  it(`should return color when type is solid`, () => {
    const type = 'solid';
    const color: Color = { value: 123456 };

    const result = fill.parse({ type, color });

    strictEqual(result, `#${color.value.toString(16)}`);
  });

  it(`should return empty string when type is unknown`, () => {
    const fillSrc = {};
    const result = fill.parse(fillSrc);

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

    const result = fill.parse({ type: 'gradient', gradient: gradientInfo }, defs);

    strictEqual(result, `url(#gradient-${Object.values(gradientInfo).join('-')})`);
  });

  it(`should create pattern element when scale behavior is fill`, () => {
    const defs: any = builder.begin().ele('defs');
    pattern.meta.ux.scaleBehavior = 'fill';

    const result = fill.parse({ type: 'pattern', pattern }, defs);

    strictEqual(result, `url(#${pattern.meta.ux.uid})`);
    strictEqual(
      defs.end(),
      '<defs>' +
      '<pattern height="100%" id="uid" viewBox="0 0 1 1" width="100%">' +
      '<image height="1" width="1" xlink:href="undefined"/>' +
      '</pattern>' +
      '</defs>',
    );
  });

  it(`should create pattern element when scale behavior is cover`, () => {
    const defs: any = builder.begin().ele('defs');
    pattern.meta.ux.scaleBehavior = 'cover';

    const result = fill.parse({ type: 'pattern', pattern }, defs);

    strictEqual(result, `url(#${pattern.meta.ux.uid})`);
    strictEqual(
      defs.end(),
      '<defs>' +
      '<pattern height="100%" id="uid" viewBox="0 0 1 1" width="100%" preserveAspectRatio="xMidYMid slice">' +
      '<image height="1" width="1" xlink:href="undefined"/>' +
      '</pattern>' +
      '</defs>',
    );
  });

  it(`shouldn't create pattern when scale behavior is unknown`, () => {
    const defs: any = builder.begin().ele('defs');
    pattern.meta.ux.scaleBehavior = 'null' as any;

    const expected = '<defs/>';

    const actual = fill.parse({ type: 'pattern', pattern }, defs);

    strictEqual(actual, `url(#${pattern.meta.ux.uid})`);
    strictEqual(defs.end(), expected);
  });
});
