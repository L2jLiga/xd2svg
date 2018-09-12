/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode }   from 'xmlbuilder';
import { colorTransformer }      from '../utils/color-transformer';
import { defs }                  from '../utils/defs-list';
import { Fill, Parser, Pattern } from './models';

export const fill: Parser = {
  name: 'fill',
  parse: fillParser,
};

export function fillParser(src: Fill, parentElement: XMLElementOrXMLNode, uuid: string, resources): string {
  switch (src.type) {
    case 'color':
      return colorTransformer(src.fill.color);
    case 'gradient':
      return `url(#${src.gradient.ref})`;
    case 'pattern':
      createPattern(src.pattern, resources, parentElement);

      return `url(#${src.pattern.meta.ux.uid})`;
    case 'none':
      return 'none';
    default:
      return colorTransformer(src.color);
  }
}

function createPattern(patternObject: Pattern, resources: any, parentElement: XMLElementOrXMLNode): void {
  const pattern = defs.element('pattern', {
    height: '1',
    id: patternObject.meta.ux.uid,
    width: '1',
    x: '0',
    y: '0',
  });
  const image = pattern.element('image', {'xlink:href': `${resources[patternObject.meta.ux.uid]}`});

  if (patternObject.meta.ux.scaleBehavior === 'cover' || patternObject.meta.ux.scaleBehavior === 'fill') {
    pattern.attribute('patternContentUnits', 'objectBoundingBox');
    image.attribute('preserveAspectRatio', 'none');
    image.attribute('width', '1');
    image.attribute('height', '1');
  } else {
    image.attribute('width', `${patternObject.width}`);
    image.attribute('height', `${patternObject.height}`);
  }
}
