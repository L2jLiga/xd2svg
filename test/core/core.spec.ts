/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert         from 'assert';
import { injectResources } from '../../src/core';

describe('Core > Inject resources into SVGs', () => {
  it('should return empty string when empty SVGs list provided', () => {
    const result = injectResources([], null);

    assert.equal(result, '');
  });

  it('should inject resources in first SVG and return it when list length equal to 1', () => {
    const resources = {
      defs: '<defs/>',
      rootHeight: 2,
      rootWidth: 1,
    };

    const actual = injectResources(['<svg></svg>'], resources);
    const expected = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><defs/></svg>';

    assert.equal(actual, expected);
  });

  it('should inject resources and all SVGs into new one and return it when list length 2 or more', () => {
    const resources = {
      defs: '<defs/>',
      rootHeight: 2,
      rootId: 'test',
      rootWidth: 1,
    };

    const actual = injectResources(['<svg id="g1"></svg>', '<svg id="g2"></svg>'], resources);
    const expected = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
         width="1"
         height="2"
         id="test">
      <defs/>
      <svg id="g1"></svg>
<svg id="g2"></svg>
    </svg>`;

    assert.equal(actual, expected);
  });

  it('shouldn\'t paste id in root svg if it is not exist', () => {
    const resources = {
      defs: '<defs/>',
      rootHeight: 2,
      rootWidth: 1,
    };

    const actual = injectResources(['<svg id="g1"></svg>', '<svg id="g2"></svg>'], resources);
    const expected = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
         width="1"
         height="2"
         >
      <defs/>
      <svg id="g1"></svg>
<svg id="g2"></svg>
    </svg>`;

    assert.equal(actual, expected);
  });
});
