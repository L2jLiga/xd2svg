/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync } from 'fs';
import { artboardConverter } from './artboard-converter';
import { manifestParser } from './manifest-parser';
import { Directory, Resources } from './models';
import { resourcesParser } from './resources-parser';
import { svgo } from './svgo';

export function proceedFile(directory: Directory, single: boolean) {
  const dimensions: { width: number, height: number } = {width: 0, height: 0};

  const manifestInfo = manifestParser(directory);
  const resourcesInfo: Resources = resourcesParser(directory);

  const convertedArtboards: any[] = [];

  manifestInfo.artboards.forEach((artboardItem: any) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard = JSON.parse(json);

    const contentOfArtboard: string[] = artboardConverter(artboard, resourcesInfo.artboards[artboardItem.name], manifestInfo.resources);

    convertedArtboards.push(single ? contentOfArtboard.join('\n') : injectSvgResources(contentOfArtboard, {
      clipPaths: resourcesInfo.clipPaths,
      gradients: resourcesInfo.gradients,
      rootHeight: resourcesInfo.artboards[artboardItem.name].height,
      rootId: undefined,
      rootWidth: resourcesInfo.artboards[artboardItem.name].width,
    }));

    dimensions.width = Math.max(dimensions.width, resourcesInfo.artboards[artboardItem.name].width);
    dimensions.height = Math.max(dimensions.height, resourcesInfo.artboards[artboardItem.name].height);
  });

  const totalSvg: string = injectSvgResources(convertedArtboards, {
    clipPaths: resourcesInfo.clipPaths,
    gradients: resourcesInfo.gradients,
    rootHeight: dimensions.height,
    rootId: manifestInfo.id,
    rootWidth: dimensions.width,
  });

  directory.removeCallback();

  return single ? totalSvg : convertedArtboards;
}

export async function optimizeSvg(svgImage: string) {
  return await svgo.optimize(svgImage)
    .then((result) => result.data);
}

export function injectHtml(svg: string): string {
  return `<!DOCTYPE html>
<meta charset="utf-8" />
<style>${readFileSync(`${__dirname}/../assets/inpage.css`, 'utf-8')}</style>
${svg}
<script>${readFileSync(`${__dirname}/../assets/inpage.js`, 'utf-8')}</script>
`;
}

export function injectSvgResources(
  svg: string[],
  {
    rootWidth,
    rootHeight,
    rootId,
    gradients,
    clipPaths,
  },
): string {
  const commonSvgDefPart = `xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"`;

  switch (svg.length) {
    case 0:
      console.warn('There are not any svg');

      return '';

    case 1:
      return svg[0].replace(/<svg([^>]*)>/, `<svg$1 ${commonSvgDefPart}>${gradients}${clipPaths}`);

    default:
      return `<svg ${commonSvgDefPart}
         width="${rootWidth}"
         height="${rootHeight}"
         ${rootId ? `id="${rootId}"` : ''}>
      ${gradients}
      ${clipPaths}
      ${svg.join('\r\n')}
    </svg>`;
  }
}
