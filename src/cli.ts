/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { fork }        from 'child_process';
import { checkArgv }   from './cli/check-argv';
import { CliOptions }  from './cli/models';
import { parseParams } from './cli/parse-params';
import * as logger     from './utils/logger';

checkArgv();

const filesToProceed: Array<[string, CliOptions]> = parseParams();

let code: number = 0;
const failedFiles: string[] = [];

console.log(logger.blue(logger.bold('XD2SVG starts their work\n')));

const Promises = filesToProceed.map(proceedFile);

Promise.all(Promises).finally(finalizeProcess);

function proceedFile([inputFile, options]): Promise<void> {
  console.log(
    logger.blue('filename: ') + '%s\n' +
    logger.blue('output type: ') + '%s\n' +
    logger.blue('output path: ') + '%s\n',
    inputFile,
    options.single ? 'single' : 'multiple',
    options.output,
  );

  return new Promise((res) => {
    fork(
      __dirname + '/runner.js',
      [inputFile, JSON.stringify(options)],
    ).on('exit', handleProcessEnd(inputFile, res));
  });
}

function handleProcessEnd(file: string, res: () => void) {
  return (c: number) => {
    if (c !== 0) {
      code = -1;
      failedFiles.push(file);
    }

    res();
  };
}

function finalizeProcess() {
  console.log('\n');

  if (failedFiles.length) {
    console.log(`Converting of some mockups failed:`);
    failedFiles.forEach((file) => console.log(`> ${file}`));
  }

  console.log(logger[code === 0 ? 'blue' : 'red']('\nFinished with code: ' + code));

  process.exit(code);
}
