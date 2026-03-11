/**
 * Tiny inline SVG icons for collapsible section headers.
 * 14×14 viewBox, stroke-based, currentColor.
 * Designed for legibility at small sizes — bold strokes, minimal detail.
 */

const S = 14;
const props = { width: S, height: S, viewBox: `0 0 ${S} ${S}`, fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Three overlapping circles (color mixing) */
export function IconColors() {
  return (
    <svg {...props}>
      <circle cx="5.5" cy="5.5" r="3" />
      <circle cx="8.5" cy="5.5" r="3" opacity="0.5" />
      <circle cx="7" cy="8.5" r="3" opacity="0.5" />
    </svg>
  );
}

/** Stylized "A" — typography */
export function IconTypography() {
  return (
    <svg {...props}>
      <path d="M3 11L7 3l4 8" />
      <path d="M4.5 8.5h5" />
    </svg>
  );
}

/** Nested rectangles — margin/padding */
export function IconBoxModel() {
  return (
    <svg {...props}>
      <rect x="1" y="1" width="12" height="12" rx="1" strokeDasharray="2.5 2" opacity="0.5" />
      <rect x="3.5" y="3.5" width="7" height="7" rx="0.5" />
    </svg>
  );
}

/** Rectangle with emphasized top edge — borders */
export function IconBorders() {
  return (
    <svg {...props}>
      <rect x="2" y="2" width="10" height="10" rx="1" opacity="0.4" />
      <line x1="3" y1="2" x2="11" y2="2" strokeWidth="2.5" opacity="1" />
    </svg>
  );
}

/** H letterform — heading */
export function IconHeader() {
  return (
    <svg {...props}>
      <path d="M3 3v8M3 7h5M8 3v8" />
    </svg>
  );
}

/** Mountain in frame — image */
export function IconImage() {
  return (
    <svg {...props}>
      <rect x="1.5" y="2.5" width="11" height="9" rx="1" />
      <path d="M1.5 9.5l3-3 2 2 2.5-3 3.5 4" />
      <circle cx="4.5" cy="5.5" r="1" />
    </svg>
  );
}

/** Bullet list — dots and lines */
export function IconBullets() {
  return (
    <svg {...props}>
      <circle cx="3" cy="4" r="1.2" fill="currentColor" stroke="none" />
      <line x1="6" y1="4" x2="12" y2="4" />
      <circle cx="3" cy="7.5" r="1.2" fill="currentColor" stroke="none" />
      <line x1="6" y1="7.5" x2="12" y2="7.5" />
      <circle cx="3" cy="11" r="1.2" fill="currentColor" stroke="none" />
      <line x1="6" y1="11" x2="11" y2="11" />
    </svg>
  );
}

/** Five color swatches in a row — palette */
export function IconPalette() {
  return (
    <svg {...props} strokeWidth={0}>
      <circle cx="2.5" cy="7" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="5" cy="7" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="7.5" cy="7" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="10" cy="7" r="2" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

/** Chain link — two interlocking loops */
export function IconLinks() {
  return (
    <svg {...props}>
      <path d="M6 9l-1.5 1.5a2 2 0 11-2.8-2.8L3.5 6" />
      <path d="M8 5l1.5-1.5a2 2 0 112.8 2.8L10.5 8" />
      <line x1="5.5" y1="8.5" x2="8.5" y2="5.5" />
    </svg>
  );
}

/** 2×2 grid — layout grid */
export function IconGrid() {
  return (
    <svg {...props}>
      <rect x="1.5" y="1.5" width="4.5" height="4.5" rx="0.5" />
      <rect x="8" y="1.5" width="4.5" height="4.5" rx="0.5" />
      <rect x="1.5" y="8" width="4.5" height="4.5" rx="0.5" />
      <rect x="8" y="8" width="4.5" height="4.5" rx="0.5" />
    </svg>
  );
}

/** Document with folded corner — page */
export function IconPage() {
  return (
    <svg {...props}>
      <path d="M3.5 1.5h4.5l3 3v8a1 1 0 01-1 1h-6.5a1 1 0 01-1-1v-10a1 1 0 011-1z" />
      <path d="M8 1.5V5h3.5" />
    </svg>
  );
}

/** Two-column split — layout */
export function IconLayout() {
  return (
    <svg {...props}>
      <rect x="1.5" y="1.5" width="11" height="11" rx="1" />
      <line x1="5.5" y1="1.5" x2="5.5" y2="12.5" />
    </svg>
  );
}

/** Rectangle with shadow — box shadow */
export function IconBoxShadow() {
  return (
    <svg {...props}>
      <rect x="2" y="2" width="8" height="8" rx="1" />
      <rect x="4" y="4" width="8" height="8" rx="1" opacity="0.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Four horizontal lines — content type */
export function IconContent() {
  return (
    <svg {...props}>
      <line x1="2" y1="3" x2="12" y2="3" />
      <line x1="2" y1="6" x2="10" y2="6" />
      <line x1="2" y1="9" x2="12" y2="9" />
      <line x1="2" y1="12" x2="9" y2="12" />
    </svg>
  );
}

/** Counter-clockwise arrow — history/undo */
export function IconHistory() {
  return (
    <svg {...props}>
      <path d="M2 7a5 5 0 119 3" />
      <path d="M2 3v4h4" />
    </svg>
  );
}
