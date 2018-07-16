import { assert } from 'chai';
import { font }   from '../../../src/core/styles/font';

describe('Core > Styles parsers > Font', () => {
  it('should return styles string with presented styles', () => {
    const testCases = [
      {
        given: {postscriptName: 'test'},
        expected: 'font-family: test',
      },
      {
        given: {family: 'test'},
        expected: 'font-family: test',
      },
      {
        given: {postscriptName: 'demo', family: 'test'},
        expected: 'font-family: demo, test',
      },
      {
        given: {style: 'Bold'},
        expected: 'font-weight: 700',
      },
      {
        given: {size: 16},
        expected: 'font-size: 16px',
      },
      {
        given: {style: 'Medium', size: 22},
        expected: 'font-weight: 500;font-size: 22px',
      },
    ];

    testCases.forEach((testCase) => {
      const result = font.parse(testCase.given);

      assert.equal(result, testCase.expected);
    });
  });
});
