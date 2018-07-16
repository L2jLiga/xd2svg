import { assert }   from 'chai';
import { clipPath } from '../../../src/core/styles/clip-path';

describe('Core > Styles parsers > Clip path', () => {
  it('should return url with href', () => {
    const ref = 'test-href';

    const result = clipPath.parse({ref});

    assert.equal(result, `url(#${ref})`);
  });
});
