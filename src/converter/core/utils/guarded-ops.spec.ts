import { strictEqual }     from 'assert';
import { begin, XMLNode }  from 'xmlbuilder';
import { applyIfPossible } from './guarded-ops';

describe('Guarded operations', () => {
  let node: XMLNode;

  beforeEach(() => node = begin().ele('node'));

  it('should not apply attribute if value is null', () => {
    applyIfPossible(node, 'attr', null);

    strictEqual(node.end(), `<node/>`);
  });

  it('should not apply attribute if value is undefined', () => {
    applyIfPossible(node, 'attr', void 0);

    strictEqual(node.end(), `<node/>`);
  });

  it('should not apply attribute if value is empty string', () => {
    applyIfPossible(node, 'attr', '');

    strictEqual(node.end(), `<node/>`);
  });

  it('should apply attribute if value is string', () => {
    applyIfPossible(node, 'attr', 'test');

    strictEqual(node.end(), `<node attr="test"/>`);
  });

  it('should apply attribute if value is number', () => {
    applyIfPossible(node, 'attr', 0);

    strictEqual(node.end(), `<node attr="0"/>`);
  });
});
