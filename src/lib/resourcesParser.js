'use strict';

const fs = require('fs');
const document = (new (require('jsdom').JSDOM)()).window.document;

module.exports = function resourceParser(directory) {
  const json = fs.readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');

  const resources = JSON.parse(json);

  return {
    artboards: buildArtboardsInfo(resources.artboards),

    gradients: buildGradients(resources.resources.gradients),
  };

  /**
   * Parse artboards in resources
   * @param {Object} artboards
   * @return {Object}
   */
  function buildArtboardsInfo(artboards) {
    const artboardsList = {};

    Object.keys(artboards).forEach((artboardId) => {
      artboardsList[artboards[artboardId].name] = {
        name: artboards[artboardId].name,
        x: artboards[artboardId].x,
        y: artboards[artboardId].y,
        width: artboards[artboardId].width,
        height: artboards[artboardId].height,
        viewportWidth: artboards[artboardId].viewportWidth,
        viewportHeight: artboards[artboardId].viewportHeight,
      };
    });

    return artboardsList;
  }

  /**
   * Build gradients from object
   * @param {Object} gradients - Object with gradients
   * @return {String} Builded gradients as html
   */
  function buildGradients(gradients) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    const gradientsId = Object.keys(gradients);

    let gradientsCount = gradientsId.length - 1;

    for (; gradientsCount > 0; gradientsCount--) {
      const gradientId = gradientsId[gradientsCount];

      const buildedElement = buildElement(gradients[gradientId], gradientId);

      defs.appendChild(buildedElement);
    }

    return defs.innerHTML;

    /**
     * Build gradient element from presented data
     * @param {Object} gradient - Gradient data
     * @param {String} gradientId - Identificator of gradient
     * @return {Element} Builded gradient element
     */
    function buildElement(gradient, gradientId) {
      const currentGradient = document.createElementNS('http://www.w3.org/2000/svg', gradient.type + 'Gradient');
      currentGradient.setAttribute('id', gradientId);

      const stops = gradient.stops;

      stops.forEach((stop) => {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', 'stop');

        elem.setAttribute('offset', stop.offset);
        elem.setAttribute('stop-color', require('./utils/colorTransformer')(stop.color));

        currentGradient.appendChild(elem);
      });

      return currentGradient;
    }
  }
};
