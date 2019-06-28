/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { fork }                  from 'child_process';
import { convertFile }           from 'convert-svg-to-png';
import { readdirSync, readFile } from 'fs';
import { join }                  from 'path';
import { promisify }             from 'util';

const BlinkDiff = require('blink-diff');
const readFilePromise = promisify(readFile);

describe.only('Complex test for xd2svg', () => {
  let maxListeners;

  before(() => {
    maxListeners = process.getMaxListeners();

    process.setMaxListeners(0);
  });

  after(() => {
    process.setMaxListeners(maxListeners);
  });

  const forkProcess = (...args: string[]) => fork('./bin/xd2svg-cli', args);

  it('should throw an error when file does not exist', (done) => {
    const forked = forkProcess('test/path/to/not/existed/file.xd');

    forked.on('exit', (code) => {
      if (code !== 0) return done();

      done('It should throw error when invalid mockup given');
    });
  });

  it('should throw an error when file is invalid', (done) => {
    const forked = forkProcess(join(process.cwd(), '/test/input/invalid-mockup.xd'));

    forked.on('exit', (code) => {
      if (code !== 0) return done();

      done('It should throw error when invalid mockup given');
    });
  });

  it('should be able to convert single file with single output option', (done) => {
    const forked = forkProcess(join(process.cwd(), 'test', 'input', 'single.xd'), '-s', '-o', join(__dirname, 'output', 'single.svg'));

    forked.on('exit', (code) => {
      if (code !== 0) return done(new Error('Could not convert'));

      runDiffFor(
        join(__dirname, 'output', 'single.svg'),
        join(process.cwd(), 'test', 'expected', 'single.png'),
      ).then(() => done()).catch(done);
    });
  });

  it('should be able to convert unpacked mockup', (done) => {
    const forked = forkProcess(join(process.cwd(), 'test', 'input', 'unpacked'), '-o', join(__dirname, 'output', 'multi'));

    forked.on('exit', (code) => {
      if (code !== 0) return done(new Error('Unable to convert multiple artboards'));

      const results = readdirSync(join(__dirname, 'output', 'multi'))
        .filter((f) => f.endsWith('.svg'))
        .map((actual) => runDiffFor(
          join(__dirname, 'output', 'multi', actual),
          join(process.cwd(), 'test', 'expected', actual.replace('.svg', '.png')),
        ));

      Promise.all(results).then(() => done()).catch(done);
    });
  });
});

function runDiffFor(actual: string, expected: string): Promise<void> {
  return convertFile(actual, {puppeteer: {args: ['--no-sandbox']}})
    .then(() => readFilePromise(actual.replace('.svg', '.png')))
    .then((data: Buffer) => {
      const diff = new BlinkDiff({
        delta: 40,
        hideShift: true,
        imageAPath: expected,
        imageB: data,

        threshold: .05,
        thresholdType: BlinkDiff.THRESHOLD_PERCENT,
      });

      return new Promise((resolve, reject) => {
        diff.run((error, result) => {
          if (error) {
            return reject(error);
          }

          if (!diff.hasPassed(result.code)) {
            return reject(result);
          }

          return resolve();
        });
      });
    });
}
