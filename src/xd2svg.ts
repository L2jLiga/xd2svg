/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as extractZip                                                  from 'extract-zip';
import { existsSync, lstatSync, writeFileSync }                         from 'fs';
import { dirSync, SynchrounousResult }                                  from 'tmp';
import { promisify }                                                    from 'util';
import { defaultOptions, Dictionary, Directory, Options, OutputFormat } from './common';
import { proceedFile }                                                  from './core';
import * as logger                                                      from './utils/logger';

const extract = promisify(extractZip);

interface Xd2svgOptions {
  single?: boolean;
}

interface SingleOutput extends Xd2svgOptions {
  single: true;
}

interface MultipleOutput extends Xd2svgOptions {
  single: false;
}

export default async function xd2svg(input: string | Buffer, options: SingleOutput): Promise<string>;
export default async function xd2svg(input: string | Buffer, options?: MultipleOutput): Promise<Dictionary<string>>;
export default async function xd2svg(input: string | Buffer, options: Xd2svgOptions): Promise<OutputFormat>;
export default async function xd2svg(input: string | Buffer, options: Xd2svgOptions = defaultOptions): Promise<OutputFormat> {
  const opts: Options = {
    ...defaultOptions,
    ...options,
  };

  const directory: Directory = await openMockup(input);
  const svg: string | Dictionary<string> = proceedFile(directory, opts.single);

  if (directory.removeCallback) directory.removeCallback();

  return svg;
}

async function openMockup(inputFile: string | Buffer): Promise<Directory> {
  let tmpInputFile: SynchrounousResult;

  if (Buffer.isBuffer(inputFile)) {
    tmpInputFile = dirSync({unsafeCleanup: true, postfix: `_input_${Date.now()}`});
    const buffer = inputFile;
    inputFile = tmpInputFile.name + '/tmp.xd';

    writeFileSync(inputFile, buffer);
  }

  if (!existsSync(inputFile)) {
    logger.error(`No such file or directory: ${inputFile}, please make sure that path is correct`);

    throw null;
  }

  if (lstatSync(inputFile).isDirectory()) {
    return {
      name: inputFile,
    } as Directory;
  }

  const directory: SynchrounousResult = dirSync({unsafeCleanup: true, postfix: `_${Date.now()}`});

  await extract(inputFile, {dir: directory.name})
    .catch((error) => {
      logger.error(`Unable to unpack XD, please make sure that provided file is correct`);

      throw error;
    });

  if (tmpInputFile) tmpInputFile.removeCallback();

  return directory;
}
