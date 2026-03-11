/**
 * Nudge a CSS numeric value (e.g. "10px", "0.5em", "1.5") by ArrowUp/Down.
 * Returns the new string value, or null if the key isn't an arrow.
 */
export function nudgeCSSValue(current: string, key: "ArrowUp" | "ArrowDown", shift: boolean): string {
  const match = current.match(/^(-?[\d.]+)\s*([a-z%]*)$/);
  const num = match ? parseFloat(match[1]) : parseFloat(current) || 0;
  const unit = match?.[2] ?? "";
  const small = unit === "em" || unit === "rem" || !unit; // unitless (line-height) uses small steps
  const step = shift ? (small ? 1 : 10) : (small ? 0.1 : 1);
  const delta = key === "ArrowUp" ? step : -step;
  const next = small
    ? (num + delta).toFixed(2).replace(/0$/, "").replace(/\.$/, "")
    : String(Math.round(num + delta));
  return `${next}${unit}`;
}

/**
 * Parse a CSS shorthand value (margin, padding) into its four sides.
 * Handles 1, 2, 3, or 4 value patterns per CSS spec.
 */
export function parseShorthand(value: string): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  const parts = value.trim().split(/\s+/);
  switch (parts.length) {
    case 1:
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    case 2:
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    case 3:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    case 4:
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    default:
      return { top: "", right: "", bottom: "", left: "" };
  }
}
