/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { Options }                              from 'extract-zip';
import { dirSync, SynchrounousResult }          from 'tmp';
import { promisify }                            from 'util';
import { CliOptions, OutputFormat }             from './cli/models';
import { injectHtml, optimizeSvg, proceedFile } from './core';
import { Dictionary, Directory }                from './core/models';

const extract: (zipPath: string, opts: Options) => Promise<void> = promisify(require('extract-zip'));

interface SingleOutput extends CliOptions {
  single: true;
}

interface MultipleOutput extends CliOptions {
  single: false;
}

export async function xd2svg(input: string | Directory, options: SingleOutput): Promise<string>;
export async function xd2svg(input: string | Directory, options: MultipleOutput): Promise<Dictionary<string>>;
export async function xd2svg(input: string | Directory, options: CliOptions): Promise<OutputFormat>;
export async function xd2svg(input: string | Directory, options: CliOptions): Promise<OutputFormat> {
  const directory: Directory = typeof input === 'string' ?
    await openFile(input)
    : input;
  const isHtml: boolean = options.format === 'html';
  const svg: OutputFormat = proceedFile(directory, options.single);

  const optimizedSvg: OutputFormat =
    typeof svg === 'string' ?
      await prepareAndOptimizeSvg(svg, isHtml)
      : await promiseAllObject(svg, isHtml);

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

async function promiseAllObject(svg: Dictionary<string>, isHtml): Promise<Dictionary<string>> {
  const keys = Object.keys(svg);
  const values = await Promise.all(Object.values(svg).map((value: string) => prepareAndOptimizeSvg(value, isHtml)));

  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];

    return obj;
  }, {});
}

async function prepareAndOptimizeSvg(svg: string, isHtml: boolean): Promise<string> {
  return await optimizeSvg(svg)
    .then((result: string) => Promise.resolve(isHtml ? injectHtml(result) : result));
}
