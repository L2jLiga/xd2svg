/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { convert }   from 'convert-svg-to-png';
import { dirSync }   from 'tmp';
import { promisify } from 'util';
import xd2svg        from '../src/xd2svg';

const BlinkDiff = require('blink-diff');

describe('Complex test for xd2svg', () => {
  it('should convert xd to svg', (done) => {
    xd2svg('test/test.xd', {single: true})
      .then((svgImage: string) => convert(svgImage, {puppeteer: {args: ['--no-sandbox']}}) as Promise<Buffer>)
      .then((converted) => {
        const diff = new BlinkDiff({
          delta: 50,
          hideShift: true,
          imageAPath: 'test/preview.png',
          imageB: converted,

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

  it('should correctly convert directory', (done) => {
    const tmpDir = dirSync({
      postfix: 'test-directory',
      unsafeCleanup: true,
    });

    promisify(require('extract-zip'))('test/test.xd', {dir: tmpDir.name})
      .then(() => xd2svg(tmpDir, {single: false}))
      .then((SVGs) => convert(Object.values(SVGs)[0], {puppeteer: {args: ['--no-sandbox']}}))
      .then((imageB) => {
        const diff = new BlinkDiff({
          delta: 50,
          hideShift: true,
          imageAPath: 'test/preview.png',
          imageB,

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
});
