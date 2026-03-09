import type { ColorPalette, Style, Theme } from "../models";

/** Map of palette keys to their CSS variable strings */
export const PALETTE_VAR_MAP: Record<keyof ColorPalette, string> = {
  primary: "var(--palette-primary)",
  secondary: "var(--palette-secondary)",
  accent: "var(--palette-accent)",
  muted: "var(--palette-muted)",
  background: "var(--palette-background)",
};

const VAR_REGEX = /^var\(--palette-([a-z]+)\)$/;

/** Check if a CSS value is a palette variable reference */
export function isPaletteVar(value: string): boolean {
  return VAR_REGEX.test(value);
}

/** Extract the palette key from a var(--palette-*) string, or null */
export function paletteKeyFromVar(value: string): keyof ColorPalette | null {
  const m = value.match(VAR_REGEX);
  if (!m) return null;
  const key = m[1] as keyof ColorPalette;
  return key in PALETTE_VAR_MAP ? key : null;
}

/** Resolve a var(--palette-*) to its hex color, or return the value unchanged */
export function resolvePaletteVar(value: string, palette: ColorPalette): string {
  const key = paletteKeyFromVar(value);
  return key ? palette[key] : value;
}

/** Resolve any palette var() references in a Style object */
export function resolveStyleVars(style: Style, palette: ColorPalette): Style {
  const resolved: Style = {};
  for (const [k, v] of Object.entries(style)) {
    if (typeof v === "string" && isPaletteVar(v)) {
      (resolved as Record<string, unknown>)[k] = resolvePaletteVar(v, palette);
    } else if (typeof v === "string" && v.includes("var(--palette-")) {
      // Handle var() embedded in shorthand values like "2px solid var(--palette-primary)"
      (resolved as Record<string, unknown>)[k] = v.replace(
        /var\(--palette-([a-z]+)\)/g,
        (_, key: string) => (key in palette ? palette[key as keyof ColorPalette] : _),
      );
    } else {
      (resolved as Record<string, unknown>)[k] = v;
    }
  }
  return resolved;
}

/** Default mapping: which theme properties should use which palette key */
const THEME_PALETTE_MAP: Record<string, keyof ColorPalette> = {
  "h1.color": "primary",
  "h2.color": "primary",
  "h3.color": "secondary",
  "h4.color": "secondary",
  "link.color": "accent",
};

/** Replace color portion of a border shorthand with a palette var */
function rewriteBorderColor(border: string, varRef: string): string {
  // "2px solid #2563eb" → "2px solid var(--palette-primary)"
  const parts = border.trim().split(/\s+/);
  if (parts.length >= 3) {
    // Last part is the color
    parts[parts.length - 1] = varRef;
    return parts.join(" ");
  }
  return border;
}

/**
 * Apply a palette to a theme: rewrites color properties to use var() references.
 * Also rewrites heading borderBottom colors if they exist.
 */
export function applyPaletteToTheme(theme: Theme, palette: ColorPalette): Theme {
  const newTheme = { ...theme, palette };

  // Apply the standard mapping
  for (const [path, paletteKey] of Object.entries(THEME_PALETTE_MAP)) {
    const [section, prop] = path.split(".") as [keyof Theme, string];
    const sectionStyle = newTheme[section];
    if (sectionStyle && typeof sectionStyle === "object" && !Array.isArray(sectionStyle)) {
      (newTheme as Record<string, unknown>)[section] = {
        ...(sectionStyle as Style),
        [prop]: PALETTE_VAR_MAP[paletteKey],
      };
    }
  }

  // Rewrite heading borderBottom colors to use primary
  const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
  for (const tag of headingTags) {
    const hs = newTheme[tag] as Style;
    if (hs?.borderBottom && typeof hs.borderBottom === "string") {
      const paletteKey = tag === "h3" || tag === "h4" ? "secondary" : "primary";
      (newTheme as Record<string, unknown>)[tag] = {
        ...hs,
        borderBottom: rewriteBorderColor(hs.borderBottom as string, PALETTE_VAR_MAP[paletteKey]),
      };
    }
  }

  return newTheme;
}
