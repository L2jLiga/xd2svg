/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert                       from 'assert';
import * as builder                      from 'xmlbuilder';
import { artboardConverter, createElem } from '../../src/core/artboard-converter';
import { Artboard, ArtboardInfo }        from '../../src/core/models';

describe('Core > Artboard converter', () => {
  it('should create svg from empty artboard', () => {
    const artboard: Artboard = {
      children: [{
        artboard: {
          children: [],
        },
        style: {},
      }],
    } as any;

    const artboardInfo: ArtboardInfo = {
      name: 'some',
      x: 0,
      y: 0,
    } as any;

    const actual = artboardConverter(artboard, artboardInfo, null);
    const expected = [
      '<svg enable-background="new 0 0 undefined undefined" id="undefined" viewBox="0 0 undefined undefined">' +
      '<title>some</title>' +
      '<rect height="undefined" style="" transform="translate(0 0)" width="undefined" x="0" y="0"/>' +
      '<defs/>' +
      '</svg>',
    ];

    assert.deepEqual(actual, expected);
  });

  describe('Create element', () => {
    it('should warn when unknown type', (done) => {
      const warn = console.warn;

      console.warn = () => {
        done();

        console.warn = warn;
      };

      createElem({
        children: [{type: 'unknownType'}],
      } as any, null, null, null);
    });

    it('should create text element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [
          {
            style: {},
            text: {
              paragraphs: [
                {
                  lines: [
                    [{from: 0, to: 3}],
                  ],
                },
              ],
              rawText: 'raw',
            },
            type: 'text',
            visible: false,
          },
        ],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<text style=";display:  none;"><tspan>raw</tspan></text>');
    });

    it('should warn when unsupported shape', (done) => {
      const warn = console.warn;

      console.warn = () => {
        done();

        console.warn = warn;
      };

      createElem({
        children: [{type: 'shape', shape: {type: 'unknownShape'}}],
      } as any, builder.begin(), null, null);
    });

    it('should create compound element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            children: [],
            path: 'abcdef',
            type: 'compound',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<path d="abcdef"/>');
    });

    it('should create path element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            path: 'abcdef',
            type: 'path',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<path d="abcdef"/>');
    });

    it('should create rectangle element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            height: 4,
            r: [5, 6],
            type: 'rect',
            width: 3,
            x: 1,
            y: 2,
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<rect x="1" y="2" width="3" height="4" rx="5" ry="6"/>');
    });

    it('should create circle element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            cx: 1,
            cy: 2,
            r: 3,
            type: 'circle',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<circle cx="1" cy="2" r="3"/>');
    });

    it('should create ellipse element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            cx: 1,
            cy: 2,
            rx: 3,
            ry: 4,
            type: 'ellipse',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<ellipse cx="1" cy="2" rx="3" ry="4"/>');
    });

    it('should create line element', () => {
      const parent = builder.begin();

      const svgObjCollection: any = {
        children: [{
          shape: {
            type: 'line',
            x1: 1,
            x2: 2,
            y1: 3,
            y2: 4,
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null, null);

      assert.equal(parent.end(), '<line x1="1" y1="3" x2="2" y2="4"/>');
    });
  });
});
