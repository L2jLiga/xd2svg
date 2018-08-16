/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { convert }     from 'convert-svg-to-png';
import * as extractZip from 'extract-zip';
import { dirSync }     from 'tmp';
import { promisify }   from 'util';
import xd2svg          from '../src/xd2svg';

const BlinkDiff = require('blink-diff');

describe('Complex test for xd2svg', () => {
  let maxListeners;

  before(() => {
    maxListeners = process.getMaxListeners();
    console.log(maxListeners);
    process.setMaxListeners(16);
  });

  after(() => {
    process.setMaxListeners(maxListeners);
  });

  it('should throw an error when file does not exist', (done) => {
    xd2svg('test/path/to/not/existed/file.xd', {})
      .then(() => done('Something went wrong'))
      .catch(() => done());
  });

  it('should throw an error when file is invalid', (done) => {
    xd2svg('test/invalid-mockup.xd', {})
      .then(() => done('Something went wrong'))
      .catch(() => done());
  });

  it('should convert xd to svg', (done) => {
    xd2svg('test/single.xd', {single: true})
      .then((svgImage: string) => convert(svgImage, {puppeteer: {args: ['--no-sandbox']}}) as Promise<Buffer>)
      .then((actual) => {
        const diff = new BlinkDiff({
          delta: 50,
          hideShift: true,
          imageAPath: 'test/expected/single.png',
          imageB: actual,

          threshold: .1,
          thresholdType: BlinkDiff.THRESHOLD_PERCENT,
        });

        diff.run((error, result) => {
          if (error) {
            return done(error);
          }

          if (!diff.hasPassed(result.code)) {
            return done('Too much difference!');
          }

          return done();
        });
      })
      .catch(done);
  });

  it('should correctly convert extracted mockup', (done) => {
    const tmpDir = dirSync({
      postfix: 'test-directory',
      unsafeCleanup: true,
    });

    let keys: string[];

    promisify(extractZip)('test/multi.xd', {dir: tmpDir.name})
      .then(() => xd2svg(tmpDir.name, {single: false}))
      .then((SVGs) => {
        keys = Object.keys(SVGs);
        return Promise.all(Object.values(SVGs).map((SVG) => convert(SVG, {puppeteer: {args: ['--no-sandbox']}})));
      })
      .then((images) => {
        const diffs = keys.map((key: string, index: number) => {
          const diff = new BlinkDiff({
            delta: 50,
            hideShift: true,
            imageAPath: `test/expected/${key}`,
            imageB: images[index],

            threshold: .1,
            thresholdType: BlinkDiff.THRESHOLD_PERCENT,
          });

          return new Promise((resolve, reject) => {
            diff.run((error, result) => {
              if (error) {
                return reject(error);
              }

              if (!diff.hasPassed(result.code)) {
                return reject('Too much difference!');
              }

              return resolve();
            });
          });
        });

        return Promise.all(diffs);
      })
      .then(() => done())
      .catch(done);
  });
});
