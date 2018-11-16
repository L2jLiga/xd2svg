import { XMLElementOrXMLNode } from 'xmlbuilder';

export function applyIfPossible(node: XMLElementOrXMLNode, attribute: string, value: any): void {
  if (value != null) {
    node.attribute(attribute, value);
  }
}
