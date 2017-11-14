const fs = require('fs');

module.exports = function (directory) {
  'use strict';

  let json = fs.readFileSync(`${directory.name}/resources/graphics/graphicContent.agc`, 'utf-8');

  let resources = JSON.parse(json);

  return {
    artboards: buildArtboardsInfo(resources.artboards),

    gradient: buildGradients(resources.resources.gradient)
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
        viewportHeight: artboards[artboardId].viewportHeight,
      };
    });

    return artboardsList;
  }

  function buildGradients() {
    
  }
};