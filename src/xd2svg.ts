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

interface SingleOutput extends Options {
  single: true;
}

interface MultipleOutput extends Options {
  single: false;
}

export default async function xd2svg(input: string | Buffer, options: SingleOutput): Promise<string>;
export default async function xd2svg(input: string | Buffer, options?: MultipleOutput): Promise<Dictionary<string>>;
export default async function xd2svg(input: string | Buffer, options: Options): Promise<OutputFormat>;
export default async function xd2svg(input: string | Buffer, options: Options = defaultOptions): Promise<OutputFormat> {
  const opts: Options = {
    ...defaultOptions,
    ...options,
  };

  const directory: Directory = await openMockup(input);
  const svg: string | Dictionary<string> = proceedFile(directory, opts.single, opts.prettyPrint);

  if (directory.removeCallback) directory.removeCallback();

  return svg;
}

async function openMockup(input: string | Buffer): Promise<Directory> {
  let tmpInputFile: SynchrounousResult;

  if (Buffer.isBuffer(input)) {
    tmpInputFile = dirSync({unsafeCleanup: true, postfix: `_input_${Date.now()}`});
    const buffer = input;
    input = tmpInputFile.name + '/tmp.xd';

    writeFileSync(input, buffer);
  }

  throwIfPathDoesNotExist(input);

  if (lstatSync(input).isDirectory()) {
    return {
      name: input,
    } as Directory;
  }

  const directory: SynchrounousResult = dirSync({unsafeCleanup: true, postfix: `_${Date.now()}`});

  await extract(input, {dir: directory.name})
    .catch((error) => {
      logger.error(`Unable to unpack XD, please make sure that provided file is correct`);

      throw error;
    });

  if (tmpInputFile) tmpInputFile.removeCallback();

  return directory;
}

function throwIfPathDoesNotExist(path: string) {
  if (!existsSync(path)) {
    logger.error(`No such file or directory: ${path}, please make sure that path is correct`);

    throw null;
  }
}
