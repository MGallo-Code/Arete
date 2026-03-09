import type { CSSProperties } from "react";

// --- Style ---

export type Style = Partial<CSSProperties>;

// --- Rich Text ---

export interface TextRun {
  text: string;
  link?: string;
  style?: Style;
}

export type RichText = TextRun[];

// --- Bullets ---

export interface BulletLevel {
  char?: string; // marker character, e.g. "•", "–", "▸"
  image?: string; // marker image URL or data URI — takes precedence over char
  style?: Style; // text style + paddingLeft for indentation
}

export interface BulletItem {
  content: RichText;
  level?: number; // index into BulletLevel[]
}

// --- Content ---

export type Content =
  | { type: "text"; value: RichText }
  | { type: "bullets"; items: BulletItem[]; levels?: BulletLevel[] } // levels overrides theme.bullets for this list
  | { type: "blocks"; children: Block[] }
  | { type: "image"; src: string; alt?: string; style?: Style };

// --- Block ---

export interface Block {
  id: string;
  tags?: string[];
  header?: { content: RichText; level: 1 | 2 | 3 | 4 | 5 | 6 };
  content: Content;
  style?: Style;
}

// --- Template ---

export interface PageSettings {
  size: "letter" | "a4";
  margins: { top: string; right: string; bottom: string; left: string };
}

export interface Theme {
  root: Style;   // full page — background, watermark; cascades font/color to all children
  canvas: Style; // content area inside margins — grid container background
  h1: Style;
  h2: Style;
  h3: Style;
  h4: Style;
  h5: Style;
  h6: Style;
  bullets: BulletLevel[]; // template-wide defaults per indent level
  link: Style;
}

export interface Template {
  id: string;
  name: string;
  grid: string; // CSS grid-template value, e.g. '"header header" auto "sidebar main" 1fr / 30% 70%'
  regionStyles: Record<string, Style>; // style per named grid region
  page: PageSettings;
  fonts?: string[]; // font family names to load (e.g. Google Fonts) for Puppeteer
  theme: Theme;
}

// --- Resume ---

export interface Resume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  template: Template;
  regionBlockIds: Record<string, string[]>; // ordered block IDs per named grid region
  blocks: Record<string, Block>; // block lookup by ID
}
