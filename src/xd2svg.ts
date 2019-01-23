/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as extractZip                                                                                from 'extract-zip';
import { existsSync, lstatSync, writeFileSync }                                                       from 'fs';
import { join }                                                                                       from 'path';
import { dirSync, SynchrounousResult }                                                                from 'tmp';
import { promisify }                                                                                  from 'util';
import { defaultOptions, Dictionary, Directory, MultipleOutput, Options, OutputFormat, SingleOutput } from './common';
import { proceedFile }                                                                                from './core';
import * as logger                                                                                    from './utils/logger';

const extract = promisify(extractZip);

export default async function xd2svg(input: string | Buffer, options?: SingleOutput): Promise<string>;
export default async function xd2svg(input: string | Buffer, options?: MultipleOutput): Promise<Dictionary<string>>;
export default async function xd2svg(input: string | Buffer, options?: Options): Promise<OutputFormat>;
export default async function xd2svg(input: string | Buffer, options: Options = defaultOptions): Promise<OutputFormat> {
  const opts: Options = {
    ...defaultOptions,
    ...options,
  };

  const directory: Directory = await openMockup(input);
  const svg: string | Dictionary<string> = proceedFile(directory, opts);

  if (directory.removeCallback) directory.removeCallback();

  return svg;
}

async function openMockup(input: string | Buffer): Promise<Directory> {
  if (Buffer.isBuffer(input)) input = createFileFromBuffer(input);

  throwIfPathDoesNotExist(input);

  if (lstatSync(input).isDirectory()) return {name: input};

  const directory: SynchrounousResult = dirSync({unsafeCleanup: true, postfix: `_${Date.now()}`});

  await extract(input, {dir: directory.name})
    .catch((error) => {
      logger.error(`Unable to unpack XD, please make sure that provided file is correct`);

      throw error;
    });

  return directory;
}

function createFileFromBuffer(data: Buffer): string {
  const dir = dirSync({unsafeCleanup: true, postfix: `_input_${Date.now()}`});
  const input = join(dir.name, '/tmp.xd');

  writeFileSync(input, data);

  return input;
}

function throwIfPathDoesNotExist(path: string) {
  if (!existsSync(path)) {
    logger.error(`No such file or directory: ${path}, please make sure that path is correct`);

    throw null;
  }
}
