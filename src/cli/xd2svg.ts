/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync, writeFile } from 'fs';
import { dirSync, SynchrounousResult } from 'tmp';
import { artboardConverter } from './lib/artboard-converter';
import { manifestParser } from './lib/manifest-parser';
import { resourcesParser } from './lib/resources-parser';
import { svgo } from './lib/svgo';
import { Resource } from './models';

const extract = require('extract-zip');

export function xd2svg(inputFile: string, outputFile: string) {
  const directory: SynchrounousResult = dirSync({unsafeCleanup: true});

  extract(inputFile, {dir: directory.name}, (error: string) => {
    if (error) throw new Error(error);

    const svg: string = proceedFile(directory);

    optimizeSvg(svg, outputFile);
  });
}

function proceedFile(directory: SynchrounousResult) {
  const dimensions: { width: number, height: number } = {width: 0, height: 0};

  const manifestInfo = manifestParser(directory);
  const resourcesInfo: Resource = resourcesParser(directory);

  const convertedArtboards: any[] = [];

  manifestInfo.artboards.forEach((artboardItem: any) => {
    const json = readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

    const artboard = JSON.parse(json);

    const contentOfArtboard: string = artboardConverter(artboard, resourcesInfo.artboards[artboardItem.name], manifestInfo.resources).join('');

    convertedArtboards.push(contentOfArtboard);

    dimensions.width = Math.max(dimensions.width, resourcesInfo.artboards[artboardItem.name].width);
    dimensions.height = Math.max(dimensions.height, resourcesInfo.artboards[artboardItem.name].height);
  });

  const totalSvg: string = `<?xml version="1.0" standalone="no"?>
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

  return totalSvg;
}

function optimizeSvg(svgImage: string, outputFile: string) {
  svgo.optimize(svgImage)

    .then((result: any) => {
      result.data = `<!DOCTYPE html>
                       <!-- Disabled until UI been implemented
                         <link rel="stylesheet" href="additional/inpage.css" />
                         <script src="additional/inpage.js" defer></script>
                       -->
                       ${result.data}`;

      return Promise.resolve(result);
    })

    .then((result: any) => writeFile(outputFile, result.data, (error) => {
      if (error) throw error;
    }), (error: any) => {
      throw new Error(error);
    })

    .then(() => console.log('XD2SVG finished their work'));
}
