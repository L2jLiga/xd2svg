import fill, { Fill } from './fill';
import { Parser } from './index';

const strokeParser: Parser = {
  name: 'stroke',
  parse: stroke,
};

export interface Stroke extends Fill {
  width: number;
}

function stroke(src: Stroke, parentElement, uuid, resources) {
  return fill.parse(src, parentElement, uuid, resources) + `;stroke-width:${src.width}px`;
}

export default strokeParser;
