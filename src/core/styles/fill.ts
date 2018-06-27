/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { colorTransformer } from '../utils/color-transformer';
import { createElement } from '../utils/create-element';
import { Fill, Parser, Pattern } from './models';

export const fill: Parser = {
  name: 'fill',
  parse: fillParser,
};

export function fillParser(src: Fill, parentElement: Element, uuid: string, resources): string {
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

function createPattern(uuid: string, resources: any, patternObject: Pattern): SVGPatternElement {
  const pattern: SVGPatternElement = createElement('pattern', {
    height: '1',
    id: uuid,
    width: '1',
    x: '0',
    y: '0',
  });
  const image: SVGImageElement = createElement('image', {'xlink:href': resources[patternObject.meta.ux.uid]});

  if (patternObject.meta.ux.scaleBehavior === 'cover' || patternObject.meta.ux.scaleBehavior === 'fill') {
    pattern.setAttribute('patternContentUnits', 'objectBoundingBox');
    image.setAttribute('preserveAspectRatio', 'none');
    image.setAttribute('width', '1');
    image.setAttribute('height', '1');
  } else {
    image.setAttribute('width', `${patternObject.width}`);
    image.setAttribute('height', `${patternObject.height}`);
  }

  pattern.appendChild(image);

  return pattern;
}
