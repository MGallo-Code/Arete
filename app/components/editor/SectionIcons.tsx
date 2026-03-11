/**
 * Section icons using Lucide React.
 * All use size={14} strokeWidth={1.8} for consistency.
 */

import {
  Palette,
  Type,
  Box,
  PanelTop,
  Heading,
  ImageIcon,
  List,
  Paintbrush,
  Link2,
  LayoutGrid,
  FileText,
  Columns2,
  Layers,
  AlignLeft,
  History,
} from "lucide-react";

const S = 14;
const SW = 1.8;

/** Three overlapping circles (color mixing) */
export function IconColors() {
  return <Palette size={S} strokeWidth={SW} />;
}

/** Stylized "A" — typography */
export function IconTypography() {
  return <Type size={S} strokeWidth={SW} />;
}

/** Nested rectangles — margin/padding */
export function IconBoxModel() {
  return <Box size={S} strokeWidth={SW} />;
}

/** Rectangle with emphasized top edge — borders */
export function IconBorders() {
  return <PanelTop size={S} strokeWidth={SW} />;
}

/** H letterform — heading */
export function IconHeader() {
  return <Heading size={S} strokeWidth={SW} />;
}

/** Mountain in frame — image */
export function IconImage() {
  return <ImageIcon size={S} strokeWidth={SW} />;
}

/** Bullet list — dots and lines */
export function IconBullets() {
  return <List size={S} strokeWidth={SW} />;
}

/** Five color swatches in a row — palette */
export function IconPalette() {
  return <Paintbrush size={S} strokeWidth={SW} />;
}

/** Chain link — two interlocking loops */
export function IconLinks() {
  return <Link2 size={S} strokeWidth={SW} />;
}

/** 2x2 grid — layout grid */
export function IconGrid() {
  return <LayoutGrid size={S} strokeWidth={SW} />;
}

/** Document with folded corner — page */
export function IconPage() {
  return <FileText size={S} strokeWidth={SW} />;
}

/** Two-column split — layout */
export function IconLayout() {
  return <Columns2 size={S} strokeWidth={SW} />;
}

/** Rectangle with shadow — box shadow */
export function IconBoxShadow() {
  return <Layers size={S} strokeWidth={SW} />;
}

/** Four horizontal lines — content type */
export function IconContent() {
  return <AlignLeft size={S} strokeWidth={SW} />;
}

/** Counter-clockwise arrow — history/undo */
export function IconHistory() {
  return <History size={S} strokeWidth={SW} />;
}
