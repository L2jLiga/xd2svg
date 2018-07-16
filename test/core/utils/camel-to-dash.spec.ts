import { assert }      from 'chai';
import { camelToDash } from '../../../src/core/utils/camel-to-dash';

describe('Core > Utils > Camel to Dash:', () => {
  it('should convert camelCase string to dash-case', () => {
    const str = 'CamelCaseString';

    const result = camelToDash(str);

    assert.equal(result, 'camel-case-string');
  });
});
