#!/usr/bin/env node

(() => {
  'use strict';

  const [fs, unzip] = [
    require('fs'),
    require('unzip'),
  ];

  const artBoardConverter = require('../lib/artBoardConverter.js');

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

  let input = fs.createReadStream(inputFile);

  input.pipe(unzip.Extract({path: `tmp-${inputFile}`}));



  // TODO: Write logic this

  input.close();

  console.log(inputFile, outputFile);
})();