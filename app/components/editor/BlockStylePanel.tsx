"use client";

import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import BoxModelEditor from "./BoxModelEditor";
import styles from "./editor.module.css";

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
    <div className={styles.themePanel}>
      <div className={styles.themeSectionTitle}>{getBlockLabel(block)}</div>

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
          <input
            className={styles.propInput}
            style={{ width: "auto", flex: 1 }}
            value={(style.fontSize as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ fontSize: e.target.value })}
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
    </div>
  );
}
