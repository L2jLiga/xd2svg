/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as minimist      from 'minimist';
import { basename, join } from 'path';
import { CliOptions }     from './models';

export function parseParams(): Array<[string, CliOptions]> {
  const parsedArgs = parseArgs(process.argv);
  const commonOptions: CliOptions = {
    preferCompoundPath: parsedArgs.preferCompoundPath,
    prettyPrint: parsedArgs.prettyPrint,
    single: parsedArgs.single,
  };

  const inputFiles = getInputFiles(parsedArgs);

  return inputFiles.map((inputFileName: string): [string, CliOptions] => {
    const inputName = inputFileName.split('.');

    if (inputName.length > 1) inputName.pop();

    let output: string;
    if (inputFiles.length > 1 && parsedArgs.output) {
      const inputFile = basename(inputFileName, '.xd');

      output = join(parsedArgs.output, `${inputFile}${parsedArgs.single ? '.svg' : ''}`);
    } else if (parsedArgs.output) {
      output = parsedArgs.output;
    } else {
      output = `${inputName.join('.')}${parsedArgs.single ? '.svg' : ''}`;
    }

    return [inputFileName, {
      ...commonOptions,
      output,
    }];
  });
}

function parseArgs(argv): minimist.ParsedArgs {
  return minimist(argv, {
    '--': true,
    'alias': {
      output: 'o',
      preferCompoundPath: 'prefer-compound-path',
      prettyPrint: ['p', 'pretty-print'],
      single: 's',
    },
    'boolean': ['preferCompoundPath', 'single', 'prettyPrint'],
    'default': {
      preferCompoundPath: false,
      prettyPrint: false,
      single: false,
    },
    'string': ['output'],
  });
}

// Get the list of modules to check.
// When invoked as `node path/to/cli.js something` we need to strip the two starting arguments.
// When invoked as `binary something` we only need to strip the first starting argument.
function getInputFiles(parsedArgs: minimist.ParsedArgs): string[] {
  return isNodeBinary(parsedArgs._[0]) ? parsedArgs._.slice(2) : parsedArgs._.slice(1);
}

// Check if a given string looks like the node binary.
function isNodeBinary(str: string): boolean {
  return str.endsWith('node') || str.endsWith('node.exe');
}
