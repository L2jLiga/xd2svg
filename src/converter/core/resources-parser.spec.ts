/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga>. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/xd2svg/LICENSE
 */

import { deepStrictEqual, strictEqual } from 'assert';
import * as fs                          from 'fs';
import { SinonStub, stub }              from 'sinon';
import { resourcesParser }              from './resources-parser';
import { defs }                         from './utils';

describe('Core > Resources parser', () => {
  let readFileSyncStub: SinonStub;

  before(() => {
    readFileSyncStub = stub(fs, 'readFileSync') as SinonStub;
  });

  after(() => {
    readFileSyncStub.restore();
  });

  it('should parse json at all', () => {
    const values = {
      artboards: {},
      resources: {
        clipPaths: {},
        gradients: {},
      },
    };

    readFileSyncStub.returns(JSON.stringify(values));

    const result = resourcesParser({ name: '' } as any);

    deepStrictEqual(result, {});
    strictEqual(defs.end(), '<defs/>');
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

    const result = resourcesParser({ name: '' } as any);

    deepStrictEqual(result, {
      [values.artboards['artboard-uuid'].name]: values.artboards['artboard-uuid'],
    });
  });

  it('should correctly create clip-paths and gradients', () => {
    const clipPathsResources = {
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

    readFileSyncStub.returns(JSON.stringify(clipPathsResources));
    resourcesParser({ name: '' } as any);

    strictEqual(defs.end(), '<defs><clipPath id="clipPathId"/></defs>');

    const gradientsResources = {
      artboards: {},
      resources: {
        clipPaths: {},
        gradients: {
          gradient1: {
            stops: [{ offset: 0 }],
            type: 'linear',
          },
          gradient2: {
            stops: [],
            type: 'radial',
          },
        },
      },
    };

    readFileSyncStub.returns(JSON.stringify(gradientsResources));

    resourcesParser({ name: '' } as any);

    strictEqual(defs.end(), '<defs><clipPath id="clipPathId"/></defs>');
  });
});
