/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert     from 'assert';
import * as builder    from 'xmlbuilder';
import { filters }     from '../../../src/core/styles/filters';
import { camelToDash } from '../../../src/core/utils/camel-to-dash';

describe('Core > Styles parsers > Filters', () => {
  it('should skip invisible filter and return empty list', () => {
    const filtersSrc = [
      {
        params: {
          visible: false,
        },
        type: 'invisibleFilter',
      },
    ];

    const result = filters.parse(filtersSrc, builder.create('svg'));

    assert.equal(result, null);
  });

  it('should correctly parse blur filter', () => {
    const defs = builder.begin().ele('defs');
    const blurFilter = {
      params: {
        blurAmount: 12,
        brightnessAmount: 15,
        fillOpacity: 1,
      },
      type: '#blur',
    };

    const expectedOutput =
      '<defs>' +
      '<filter id="filter-1-blur-12-15">' +
      '<feGaussianBlur in="SourceGraphic" result="blur-1-0" stdDeviation="12"/>' +
      '<feComponentTransfer in="blur-1-0" result="blur-1-0">' +
      '<feFuncR type="linear" slope="0.15"/>' +
      '<feFuncG type="linear" slope="0.15"/>' +
      '<feFuncB type="linear" slope="0.15"/>' +
      '<feFuncA type="linear" slope="1"/>' +
      '</feComponentTransfer>' +
      '<feMerge>' +
      '<feMergeNode in="blur-1-0"/>' +
      '<feMergeNode in="SourceGraphic"/>' +
      '</feMerge>' +
      '</filter>' +
      '</defs>';

    const result = filters.parse([blurFilter], defs);

    assert.equal(result, `url(#filter-1-blur-12-15)`);
    assert.equal(defs.end(), expectedOutput);
  });

  it('should correctly parse drop-shadow filter', () => {
    const defs = builder.begin().ele('defs');
    const dropShadow = {
      type: 'dropShadow',
      params: {
        dropShadows: [
          {
            dx: 0,
            dy: 3,
            r: 3,
            color: {
              mode: 'RGB',
              value: {
                r: 0,
                g: 0,
                b: 0,
              },
              alpha: 1,
            },
          },
        ],
      },
    };

    const expectedOutput =
      '<defs>' +
      '<filter id="filter-1-drop-shadow-0-3-3-RGB">' +
      '<feDropShadow dx="0" dy="3" flood-color="rgba(0,0,0,1)" in="SourceGraphic" stdDeviation="3"/>' +
      '</filter>' +
      '</defs>';

    const result = filters.parse([dropShadow], defs);

    assert.equal(result, `url(#filter-1-drop-shadow-0-3-3-RGB)`);
    assert.equal(defs.end(), expectedOutput);
  });

  it('should log to console when unknown filter', (done) => {
    const defs = builder.begin().ele('defs');
    const filterName = 'unknownFilter';
    const log = console.log;

    const filterSrc = [{type: filterName}];

    console.log = (msg) => {
      assert.equal(msg, `Currently unsupported filter: ${camelToDash(filterName)}`);

      console.log = log;

      done();
    };

    filters.parse(filterSrc, defs);
  });
});
