export interface Text {
  rawText: string;
  paragraphs: Paragraph[];
}

export interface Paragraph {
  lines: Line[][];
}

export interface Line {
  from: number;
  to: number;
  x?: number;
  y?: number;
}
