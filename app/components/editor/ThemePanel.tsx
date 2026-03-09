"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
import type { ColorPalette } from "../../models";
import { FONT_PRESETS } from "../../data/constants";
import { parseGridTemplate, updateColumnWidth, updateRowHeight, getColumnRegions, getRowRegions } from "../../utils/gridUtils";
import { isPaletteVar, resolvePaletteVar } from "../../utils/paletteUtils";
import BoxModelEditor from "./BoxModelEditor";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const SIZE_PRESETS = ["8pt", "9pt", "10pt", "11pt", "12pt"];

const PALETTE_PRESETS: { name: string; palette: ColorPalette }[] = [
  {
    name: "Professional Blue",
    palette: { primary: "#2563eb", secondary: "#1e40af", accent: "#3b82f6", muted: "#94a3b8", background: "#f8fafc" },
  },
  {
    name: "Warm Earth",
    palette: { primary: "#92400e", secondary: "#78350f", accent: "#d97706", muted: "#a8a29e", background: "#faf5f0" },
  },
  {
    name: "Modern Dark",
    palette: { primary: "#1a1a2e", secondary: "#16213e", accent: "#0f3460", muted: "#6b7280", background: "#f9fafb" },
  },
  {
    name: "Elegant Green",
    palette: { primary: "#065f46", secondary: "#064e3b", accent: "#059669", muted: "#9ca3af", background: "#f0fdf4" },
  },
];

const PALETTE_KEYS: (keyof ColorPalette)[] = ["primary", "secondary", "accent", "muted", "background"];

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;

/** Parse a borderBottom shorthand like "2px solid #2563eb" into parts */
function parseBorder(value: string | undefined, palette?: ColorPalette): { width: string; color: string; rawColor: string } {
  if (!value) return { width: "", color: "#000000", rawColor: "" };
  const parts = value.trim().split(/\s+/);
  const width = parts[0] ?? "";
  // Color: find var(), #hex, rgb(), or named color (last part)
  let rawColor = "";
  const varMatch = value.match(/var\(--palette-[a-z]+\)/);
  if (varMatch) {
    rawColor = varMatch[0];
  } else {
    rawColor = parts.find((p) => p.startsWith("#") || p.startsWith("rgb")) ?? parts[parts.length - 1] ?? "#000000";
  }
  // Resolve var() for display in color picker
  const color = palette && isPaletteVar(rawColor) ? resolvePaletteVar(rawColor, palette) : rawColor;
  return { width, color: color || "#000000", rawColor };
}

