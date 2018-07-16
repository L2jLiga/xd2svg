const fs = require('fs');
const { xd2svg } = require('xd2svg');

const inputFileName = 'myFile.xd';
const options = {
  format: 'html',
  single: true
};

xd2svg(inputFileName, options)
  .then((result) => fs.writeFile('outputFile.html', result));
