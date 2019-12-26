/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { writeFile }    from 'fs';
import * as mkdirp      from 'mkdirp';
import { promisify }    from 'util';
import * as logger      from '../common/utils/logger';
import xd2svg           from '../converter/xd2svg';
import { CliOptions }   from './models';

const sanitize = require('sanitize-filename');
const mkdirPromise = promisify(mkdirp);

export async function convertXd(input: string, options: CliOptions): Promise<void> {
  const svgImages = await xd2svg(input, options);

  await preparePath(options);

  typeof svgImages === 'string' ?
    writeFile(options.output, svgImages, errorHandler)
    : Object.keys(svgImages).map((key) => writeFile(`${options.output}/${sanitize(key)}.svg`, svgImages[key], errorHandler));
}

async function preparePath(options: CliOptions): Promise<void> {
  const path = options.output.replace(/\\+/g, '/').split('/');
  if (options.single) path.pop();

  await mkdirPromise(path.join('/'));
}

function errorHandler(error): void {
  if (!error) return;

  logger.error('An error occurred while flushing to disk, reason: %O', error);

  throw error;
}
