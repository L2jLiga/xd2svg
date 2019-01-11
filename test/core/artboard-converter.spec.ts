/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert                from 'assert';
import { artboardConverter }      from '../../src/core/artboard-converter';
import { Artboard, ArtboardInfo } from '../../src/core/models';

describe('Core > Artboard converter', () => {
  it('should create svg from empty artboard', () => {
    const artboard: Artboard = {
      children: [{
        artboard: {
          children: [],
        },
      }],
    } as any;

    const artboardInfo: ArtboardInfo = {
      name: 'some',
      x: 0,
      y: 0,
    } as any;

    const actual = artboardConverter(artboard, artboardInfo, {});
    const expected = [
      '<svg enable-background="new 0 0 undefined undefined" id="undefined" viewBox="0 0 undefined undefined">' +
      '<title>some</title>' +
      '<rect height="undefined" style="" transform="translate(0 0)" width="undefined" x="0" y="0"/>' +
      '<defs/>' +
      '</svg>',
    ];

    assert.deepEqual(actual, expected);
  });
});
