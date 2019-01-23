import * as assert    from 'assert';
import * as builder   from 'xmlbuilder';
import { createElem } from '../../../src/core/utils/create-elem';

describe('Create element', () => {
  it('should warn when unknown type', (done) => {
    const warn = console.warn;

    console.warn = () => {
      done();

      console.warn = warn;
    };

    createElem({
      children: [{type: 'unknownType'}],
    } as any, null, null);
  });

  it('should create text element', () => {
    const parent = builder.begin();

    const svgObjCollection: any = {
      children: [
        {
          style: {},
          text: {
            paragraphs: [
              {
                lines: [
                  [{from: 0, to: 3}],
                ],
              },
            ],
            rawText: 'raw',
          },
          type: 'text',
          visible: false,
        },
      ],
    };

    createElem(svgObjCollection, parent, null);

    assert.equal(parent.end(), '<text style="display: none"><tspan>raw</tspan></text>');
  });

  it('should warn when unsupported shape', (done) => {
    const warn = console.warn;

    console.warn = () => {
      done();

      console.warn = warn;
    };

    createElem({
      children: [{type: 'shape', shape: {type: 'unknownShape'}}],
    } as any, builder.begin(), null);
  });

  it('should create clipPath element when rectangle element has border radius property', () => {
    const parent = builder.begin();
    const defs = builder.begin();

    const svgObjCollection: any = {
      children: [{
        shape: {
          height: 15,
          r: [5, 6, 5, 6],
          type: 'rect',
          width: 15,
          x: 1,
          y: 2,
        },
        type: 'shape',
      }],
    };

    createElem(svgObjCollection, parent, defs);

    const clipPath = '<clipPath id="clip-path-15-15-5-6-5-6">' +
      '<path d="M5 0h4a 6 5 0 0 1 6 5v4a 6 5 0 0 1 -6 5h-4a 5 6 0 0 1 -5 -6v-4a 6 5 0 0 1 6 -5z"/>' +
      '</clipPath>';

    assert.equal(defs.end(), clipPath);
    assert.equal(parent.end(), '<rect x="1" y="2" width="15" height="15" style="clip-path: url(#clip-path-15-15-5-6-5-6)"/>');
  });

  it('should create style object for invisible element if it does not have any styles', () => {
    const parent = builder.begin();

    const svgObjCollection: any = {
      children: [
        {
          shape: {
            height: 15,
            type: 'rect',
            width: 15,
            x: 1,
            y: 2,
          },
          type: 'shape',
          visible: false,
        },
      ],
    };

    createElem(svgObjCollection, parent, null);

    assert.equal(parent.end(), '<rect x="1" y="2" width="15" height="15" style="display: none"/>');
  });
});
