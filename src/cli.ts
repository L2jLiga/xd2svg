/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { CliOptions } from './cli/models';
import { xd2svg } from './cli/xd2svg';

const inputFileName: string = process.argv[2];

if (inputFileName) {
  let customOutput: boolean = false;

  const inputName: string[] = inputFileName.split('.');

  if (inputName.length > 1) {
    inputName.pop();
  }

  const defaultOptions: CliOptions = {
    format: 'svg',
    output: inputName.join('.'),
    single: true,
  };

  for (let argIdx = 2; argIdx++; argIdx < process.argv.length) {
    if (process.argv[argIdx] === undefined) break;

    const arg = process.argv[argIdx].split('=');
    switch (arg[0]) {
      case '--format':
        defaultOptions.format = /^html$/i.test(arg[1]) ? 'html' : 'svg';
        break;

      case '--output':
        defaultOptions.output = arg[1];
        customOutput = true;
        break;

      case '--single':
        defaultOptions.single = /^true$/i.test(arg[1]);
    }
  }

  if (!customOutput && defaultOptions.single) {
    defaultOptions.output += `.${defaultOptions.format}`;
  }

  xd2svg(inputFileName, defaultOptions);

  console.log(`Proceed file %s with options\n%O`, inputFileName, defaultOptions);
} else {
  console.log(`Usage: xd2svg-cli InputFile.xd [options]
  options:
  --output - specify output path (default FileName directory or FileName.svg)
  --format - specify output format: svg, html (default: svg)
  --single - specify does output should be single file with all artboards or directory with separated each other (default: true)
  `);
}
