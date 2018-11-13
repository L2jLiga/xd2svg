/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode } from 'xmlbuilder';
import { camelToDash } from '../utils/camel-to-dash';
import { colorTransformer } from '../utils/color-transformer';
import { Parser } from './models';

export const filters: Parser = {
  name: 'filter',
  parse: filtersParser,
};

function filtersParser(src: any[], defs: XMLElementOrXMLNode): string {
  const filter = defs.element('filter');
  const filterNo = elementChildrenCount(defs);
  let filterId: string = `filter-${filterNo}-`;

  src.reverse().forEach((filterDesc: any, index: number) => {
    const filterName = filterDesc.type.includes('#blur') ? 'blur' : camelToDash(filterDesc.type);
    const filterParams = getFilterParams(filterDesc);

    if (filterInvisible(filterDesc)) return;

    switch (filterName) {
      case 'blur': {
        filterId += `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;

        return makeBlurFilter(filter, filterParams, `${filterNo}-${index}`);
      }

      case 'drop-shadow': {
        for (const {dx, dy, r, color} of filterParams) {
          filterId += `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

          filter
            .element('feDropShadow', {
              dx,
              dy,
              'flood-color': colorTransformer(color),
              'in': 'SourceGraphic',
              'stdDeviation': r,
            });
        }

        break;
      }

      default:
        console.log(`Currently unsupported filter: ${filterName}`);
    }
  });

  if (!elementChildrenCount(filter)) {
    filter.remove();

    return null;
  }

  filter.attribute('id', filterId);

  return `url(#${filterId})`;
}

function elementChildrenCount(ele: any): number {
  return ele.children.length;
}

function getFilterParams(filterDesc: any): any {
  return filterDesc.params && filterDesc.params[filterDesc.type + 's'] || filterDesc.params || {};
}

function filterInvisible(filterDesc: any): boolean {
  return filterDesc.visible === false || filterDesc.params && filterDesc.params.visible === false;
}

// TODO: Still work not so fine as I expect
function makeBlurFilter(filter: XMLElementOrXMLNode, filterParams: any, filterPostfix: string): void {
  makeFeGaussianBlur(filter, filterPostfix, filterParams);
  makeFeComponentTransfer(filter, filterPostfix, filterParams);
  makeFeComposite(filter, filterPostfix);

  if (filterParams.fillOpacity !== 0) {
    filter
      .element('feMerge')
      .element('feMergeNode', {in: 'SourceGraphic'}).up()
      .element('feMergeNode', {in: `composite-${filterPostfix}`});
  }
}

function makeFeGaussianBlur(parent: XMLElementOrXMLNode, filterPostfix: string, filterParams) {
  parent
    .element('feGaussianBlur', {
      in: filterParams.backgroundEffect ? 'BackgroundImage' : 'SourceGraphic',
      result: `blur-${filterPostfix}`,
      stdDeviation: filterParams.blurAmount,
    });
}

function makeFeComponentTransfer(parent: XMLElementOrXMLNode, filterPostfix: string, filterParams): void {
  parent
    .element('feComponentTransfer', {
      in: filterParams.backgroundEffect ? 'BackgroundImage' : 'SourceGraphic',
      result: `transfer-${filterPostfix}`,
    })
    .element('feFuncR', {type: 'linear', slope: brigtnessToSlope(filterParams.brightnessAmount)}).up()
    .element('feFuncG', {type: 'linear', slope: brigtnessToSlope(filterParams.brightnessAmount)}).up()
    .element('feFuncB', {type: 'linear', slope: brigtnessToSlope(filterParams.brightnessAmount)}).up()
    .element('feFuncA', {type: 'linear', slope: filterParams.fillOpacity});
}

function makeFeComposite(parent: XMLElementOrXMLNode, filterPostfix: string): void {
  parent.element('feComposite', {
    in: `blur-${filterPostfix}`,
    in2: `transfer-${filterPostfix}`,
    operator: 'in',
    result: `composite-${filterPostfix}`,
  });
}

function brigtnessToSlope(brightness: number): number {
  return (brightness + 50) / 200;
}
