import parsers, { Parser } from './styles';

const supportedStyles: string[] = Object.keys(parsers);

export default function createStyles(stylesSrc, parentElement: Element, uuid: string, resources: { [path: string]: string }): string {
  let styleAttr: string = '';

  supportedStyles.forEach((styleName: string) => {
    if (!stylesSrc[styleName]) return;

    const parser: Parser = parsers[styleName];

    const ruleName: string = parser.name ? `${parser.name}: ` : '';
    const ruleValue: string = parser.parse(stylesSrc[styleName], parentElement, uuid, resources);

    styleAttr += `;${ruleName} ${ruleValue};`;
  });

  return styleAttr;
}
