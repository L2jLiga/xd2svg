/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { camelToDash }      from '../utils/camel-to-dash';
import { colorTransformer } from '../utils/color-transformer';
import { createElement }    from '../utils/create-element';
import { Parser }           from './models';

export const filters: Parser = {
  name: 'filter',
  parse: filtersParser,
};

function filtersParser(src: any, parentElement: Element): string {
  const filterList: string[] = [];

  src.forEach((filter) => {
    const filterName = filter.type.includes('#blur') ? 'blur' : camelToDash(filter.type);
    const filterParams = filter.params && filter.params[filter.type + 's'] || filter.params || {};

    if (filterParams.visible === false) return;

    switch (filterName) {
      case 'blur': {
        const filterId: string = `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        const svgFilterElement = createElement('filter', {id: filterId});

        const blur = createElement('fegaussianblur', {
          in: 'SourceGraphic',
          stdDeviation: filterParams.blurAmount,
        });
        const flood = createElement('feflood', {
          'flood-opacity': filterParams.fillOpacity,
          'in': 'SourceGraphic',
        });

        svgFilterElement.appendChild(blur);
        svgFilterElement.appendChild(flood);

        parentElement.appendChild(svgFilterElement);

        filterList.push(`url(#${filterId})`);

        break;
      }

      case 'drop-shadow': {
        for (const {dx, dy, r, color} of filterParams) {

          const filterId: string = `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

          const svgFilterElement = createElement('filter', {id: filterId});

          const dropShadow = createElement('fedropshadow', {
            dx,
            dy,
            'flood-color': colorTransformer(color),
            'stdDeviation': r,
          });

          svgFilterElement.appendChild(dropShadow);

          parentElement.appendChild(svgFilterElement);

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
