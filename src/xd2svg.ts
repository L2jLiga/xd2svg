/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { convert as convertToJpg }     from 'convert-svg-to-jpeg';
import { convert as convertToPng }     from 'convert-svg-to-png';
import { Options }                     from 'extract-zip';
import { dirSync, SynchrounousResult } from 'tmp';
import { promisify }                   from 'util';
import { CliOptions, OutputFormat }    from './cli/models';
import { optimizeSvg, proceedFile }    from './core';
import { Dictionary, Directory }       from './core/models';

const extract: (zipPath: string, opts: Options) => Promise<void> = promisify(require('extract-zip'));

interface SingleOutput extends CliOptions {
  single: true;
}

interface MultipleOutput extends CliOptions {
  single: false;
}

export async function xd2svg(input: string | Directory, options: SingleOutput): Promise<string | Buffer>;
export async function xd2svg(input: string | Directory, options: MultipleOutput): Promise<Dictionary<string | Buffer>>;
export async function xd2svg(input: string | Directory, options: CliOptions): Promise<OutputFormat>;
export async function xd2svg(input: string | Directory, options: CliOptions): Promise<OutputFormat> {
  const directory: Directory = typeof input === 'string' ?
    await openFile(input)
    : input;
  const svg: string | Dictionary<string> = proceedFile(directory, options.single);

  const optimizedSvg: OutputFormat =
    typeof svg === 'string' ?
      await prepareAndOptimizeImage(svg, options.format)
      : await promiseAllObject(svg, options.format);

  if (typeof input !== 'string' && input.removeCallback) input.removeCallback();

  return optimizedSvg;
}

async function openFile(inputFile): Promise<SynchrounousResult> {
  const directory: SynchrounousResult = dirSync({unsafeCleanup: true});

  await extract(inputFile, {dir: directory.name})
    .catch((error) => {
      throw new Error(error);
    });

  return directory;
}

async function promiseAllObject(svg: Dictionary<string>, format: 'svg' | 'png' | 'jpg' | 'jpeg'): Promise<Dictionary<string | Buffer>> {
  const keys = Object.keys(svg);
  const values = await Promise.all(Object.values(svg).map((value: string) => prepareAndOptimizeImage(value, format)));

  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];

    return obj;
  }, {});
}

async function prepareAndOptimizeImage(svg: string, format: 'svg' | 'png' | 'jpg' | 'jpeg'): Promise<string | Buffer> {
  const optimizedSvg = await optimizeSvg(svg);

  if (format === 'png') {
    return await convertToPng(optimizedSvg, {puppeteer: {args: ['--no-sandbox']}}) as Buffer;
  }

  if (format === 'jpg' || format === 'jpeg') {
    return await convertToJpg(optimizedSvg, {puppeteer: {args: ['--no-sandbox']}}) as Buffer;
  }

  return optimizedSvg;
}
