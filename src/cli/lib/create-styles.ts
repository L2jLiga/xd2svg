import parsers from './styles';

export function createStyles(stylesSrc, parentElement: Element, uuid: string, resources: { [path: string]: string }): string {
  let styleAttr: string = '';

  Object.getOwnPropertyNames(stylesSrc).map((styleName) => {
    const parser = parsers[styleName];
    const styleValue = stylesSrc[styleName];

    if (parser) {
      const ruleName: string = parser.name ? `${parser.name}: ` : '';
      const ruleValue: string = parser.parse(styleValue, parentElement, uuid, resources);

      styleAttr += `;${ruleName} ${ruleValue};`;
    } else {
      console.warn('Unsupported style %s:\n\n%O', styleName, styleValue);
    }
  });

  return styleAttr;
}
