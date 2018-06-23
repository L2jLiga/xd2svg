import { dirSync, SynchrounousResult } from 'tmp';
import { promisify } from 'util';
import { CliOptions } from './cli/models';
import { injectHtml, optimizeSvg, proceedFile } from './core/xd2svg';

const extract = promisify(require('extract-zip'));

export async function xd2svg(inputFile: string, options: CliOptions): Promise<string | string[]> {
  let optimizedSvg: Promise<string> | Promise<string[]>;

  const directory: SynchrounousResult = await openFile(inputFile);
  const isHtml: boolean = options.format === 'html';
  const svg: string | string[] = proceedFile(directory, options.single);

  optimizedSvg =
    typeof svg === 'string' ?
      prepareAndOptimizeSvg(svg, isHtml)
      : Promise.all(svg.map((curSvg) => prepareAndOptimizeSvg(curSvg, isHtml))) as Promise<string[]>;

  return await optimizedSvg;
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
