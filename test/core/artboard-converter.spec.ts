import * as assert    from 'assert';
import { createElem } from '../../src/core/artboard-converter';

describe('Core > Artboard converter', () => {
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
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<text style=";display:  none;"><tspan>raw</tspan></text>');
        },
      };

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
    });

    it('should warn when unsupported shape', (done) => {
      const warn = console.warn;

      console.warn = () => {
        done();

        console.warn = warn;
      };

      createElem({
        children: [{type: 'shape', shape: {}}],
      } as any, null, null);
    });

    it('should create compound element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<path d="abcdef"></path>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            children: [],
            path: 'abcdef',
            type: 'compound',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });

    it('should create path element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<path d="abcdef"></path>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            path: 'abcdef',
            type: 'path',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });

    it('should create rectangle element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<rect x="1" y="2" width="3" height="4" rx="5" ry="6"></rect>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            height: 4,
            r: [5, 6],
            type: 'rect',
            width: 3,
            x: 1,
            y: 2,
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });

    it('should create circle element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<circle cx="1" cy="2" r="3"></circle>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            cx: 1,
            cy: 2,
            r: 3,
            type: 'circle',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });

    it('should create ellipse element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<ellipse cx="1" cy="2" rx="3" ry="4"></ellipse>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            cx: 1,
            cy: 2,
            rx: 3,
            ry: 4,
            type: 'ellipse',
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });

    it('should create line element', () => {
      const parent: any = {
        appendChild({outerHTML}) {
          assert.equal(outerHTML, '<line x1="1" y1="3" x2="2" y2="4"></line>');
        },
      };

      const svgObjCollection: any = {
        children: [{
          shape: {
            type: 'line',
            x1: 1,
            x2: 2,
            y1: 3,
            y2: 4,
          },
          type: 'shape',
        }],
      };

      createElem(svgObjCollection, parent, null);
    });
  });
});
