/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                               from 'fs';
import { artboardConverter }                          from './artboard-converter';
import { manifestParser }                             from './manifest-parser';
import { Artboard, Dictionary, Directory, Resources } from './models';
import { resourcesParser }                            from './resources-parser';
import { svgo }                                       from './svgo';

interface InjectableSvgData {
  rootWidth: number;
  rootHeight: number;
  rootId?: string;
  gradients: string;
  clipPaths: string;
}

export function proceedFile(directory: Directory, single: true): string;
export function proceedFile(directory: Directory, single: false): Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string> {
  const dimensions: { width: number, height: number } = {width: 0, height: 0};

  const manifestInfo = manifestParser(directory);
  const resourcesInfo: Resources = resourcesParser(directory);

  const convertedArtboards: Dictionary<string> = {};

  manifestInfo.artboards.forEach((artboardItem: any) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard: Artboard = JSON.parse(json);

    const contentOfArtboard: string[] = artboardConverter(artboard, resourcesInfo.artboards[artboardItem.name], manifestInfo.resources);

    convertedArtboards[artboardItem.name] = (single ? contentOfArtboard.join('\n') : injectSvgResources(contentOfArtboard, {
      clipPaths: resourcesInfo.clipPaths,
      gradients: resourcesInfo.gradients,
      rootHeight: resourcesInfo.artboards[artboardItem.name].height,
      rootWidth: resourcesInfo.artboards[artboardItem.name].width,
    }));

    dimensions.width = Math.max(dimensions.width, resourcesInfo.artboards[artboardItem.name].width);
    dimensions.height = Math.max(dimensions.height, resourcesInfo.artboards[artboardItem.name].height);
  });

  if (single) {
    return injectSvgResources(Object.values(convertedArtboards), {
      clipPaths: resourcesInfo.clipPaths,
      gradients: resourcesInfo.gradients,
      rootHeight: dimensions.height,
      rootId: manifestInfo.id,
      rootWidth: dimensions.width,
    });
  }

  return convertedArtboards;
}

export async function optimizeSvg(svgImage: string): Promise<string> {
  const optimizedSvg = await svgo.optimize(svgImage);

  return optimizedSvg.data;
}

export function injectSvgResources(
  svg: string[],
  data: InjectableSvgData,
): string {
  const commonSvgDefPart = `xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"`;

  switch (svg.length) {
    case 0:
      console.warn('There are not any svg');

      return '';

    case 1:
      return svg[0].replace(/<svg([^>]*)>/, `<svg$1 ${commonSvgDefPart}>${data.gradients}${data.clipPaths}`);

    default:
      return `<svg ${commonSvgDefPart}
         width="${data.rootWidth}"
         height="${data.rootHeight}"
         ${data.rootId ? `id="${data.rootId}"` : ''}>
      ${data.gradients}
      ${data.clipPaths}
      ${svg.join('\n')}
    </svg>`;
  }
}
