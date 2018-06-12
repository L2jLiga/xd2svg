import { SynchrounousResult } from 'tmp';
import { ArtboardInfo } from '../models/artboard-info';
import { Resource } from '../models/resource';
import colorTransformer from './utils/colorTransformer';

const fs = require('fs');
const jsdom = require('jsdom');
const document: Document = (new jsdom.JSDOM()).window.document;

export default function resourceParser(directory: SynchrounousResult): Resource {
  const json = fs.readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');

  const resources = JSON.parse(json);

  return {
    artboards: buildArtboardsInfo(resources.artboards),

    gradients: buildGradients(resources.resources.gradients),
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
