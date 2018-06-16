import fill from './fill';
import font from './font';
import opacity from './opacity';
import stroke from './stroke';
import textAttributes from './text-attributes';

const parsers: { [parser: string]: Parser } = {
  fill,
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
