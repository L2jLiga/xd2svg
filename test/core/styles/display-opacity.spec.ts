import { assert }  from 'chai';
import { display } from '../../../src/core/styles/display';
import { opacity } from '../../../src/core/styles/opacity';

describe('Core > Styles parsers', () => {
  describe('> Display', () => {
    it('should return url with href', () => {
      const given = 'block';

      const result = display.parse(given);

      assert.equal(result, given);
    });
  });

  describe('> Opacity', () => {
    it('should return url with href', () => {
      const given = 'block';

      const result = opacity.parse(given);

      assert.equal(result, given);
    });
  });
});
