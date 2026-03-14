"use client";

import { X } from "lucide-react";
import { useEditorRequired } from "../../contexts/EditorContext";
import type { ColorPalette, Style } from "../../models";
import { parseGridTemplate, updateColumnWidth, updateRowHeight, getColumnRegions, getRowRegions } from "../../utils/gridUtils";
import BorderControls from "./BorderControls";
import BoxModelEditor from "./BoxModelEditor";
import BoxShadowControls from "./BoxShadowControls";
import CollapsibleSection from "./CollapsibleSection";
import ColorControls from "./ColorControls";
import ColorPropRow from "./ColorPropRow";
import PropertyRow from "./PropertyRow";
import { IconColors, IconPalette, IconTypography, IconLinks, IconHeader, IconPage, IconGrid } from "./SectionIcons";
import TypographyControls from "./TypographyControls";
import styles from "./editor.module.css";

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

export default function ThemePanel() {
  const { resume, dispatch } = useEditorRequired();
  const { theme, page } = resume.template;

  return (
    <div className={styles.panelSection}>
      <div className={styles.panelHeader}>
        <div className={styles.panelTitle}>Theme</div>
      </div>

      {/* Colors */}
      <CollapsibleSection panelId="theme" title="Colors" icon={<IconColors />}>
        <ColorPropRow
          label="Text Color"
          value={theme.root.color as string | undefined}
          fallback="#000000"
          onChange={(v) => dispatch({ type: "UPDATE_THEME_ROOT", style: { color: v } })}
          onClear={() => dispatch({ type: "UPDATE_THEME_ROOT", style: { color: undefined } })}
          palette={theme.palette}
        />
        <ColorPropRow
          label="Page Background"
          value={theme.root.background as string | undefined}
          fallback="#ffffff"
          onChange={(v) => dispatch({ type: "UPDATE_THEME_ROOT", style: { background: v } })}
          onClear={() => dispatch({ type: "UPDATE_THEME_ROOT", style: { background: undefined } })}
          palette={theme.palette}
        />
        <ColorPropRow
          label="Canvas Background"
          value={(theme.canvas.backgroundColor as string | undefined) ?? (theme.canvas.background as string | undefined)}
          fallback="#ffffff"
          onChange={(v) => dispatch({ type: "UPDATE_THEME_CANVAS", style: { backgroundColor: v } })}
          onClear={() => dispatch({ type: "UPDATE_THEME_CANVAS", style: { backgroundColor: undefined, background: undefined } })}
          palette={theme.palette}
        />
      </CollapsibleSection>

      {/* Color Palette */}
      <CollapsibleSection panelId="theme" title="Color Palette" icon={<IconPalette />}>
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
        {theme.palette && (
          <>
            {PALETTE_KEYS.map((key) => (
              <PropertyRow key={key} label={key}>
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
              </PropertyRow>
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
      </CollapsibleSection>

      {/* Typography */}
      <CollapsibleSection panelId="theme" title="Typography" icon={<IconTypography />}>
        <TypographyControls
          style={theme.root}
          updateStyle={(patch) => dispatch({ type: "UPDATE_THEME_ROOT", style: patch })}
          clearStyle={(...keys) => {
            const patch: Record<string, undefined> = {};
            for (const k of keys) patch[k] = undefined;
            dispatch({ type: "UPDATE_THEME_ROOT", style: patch });
          }}
        />
      </CollapsibleSection>

      {/* Links */}
      <CollapsibleSection panelId="theme" title="Links" icon={<IconLinks />}>
        <ColorPropRow
          label="Link Color"
          value={theme.link.color as string | undefined}
          fallback="#2563eb"
          onChange={(v) => dispatch({ type: "UPDATE_THEME_LINK", style: { color: v } })}
          onClear={() => dispatch({ type: "UPDATE_THEME_LINK", style: { color: undefined } })}
          palette={theme.palette}
        />
        <PropertyRow label="Text decoration">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${theme.link.textDecoration === "none" ? styles.toggleActive : ""}`}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { textDecoration: "none" } })}
              >
                None
              </button>
              <button
                className={`${styles.toggleBtn} ${!theme.link.textDecoration || theme.link.textDecoration === "underline" ? styles.toggleActive : ""}`}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { textDecoration: "underline" } })}
              >
                Underline
              </button>
            </div>
            {theme.link.textDecoration && (
              <button
                className={styles.clearBtn}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { textDecoration: undefined } })}
                title="Clear"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </PropertyRow>
        <PropertyRow label="Font weight">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${!theme.link.fontWeight ? styles.toggleActive : ""}`}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { fontWeight: undefined } })}
              >
                Inherit
              </button>
              <button
                className={`${styles.toggleBtn} ${theme.link.fontWeight === "bold" ? styles.toggleActive : ""}`}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { fontWeight: "bold" } })}
              >
                Bold
              </button>
            </div>
            {theme.link.fontWeight && (
              <button
                className={styles.clearBtn}
                onClick={() => dispatch({ type: "UPDATE_THEME_LINK", style: { fontWeight: undefined } })}
                title="Clear"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </PropertyRow>
      </CollapsibleSection>

      {/* Headings */}
      <CollapsibleSection panelId="theme" title="Headings" icon={<IconHeader />}>
        {TAGS.map((tag) => {
          const headingStyle = theme[tag];
          const updateHeadingStyle = (patch: Record<string, string | undefined>) => {
            dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: patch as Style });
          };
          const clearHeadingStyle = (key: string) => {
            dispatch({ type: "UPDATE_HEADING_STYLE", tag, style: { [key]: undefined } as Style });
          };
          return (
            <CollapsibleSection
              key={tag}
              panelId="theme"
              title={tag}
              defaultOpen={tag === "h1"}
            >
              <TypographyControls
                style={headingStyle}
                updateStyle={updateHeadingStyle}
                clearStyle={clearHeadingStyle}
              />
              <ColorControls
                style={headingStyle}
                updateStyle={updateHeadingStyle}
                clearStyle={clearHeadingStyle}
                palette={theme.palette}
              />
              <BoxModelEditor
                marginTop={(headingStyle.marginTop as string) ?? ""}
                marginRight={(headingStyle.marginRight as string) ?? ""}
                marginBottom={(headingStyle.marginBottom as string) ?? ""}
                marginLeft={(headingStyle.marginLeft as string) ?? ""}
                paddingTop={(headingStyle.paddingTop as string) ?? ""}
                paddingRight={(headingStyle.paddingRight as string) ?? ""}
                paddingBottom={(headingStyle.paddingBottom as string) ?? ""}
                paddingLeft={(headingStyle.paddingLeft as string) ?? ""}
                onMarginChange={(side, value) => {
                  const key = `margin${side[0].toUpperCase()}${side.slice(1)}`;
                  updateHeadingStyle({ [key]: value });
                }}
                onPaddingChange={(side, value) => {
                  const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
                  updateHeadingStyle({ [key]: value });
                }}
                onClearAllMargins={() => updateHeadingStyle({
                  marginTop: undefined, marginRight: undefined,
                  marginBottom: undefined, marginLeft: undefined,
                })}
                onClearAllPadding={() => updateHeadingStyle({
                  paddingTop: undefined, paddingRight: undefined,
                  paddingBottom: undefined, paddingLeft: undefined,
                })}
              />
              <BorderControls
                style={headingStyle}
                updateStyle={updateHeadingStyle}
                clearStyle={clearHeadingStyle}
                palette={theme.palette}
              />
              <BoxShadowControls
                style={headingStyle}
                updateStyle={updateHeadingStyle}
                clearStyle={clearHeadingStyle}
                palette={theme.palette}
              />
            </CollapsibleSection>
          );
        })}
      </CollapsibleSection>

      {/* Page */}
      <CollapsibleSection panelId="theme" title="Page" icon={<IconPage />}>
        <PropertyRow label="Size">
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
        </PropertyRow>
        <PropertyRow label="Margins">
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
        </PropertyRow>
      </CollapsibleSection>

      {/* Grid Layout */}
      <CollapsibleSection panelId="theme" title="Grid" icon={<IconGrid />}>
        {(() => {
          const parsed = parseGridTemplate(resume.template.grid);
          return (
            <>
              {parsed.cols.length > 1 && (
                <PropertyRow label="Columns">
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
                </PropertyRow>
              )}
              <PropertyRow label="Rows">
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
              </PropertyRow>
            </>
          );
        })()}
      </CollapsibleSection>
    </div>
  );
}
