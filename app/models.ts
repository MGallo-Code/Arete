// --- Resume ---

export interface Resume {
  template: Template;
  regions: { [regionId: string]: string[] }; // ordered block IDs per region
  blocks: Record<string, Block>; // block lookup by ID
}

// --- Structures ---

export interface Template {
  id: string;
  name: string;
  rows: Row[];
  theme: Theme;
}

export interface Column {
  id: string;
  width: number; // percentage of the row, e.g. 50 or 33.33
  style: Style;
}

export interface Row {
  id: string;
  columns: Column[];
  style: Style;
}

export interface Block {
  id: string;
  header?: { text: string; level: 1 | 2 | 3 | 4 | 5 | 6 };
  content: Content;
  style?: Style;
}

export type Content =
  | { type: "text"; value: RichText }
  | { type: "bullets"; items: RichText[] }
  | { type: "blocks"; children: Block[]; columns?: number };

// (for inline styles/text formatting)
export type RichText = TextRun[];

export interface TextRun {
  text: string;
  link?: string;
  style?: Style; // overrides theme defaults for this run
}

// --- Styles ---

import type { CSSProperties } from "react";

export type Style = Partial<CSSProperties>;

// default styles for resume templates
export interface Theme {
  root: Style;
  main: Style;
  body: Style;
  h1: Style;
  h2: Style;
  h3: Style;
  h4: Style;
  h5: Style;
  h6: Style;
  bullet: Style;
}
