import { Options } from 'extract-zip';
import { dirSync, SynchrounousResult } from 'tmp';
import { promisify } from 'util';
import { CliOptions } from './cli/models';
import { injectHtml, optimizeSvg, proceedFile } from './core';
import { ArtboardMap, Directory } from './core/models';

const extract: (zipPath: string, opts: Options) => Promise<void> = promisify(require('extract-zip'));

export async function xd2svg(input: string | Directory, options: CliOptions): Promise<string | ArtboardMap> {
  const directory: Directory = typeof input === 'string' ?
    await openFile(input)
    : input;
  const isHtml: boolean = options.format === 'html';
  const svg: string | ArtboardMap = proceedFile(directory, options.single);

  const optimizedSvg: string | ArtboardMap =
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

async function promiseAllObject(svg: ArtboardMap, isHtml): Promise<ArtboardMap> {
  const keys = Object.keys(svg);
  const values = await Promise.all(Object.values(svg).map((value: string) => prepareAndOptimizeSvg(value, isHtml)));

  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];

    return obj;
  }, {});
}

function prepareAndOptimizeSvg(svg: string, isHtml: boolean): Promise<string> {
  return optimizeSvg(svg)
    .then((result: string) => Promise.resolve(isHtml ? injectHtml(result) : result));
}
