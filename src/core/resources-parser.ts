/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                       from 'fs';
import * as builder                           from 'xmlbuilder';
import { XMLElementOrXMLNode }                from 'xmlbuilder';
import { createElem }                         from './artboard-converter';
import { ArtboardInfo, Directory, Resources } from './models';
import { Color }                              from './styles/models';
import { colorTransformer }                   from './utils/color-transformer';

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
  const defs = builder.begin().element('defs');

  Object.keys(gradients).forEach((gradientId: string) => buildElement(gradients[gradientId], gradientId, defs));

  return defs.end();
}

function buildElement({type, stops}, gradientId: string, defs: XMLElementOrXMLNode): void {
  const gradient = defs.element(type === 'linear' ? 'lineargradient' : 'radialgradient', {id: gradientId});

  stops.forEach((stop: { offset: string, color: Color }) => {
    gradient.element('stop', {
      'offset': stop.offset,
      'stop-color': colorTransformer(stop.color),
    });
  });
}

function buildClipPaths(clipPaths: any): string {
  const root = builder.begin().element('defs');

  Object.keys(clipPaths).forEach((clipPathId: string) => {
    const clipPath = clipPaths[clipPathId];
    const clipPathElement = createElem(clipPath, root.element('clipPath'), null);

    clipPathElement.attribute('id', clipPathId);
  });

  return root.end();
}
