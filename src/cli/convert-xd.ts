/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { existsSync, mkdirSync, writeFile } from 'fs';
import { OutputFormat }                     from '../common';
import * as logger                          from '../utils/logger';
import xd2svg                               from '../xd2svg';
import { CliOptions }                       from './models';

const sanitize = require('sanitize-filename');

export async function convertXd(input: string, options: CliOptions): Promise<void> {
  try {
    const svgImages: OutputFormat = await xd2svg(input, options);

    preparePath(options);

    typeof svgImages === 'string' ?
      writeFile(options.output, svgImages, errorHandler)
      : Object.keys(svgImages).map((key) => writeFile(`${options.output}/${sanitize(key)}.svg`, svgImages[key], errorHandler));
  } catch (e) {
    process.exit(-1);
  }
}

function preparePath(options: CliOptions): void {
  const path: string[] = options.output.split('/');
  if (options.single) path.pop();

  if (path.length) {
    path.reduce((prev, cur) => {
      const newPath = `${prev}/${cur}`;

      if (!existsSync(newPath)) {
        mkdirSync(newPath);
      }

      return newPath;
    }, '.');
  }
}

function errorHandler(error) {
  if (!error) return;

  logger.error('An error occured while flushing to disk, reason: %O', error);

  throw error;
}
