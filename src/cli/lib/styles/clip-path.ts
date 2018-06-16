import { Parser } from './index';

export const clipPath: Parser = {
  name: 'clip-path',
  parse: clipPathParser,
};

interface ClipPath {
  ref: string;
}

function clipPathParser(src: ClipPath): string {
  return `url(#${src.ref})`;
}
