/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { existsSync, mkdirSync, readFileSync, writeFile } from 'fs';
import { dirSync, SynchrounousResult } from 'tmp';
import { CliOptions } from '../cli/models';
import { artboardConverter } from './lib/artboard-converter';
import { manifestParser } from './lib/manifest-parser';
import { resourcesParser } from './lib/resources-parser';
import { svgo } from './lib/svgo';
import { Resource } from './models';

const extract = require('extract-zip');

export function xd2svg(inputFile: string, options: CliOptions) {
  const directory: SynchrounousResult = dirSync({unsafeCleanup: true});

  extract(inputFile, {dir: directory.name}, (error: string) => {
    if (error) throw new Error(error);

    const isHtml: boolean = options.format === 'html';

    const svg: string | string[] = proceedFile(directory, options.single);

    if (typeof svg === 'string') {
      optimizeSvg(svg, options.output, isHtml);
    } else {
      let i = 0;

      if (!existsSync(options.output)) {
        mkdirSync(options.output);
      }

      svg.map((curSvg) => {
        optimizeSvg(curSvg, `${options.output}/${i++}.${options.format}`, isHtml);
      });
    }
  });
}

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

export function optimizeSvg(svgImage: string, outputFile: string, isHtml: boolean) {
  svgo.optimize(svgImage)

    .then((result: any) => {
      if (isHtml) {
        result.data = injectHtml(result.data);
      }

      return Promise.resolve(result);
    })

    .then((result: any) => writeFile(outputFile, result.data, (error) => {
      if (error) throw error;
    }), (error: any) => {
      throw new Error(error);
    })

    .then(() => console.log('XD2SVG finished their work'));
}

export function injectHtml(svg: string): string {
  return `<!DOCTYPE html>
<meta charset="utf-8" />
<style>${readFileSync(`${__dirname}/assets/inpage.css`, 'utf-8')}</style>
${svg}
<script>${readFileSync(`${__dirname}/assets/inpage.js`, 'utf-8')}</script>
`;
}
