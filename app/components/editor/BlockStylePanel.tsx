"use client";

import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import type { BulletLevel } from "../../models";
import { FONT_PRESETS } from "../../data/constants";
import BoxModelEditor from "./BoxModelEditor";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

export default function BlockStylePanel() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();
  const theme = resume.template.theme;

  if (!selectedBlockId) return null;

  const block = findBlock(resume.blocks, selectedBlockId);
  if (!block) return null;

  const style = block.style ?? {};

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

      {/* Box Model (Margin + Padding) */}
      <BoxModelEditor
        marginTop={(style.marginTop as string) ?? ""}
        marginRight={(style.marginRight as string) ?? ""}
        marginBottom={(style.marginBottom as string) ?? ""}
        marginLeft={(style.marginLeft as string) ?? ""}
        paddingTop={(style.paddingTop as string) ?? ""}
        paddingRight={(style.paddingRight as string) ?? ""}
        paddingBottom={(style.paddingBottom as string) ?? ""}
        paddingLeft={(style.paddingLeft as string) ?? ""}
        onMarginChange={(side, value) => {
          const key = `margin${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
        onPaddingChange={(side, value) => {
          const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
      />

      {/* Background color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background color</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="color"
            className={styles.colorInput}
            value={(style.backgroundColor as string) || "#ffffff"}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
          />
          {style.backgroundColor ? (
            <button className={styles.clearBtn} onClick={() => clearStyle("backgroundColor")} title="Clear">
              ×
            </button>
          ) : (
            <span className={styles.inheritLabel}>inherit</span>
          )}
        </div>
      </div>

      {/* Font size override */}
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

      {/* Color override */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Color</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="color"
            className={styles.colorInput}
            value={(style.color as string) || "#000000"}
            onChange={(e) => updateStyle({ color: e.target.value })}
          />
          {style.color ? (
            <button className={styles.clearBtn} onClick={() => clearStyle("color")} title="Clear">
              ×
            </button>
          ) : (
            <span className={styles.inheritLabel}>inherit</span>
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

      {/* Gap */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Gap</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={(style.gap as string) ?? ""}
            placeholder="0"
            onChange={(v) => updateStyle({ gap: v })}
          />
          {style.gap && (
            <button className={styles.clearBtn} onClick={() => clearStyle("gap")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Bullet styles — only for bullet blocks */}
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
                  </div>
                  <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
                    <span className={styles.inheritLabel}>indent</span>
                    <span className={styles.inheritLabel}>gap</span>
                  </div>
                </div>
              );
            })}
            <button
              className={styles.propBtn}
              onClick={() => {
                const newLevels = [...effectiveLevels, { char: "\u2022" }];
                dispatch({ type: "UPDATE_BULLET_LEVELS", blockId: selectedBlockId, levels: newLevels });
              }}
            >
              + Add Level
            </button>
          </>
        );
      })()}
    </div>
  );
}
