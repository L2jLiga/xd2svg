const extract = require('extract-zip');
const { writeFile } = require('fs');
const { dirSync } = require('tmp');
const { promisify } = require('util');
const xd2svg = require('xd2svg');

prepareSvg('myFile.xd');

async function prepareSvg(inputFileName) {
  const directory = dirSync();
  /***
   * example of directory
   *  {
      *    name: "/path/to/directory/with/extracted/file",
      *    removeCallback(): console.log('Optional callback which was executed when convertation finished')
      *  }
   */

  await promisify(extract)(inputFileName);

  const preparedSvgs = xd2svg(directory, {
    format: 'svg',
    single: false
  });

  Object
    .keys(preparedSvgs)
    .map((key) => writeFile(`${key}.svg`, preparedSvgs[key]));
}
