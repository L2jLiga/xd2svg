import { equal }         from 'assert';
import { svgRectToPath } from '../../../src/core/utils/svg-rect-to-clip-path';

describe('Core > Utils > SVG Rectange to clipPath', () => {
  [
    [{height: 1, r: [0, 0, 0, 0], width: 2}, 'M0 0h2v1h-2v-1z'],
    [{height: 1, r: [0, 0, 0, 1], width: 2}, 'M0 0h2v1h-1a 0 1 0 0 1 0 -1v0z'],
    [{height: 1, r: [0, 0, 1, 0], width: 2}, 'M0 0h2v0a 0 1 0 0 1 0 1h-1v-1z'],
    [{height: 1, r: [0, 1, 0, 0], width: 2}, 'M0 0h1a 1 0 0 0 1 1 0v0h-2v-1z'],
    [{height: 1, r: [0, 1, 0, 1], width: 2}, 'M0 0h1a 1 0 0 0 1 1 0v0h-1a 0 1 0 0 1 0 -1v0z'],
    [{height: 1, r: [0, 1, 1, 0], width: 2}, 'M0 0h1a 1 1 0 0 1 1 1v-1a 1 1 0 0 1 -1 1h-1v-1z'],
    [{height: 1, r: [1, 0, 0, 0], width: 2}, 'M1 0h1v1h-2v0a 0 1 0 0 1 0 -1z'],
    [{height: 1, r: [1, 0, 0, 1], width: 2}, 'M1 0h1v1h-1a 0 1 0 0 1 0 -1v1a 1 1 0 0 1 1 -1z'],
    [{height: 1, r: [1, 0, 1, 0], width: 2}, 'M1 0h1v0a 0 1 0 0 1 0 1h-1v0a 0 1 0 0 1 0 -1z'],
    [{height: 1, r: [1, 0, 1, 1], width: 2}, 'M1 0h1v0a 0 1 0 0 1 0 1h0a 1 1 0 0 1 -1 -1v1a 1 1 0 0 1 1 -1z'],
    [{height: 1, r: [1, 1, 0, 0], width: 2}, 'M1 0h0a 1 0 0 0 1 1 0v0h-2v0a 0 1 0 0 1 0 -1z'],
    [{height: 1, r: [1, 1, 0, 1], width: 2}, 'M1 0h0a 1 0 0 0 1 1 0v0h-1a 0 1 0 0 1 0 -1v1a 1 1 0 0 1 1 -1z'],
    [{height: 1, r: [1, 1, 1, 0], width: 2}, 'M1 0h0a 1 1 0 0 1 1 1v-1a 1 1 0 0 1 -1 1h-1v0a 0 1 0 0 1 0 -1z'],
    [{height: 1, r: [1, 1, 1, 1], width: 2}, 'M1 0h0a 1 1 0 0 1 1 1v-1a 1 1 0 0 1 -1 1h0a 1 1 0 0 1 -1 -1v1a 1 1 0 0 1 1 -1z'],
  ].forEach(([attributes, expected]) => {
    it('should work', () => {
      const d = svgRectToPath(attributes as any);

      equal(d, expected);
    });
  });
});
