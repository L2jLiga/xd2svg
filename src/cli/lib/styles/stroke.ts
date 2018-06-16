import { Fill, fillParser } from './fill';
import { Parser } from './index';

export const stroke: Parser = {
  name: 'stroke',
  parse: strokeParser,
};

export interface Stroke extends Fill {
  width: number;
}

function strokeParser(src: Stroke, parentElement, uuid, resources) {
  return fillParser(src, parentElement, uuid, resources) + `;stroke-width:${src.width}px`;
}
