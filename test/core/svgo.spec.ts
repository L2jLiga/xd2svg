import {assert} from 'chai';
import * as SVGO from 'svgo';
import { svgo } from '../../src/core/svgo';

describe('Core > SVGO', () => {
  it('should create SVGO instance', () => {
    assert.isTrue(svgo instanceof SVGO);
  });
});
