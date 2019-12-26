import * as assert   from 'assert';
import { gradients } from './gradients-list';

describe('Gradients list', () => {
  it('should export gradients list', () => {
    assert.ok(gradients);
  });
});
