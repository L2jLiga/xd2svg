/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync } from 'fs';
import { SynchrounousResult } from 'tmp';
import { ArtboardInfo } from '../models/artboard-info';
import { Resource } from '../models/resource';
import { createElem } from './artboard-converter';
import { colorTransformer } from './utils/color-transformer';
import { document } from './utils/global-namespace';

export function resourcesParser(directory: SynchrounousResult): Resource {
  const json = readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');

  const resources = JSON.parse(json);

  return {
    artboards: buildArtboardsInfo(resources.artboards),

    gradients: buildGradients(resources.resources.gradients),

    clipPaths: buildClipPaths(resources.resources.clipPaths),
  };
}

function buildArtboardsInfo(artboards: { [id: string]: any }): { [name: string]: ArtboardInfo } {
  const artboardsInfoList: { [name: string]: ArtboardInfo } = {};

  Object.keys(artboards).forEach((artboardId: string) => {
    artboardsInfoList[artboards[artboardId].name] = {
      height: artboards[artboardId].height,
      name: artboards[artboardId].name,
      viewportHeight: artboards[artboardId].viewportHeight,
      viewportWidth: artboards[artboardId].viewportWidth,
      width: artboards[artboardId].width,
      x: artboards[artboardId].x,
      y: artboards[artboardId].y,
    };
  });

  return artboardsInfoList;
}

function buildGradients(gradients): string {
  const defs: Element = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  const gradientsId: string[] = Object.keys(gradients);

  let gradientsCount: number = gradientsId.length - 1;

  for (; gradientsCount > 0; gradientsCount--) {
    const gradientId: string = gradientsId[gradientsCount];

    const buildedElement: Element = buildElement(gradients[gradientId], gradientId);

    defs.appendChild(buildedElement);
  }

  return defs.innerHTML;
}

function buildElement(gradient: { [key: string]: any }, gradientId: string): Element {
  const currentGradient = document.createElementNS('http://www.w3.org/2000/svg', gradient.type + 'Gradient');
  currentGradient.setAttribute('id', gradientId);

  const stops = gradient.stops;

  stops.forEach((stop) => {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', 'stop');

    elem.setAttribute('offset', stop.offset);
    elem.setAttribute('stop-color', colorTransformer(stop.color));

    currentGradient.appendChild(elem);
  });

  return currentGradient;
}

function buildClipPaths(clipPaths: any): string {
  const clipPathsArr: string[] = [];

  Object.keys(clipPaths).forEach((clipPathId: string) => {
    const clipPath = clipPaths[clipPathId];
    const clipPathElement = createElem(clipPath, document.createElementNS('http://www.w3.org/2000/svg', 'clipPath'), null);

    clipPathElement.setAttribute('id', clipPathId);

    clipPathsArr.push(clipPathElement.outerHTML);
  });

  return clipPathsArr.join('');
}
