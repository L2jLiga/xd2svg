import { assert }  from 'chai';
import { filters } from '../../../src/core/styles/filters';

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
});
