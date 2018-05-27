export interface Artboard {
  id: string;
  children: Artboard[];
  type: string;
  artboard?: Artboard;
  shape?: Shape;
  text?: Text;
  group?: Artboard;
  style: { [style: string]: any };
  transform: { [transform: string]: any };
}

export interface Shape {
  type: string;

  /* Path */
  path?: string;

  /* Rectangle */
  x: string;
  y: string;
  width: string;
  height: string;

  /* Circle */
  cx: string;
  cy: string;
  r: string;
}

export interface Text {
  rawText: string;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  lines: Array<Line[]>;
}

export interface Line {
  from: number;
  to: number;
  x: number;
  y: number;
}
