"use client";

import { useMemo, useRef } from "react";
import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import type { BulletLevel, Style } from "../../models";
import { FONT_PRESETS } from "../../data/constants";
import { parseShorthand } from "../../utils/cssUtils";
import BorderControls from "./BorderControls";
import BoxModelEditor from "./BoxModelEditor";
import ColorPropRow from "./ColorPropRow";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;

export default function BlockStylePanel() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();
  const theme = resume.template.theme;

  if (!selectedBlockId) return null;

  const block = findBlock(resume.blocks, selectedBlockId);
  if (!block) return null;

  const style = block.style ?? {};

  // Compute inherited margin/padding defaults from theme heading styles
  const defaults = useMemo(() => {
    const tag = block.header?.tag;
    const themeStyle: Style | undefined = tag ? theme[tag] : undefined;
    if (!themeStyle) return {};

    const result: Record<string, string> = {};

    // Check longhand properties first, then parse shorthand
    if (themeStyle.margin && typeof themeStyle.margin === "string") {
      const parsed = parseShorthand(themeStyle.margin as string);
      result.marginTop = parsed.top;
      result.marginRight = parsed.right;
      result.marginBottom = parsed.bottom;
      result.marginLeft = parsed.left;
    }
    if (themeStyle.padding && typeof themeStyle.padding === "string") {
      const parsed = parseShorthand(themeStyle.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }

    // Longhand properties override shorthand
    if (themeStyle.marginTop) result.marginTop = themeStyle.marginTop as string;
    if (themeStyle.marginRight) result.marginRight = themeStyle.marginRight as string;
    if (themeStyle.marginBottom) result.marginBottom = themeStyle.marginBottom as string;
    if (themeStyle.marginLeft) result.marginLeft = themeStyle.marginLeft as string;
    if (themeStyle.paddingTop) result.paddingTop = themeStyle.paddingTop as string;
    if (themeStyle.paddingRight) result.paddingRight = themeStyle.paddingRight as string;
    if (themeStyle.paddingBottom) result.paddingBottom = themeStyle.paddingBottom as string;
    if (themeStyle.paddingLeft) result.paddingLeft = themeStyle.paddingLeft as string;

    return result;
  }, [block.header?.tag, theme]);

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_BLOCK_STYLE", blockId: selectedBlockId, style: patch });
  };

  const clearStyle = (key: string) => {
    const newStyle = { ...style };
    delete (newStyle as Record<string, unknown>)[key];
    dispatch({
      type: "SET_BLOCK_STYLE",
      blockId: selectedBlockId,
      style: Object.keys(newStyle).length > 0 ? newStyle : undefined,
    });
  };

  return (
    <div className={styles.selectionPanel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.selectionPanelTitle}>Block</div>
          <div className={styles.panelSubtitle}>{getBlockLabel(block)}</div>
        </div>
      </div>

      {/* 0. Header controls */}
      <div className={styles.themeSectionTitle}>Header</div>
      {block.header ? (
        <div className={styles.propRow}>
          <label className={styles.propLabel}>Tag</label>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select
              className={styles.propSelect}
              value={block.header.tag}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BLOCK_HEADER_TAG",
                  blockId: selectedBlockId,
                  tag: e.target.value as "h1" | "h2" | "h3" | "h4" | "h5" | "h6",
                })
              }
            >
              {(["h1", "h2", "h3", "h4", "h5", "h6"] as const).map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              className={`${styles.propBtn} ${styles.propBtnDanger}`}
              onClick={() =>
                dispatch({ type: "REMOVE_HEADER", blockId: selectedBlockId })
              }
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.propRow}>
          <button
            className={styles.propBtn}
            onClick={() =>
              dispatch({ type: "ADD_HEADER", blockId: selectedBlockId })
            }
          >
            + Add Header
          </button>
        </div>
      )}

      {/* 1. Spacing — Box Model (Margin + Padding) */}
      <BoxModelEditor
        marginTop={(style.marginTop as string) ?? ""}
        marginRight={(style.marginRight as string) ?? ""}
        marginBottom={(style.marginBottom as string) ?? ""}
        marginLeft={(style.marginLeft as string) ?? ""}
        paddingTop={(style.paddingTop as string) ?? ""}
        paddingRight={(style.paddingRight as string) ?? ""}
        paddingBottom={(style.paddingBottom as string) ?? ""}
        paddingLeft={(style.paddingLeft as string) ?? ""}
        defaultMarginTop={defaults.marginTop}
        defaultMarginRight={defaults.marginRight}
        defaultMarginBottom={defaults.marginBottom}
        defaultMarginLeft={defaults.marginLeft}
        defaultPaddingTop={defaults.paddingTop}
        defaultPaddingRight={defaults.paddingRight}
        defaultPaddingBottom={defaults.paddingBottom}
        defaultPaddingLeft={defaults.paddingLeft}
        onMarginChange={(side, value) => {
          const key = `margin${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
        onPaddingChange={(side, value) => {
          const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
      />

      {/* 2. Colors */}
      <div className={styles.themeSectionTitle}>Colors</div>
      <ColorPropRow
        label="Background"
        value={style.backgroundColor as string | undefined}
        fallback="#ffffff"
        onChange={(v) => updateStyle({ backgroundColor: v })}
        onClear={() => clearStyle("backgroundColor")}
        palette={theme.palette}
      />
      <ColorPropRow
        label="Text color"
        value={style.color as string | undefined}
        fallback="#000000"
        onChange={(v) => updateStyle({ color: v })}
        onClear={() => clearStyle("color")}
        palette={theme.palette}
      />

      {/* 3. Typography */}
      <div className={styles.themeSectionTitle}>Typography</div>

      {/* Font family */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font family</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <select
            className={styles.propSelect}
            value={(style.fontFamily as string) ?? ""}
            onChange={(e) => updateStyle({ fontFamily: e.target.value || undefined })}
          >
            <option value="">inherit</option>
            {FONT_PRESETS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {style.fontFamily && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontFamily")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Font size */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font size</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={(style.fontSize as string) ?? ""}
            placeholder="0"
            onChange={(v) => updateStyle({ fontSize: v })}
          />
          {style.fontSize && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontSize")} title="Clear">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Font weight */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font weight</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className={styles.toggleGroup}>
            <button
              className={`${styles.toggleBtn} ${!style.fontWeight || style.fontWeight === "normal" ? styles.toggleActive : ""}`}
              onClick={() => updateStyle({ fontWeight: "normal" })}
            >
              Normal
            </button>
            <button
              className={`${styles.toggleBtn} ${style.fontWeight === "bold" ? styles.toggleActive : ""}`}
              onClick={() => updateStyle({ fontWeight: "bold" })}
            >
              Bold
            </button>
          </div>
          {style.fontWeight && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontWeight")} title="Clear">
              ×
            </button>
          )}
          {!style.fontWeight && <span className={styles.inheritLabel}>inherit</span>}
        </div>
      </div>

      {/* Line height */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Line height</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            className={styles.propInput}
            style={{ width: "auto", flex: 1 }}
            value={(style.lineHeight as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ lineHeight: e.target.value })}
          />
          {style.lineHeight && (
            <button className={styles.clearBtn} onClick={() => clearStyle("lineHeight")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Letter spacing */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Letter spacing</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="text"
            className={styles.propInput}
            style={{ width: "auto", flex: 1 }}
            value={(style.letterSpacing as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ letterSpacing: e.target.value || undefined })}
          />
          {style.letterSpacing && (
            <button className={styles.clearBtn} onClick={() => clearStyle("letterSpacing")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Text transform */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text transform</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <select
            className={styles.propSelect}
            value={(style.textTransform as string) ?? "none"}
            onChange={(e) => {
              const val = e.target.value;
              updateStyle({ textTransform: val === "none" ? undefined : val });
            }}
          >
            {TEXT_TRANSFORM_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {style.textTransform && (
            <button className={styles.clearBtn} onClick={() => clearStyle("textTransform")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* 4. Text Layout */}
      <div className={styles.themeSectionTitle}>Text Layout</div>

      {/* Text align */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text align</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className={styles.toggleGroup}>
            {(["left", "center", "right", "justify"] as const).map((align) => (
              <button
                key={align}
                className={`${styles.toggleBtn} ${style.textAlign === align ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ textAlign: align })}
                title={align}
              >
                {align[0].toUpperCase()}
              </button>
            ))}
          </div>
          {style.textAlign && (
            <button className={styles.clearBtn} onClick={() => clearStyle("textAlign")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* 5 & 6. Borders + Border Radius */}
      <BorderControls style={style} updateStyle={updateStyle} clearStyle={clearStyle} />

      {/* 7. Content-specific — Bullet styles */}
      {block.content.type === "bullets" && (() => {
        const hasOverride = !!block.content.levels;
        // Effective levels: per-block override, or theme fallback
        const effectiveLevels: BulletLevel[] = block.content.levels ?? theme.bullets ?? [];
        const maxUsedLevel = Math.max(0, ...block.content.items.map(i => i.level ?? 0));
        const displayLevels = Math.max(effectiveLevels.length, maxUsedLevel + 1, 1);

        const updateLevel = (levelIndex: number, patch: Partial<BulletLevel>) => {
          // When first editing, copy theme levels as the starting point
          const newLevels = [...effectiveLevels];
          // Extend array if needed
          while (newLevels.length <= levelIndex) {
            newLevels.push({});
          }
          newLevels[levelIndex] = { ...newLevels[levelIndex], ...patch };
          dispatch({ type: "UPDATE_BULLET_LEVELS", blockId: selectedBlockId, levels: newLevels });
        };

        // eslint-disable-next-line react-hooks/rules-of-hooks
        const colorInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

        const MARKER_PRESETS = [
          { label: "None", value: "" },
          { label: "\u2022 Bullet", value: "\u2022" },
          { label: "\u2013 Dash", value: "\u2013" },
          { label: "\u25B8 Triangle", value: "\u25B8" },
          { label: "\u25E6 Circle", value: "\u25E6" },
          { label: "\u25AA Square", value: "\u25AA" },
          { label: "\u2605 Star", value: "\u2605" },
          { label: "\u2192 Arrow", value: "\u2192" },
        ];

        return (
          <>
            <div className={styles.themeSectionTitle}>
              Bullet Styles
              {!hasOverride && <span className={styles.inheritLabel} style={{ marginLeft: 6, textTransform: "none" }}>from theme</span>}
            </div>
            {Array.from({ length: displayLevels }, (_, i) => {
              const lvl = effectiveLevels[i] ?? {};
              return (
                <div key={i} className={styles.propRow}>
                  <label className={styles.propLabel}>Level {i + 1}</label>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                    <select
                      className={styles.propSelect}
                      style={{ width: "auto", flex: 1 }}
                      value={lvl.char ?? ""}
                      onChange={(e) => updateLevel(i, { char: e.target.value || undefined })}
                    >
                      {MARKER_PRESETS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                    <SpacingInput
                      compact
                      value={(lvl.style?.paddingLeft as string) ?? ""}
                      placeholder="0"
                      onChange={(v) => updateLevel(i, { style: { ...lvl.style, paddingLeft: v } })}
                    />
                    <SpacingInput
                      compact
                      value={(lvl.style?.gap as string) ?? ""}
                      placeholder="0"
                      onChange={(v) => updateLevel(i, { style: { ...lvl.style, gap: v } })}
                    />
                    {lvl.style?.color ? (
                      <>
                        <input
                          type="color"
                          className={styles.colorInput}
                          value={lvl.style.color as string}
                          onChange={(e) => updateLevel(i, { style: { ...lvl.style, color: e.target.value } })}
                        />
                        <button
                          className={styles.clearBtn}
                          onClick={() => {
                            const newStyle = { ...lvl.style };
                            delete (newStyle as Record<string, unknown>).color;
                            updateLevel(i, { style: newStyle });
                          }}
                          title="Clear color"
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.colorSwatchBtn}
                          onClick={() => colorInputRefs.current[i]?.click()}
                          title="Set color"
                        >
                          +
                        </button>
                        <input
                          ref={(el) => { colorInputRefs.current[i] = el; }}
                          type="color"
                          className={styles.colorSwatchHiddenInput}
                          value="#000000"
                          onChange={(e) => updateLevel(i, { style: { ...lvl.style, color: e.target.value } })}
                        />
                      </>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                    <span className={styles.inheritLabel}>indent</span>
                    <span className={styles.inheritLabel}>gap</span>
                    <span className={styles.inheritLabel}>{lvl.style?.color ? "color" : "inherit"}</span>
                  </div>
                </div>
              );
            })}
            <button
              className={styles.propBtn}
              disabled={effectiveLevels.length >= 6}
              onClick={() => {
                const newLevels = [...effectiveLevels, { char: "\u2022" }];
                dispatch({ type: "UPDATE_BULLET_LEVELS", blockId: selectedBlockId, levels: newLevels });
              }}
            >
              + Add Level{effectiveLevels.length >= 6 ? " (max)" : ""}
            </button>
          </>
        );
      })()}
    </div>
  );
}
