import { Parser } from './index';

const opacityParser: Parser = {
  name: 'opacity',
  parse: (opacity) => opacity,
};

export default opacityParser;
