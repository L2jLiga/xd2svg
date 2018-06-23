/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync } from 'fs';
import { SynchrounousResult } from 'tmp';
import { artboardConverter } from './lib/artboard-converter';
import { manifestParser } from './lib/manifest-parser';
import { resourcesParser } from './lib/resources-parser';
import { svgo } from './lib/svgo';
import { Resource } from './models';

export function proceedFile(directory: SynchrounousResult, single: boolean) {
  const dimensions: { width: number, height: number } = {width: 0, height: 0};

  const manifestInfo = manifestParser(directory);
  const resourcesInfo: Resource = resourcesParser(directory);

  const convertedArtboards: any[] = [];

  manifestInfo.artboards.forEach((artboardItem: any) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard = JSON.parse(json);

    const contentOfArtboard: string = artboardConverter(artboard, resourcesInfo.artboards[artboardItem.name], manifestInfo.resources).join('');

    convertedArtboards.push(single ? contentOfArtboard : `<?xml version="1.0" standalone="no" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         width="${resourcesInfo.artboards[artboardItem.name].width}"
         height="${resourcesInfo.artboards[artboardItem.name].height}"
         id="${manifestInfo.id}"
         version="1.1">
      ${resourcesInfo.gradients}
      ${resourcesInfo.clipPaths}
      ${contentOfArtboard}
    </svg>`);

    dimensions.width = Math.max(dimensions.width, resourcesInfo.artboards[artboardItem.name].width);
    dimensions.height = Math.max(dimensions.height, resourcesInfo.artboards[artboardItem.name].height);
  });

  const totalSvg: string = `<?xml version="1.0" standalone="no" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         width="${dimensions.width}"
         height="${dimensions.height}"
         id="${manifestInfo.id}"
         version="1.1">
      ${resourcesInfo.gradients}
      ${resourcesInfo.clipPaths}
      ${convertedArtboards.join('\r\n')}
    </svg>`;

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
