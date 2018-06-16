import colorTransformer, { Color } from '../utils/color-transformer';
import { document } from '../utils/global-namespace';
import { Parser } from './index';

const fillParser: Parser = {
  name: 'fill',
  parse: fill,
};

export interface Fill {
  type: string;
  fill?: {
    color: Color;
  };
  gradient?: {
    ref: string;
  };
  pattern?: Pattern;
  color?: Color;
}

export interface Pattern {
  meta: {
    ux: {
      uid: string;
    };
  };
  width: number;
  height: number;
}

function fill(src: Fill, parentElement: Element, uuid: string, resources): string {
  switch (src.type) {
    case 'color':
      return colorTransformer(src.fill.color);
    case 'gradient':
      return `url(#${src.gradient.ref})`;
    case 'pattern':
      parentElement.appendChild(createPattern(uuid, resources, src.pattern));

      return `url(#${uuid})`;
    case 'none':
      return 'none';
    default:
      return colorTransformer(src.color);
  }
}

function createPattern(uuid: string, resources: any, patternObject: Pattern): Element {
  const pattern: Element = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
  const image: Element = document.createElementNS('http://www.w3.org/2000/svg', 'image');

  pattern.setAttribute('id', uuid);

  image.setAttribute('xlink:href', resources[patternObject.meta.ux.uid]);
  image.setAttribute('width', `${patternObject.width}`);
  image.setAttribute('height', `${patternObject.height}`);

  pattern.appendChild(image);

  return pattern;
}

export default fillParser;
