/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                       from 'fs';
import { createElem }                         from './artboard-converter';
import { ArtboardInfo, Directory, Resources } from './models';
import { Color }                              from './styles/models';
import { colorTransformer }                   from './utils/color-transformer';
import { createElement }                      from './utils/create-element';

export function resourcesParser(directory: Directory): Resources {
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
  const defs: SVGDefsElement = createElement('defs');

  Object.keys(gradients).forEach((gradientId: string) => {
    const buildedElement: Element = buildElement(gradients[gradientId], gradientId);

    defs.appendChild(buildedElement);
  });

  return defs.innerHTML;
}

function buildElement({type, stops}, gradientId: string): Element {
  const gradient = createElement(type === 'linear' ? 'lineargradient' : 'radialgradient', {id: gradientId});

  stops.forEach((stop: { offset: string, color: Color }) => {
    const elem = createElement('stop', {
      'offset': stop.offset,
      'stop-color': colorTransformer(stop.color),
    });

    gradient.appendChild(elem);
  });

  return gradient;
}

function buildClipPaths(clipPaths: any): string {
  const clipPathsArr: string[] = [];

  Object.keys(clipPaths).forEach((clipPathId: string) => {
    const clipPath = clipPaths[clipPathId];
    const clipPathElement = createElem(clipPath, createElement('clippath'), null);

    clipPathElement.setAttribute('id', clipPathId);

    clipPathsArr.push(clipPathElement.outerHTML);
  });

  return clipPathsArr.join('');
}
