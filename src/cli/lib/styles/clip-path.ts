import { Parser } from './index';

const clipPathParser: Parser = {
  name: 'clip-path',
  parse: clipPath,
};

interface ClipPath {
  ref: string;
}

function clipPath(src: ClipPath, parentElement: Element, uuid: string, resources): string {
  return `url(#${src.ref})`;
}

export default clipPathParser;
