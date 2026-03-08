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
  grid: string; // CSS grid-template value, e.g. '"header" auto "sidebar main" 1fr / 30% 70%'
  regions: Record<string, { style?: Style }>; // named grid areas + their styles
  theme: Theme;
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
