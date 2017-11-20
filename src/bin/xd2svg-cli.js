#!/usr/bin/env node
'use strict';

(() => {
  const inputFileName = process.argv[2];
  let outputFileName = process.argv[3];
  if (!inputFileName) {
    return;
  }

  if (!outputFileName) {
    const inputName = inputFileName.split('.');

    if (inputName.length > 1) {
      inputName.pop();
    }

    inputName.push('svg');

    outputFileName = inputName.join('.');
  }

  require('./xd2svg')(inputFileName, outputFileName);

  console.log(inputFileName, outputFileName);
})();
