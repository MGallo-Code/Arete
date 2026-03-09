/**
 * Utilities for parsing and updating CSS grid-template shorthand values.
 *
 * Expected format (matches CSS grid-template):
 *   "header header" auto "sidebar main" 1fr / 30% 70%
 *
 * Structure: one or more row definitions, then " / " followed by column widths.
 * Each row definition is: "area-names" height
 */

export interface GridRow {
  areas: string[]; // area names for this row, e.g. ["header", "header"]
  height: string; // row track size, e.g. "auto", "1fr"
}

export interface ParsedGrid {
  rows: GridRow[];
  cols: string[];
}

/**
 * Parse a CSS grid-template shorthand into rows (with area names + height) and column widths.
 */
export function parseGridTemplate(grid: string): ParsedGrid {
  // Split on " / " to separate rows from columns
  const slashIndex = grid.lastIndexOf("/");
  if (slashIndex === -1) {
    // No columns specified — single column
    return { rows: parseRows(grid.trim()), cols: ["1fr"] };
  }

  const rowsPart = grid.slice(0, slashIndex).trim();
  const colsPart = grid.slice(slashIndex + 1).trim();

  const rows = parseRows(rowsPart);
  const cols = colsPart.split(/\s+/).filter(Boolean);

  return { rows, cols };
}

/**
 * Parse the rows portion of grid-template.
 * Format: "area1 area2" height "area3 area4" height ...
 */
function parseRows(rowsPart: string): GridRow[] {
  const rows: GridRow[] = [];
  // Match quoted area strings followed by a height value
  const regex = /"([^"]+)"\s+(\S+)/g;
  let match;
  while ((match = regex.exec(rowsPart)) !== null) {
    const areas = match[1].split(/\s+/).filter(Boolean);
    const height = match[2];
    rows.push({ areas, height });
  }
  return rows;
}

/**
 * Rebuild a CSS grid-template string from parsed rows and columns.
 */
export function buildGridTemplate(parsed: ParsedGrid): string {
  const rowParts = parsed.rows.map((row) => `"${row.areas.join(" ")}" ${row.height}`);
  return `${rowParts.join(" ")} / ${parsed.cols.join(" ")}`;
}

/**
 * Update the width of a specific column in a grid-template string.
 */
export function updateColumnWidth(grid: string, colIndex: number, newWidth: string): string {
  const parsed = parseGridTemplate(grid);
  if (colIndex < 0 || colIndex >= parsed.cols.length) return grid;
  parsed.cols[colIndex] = newWidth;
  return buildGridTemplate(parsed);
}

/**
 * Update the height of a specific row in a grid-template string.
 */
export function updateRowHeight(grid: string, rowIndex: number, newHeight: string): string {
  const parsed = parseGridTemplate(grid);
  if (rowIndex < 0 || rowIndex >= parsed.rows.length) return grid;
  parsed.rows[rowIndex].height = newHeight;
  return buildGridTemplate(parsed);
}

/**
 * Get the unique region names that appear in a specific column index.
 */
export function getColumnRegions(parsed: ParsedGrid, colIndex: number): string[] {
  const regions = new Set<string>();
  for (const row of parsed.rows) {
    if (colIndex < row.areas.length) {
      regions.add(row.areas[colIndex]);
    }
  }
  return Array.from(regions);
}

/**
 * Get the unique region names that appear in a specific row index.
 */
export function getRowRegions(parsed: ParsedGrid, rowIndex: number): string[] {
  if (rowIndex < 0 || rowIndex >= parsed.rows.length) return [];
  return Array.from(new Set(parsed.rows[rowIndex].areas));
}
