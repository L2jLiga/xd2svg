/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import * as assert from 'assert';
import * as fs             from 'fs';
import { SinonStub, stub } from 'sinon';
import { manifestParser }  from '../../src/core/manifest-parser';

describe('Core > Manifest parser', () => {
  let readFileSyncStub: SinonStub;

  before(() => {
    readFileSyncStub = stub(fs, 'readFileSync') as SinonStub;
  });

  after(() => {
    readFileSyncStub.restore();
  });

  it('should parse manifest and filter manifest to find out all artboards', () => {
    const manifest = {
      children: [{
        children: [{child: 1, 'uxdesign#bounds': true}, {child: 2, 'uxdesign#bounds': true}],
        name: 'artwork',
      }, {
        id: 2,
        name: 'something-else',
      }],
    };

    readFileSyncStub.returns(JSON.stringify(manifest));

    const result = manifestParser({name: ''});

    assert.equal(result.artboards.length, 2);
    assert.deepEqual(result.artboards, manifest.children[0].children);
  });

  it('shouldn\'t fail when resource doesn\'t has any components', () => {
    const manifest = {
      children: [{
        name: 'resources',
      }],
    };

    readFileSyncStub.returns(JSON.stringify(manifest));

    const result = manifestParser({name: ''});

    assert.deepEqual(result.resources, {});
  });
});
