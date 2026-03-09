"use client";

import { useEditorRequired, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

const SIDES = ["top", "right", "bottom", "left"] as const;

type MarginKey = "marginTop" | "marginRight" | "marginBottom" | "marginLeft";
type PaddingKey = "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft";

export default function BlockStylePanel() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();

  if (!selectedBlockId) return null;

  const block = findBlock(resume.blocks, selectedBlockId);
  if (!block) return null;

  const style = block.style ?? {};

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_BLOCK_STYLE", blockId: selectedBlockId, style: patch });
  };

  return (
    <div className={styles.themePanel}>
      <div className={styles.themeSectionTitle}>{getBlockLabel(block)}</div>

      {/* Margin */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Margin</label>
        <div className={styles.marginGrid}>
          {SIDES.map((side) => {
            const key = `margin${side[0].toUpperCase()}${side.slice(1)}` as MarginKey;
            return (
              <div key={side} className={styles.marginField}>
                <span className={styles.marginLabel}>{side[0].toUpperCase()}</span>
                <input
                  className={styles.propInput}
                  style={{ width: 52 }}
                  value={(style[key] as string) ?? ""}
                  placeholder="0"
                  onChange={(e) => updateStyle({ [key]: e.target.value })}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Padding */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Padding</label>
        <div className={styles.marginGrid}>
          {SIDES.map((side) => {
            const key = `padding${side[0].toUpperCase()}${side.slice(1)}` as PaddingKey;
            return (
              <div key={side} className={styles.marginField}>
                <span className={styles.marginLabel}>{side[0].toUpperCase()}</span>
                <input
                  className={styles.propInput}
                  style={{ width: 52 }}
                  value={(style[key] as string) ?? ""}
                  placeholder="0"
                  onChange={(e) => updateStyle({ [key]: e.target.value })}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Background color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={(style.backgroundColor as string) ?? "#ffffff"}
          onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
        />
      </div>

      {/* Font size override */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font size</label>
        <input
          className={styles.propInput}
          value={(style.fontSize as string) ?? ""}
          placeholder="inherit"
          onChange={(e) => updateStyle({ fontSize: e.target.value })}
        />
      </div>

      {/* Color override */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={(style.color as string) ?? "#000000"}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
      </div>

      {/* Font weight */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font weight</label>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${style.fontWeight !== "bold" ? styles.toggleActive : ""}`}
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
      </div>
    </div>
  );
}
