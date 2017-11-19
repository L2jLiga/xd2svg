'use strict';

module.exports = function xd2svg(inputFile, outputFile) {
  const [fs, unzip, tmp] = [
    require('fs'),
    require('extract-zip'),
    require('tmp'),
  ];

  const directory = tmp.dirSync({
    unsafeCleanup: true,
  });

  unzip(inputFile, {dir: directory.name}, workWithFile);

  /**
   * Callback which was called when xd was unpacked
   * @param {*} error - Error message
   */
  function workWithFile(error) {
    if (error) throw new Error(error);

    const artBoardConverter = require('../lib/artboardConverter.js');
    const manifestInfo = require('../lib/manifestParser')(directory);
    const resourcesInfo = require('../lib/resourcesParser')(directory);

    const convertedArtboards = [];

    manifestInfo.artboards.forEach((artboardItem) => {
      const json = fs.readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

      const artboard = JSON.parse(json);

      const contentOfArtboard = artBoardConverter(artboard, resourcesInfo.artboards[artboardItem.name], manifestInfo.resources).join('');

      convertedArtboards.push(contentOfArtboard);
    });

    const totalSvg = `<?xml version="1.0" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         id="${manifestInfo.id}"
         version="1.1">
      ${resourcesInfo.gradients}
      ${convertedArtboards.join('\r\n')}
    </svg>`;

    directory.removeCallback();

    fs.writeFile(outputFile, totalSvg, 'utf-8');
  }
};
