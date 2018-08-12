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
});
