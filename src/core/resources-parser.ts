/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync }                      from 'fs';
import * as builder                          from 'xmlbuilder';
import { Dictionary, Directory }             from '../common';
import { ArtboardInfo }                      from './models';
import { Color }                             from './styles/models';
import { colorTransformer, defs, gradients } from './utils';
import { createElem }                        from './utils/create-elem';

export function resourcesParser(directory: Directory): Dictionary<ArtboardInfo> {
  const json = readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');
  const resources = JSON.parse(json);

  buildGradients(resources.resources.gradients);
  buildClipPaths(resources.resources.clipPaths);

  return buildArtboardsInfo(resources.artboards);
}

function buildArtboardsInfo(artboards: { [id: string]: any }): Dictionary<ArtboardInfo> {
  const artboardsInfoList: Dictionary<ArtboardInfo> = {};

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

function buildGradients(list: Dictionary<{ type, stops }>): void {
  Object.entries(list).forEach(([gradientId, gradient]) => buildElement(gradient, gradientId));
}

function buildElement({type, stops}, gradientId: string): void {
  const gradient = builder.begin().element(type === 'linear' ? 'linearGradient' : 'radialGradient', {id: gradientId});
  gradients[gradientId] = gradient;

  stops.forEach((stop: { offset: string, color: Color }) => {
    gradient.element('stop', {
      'offset': stop.offset,
      'stop-color': colorTransformer(stop.color),
    });
  });
}

function buildClipPaths(clipPaths: any): void {
  Object.keys(clipPaths).forEach((clipPathId: string) => {
    const clipPath = clipPaths[clipPathId];
    const clipPathElement = createElem(clipPath, defs.element('clipPath'), defs);

    clipPathElement.attribute('id', clipPathId);
  });
}
