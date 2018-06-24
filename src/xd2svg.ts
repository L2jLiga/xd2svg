import { Options } from 'extract-zip';
import { dirSync, SynchrounousResult } from 'tmp';
import { promisify } from 'util';
import { CliOptions } from './cli/models';
import { Directory } from './core/models';
import { injectHtml, optimizeSvg, proceedFile } from './core/xd2svg';

const extract: (zipPath: string, opts: Options) => Promise<void> = promisify(require('extract-zip'));

export async function xd2svg(input: string | Directory, options: CliOptions): Promise<string | string[]> {
  const directory: Directory = typeof input === 'string' ?
    await openFile(input)
    : input;
  const isHtml: boolean = options.format === 'html';
  const svg: string | string[] = proceedFile(directory, options.single);

  const optimizedSvg: string | string[] =
    typeof svg === 'string' ?
      await prepareAndOptimizeSvg(svg, isHtml)
      : await Promise.all(svg.map((curSvg) => prepareAndOptimizeSvg(curSvg, isHtml)));

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

function prepareAndOptimizeSvg(svg: string, isHtml: boolean): Promise<string> {
  return optimizeSvg(svg)
    .then((result: string) => Promise.resolve(isHtml ? injectHtml(result) : result));
}
