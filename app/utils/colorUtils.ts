/** Parse any CSS color to { r, g, b, a } (0-255 for rgb, 0-1 for a) */
export function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  if (!color) return null;
  const s = color.trim();

  // #rgb
  const hex3 = s.match(/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
  if (hex3) {
    return {
      r: parseInt(hex3[1] + hex3[1], 16),
      g: parseInt(hex3[2] + hex3[2], 16),
      b: parseInt(hex3[3] + hex3[3], 16),
      a: 1,
    };
  }

  // #rrggbb
  const hex6 = s.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (hex6) {
    return {
      r: parseInt(hex6[1], 16),
      g: parseInt(hex6[2], 16),
      b: parseInt(hex6[3], 16),
      a: 1,
    };
  }

  // #rrggbbaa
  const hex8 = s.match(/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (hex8) {
    return {
      r: parseInt(hex8[1], 16),
      g: parseInt(hex8[2], 16),
      b: parseInt(hex8[3], 16),
      a: parseInt(hex8[4], 16) / 255,
    };
  }

  // rgba(r, g, b, a) or rgba(r g b / a)
  const rgba = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+|[/\s]+)([\d.]+)\s*\)$/);
  if (rgba) {
    return {
      r: parseInt(rgba[1]),
      g: parseInt(rgba[2]),
      b: parseInt(rgba[3]),
      a: parseFloat(rgba[4]),
    };
  }

  // rgb(r, g, b) or rgb(r g b)
  const rgb = s.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)\s*\)$/);
  if (rgb) {
    return {
      r: parseInt(rgb[1]),
      g: parseInt(rgb[2]),
      b: parseInt(rgb[3]),
      a: 1,
    };
  }

  return null;
}

/** Convert { r, g, b, a } to a CSS color string. Returns hex when a=1, rgba() otherwise. */
export function colorToString(r: number, g: number, b: number, a: number): string {
  if (a >= 1) {
    return rgbToHex(r, g, b);
  }
  return `rgba(${r},${g},${b},${round2(a)})`;
}

/** Convert r, g, b to #rrggbb hex */
export function rgbToHex(r: number, g: number, b: number): string {
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** Extract hex (no alpha) from any color string, for <input type="color"> */
export function colorToHex(color: string): string {
  const parsed = parseColor(color);
  if (parsed) return rgbToHex(parsed.r, parsed.g, parsed.b);
  return "#000000";
}

/** Extract alpha (0-1) from any color string */
export function colorAlpha(color: string): number {
  const parsed = parseColor(color);
  return parsed ? parsed.a : 1;
}

/** Set alpha on any color string, returning hex when a=1, rgba() otherwise */
export function setColorAlpha(color: string, alpha: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  return colorToString(parsed.r, parsed.g, parsed.b, alpha);
}

/** Set hex component of a color while preserving alpha */
export function setColorHex(color: string, hex: string): string {
  const oldParsed = parseColor(color);
  const newParsed = parseColor(hex);
  if (!newParsed) return color;
  const a = oldParsed ? oldParsed.a : 1;
  return colorToString(newParsed.r, newParsed.g, newParsed.b, a);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
