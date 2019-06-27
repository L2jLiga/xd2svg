/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { XMLNode } from 'xmlbuilder';

export interface SvgRectToClipPath {
  width: number;
  height: number;
  r: number[];
}

export function svgRectToClipPath(attributes: SvgRectToClipPath, defs: XMLNode) {
  const clipPath = defs.element('clipPath');

  clipPath.element('path', {
    d: svgRectToPath(attributes),
  });

  return clipPath;
}

export function svgRectToPath(attributes: SvgRectToClipPath) {
  const width = attributes.width;
  const height = attributes.height;

  const leftTopCorner = attributes.r[0];
  const rightTopCorner = attributes.r[1];
  const rightBottomCorner = attributes.r[2];
  const leftBottomCorner = attributes.r[3];

  return (
    // start at the left corner
    'M' + leftTopCorner + ' 0' +
    // top side
    'h' + (width - leftTopCorner - rightTopCorner) +
    // top-right corner
    (rightTopCorner ? 'a ' + rightTopCorner + ' ' + rightBottomCorner + ' 0 0 1 ' + rightTopCorner + ' ' + rightBottomCorner : '') +
    // right side
    'v' + (height - rightTopCorner - rightBottomCorner) +
    // bottom-right corner
    (rightBottomCorner ? 'a ' + rightTopCorner + ' ' + rightBottomCorner + ' 0 0 1 ' + rightTopCorner * -1 + ' ' + rightBottomCorner : '') +
    // down side
    'h' + (width - rightBottomCorner - leftBottomCorner) * -1 +
    // bottom-left corner
    (leftBottomCorner ? 'a ' + rightBottomCorner + ' ' + leftBottomCorner + ' 0 0 1 ' + rightBottomCorner * -1 + ' ' + leftBottomCorner * -1 : '') +
    // left side
    'v' + (height - leftBottomCorner - leftTopCorner) * -1 +
    // top-left corner
    (leftTopCorner ? 'a ' + leftBottomCorner + ' ' + leftTopCorner + ' 0 0 1 ' + leftBottomCorner + ' ' + leftTopCorner * -1 : '') +
    // Close path
    'z'
  );
}
