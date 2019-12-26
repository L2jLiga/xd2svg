import * as assert from 'assert';
import { defs }    from './defs-list';

describe('Definitions list', () => {
  it('should export definitions list', () => {
    assert.ok(defs);
  });
});
