/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { readFileSync } from 'fs';
import { manifestInfo } from '../src/core/manifest-parser';
import xd2svg           from '../src/xd2svg';

describe('Complex test for xd2svg', () => {
  let maxListeners;

  before(() => {
    maxListeners = process.getMaxListeners();

    process.setMaxListeners(0);
  });

  beforeEach(() => {
    manifestInfo.resources = null;
    manifestInfo.artboards = [];
  });

  after(() => {
    process.setMaxListeners(maxListeners);
  });

  it('should throw an error when file does not exist', (done) => {
    xd2svg('test/path/to/not/existed/file.xd')
      .then(() => done('Something went wrong'))
      .catch(() => done());
  });

  it('should throw an error when invalid buffer provided', (done) => {
    xd2svg(Buffer.from([1, 2, 3]))
      .then(() => done('Something went wrong'))
      .catch(() => done());
  });

  it('should be able to convert from buffer', () => {
    const inputBuffer: Buffer = Buffer.from(readFileSync('test/multi.xd'));

    return xd2svg(inputBuffer, {single: false, preferCompoundPath: false, prettyPrint: false});
  });

  it('should be able to convert from path', () => xd2svg('e2e/unpacked', {single: true, prettyPrint: true, preferCompoundPath: true}));
});
