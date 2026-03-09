"use client";

import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import BoxModelEditor from "./BoxModelEditor";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const FONT_PRESETS = [
  { label: "Georgia (serif)", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Inter (sans-serif)", value: "Inter, Helvetica, sans-serif" },
  { label: "Helvetica", value: "Helvetica, Arial, sans-serif" },
  { label: "DM Sans", value: "'DM Sans', Helvetica, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
];

export default function BlockStylePanel() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();

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
    </div>
  );
}
