import {assert}          from 'chai';
import * as fs           from 'fs';
import {SinonStub, stub} from 'sinon';
import {resourcesParser} from '../../src/core/resources-parser';

describe('Core > Resources parser', () => {
  let readFileSyncStub: SinonStub;

  before(() => {
    readFileSyncStub = stub(fs, 'readFileSync') as SinonStub;
  });

  after(() => {
    readFileSyncStub.restore();
  });

  it('should parse json and create resources object', () => {
    const values = {
      artboards: {},
      resources: {
        clipPaths: {},
        gradients: {},
      },
    };

    readFileSyncStub.returns(JSON.stringify(values));

    const result = resourcesParser({name: ''} as any);

    assert.deepEqual(result, {
      artboards: {},
      clipPaths: '',
      gradients: '',
    });
  });

  it('should correctly remap artboard info', () => {
    const values = {
      artboards: {
        'artboard-uuid': {
          height: 123,
          name: 'mock-artboard',
          viewportHeight: 1,
          viewportWidth: 2,
          width: 321,
          x: 333,
          y: 444,
        },
      },
      resources: {
        clipPaths: {},
        gradients: {},
      },
    };

    readFileSyncStub.returns(JSON.stringify(values));

    const result = resourcesParser({name: ''} as any);

    assert.deepEqual(result, {
      artboards: {
        [values.artboards['artboard-uuid'].name]: values.artboards['artboard-uuid'],
      },
      clipPaths: '',
      gradients: '',
    });
  });

  it('should correctly create clip-paths', () => {
    const values = {
      artboards: {},
      resources: {
        clipPaths: {
          clipPathId: {
            children: [],
          },
        },
        gradients: {},
      },
    };

    readFileSyncStub.returns(JSON.stringify(values));

    const result = resourcesParser({name: ''} as any);

    assert.deepEqual(result, {
      artboards: {},
      clipPaths: '<clippath id="clipPathId"></clippath>',
      gradients: '',
    });
  });

  it('should correctly create gradients', () => {
    const values = {
      artboards: {},
      resources: {
        clipPaths: {},
        gradients: {
          gradient1: {
            stops: [{offset: 0}],
            type: 'linear',
          },
          gradient2: {
            stops: [],
            type: 'radial',
          },
        },
      },
    };

    readFileSyncStub.returns(JSON.stringify(values));

    const result = resourcesParser({name: ''} as any);

    assert.deepEqual(result, {
      artboards: {},
      clipPaths: '',
      gradients: '<lineargradient id="gradient1"><stop offset="0" stop-color="#fff"></stop></lineargradient><radialgradient id="gradient2"></radialgradient>',
    });
  });
});
