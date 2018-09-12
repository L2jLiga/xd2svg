/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                                  from 'fs';
import { artboardConverter }                             from './artboard-converter';
import { manifestParser }                                from './manifest-parser';
import { Artboard, ArtboardInfo, Dictionary, Directory } from './models';
import { resourcesParser }                               from './resources-parser';
import { svgo }                                          from './svgo';
import { defs }                                          from './utils/defs-list';

interface InjectableSvgData {
  rootWidth: number;
  rootHeight: number;
  rootId?: string;
}

export function proceedFile(directory: Directory, single: true): string;
export function proceedFile(directory: Directory, single: false): Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string> {
  const dimensions: { width: number, height: number } = {width: 0, height: 0};

  const manifestInfo = manifestParser(directory);
  const artboardInfoDictionary: Dictionary<ArtboardInfo> = resourcesParser(directory);

  const convertedArtboards: Dictionary<string> = {};

  manifestInfo.artboards.map((artboardItem: any) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard: Artboard = JSON.parse(json);

    const contentOfArtboard: string[] = artboardConverter(artboard, artboardInfoDictionary[artboardItem.name], manifestInfo.resources);

    if (single) {
      convertedArtboards[artboardItem.name] = contentOfArtboard.join('\n');

      dimensions.width = Math.max(dimensions.width, artboardInfoDictionary[artboardItem.name].width);
      dimensions.height = Math.max(dimensions.height, artboardInfoDictionary[artboardItem.name].height);

      return;
    }

    convertedArtboards[artboardItem.name] = injectSvgResources(contentOfArtboard, {
      rootHeight: artboardInfoDictionary[artboardItem.name].height,
      rootWidth: artboardInfoDictionary[artboardItem.name].width,
    });
  });

  if (single) {
    return injectSvgResources(Object.values(convertedArtboards), {
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
      return svg[0].replace(/<svg([^>]*)>/, `<svg$1 ${commonSvgDefPart}>${defs.end()}`);

    default:
      return `<svg ${commonSvgDefPart}
         width="${data.rootWidth}"
         height="${data.rootHeight}"
         ${data.rootId ? `id="${data.rootId}"` : ''}>
      ${defs.end()}
      ${svg.join('\n')}
    </svg>`;
  }
}
