/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { strictEqual } from 'assert';
import * as builder    from 'xmlbuilder';
import { camelToDash } from '../utils';
import { filters }     from './filters';

describe('Core > Styles parsers > Filters', () => {
  it('should skip invisible filter and return empty string', () => {
    const filtersSrc = [
      {
        params: {
          visible: false,
        },
        type: 'invisibleFilter',
      },
    ];

    const result = filters.parse(filtersSrc, builder.create('svg'));

    strictEqual(result, '');
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
      '<feComponentTransfer in="SourceGraphic" result="transfer-1-0">' +
      '<feFuncR type="linear" slope="0.325"/>' +
      '<feFuncG type="linear" slope="0.325"/>' +
      '<feFuncB type="linear" slope="0.325"/>' +
      '<feFuncA type="linear" slope="1"/>' +
      '</feComponentTransfer>' +
      '<feComposite in="blur-1-0" in2="transfer-1-0" operator="in" result="composite-1-0"/>' +
      '<feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="composite-1-0"/></feMerge></filter>' +
      '</defs>';

    const result = filters.parse([blurFilter], defs);

    strictEqual(result, `url(#filter-1-blur-12-15)`);
    strictEqual(defs.end(), expectedOutput);
  });

  it('should correctly parse drop-shadow filter', () => {
    const defs = builder.begin().ele('defs');
    const dropShadow = {
      params: {
        dropShadows: [
          {
            color: {
              alpha: 1,
              mode: 'RGB',
              value: {
                b: 0,
                g: 0,
                r: 0,
              },
            },
            dx: 0,
            dy: 3,
            r: 3,
          },
        ],
      },
      type: 'dropShadow',
    };

    const expectedOutput =
      '<defs>' +
      '<filter id="filter-1-drop-shadow-0-3-3-RGB">' +
      '<feDropShadow dx="0" dy="3" flood-color="rgba(0,0,0,1)" in="SourceGraphic" stdDeviation="3"/>' +
      '</filter>' +
      '</defs>';

    const result = filters.parse([dropShadow], defs);

    strictEqual(result, `url(#filter-1-drop-shadow-0-3-3-RGB)`);
    strictEqual(defs.end(), expectedOutput);
  });

  it('should log to console when unknown filter', (done) => {
    const defs = builder.begin().ele('defs');
    const filterName = 'unknownFilter';
    const log = console.log;

    const filterSrc = [{ type: filterName }];

    console.log = (msg) => {
      console.log = log;
      strictEqual(msg, `Unsupported filter type: ${camelToDash(filterName)}`);

      done();
    };

    filters.parse(filterSrc, defs);
  });
});
