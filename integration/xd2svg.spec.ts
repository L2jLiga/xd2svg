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
import { manifestInfo }          from '../src/core/manifest-parser';

const BlinkDiff = require('blink-diff');
const readFilePromise = promisify(readFile);

describe.only('Complex test for xd2svg', () => {
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

  const forkProcess = (...args: string[]) => fork('./bin/xd2svg-cli', args);

  it('should throw an error when file does not exist', (done) => {
    const process = forkProcess('test/path/to/not/existed/file.xd');

    process.on('exit', (code) => {
      if (code !== 0) return done();

      done('It should throw error when invalid mockup given');
    });
  });

  it('should throw an error when file is invalid', (done) => {
    const process = forkProcess(join(__dirname, 'invalid-mockup.xd'));

    process.on('exit', (code) => {
      if (code !== 0) return done();

      done('It should throw error when invalid mockup given');
    });
  });

  it('should be able to convert single file with single output option', (done) => {
    const process = forkProcess(join(__dirname, 'single.xd'), '-s');

    process.on('exit', (code) => {
      if (code !== 0) return done(new Error('Could not convert'));

      runDiffFor(
        join(__dirname, 'single.svg'),
        join(__dirname, 'expected', 'single.png'),
      ).then(() => done()).catch(done);
    });
  });

  it('should be able to convert unpacked mockup', (done) => {
    const process = forkProcess(join(__dirname, 'unpacked'), '-o', join(__dirname, 'multi'));

    process.on('exit', (code) => {
      if (code !== 0) return done(new Error('Unable to convert multiple artboards'));

      const results = readdirSync(join(__dirname, 'multi'))
        .filter((f) => f.endsWith('.svg'))
        .map((actual) => runDiffFor(
          join(__dirname, 'multi', actual),
          join(__dirname, 'expected', actual.replace('.svg', '.png')),
        ));

      Promise.all(results).then(() => done()).catch(done);
    });
  });
});

/*
  it('should correctly convert when provided path to file', () => {
    return xd2svg('test/single.xd', {single: true})
      .then((svgImage: string) => convert(svgImage, {puppeteer: {args: ['--no-sandbox']}}) as Promise<Buffer>)
      .then((actual) => runDiffFor(actual, 'test/expected/single.png'));
  });

  it('should correctly convert when provided directory with extracted mockup', () => {
    const tmpDir = dirSync({
      postfix: 'test-directory',
      unsafeCleanup: true,
    });

    let keys: string[];

    return promisify(extractZip)('test/multi.xd', {dir: tmpDir.name})
      .then(() => xd2svg(tmpDir.name, {prettyPrint: true, preferCompoundPath: false}))
      .then((SVGs) => {
        keys = Object.keys(SVGs);
        return Promise.all(Object.values(SVGs).map((SVG) => convert(SVG, {
          puppeteer: {
            args: ['--no-sandbox'],
            timeout: 180000,
          },
        })));
      })
      .then((images) => {
        const diffs = keys.map((key: string, index: number) => runDiffFor(images[index], `test/expected/${key}.png`));

        return Promise.all(diffs);
      });
  });
});
*/

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
