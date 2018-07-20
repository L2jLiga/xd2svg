const fs = require('fs');
const { xd2svg } = require('xd2svg');

const inputFileName = 'myFile.xd';
const options = {
  single: true
};

xd2svg(inputFileName, options)
.then((result) => fs.writeFile('outputFile.svg', result));
