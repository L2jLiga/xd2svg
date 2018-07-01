/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { document } from './global-namespace';

export function createElement<K extends keyof SVGElementTagNameMap>(tagName: K, attrs?: {}): SVGElementTagNameMap[K];
export function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attrs?: {}): HTMLElementTagNameMap[K];
export function createElement(tagName: string, attrs?: {}): SVGElement;

export function createElement<K extends keyof SVGElementTagNameMap>(tagName: K, attrs: {} = {}): SVGElementTagNameMap[K] {
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tagName);

  Object.keys(attrs).map((attr: string) => {
    svgElement.setAttribute(attr, attrs[attr]);
  });

  return svgElement;
}
