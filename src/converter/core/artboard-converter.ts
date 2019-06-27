/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as builder               from 'xmlbuilder';
import { Options }                from '../../common';
import { createStyles }           from './create-styles';
import { Artboard, ArtboardInfo } from './models';
import { applyIfPossible }        from './utils';
import { createElem }             from './utils/create-elem';

export function artboardConverter(artboardsRoot: Artboard, artboardInfo: ArtboardInfo, options: Options): string[] {
  return artboardsRoot.children.map(toArtboards(artboardInfo, options));
}

function toArtboards(artboardInfo: ArtboardInfo, options: Options) {
  return (root: Artboard): string => {
    const svg = builder.begin().element('svg', {
      'enable-background': `new ${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
      'id': `${root.id}`,
      'viewBox': `${artboardInfo.x} ${artboardInfo.y} ${artboardInfo.width} ${artboardInfo.height}`,
    });
    applyIfPossible(svg, 'width', artboardInfo.width);
    applyIfPossible(svg, 'height', artboardInfo.height);

    svg.element('title', {}, artboardInfo.name);

    svg.element('rect', {
      height: `${artboardInfo.height}`,
      style: createStyles(root.style, svg),
      transform: `translate(${artboardInfo.x} ${artboardInfo.y})`,
      width: `${artboardInfo.width}`,
      x: 0,
      y: 0,
    });

    const defs = svg.element('defs');

    return createElem(root.artboard, svg, defs, options).end({pretty: options.prettyPrint});
  };
}
