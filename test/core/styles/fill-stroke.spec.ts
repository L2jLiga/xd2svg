/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert        from 'assert';
import * as builder       from 'xmlbuilder';
import { fill }           from '../../../src/core/styles/fill';
import { Color, Pattern } from '../../../src/core/styles/models';
import { stroke }         from '../../../src/core/styles/stroke';

describe('Core > Styles parsers', () => {
  describe(' > Fill', () => {
    it('should return none when type is none', () => {
      const type = 'none';

      const result = fill.parse({type});

      assert.equal(result, type);
    });

    it('should return color when type is color', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = fill.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it('should try to transform color when type isn\'t specified', () => {
      const cases = [
        {
          expect: '#fff',
          fill: {},
        },
        {
          expect: 'rgb(1,2,3)',
          fill: {color: {mode: 'RGB', value: {r: 1, g: 2, b: 3}}},
        },
      ];

      cases.forEach((testCase) => {
        const result = fill.parse(testCase.fill);

        assert.equal(result, testCase.expect);
      });
    });

    it('should return ref to gradient when type is gradient', () => {
      const gradientRef = 'test-ref';

      const result = fill.parse({type: 'gradient', gradient: {ref: gradientRef}});

      assert.equal(result, `url(#${gradientRef})`);
    });

    it('should append pattern element to parent and return ref to this pattern if type is pattern', () => {
      const uuid = 'uuid';
      const parent: any = builder.create('svg');
      const pattern: Pattern = {
        meta: {
          ux: {
            uid: 'uid',
            scaleBehavior: 'fill',
            hrefLastModifiedDate: 1,
          },
        },
        href: 'href',
        height: 1,
        width: 1,
      };

      const result = fill.parse({type: 'pattern', pattern}, parent, uuid, {});

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
      assert.equal(parent.children.length, 1);
      assert.equal(parent.children[0].name, 'pattern');
    });

    it('should correctly parse pattern without scale', () => {
      const uuid = 'uuid';
      const pattern: Pattern = {
        meta: {
          ux: {
            uid: 'uid',
            scaleBehavior: 'null',
            hrefLastModifiedDate: 1,
          },
        },
        href: 'href',
        height: 1,
        width: 1,
      };

      const expected = '<defs>' +
        '<pattern height="1" id="uid" width="1" x="0" y="0">' +
        '<image xlink:href="undefined" width="1" height="1"/>' +
        '</pattern>' +
        '</defs>';
      const parent = builder.begin().element('defs');

      const actual = fill.parse({type: 'pattern', pattern}, parent, uuid, {});

      assert.equal(actual, `url(#${pattern.meta.ux.uid})`);
      assert.equal(parent.end(), expected);
    });
  });

  describe(' > Stroke', () => {
    it('should return none when type is none', () => {
      const type = 'none';

      const result = stroke.parse({type});

      assert.equal(result, type);
    });

    it('should return color when type is color', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}});

      assert.equal(result, `#${color.value.toString(16)}`);
    });

    it('should try to transform color when type isn\'t specified', () => {
      const cases = [
        {
          expect: '#fff',
          stroke: {},
        },
        {
          expect: 'rgb(1,2,3)',
          stroke: {color: {mode: 'RGB', value: {r: 1, g: 2, b: 3}}},
        },
      ];

      cases.forEach((testCase) => {
        const result = stroke.parse(testCase.stroke);

        assert.equal(result, testCase.expect);
      });
    });

    it('should return ref to gradient when type is gradient', () => {
      const gradientRef = 'test-ref';

      const result = stroke.parse({type: 'gradient', gradient: {ref: gradientRef}});

      assert.equal(result, `url(#${gradientRef})`);
    });

    it('should append pattern element to parent and return ref to this pattern if type is pattern', () => {
      const uuid = 'uuid';
      const parent: any = builder.create('svg');
      const pattern: Pattern = {
        meta: {
          ux: {
            uid: 'uid',
            scaleBehavior: 'fill',
            hrefLastModifiedDate: 1,
          },
        },
        href: 'href',
        height: 1,
        width: 1,
      };

      const result = stroke.parse({type: 'pattern', pattern}, parent, uuid, {});

      assert.equal(result, `url(#${pattern.meta.ux.uid})`);
      assert.equal(parent.children.length, 1);
      assert.equal(parent.children[0].name, 'pattern');
    });

    it('should add stroke width if it present', () => {
      const type = 'color';
      const color: Color = {value: 123456};

      const result = stroke.parse({type, fill: {color}, width: 1});

      assert.equal(result, `#${color.value.toString(16)};stroke-width:1px`);
    });
  });
});
