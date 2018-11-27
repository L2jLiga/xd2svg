/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLElementOrXMLNode }           from 'xmlbuilder';
import { camelToDash, colorTransformer } from '../utils';
import { Parser }                        from './models';

export const filters: Parser = {
  name: 'filter',
  parse: (src: any[], defs: XMLElementOrXMLNode) => Filters.createFilters(src, defs).result,
};

const supportedTypes = ['blur', 'drop-shadow'];

class Filters {
  public static createFilters(src: any[], defs: XMLElementOrXMLNode): Filters {
    return new Filters(src, defs);
  }

  public result: string = '';
  private filter: XMLElementOrXMLNode;
  private defs: XMLElementOrXMLNode;

  private get filterNo() {
    return elementChildrenCount(this.defs);
  }

  constructor(src: any[], defs: XMLElementOrXMLNode) {
    this.defs = defs;
    this.filter = defs.element('filter');

    const filterId = src.reduceRight(this.filtersReducer, `filter-${this.filterNo}-`);

    if (this.checkWhetherFilterIsEmpty()) return;

    this.filter.attribute('id', filterId);

    this.result = `url(#${filterId})`;
  }

  private filtersReducer = (filterId: string, filterDesc: any, index: number): string => {
    const type = filterDesc.type.includes('#blur') ? 'blur' : camelToDash(filterDesc.type);
    const filterParams = getFilterParams(filterDesc);

    if (!supportedTypes.includes(type)) {
      console.log(`Currently unsupported filter: ${type}`);

      return filterId;
    }

    if (filterInvisible(filterDesc)) return filterId;

    filterId += type === 'blur'
      ? this.externIdWithBlur(filterParams, index)
      : this.externIdWithShadow(filterParams);

    return filterId;
  }

  private externIdWithBlur(filterParams: any, index: number): string {
    makeBlurFilter(this.filter, filterParams, `${this.filterNo}-${index}`);

    return `blur-${filterParams.blurAmount}-${filterParams.brightnessAmount}`;
  }

  private externIdWithShadow(filterParams: any) {
    let addition = '';

    for (const {dx, dy, r, color} of filterParams) {
      addition += `drop-shadow-${dx}-${dy}-${r}-${color.mode}`;

      this.filter
        .element('feDropShadow', {
          dx,
          dy,
          'flood-color': colorTransformer(color),
          'in': 'SourceGraphic',
          'stdDeviation': r,
        });
    }

    return addition;
  }

  private checkWhetherFilterIsEmpty(): boolean {
    if (elementChildrenCount(this.filter)) return false;

    this.filter.remove();

    return true;
  }
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

function makeFeGaussianBlur(parent: XMLElementOrXMLNode, filterPostfix: string, filterParams: any) {
  parent
    .element('feGaussianBlur', {
      in: filterParams.backgroundEffect ? 'BackgroundImage' : 'SourceGraphic',
      result: `blur-${filterPostfix}`,
      stdDeviation: filterParams.blurAmount,
    });
}

function makeFeComponentTransfer(parent: XMLElementOrXMLNode, filterPostfix: string, filterParams: any): void {
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

function elementChildrenCount(ele: any): number {
  return ele.children.length;
}
