import { XMLNode } from 'xmlbuilder';

export function applyIfPossible(node: XMLNode, attribute: string, value: any): void {
  if (value != null) {
    node.attribute(attribute, value);
  }
}
