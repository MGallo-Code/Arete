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
  style: Partial<Style>;
}

export interface Row {
  id: string;
  columns: Column[];
  style: Partial<Style>;
}

export interface Block {
  id: string;
  header?: { text: string; level: 1 | 2 | 3 | 4 | 5 | 6 };
  content: Content;
  style?: Partial<Style>;
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
  style?: Partial<Style>; // overrides theme defaults for this run
}

// --- Styles ---

export interface BoxStyle {
  background?: string;
  padding?: string;
  margin?: string;
  border?: string;
  borderRadius?: string;
}

export interface TextStyle {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  color?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textTransform?: "none" | "uppercase" | "capitalize";
}
export type Style = Partial<BoxStyle> & Partial<TextStyle> & { custom?: string };

// default styles for resume templates
export interface Theme {
  root: Partial<Style>;
  main: Partial<Style>;
  body: Partial<Style>;
  h1: Partial<Style>;
  h2: Partial<Style>;
  h3: Partial<Style>;
  h4: Partial<Style>;
  h5: Partial<Style>;
  h6: Partial<Style>;
  bullet: Partial<Style>;
}