export default function ThemePanel() {
  const { resume, dispatch, canUndo, canRedo } = useEditorRequired();
  const { theme, page } = resume.template;

  return (
    <div className={styles.panelSection}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Theme</div>
      </div>

      {/* Colors */}
      <div className={styles.themeSectionTitle}>Colors</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={theme.root.color ?? "#000000"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { color: e.target.value } })}
        />
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Page background</label>
        <input
          type="color"
          className={styles.colorInput}
          value={(theme.root.background as string) ?? "#ffffff"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { background: e.target.value } })}
        />
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Canvas background</label>
        <div className={styles.headingRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={(theme.canvas.backgroundColor as string) ?? (theme.canvas.background as string) ?? "#ffffff"}
            onChange={(e) => dispatch({ type: "UPDATE_THEME_CANVAS", style: { backgroundColor: e.target.value } })}
          />
          {(theme.canvas.backgroundColor || theme.canvas.background) && (
            <button
              className={styles.clearBtn}
              title="Remove background color"
              onClick={() =>
                dispatch({
                  type: "UPDATE_THEME_CANVAS",
                  style: { backgroundColor: undefined, background: undefined },
                })
              }
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Color Palette */}
      <div className={styles.themeSectionTitle}>Color Palette</div>
      {/* Preset picker */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Preset</label>
        <select
          className={styles.propSelect}
          value=""
          onChange={(e) => {
            const preset = PALETTE_PRESETS.find((p) => p.name === e.target.value);
            if (preset) dispatch({ type: "APPLY_PALETTE_PRESET", palette: preset.palette });
          }}
        >
          <option value="" disabled>
            Choose a preset...
          </option>
          {PALETTE_PRESETS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      {/* Preset preview swatches */}
      {PALETTE_PRESETS.map((p) => (
        <button
          key={p.name}
          className={styles.palettePresetRow}
          onClick={() => dispatch({ type: "APPLY_PALETTE_PRESET", palette: p.palette })}
          title={p.name}
        >
          <span className={styles.palettePresetLabel}>{p.name}</span>
          <div className={styles.paletteSwatches}>
            {PALETTE_KEYS.map((k) => (
              <span
                key={k}
                className={styles.paletteSwatch}
                style={{ backgroundColor: p.palette[k] }}
              />
            ))}
          </div>
        </button>
      ))}
      {/* Editable palette colors */}
      {theme.palette && (
        <>
          {PALETTE_KEYS.map((key) => (
            <div key={key} className={styles.propRow}>
              <label className={styles.propLabel}>{key}</label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={theme.palette![key]}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_THEME_PALETTE",
                      palette: { ...theme.palette!, [key]: e.target.value },
                    })
                  }
                />
                <span className={styles.inheritLabel}>{theme.palette![key]}</span>
              </div>
            </div>
          ))}
          <div className={styles.propBtnRow}>
            <button
              className={styles.propBtn}
              onClick={() => dispatch({ type: "UPDATE_THEME_PALETTE", palette: undefined })}
            >
              Remove palette
            </button>
          </div>
        </>
      )}

      {/* Typography */}
      <div className={styles.themeSectionTitle}>Base Typography</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font family</label>
        <select
          className={styles.propSelect}
          value={theme.root.fontFamily ?? ""}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { fontFamily: e.target.value } })}
        >
          {FONT_PRESETS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Base font size</label>
        <select
          className={styles.propSelect}
          value={theme.root.fontSize ?? "10pt"}
          onChange={(e) => dispatch({ type: "UPDATE_THEME_ROOT", style: { fontSize: e.target.value } })}
        >
          {SIZE_PRESETS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Links */}
      <div className={styles.themeSectionTitle}>Links</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Link color</label>
        <div className={styles.headingRow}>
          <input
            type="color"
            className={styles.colorInput}
            value={(() => {
            const c = (theme.link.color as string) ?? "#2563eb";
            return theme.palette && isPaletteVar(c) ? resolvePaletteVar(c, theme.palette) : c;
          })()}
            onChange={(e) => dispatch({ type: "UPDATE_THEME_LINK", style: { color: e.target.value } })}
          />
          {theme.link.color && (
            <button
              className={styles.clearBtn}
              title="Remove link color"
              onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { color: undefined } })}
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Headings */}
      <div className={styles.themeSectionTitle}>Headings</div>
      {TAGS.map((tag) => {
        const headingStyle = theme[tag];
        const border = parseBorder(headingStyle.borderBottom as string | undefined, theme.palette);
        const hasBorder = !!headingStyle.borderBottom;

        return (
          <div key={tag} className={styles.headingGroup}>
            {/* Row 1: tag + fontSize + color */}
            <div className={styles.headingRow}>
              <span className={styles.headingTag}>{tag}</span>
              <SpacingInput
                compact
                value={(headingStyle.fontSize as string) ?? ""}
                placeholder="0"
                onChange={(v) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { fontSize: v } })}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={(() => {
                  const c = (headingStyle.color as string) ?? (theme.root.color as string) ?? "#000000";
                  return theme.palette && isPaletteVar(c) ? resolvePaletteVar(c, theme.palette) : c;
                })()}
                onChange={(e) => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { color: e.target.value } })}
              />
            </div>
            {/* Row 2: letterSpacing + textTransform */}
            <div className={styles.headingDetailRow}>
              <input
                type="text"
                className={styles.headingSmallInput}
                value={(headingStyle.letterSpacing as string) ?? ""}
                placeholder="spacing"
                title="Letter spacing (e.g. 0.05em)"
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { letterSpacing: e.target.value || undefined },
                  })
                }
              />
              <select
                className={styles.headingSmallSelect}
                value={(headingStyle.textTransform as string) ?? "none"}
                title="Text transform"
                onChange={(e) => {
                  const val = e.target.value;
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { textTransform: val === "none" ? undefined : (val as "uppercase" | "lowercase" | "capitalize") },
                  });
                }}
              >
                {TEXT_TRANSFORM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {/* Row 3: borderBottom */}
            <div className={styles.headingDetailRow}>
              <input
                type="text"
                className={styles.headingSmallInput}
                value={border.width}
                placeholder="border"
                title="Border width (e.g. 2px, 1px)"
                onChange={(e) => {
                  const w = e.target.value;
                  if (!w) {
                    dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { borderBottom: undefined } });
                  } else {
                    dispatch({
                      type: "UPDATE_HEADING_STYLE",
                      tag,
                      style: { borderBottom: `${w} solid ${border.color}` },
                    });
                  }
                }}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={border.color}
                title="Border color"
                onChange={(e) => {
                  const w = border.width || "1px";
                  dispatch({
                    type: "UPDATE_HEADING_STYLE",
                    tag,
                    style: { borderBottom: `${w} solid ${e.target.value}` },
                  });
                }}
              />
              {hasBorder && (
                <button
                  className={styles.clearBtn}
                  title="Remove border"
                  onClick={() => dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { borderBottom: undefined } })}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Page */}
      <div className={styles.themeSectionTitle}>Page</div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Size</label>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${page.size === "letter" ? styles.toggleActive : ""}`}
            onClick={() => dispatch({ type: "UPDATE_PAGE_SIZE", size: "letter" })}
          >
            Letter
          </button>
          <button
            className={`${styles.toggleBtn} ${page.size === "a4" ? styles.toggleActive : ""}`}
            onClick={() => dispatch({ type: "UPDATE_PAGE_SIZE", size: "a4" })}
          >
            A4
          </button>
        </div>
      </div>
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Margins</label>
        <BoxModelEditor
          marginTop={page.margins.top}
          marginRight={page.margins.right}
          marginBottom={page.margins.bottom}
          marginLeft={page.margins.left}
          paddingTop=""
          paddingRight=""
          paddingBottom=""
          paddingLeft=""
          onMarginChange={(side, value) => {
            dispatch({ type: "UPDATE_PAGE_MARGINS", margins: { ...page.margins, [side]: value } });
          }}
          onPaddingChange={() => {}}
        />
      </div>

      {/* Grid Layout */}
      <div className={styles.themeSectionTitle}>Grid Layout</div>
      {(() => {
        const parsed = parseGridTemplate(resume.template.grid);
        return (
          <>
            {/* Columns */}
            {parsed.cols.length > 1 && (
              <div className={styles.propRow}>
                <label className={styles.propLabel}>Columns</label>
                {parsed.cols.map((col, i) => {
                  const regions = getColumnRegions(parsed, i);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span className={styles.inheritLabel} style={{ width: 60, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={regions.join(", ")}>
                        {regions.join(", ")}
                      </span>
                      <input
                        type="text"
                        className={styles.propInput}
                        style={{ width: 80 }}
                        value={col}
                        onChange={(e) => {
                          const newGrid = updateColumnWidth(resume.template.grid, i, e.target.value);
                          dispatch({ type: "UPDATE_GRID", grid: newGrid });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {/* Rows */}
            <div className={styles.propRow}>
              <label className={styles.propLabel}>Rows</label>
              {parsed.rows.map((row, i) => {
                const regions = getRowRegions(parsed, i);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span className={styles.inheritLabel} style={{ width: 60, flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={regions.join(", ")}>
                      {regions.join(", ")}
                    </span>
                    <input
                      type="text"
                      className={styles.propInput}
                      style={{ width: 80 }}
                      value={row.height}
                      onChange={(e) => {
                        const newGrid = updateRowHeight(resume.template.grid, i, e.target.value);
                        dispatch({ type: "UPDATE_GRID", grid: newGrid });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </>
        );
      })()}

      {/* Undo/Redo indicator */}
      <div className={styles.themeSectionTitle}>Actions</div>
      <div className={styles.propBtnRow}>
        <button
          className={styles.propBtn}
          disabled={!canUndo}
          onClick={() => dispatch({ type: "UNDO" })}
        >
          Undo
        </button>
        <button
          className={styles.propBtn}
          disabled={!canRedo}
          onClick={() => dispatch({ type: "REDO" })}
        >
          Redo
        </button>
      </div>
    </div>
  );
}
