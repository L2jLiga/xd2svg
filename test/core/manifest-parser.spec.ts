import { assert }          from 'chai';
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

    const result = manifestParser({name: ''} as any);

    assert.equal(result.artboards.length, 2);
    assert.deepEqual(result.artboards, manifest.children[0].children);
  });
});
