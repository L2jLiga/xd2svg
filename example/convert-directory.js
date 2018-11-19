const extract = require('extract-zip');
const { writeFile } = require('fs');
const { dirSync } = require('tmp');
const { promisify } = require('util');
const xd2svg = require('xd2svg');

prepareSvg('myFile.xd');

async function prepareSvg(inputFileName) {
  const dir = dirSync().name;

  await promisify(extract)(inputFileName, {dir});

  const preparedSvgs = xd2svg(dir, {
    single: false
  });

  Object
    .keys(preparedSvgs)
    .map((key) => writeFile(`${key}.svg`, preparedSvgs[key]));
}
