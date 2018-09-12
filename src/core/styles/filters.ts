/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { camelToDash }         from '../utils/camel-to-dash';
import { colorTransformer }    from '../utils/color-transformer';
import { Parser }              from './models';

export const filters: Parser = {
  name: 'filter',
  parse: filtersParser,
};

function filtersParser(src: any, parentElement: XMLElementOrXMLNode): string {
  const defs = parentElement[((parentElement as any).isRoot ? 'ele' : 'insertBefore')]('defs');
  const filterList: string[] = [];

  src.forEach((filter) => {
    const filterName = filter.type.includes('#blur') ? 'blur' : camelToDash(filter.type);
    const filterParams = filter.params && filter.params[filter.type + 's'] || filter.params || {};

    if (filterParams.visible === false) return;

    switch (filterName) {
      case 'blur': {
        const filterId: string = `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        const svgFilterElement = defs.element('filter', {id: filterId});

        svgFilterElement.element('feGaussianBlur', {
          in: 'SourceGraphic',
          stdDeviation: filterParams.blurAmount,
        });
        svgFilterElement.element('feFlood', {
          'flood-opacity': filterParams.fillOpacity,
          'in': 'SourceGraphic',
        });

        filterList.push(`url(#${filterId})`);

        break;
      }

      case 'drop-shadow': {
        for (const {dx, dy, r, color} of filterParams) {

          const filterId: string = `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

          const svgFilterElement = defs.element('filter', {id: filterId});

          svgFilterElement.element('feDropShadow', {
            dx,
            dy,
            'flood-color': colorTransformer(color),
            'stdDeviation': r,
          });

          filterList.push(`url(#${filterId})`);
        }

        break;
      }

      default:
        console.log(`Currently unsupported filter: ${filterName}`);
    }
  });

  return `${filterList.join(' ')}`;
}
