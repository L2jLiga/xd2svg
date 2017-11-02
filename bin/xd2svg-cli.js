#!/usr/bin/env node

(() => {
  'use strict';

  const [fs, unzip] = [
    require('fs'),
    require('extract-zip')
  ];

  const artBoardConverter = require('../lib/artBoardConverter.js');
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

  unzip(inputFile, {dir: `.tmp-${inputFile}`}, function (error) {
    if (error) throw error;

    let json = fs.readFileSync(`.tmp-${inputFile}/manifest`, 'utf-8');

    let manifest = JSON.parse(json);

    let manifestInfo = manifestParser(manifest);

    let convertedArtboards = [];

    manifestInfo.artboards.forEach(artboardItem => {
      let json = fs.readFileSync(`.tmp-${inputFile}/artwork/${artboardItem.path}/graphics/graphicContent.agc`, 'utf-8');

      let artboard = JSON.parse(json);

      let artboardInfo = {
        width: artboardItem['uxdesign#bounds'].width,
        height: artboardItem['uxdesign#bounds'].height
      };

      let contentOfArtboard = artBoardConverter(artboard, artboardInfo).join('');

      convertedArtboards.push(contentOfArtboard);
    });

    let totalSvg = `<?xml version="1.0" standalone="no"?><svg xmlns="http://www.w3.org/2000/svg" id="${manifestInfo.id}" version="1.1">${convertedArtboards.join('')}</svg>`;

    deleteFolderRecursive(`.tmp-${inputFile}`);

    fs.writeFile(outputFile, totalSvg, 'utf-8');
  });

  function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        let curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  }

  console.log(inputFile, outputFile);
})();