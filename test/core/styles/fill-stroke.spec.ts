/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert                      from 'assert';
import * as builder                     from 'xmlbuilder';
import { fill }                         from '../../../src/core/styles/fill';
import { Color, GradientFill, Pattern } from '../../../src/core/styles/models';
import { stroke }                       from '../../../src/core/styles/stroke';
import { gradients }                    from '../../../src/core/utils';

describe(`Core > Styles parsers`, () => {
  const pattern: Pattern = {
    height: 1,
    href: 'href',
    meta: {
      ux: {
        hrefLastModifiedDate: 1,
        scaleBehavior: 'null',
        uid: 'uid',
      },
    },
    width: 1,
  };

  describe(` > Fill`, () => {
    it(`should return none when type is none`, () => {
      const type = 'none';

      const result = fill.parse({type});

      assert.equal(result, type);
    });

    it(`should return color when type is color`, () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = fill.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it(`should return color when type is solid`, () => {
      const type = 'solid';
      const color: Color = {value: 123456};

      const result = fill.parse({type, color});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it(`should return empty string when type is unknown`, () => {
      const fillSrc = {};
      const result = fill.parse(fillSrc);

      assert.equal(result, '');
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

      const result = fill.parse({type: 'gradient', gradient: gradientInfo}, defs);

      assert.equal(result, `url(#gradient-${Object.values(gradientInfo).join('-')})`);
    });

    it(`should append pattern element to defs and return ref to this pattern if type is pattern`, () => {
      const defs: any = builder.begin().ele('defs');
      pattern.meta.ux.scaleBehavior = 'fill';

      const result = fill.parse({type: 'pattern', pattern}, defs);

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
      assert.equal(
        defs.end(),
        '<defs>' +
        '<pattern height="1" id="uid" width="1" x="0" y="0" patternContentUnits="objectBoundingBox">' +
        '<image xlink:href="undefined" preserveAspectRatio="none" width="1" height="1"/>' +
        '</pattern>' +
        '</defs>',
      );
    });

    it(`should correctly parse pattern without scale`, () => {
      const defs: any = builder.begin().ele('defs');
      pattern.meta.ux.scaleBehavior = 'null';

      const expected = '<defs>' +
        '<pattern height="1" id="uid" width="1" x="0" y="0">' +
        '<image xlink:href="undefined" width="1" height="1"/>' +
        '</pattern>' +
        '</defs>';

      const actual = fill.parse({type: 'pattern', pattern}, defs);

      assert.equal(actual, `url(#${pattern.meta.ux.uid})`);
      assert.equal(defs.end(), expected);
    });
  });

  describe(` > Stroke`, () => {
    it(`should return none when type is none`, () => {
      const type = 'none';

      const result = stroke.parse({type});

      assert.equal(result, type);
    });

    it(`should return color when type is color`, () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it(`should return color when type is solid`, () => {
      const type = 'solid';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, color});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it(`should return empty string when type is unknown`, () => {
      const fillSrc = {};
      const result = stroke.parse(fillSrc);

      assert.equal(result, '');
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

      const result = stroke.parse({type: 'gradient', gradient: gradientInfo}, defs);

      assert.equal(result, `url(#gradient-${Object.values(gradientInfo).join('-')})`);
    });

    it(`should append pattern element to defs and return ref to this pattern if type is pattern`, () => {
      const defs: any = builder.create('svg');
      pattern.meta.ux.scaleBehavior = 'fill';

      const result = stroke.parse({type: 'pattern', pattern}, defs);

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
    });

    it(`should add stroke width if it present`, () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}, width: 1});

      assert.equal(result, `#${color.value.toString(16)};stroke-width:1px`);
    });
  });
});
