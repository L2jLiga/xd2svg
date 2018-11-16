/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                                                      from 'fs';
import { artboardConverter }                                                 from './artboard-converter';
import { manifestParser }                                                    from './manifest-parser';
import { Artboard, ArtboardDefinition, ArtboardInfo, Dictionary, Directory } from './models';
import { resourcesParser }                                                   from './resources-parser';
import { defs }                                                              from './utils';

interface InjectableSvgData {
  defs: string;
  rootWidth: number;
  rootHeight: number;
  rootId?: string;
}

let dimensions: { width: number, height: number };
let convertedArtboards: Dictionary<string>;

export function proceedFile(directory: Directory, single: true): string;
export function proceedFile(directory: Directory, single: false): Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string>;
export function proceedFile(directory: Directory, single: boolean): string | Dictionary<string> {
  dimensions = {width: 0, height: 0};
  convertedArtboards = {};

  const manifest = manifestParser(directory);
  const artboardsInfo: Dictionary<ArtboardInfo> = resourcesParser(directory);

  const artboards = manifest.artboards.map(toArtboard(directory, artboardsInfo, single));

  if (single) {
    return injectSvgResources(Object.values(convertedArtboards), {
      defs: defs.end(),
      rootHeight: dimensions.height,
      rootId: manifest.id,
      rootWidth: dimensions.width,
    });
  }

  artboards.forEach(compileArtboards(artboardsInfo));

  return convertedArtboards;
}

function toArtboard(directory: Directory, artboardsInfo: Dictionary<ArtboardInfo>, single: boolean) {
  return (artboardItem: ArtboardDefinition) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard: Artboard = JSON.parse(json);

    const artboardContent: string[] = artboardConverter(artboard, artboardsInfo[artboardItem.name]);

    if (single) {
      convertedArtboards[artboardItem.name] = artboardContent.join('\n');
      const artboardDimensions = artboardsInfo[artboardItem.name];

      dimensions.width = Math.max(dimensions.width, artboardDimensions.width);
      dimensions.height = Math.max(dimensions.height, artboardDimensions.height);

      return;
    }

    return {artboardName: artboardItem.name, contentOfArtboard: artboardContent};
  };
}

function compileArtboards(artboardsInfo: Dictionary<ArtboardInfo>) {
  const defsList = defs.end();

  return ({artboardName, contentOfArtboard}) => convertedArtboards[artboardName] = injectSvgResources(contentOfArtboard, {
    defs: defsList,
    rootHeight: artboardsInfo[artboardName].height,
    rootWidth: artboardsInfo[artboardName].width,
  });
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
      return svg[0].replace(/<svg([^>]*)>/, `<svg$1 ${commonSvgDefPart}>${data.defs}`);

    default:
      return `<svg ${commonSvgDefPart}
         width="${data.rootWidth}"
         height="${data.rootHeight}"
         ${data.rootId ? `id="${data.rootId}"` : ''}>
      ${data.defs}
      ${svg.join('\n')}
    </svg>`;
  }
}
