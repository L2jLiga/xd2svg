const fs = require('fs');
const document = (new (require('jsdom').JSDOM)).window.document;

module.exports = function (directory) {
  'use strict';

  let json = fs.readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');

  let resources = JSON.parse(json);

  return {
    artboards: buildArtboardsInfo(resources.artboards),

    gradients: buildGradients(resources.resources.gradients)
  };

  function buildArtboardsInfo(artboards) {
    let artboardsList = {};

    Object.keys(artboards).forEach(artboardId => {
      artboardsList[artboards[artboardId].name] = {
        name: artboards[artboardId].name,
        x: artboards[artboardId].x,
        y: artboards[artboardId].y,
        width: artboards[artboardId].width,
        height: artboards[artboardId].height,
        viewportWidth: artboards[artboardId].viewportWidth,
        viewportHeight: artboards[artboardId].viewportHeight
      };
    });

    return artboardsList;
  }

  function buildGradients(gradients) {
    let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    let gradientsId = Object.keys(gradients);

    let gradientsCount = gradientsId.length - 1;

    for (; gradientsCount > 0; gradientsCount--) {
      let gradientId = gradientsId[gradientsCount];

      let buildedElement = buildElement(gradients[gradientId], gradientId);

      defs.appendChild(buildedElement);
    }

    return defs.outerHTML;

    function buildElement(gradient, gradientId) {
      let currentGradient = document.createElementNS('http://www.w3.org/2000/svg', gradient.type + 'Gradient');
      currentGradient.setAttribute('id', gradientId);

      let stops = gradient.stops;

      stops.forEach(stop => {
        let elem = document.createElementNS('http://www.w3.org/2000/svg', 'stop');

        elem.setAttribute('offset', stop.offset);
        elem.setAttribute('stop-color', require('./color-transformer')(stop.color));

        currentGradient.appendChild(elem)
      });

      return currentGradient;
    }
  }
};