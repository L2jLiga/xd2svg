import { assert }                    from 'chai';
import { JSDOM }                     from 'jsdom';
import { context, document, window } from '../../../src/core/utils/global-namespace';

describe('Core > Utils > Global namespace', () => {
  it('should be expected instance of', () => {
    assert.isTrue(context instanceof JSDOM);
    assert.isDefined(window);
    assert.isDefined(document);
  });
});
