/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { CliOptions, defaultOptions } from './models';

export function parseParams(): CliOptions {
  const inputFileName: string = process.argv[2];
  let customOutput: boolean = false;

  const inputName: string[] = inputFileName.split('.');

  if (inputName.length > 1) {
    inputName.pop();
  }

  const options: CliOptions = {
    ...defaultOptions,
    output: inputName.join('.'),
  };

  for (let argIdx = 2; argIdx++; argIdx < process.argv.length) {
    if (process.argv[argIdx] === undefined) break;

    const [key, value] = process.argv[argIdx].split('=');
    switch (key) {
      case '-o':
      case '--output':
        options.output = value;
        customOutput = true;
        break;

      case '-d':
      case '--disable-svgo':
        options.svgo = false;
        break;

      case '-s':
      case '--single':
        options.single = !/^f/i.test(value);
    }
  }

  if (!customOutput && options.single) {
    options.output += `.svg`;
  }

  return options;
}
