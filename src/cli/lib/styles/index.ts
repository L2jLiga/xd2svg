import clipPath from './clip-path';
import fill from './fill';
import filters from './filters';
import font from './font';
import opacity from './opacity';
import stroke from './stroke';
import textAttributes from './text-attributes';

const parsers: { [parser: string]: Parser } = {
  clipPath,
  fill,
  filters,
  font,
  opacity,
  stroke,
  textAttributes,
};

export interface Parser {
  name?: string;
  parse: (...args) => string;
}

export default parsers;
