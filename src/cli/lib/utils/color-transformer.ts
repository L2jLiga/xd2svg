export interface Color {
  mode?: string;
  alpha?: number;
  value?: {
    r?: number;
    g?: number;
    b?: number;
    h?: number;
    s?: number;
    l?: number;
  };
}

export default function colorTransformer(fillColor: Color = {}): string {
  /* TODO: Add support for another modes */
  switch (fillColor.mode) {
    case 'RGB':
      if (fillColor.alpha) {
        return 'rgba(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ',' + fillColor.alpha + ')';
      } else {
        return 'rgb(' + fillColor.value.r + ',' + fillColor.value.g + ',' + fillColor.value.b + ')';
      }
    case 'HSL':
      if (fillColor.alpha) {
        return 'hsla(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ',' + fillColor.alpha + ')';
      } else {
        return 'hsl(' + fillColor.value.h + ',' + fillColor.value.s + ',' + fillColor.value.l + ')';
      }
    default:
      return 'white';
  }
}
