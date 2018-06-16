/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { xd2svg } from './cli/xd2svg';

const inputFileName: string = process.argv[2];
let outputFileName: string = process.argv[3];

if (inputFileName) {
  if (!outputFileName) {
    const inputName: string[] = inputFileName.split('.');

    if (inputName.length > 1) {
      inputName.pop();
    }

    inputName.push('html');

    outputFileName = inputName.join('.');
  }

  xd2svg(inputFileName, outputFileName);

  console.log(inputFileName, outputFileName);

} else {
  console.log('Usage: xd2svg-cli InputFile.xd [OutputFile.html]');
}
