#!/usr/bin/env node

(() => {
  'use strict';

  const inputFile = process.argv[2];
  let outputFile = process.argv[3];

  if (!inputFile) {
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

  require('./xd2svg')(inputFile, outputFile);

  console.log(inputFile, outputFile);
})();