/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
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

    const result = filters.parse(filtersSrc);

    assert.equal(result, '');
  });

  it('should correctly parse blur filter', () => {
    const blurFilter = {
      params: {
        blurAmount: 12,
        brightnessAmount: 15,
        fillOpacity: 1,
      },
      type: '#blur',
    };

    const expectedOutput =
      '<filter id="blur-12-15">' +
      '<fegaussianblur in="SourceGraphic" stdDeviation="12"></fegaussianblur>' +
      '<feflood flood-opacity="1" in="SourceGraphic"></feflood>' +
      '</filter>';

    const parentNode = {
      appendChild(child) {
        assert.equal(child.outerHTML, expectedOutput);
      },
    };

    const result = filters.parse([blurFilter], parentNode);

    assert.equal(result, `url(#blur-12-15)`);
  });

  it('should correctly parse drop-shadow filter', () => {
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
      '<filter id="drop-shadow-0-3-3-RGB">' +
      '<fedropshadow dx="0" dy="3" flood-color="rgba(0,0,0,1)" stdDeviation="3"></fedropshadow>' +
      '</filter>';

    const parentNode = {
      appendChild(child) {
        assert.equal(child.outerHTML, expectedOutput);
      },
    };

    const result = filters.parse([dropShadow], parentNode);

    assert.equal(result, `url(#drop-shadow-0-3-3-RGB)`);
  });

  it('should log to console when unknown filter', (done) => {
    const filterName = 'unknownFilter';
    const log = console.log;

    const filterSrc = [{type: filterName}];

    console.log = (msg) => {
      assert.equal(msg, `Currently unsupported filter: ${camelToDash(filterName)}`);

      console.log = log;

      done();
    };

    filters.parse(filterSrc);
  });
});
