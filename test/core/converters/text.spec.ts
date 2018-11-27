import { equal }         from 'assert';
import { begin }         from 'xmlbuilder';
import { TextConverter } from '../../../src/core/converters';
import { Text }          from '../../../src/core/models';

describe('Core > Converters > Text', () => {
  it('should create text from source', () => {
    const parent = begin();
    const source: Text = {
      paragraphs: [
        {
          lines: [
            [
              {from: 0, to: 1},
              {from: 1, to: 2, x: 5},
            ],
            [
              {from: 2, to: 3, y: 5},
              {from: 3, to: 4, x: 5, y: 5},
            ],
          ],
        },
      ],
      rawText: 'test',
    };

    TextConverter.createText(source, parent);

    equal(parent.end(), `<text><tspan>t</tspan><tspan x="5">e</tspan><tspan y="5">s</tspan><tspan x="5" y="5">t</tspan></text>`);
  });
});
