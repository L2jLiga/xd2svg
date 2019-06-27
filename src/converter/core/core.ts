/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                                                 from 'fs';
import { Dictionary, Directory, MultipleOutput, Options, SingleOutput } from '../../common';
import { artboardConverter }                                            from './artboard-converter';
import { manifestParser }                                               from './manifest-parser';
import { Artboard, ArtboardDefinition, ArtboardInfo }                   from './models';
import { resourcesParser }                                              from './resources-parser';
import { defs }                                                         from './utils';

interface InjectableSvgData {
  defs: string;
  rootWidth?: number;
  rootHeight?: number;
  rootId?: string;
}

interface ConvertedArtboard {
  name: string;
  content: string[];
}

let dimensions: { width: number, height: number };
let convertedArtboards: Dictionary<string>;

export function proceedFile(directory: Directory, options: SingleOutput): string;
export function proceedFile(directory: Directory, options: MultipleOutput): Dictionary<string>;
export function proceedFile(directory: Directory, options: Options): string | Dictionary<string>;
export function proceedFile(directory: Directory, options: Options): string | Dictionary<string> {
  dimensions = {width: 0, height: 0};
  convertedArtboards = {};

  const manifest = manifestParser(directory);
  const artboardsInfo: Dictionary<ArtboardInfo> = resourcesParser(directory);

  const artboards: ConvertedArtboard[] = manifest.artboards.map(toArtboard(directory, artboardsInfo, options));

  if (options.single) {
    artboards.forEach((artboard: ConvertedArtboard) => {
      convertedArtboards[artboard.name] = artboard.content.join('\n');
    });

    return injectResources(Object.values(convertedArtboards), {
      defs: defs.end({pretty: options.prettyPrint}),
      rootHeight: dimensions.height,
      rootId: manifest.id,
      rootWidth: dimensions.width,
    });
  }

  artboards.forEach(toConvertedArtboard(artboardsInfo, options.prettyPrint));

  return convertedArtboards;
}

function toArtboard(dir: Directory, artboardsInfo: Dictionary<ArtboardInfo>, options: Options) {
  return (artboardItem: ArtboardDefinition): ConvertedArtboard => {
    const json = readFileSync(`${dir.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard: Artboard = JSON.parse(json);

    const artboardContent: string[] = artboardConverter(artboard, artboardsInfo[artboardItem.name], options);

    if (options.single) {
      const artboardDimensions = artboardsInfo[artboardItem.name];

      dimensions.width = Math.max(dimensions.width, artboardDimensions.width);
      dimensions.height = Math.max(dimensions.height, artboardDimensions.height);
    }

    return {name: artboardItem.name, content: artboardContent};
  };
}

function toConvertedArtboard(artboardsInfo: Dictionary<ArtboardInfo>, prettyPrint: boolean) {
  const defsList = defs.end({pretty: prettyPrint});

  return (data: ConvertedArtboard): void => {
    const {name, content} = data;

    convertedArtboards[name] = injectResources(content, {
      defs: defsList,
      rootHeight: artboardsInfo[name].height,
      rootWidth: artboardsInfo[name].width,
    });
  };
}

export function injectResources(
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
