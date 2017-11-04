#!/usr/bin/env node

(() => {
  'use strict';

  const [fs, unzip, tmp] = [
    require('fs'),
    require('extract-zip'),
    require('tmp')
  ];

  const artBoardConverter = require('../lib/artboardConverter.js');
  const manifestParser = require('../lib/manifestParser');

  const inputFile = process.argv[2];
  let outputFile = process.argv[3];

  if (!inputFile) {
    console.error('No input file specified!');
    console.log('Usage: xd2svg input.xd [output.svg]');

    return;
  }

  if (!outputFile) {
    let inputName = inputFile.split('.');

    if (inputName.length > 1) {
      inputName.pop();
    }

    inputName.push('svg');

    outputFile = inputName.join('.');
  }

  let directory = tmp.dirSync({
    unsafeCleanup: true
  });

  unzip(inputFile, {dir: directory.name}, function (error) {
    if (error) throw error;

    let json = fs.readFileSync(`${directory.name}/manifest`, 'utf-8');

    let manifest = JSON.parse(json);

    let manifestInfo = manifestParser(manifest);

    let convertedArtboards = [];

    let viewbox = {
      x1: null,
      x2: null,
      y1: null,
      y2: null
    };

    manifestInfo.artboards.forEach(artboardItem => {
      let json = fs.readFileSync(`${directory.name}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

      let artboard = JSON.parse(json);

      console.log(artboardItem);

      let artboardInfo = {
        title: artboardItem.name,
        x1: artboardItem['uxdesign#bounds'].x,
        y1: artboardItem['uxdesign#bounds'].y,
        width: artboardItem['uxdesign#bounds'].width,
        height: artboardItem['uxdesign#bounds'].height
      };

      artboardInfo.x2 = artboardInfo.x1 + artboardInfo.width;
      artboardInfo.y2 = artboardInfo.y1 + artboardInfo.height;

      viewbox.x1 = viewbox.x1 === null || viewbox.x1 > artboardInfo.x1 ? artboardInfo.x1 : viewbox.x1;
      viewbox.x2 = viewbox.x2 === null || viewbox.x2 < artboardInfo.x2 ? artboardInfo.x2 : viewbox.x2;
      viewbox.y1 = viewbox.y1 === null || viewbox.y1 > artboardInfo.y1 ? artboardInfo.y1 : viewbox.y1;
      viewbox.y2 = viewbox.y2 === null || viewbox.y2 < artboardInfo.y2 ? artboardInfo.y2 : viewbox.y2;

      let contentOfArtboard = artBoardConverter(artboard, artboardInfo).join('');

      convertedArtboards.push(contentOfArtboard);
    });

    let totalSvg = `<?xml version="1.0" standalone="no"?>
    <svg xmlns="http://www.w3.org/2000/svg"
         id="${manifestInfo.id}"
         version="1.1"
         viewbox="${viewbox.x1} ${viewbox.y1} ${viewbox.x2} ${viewbox.y2}">
      ${convertedArtboards.join('')}
    </svg>`;

    directory.removeCallback();

    fs.writeFile(outputFile, totalSvg, 'utf-8');
  });

  console.log(inputFile, outputFile);
})();