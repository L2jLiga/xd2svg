module.exports = function (inputFile, outputFile) {
  'use strict';

  const [fs, unzip, tmp] = [
    require('fs'),
    require('extract-zip'),
    require('tmp')
  ];

  let directory = tmp.dirSync({
    unsafeCleanup: true
  });

  unzip(inputFile, {dir: directory.name}, workWithFile);

  function workWithFile(error) {
    if (error) throw new Error(error);

    const artBoardConverter = require('../lib/artboardConverter.js');
    const manifestInfo = require('../lib/manifestParser')(directory);
    const resourcesInfo = require('../lib/resourcesParser')(directory);

    let convertedArtboards = [];

    manifestInfo.artboards.forEach(artboardItem => {
      let json = fs.readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

      let artboard = JSON.parse(json);

      let contentOfArtboard = artBoardConverter(artboard, resourcesInfo.artboards[artboardItem.name]).join('');

      convertedArtboards.push(contentOfArtboard);
    });

    let totalSvg = `<?xml version="1.0" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg"
         id="${manifestInfo.id}"
         version="1.1">
      ${convertedArtboards.join('')}
    </svg>`;

    directory.removeCallback();

    fs.writeFile(outputFile, totalSvg, 'utf-8');
  }
};