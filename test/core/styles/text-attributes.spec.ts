import { assert }         from 'chai';
import { textAttributes } from '../../../src/core/styles/text-attributes';

describe('Core > Styles parsers > Text attributes', () => {
  it('should return all presented text attrubutes', () => {
    const cases = [
      {
        attributes: {},
        expect: '',
      },
      {
        attributes: {
          lineHeight: 1,
        },
        expect: 'line-height: 1px',
      },
      {
        attributes: {
          lineHeight: 1,
          paragraphAlign: 'center',
        },
        expect: 'line-height: 1px;text-align: center',
      },
      {
        attributes: {
          letterSpacing: 5,
          lineHeight: 1,
        },
        expect: 'line-height: 1px;letter-spacing: 0.005em',
      },
    ];

    cases.forEach((testCase) => {
      const result = textAttributes.parse(testCase.attributes);

      assert.equal(result, testCase.expect);
    });
  });
});
