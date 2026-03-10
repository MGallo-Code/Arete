"use client";

import { useRef } from "react";
import type { BulletLevel, Content } from "../../models";
import type { EditorAction } from "../../contexts/EditorContext";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

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

interface BulletStyleControlsProps {
  blockId: string;
  content: Content & { type: "bullets" };
  effectiveLevels: BulletLevel[];
  dispatch: (action: EditorAction) => void;
}

export default function BulletStyleControls({
  blockId,
  content,
  effectiveLevels,
  dispatch,
}: BulletStyleControlsProps) {
  const colorInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const hasOverride = !!content.levels;
  const maxUsedLevel = Math.max(0, ...content.items.map((i) => i.level ?? 0));
  const displayLevels = Math.max(effectiveLevels.length, maxUsedLevel + 1, 1);

  const updateLevel = (levelIndex: number, patch: Partial<BulletLevel>) => {
    const newLevels = [...effectiveLevels];
    while (newLevels.length <= levelIndex) {
      newLevels.push({});
    }
    newLevels[levelIndex] = { ...newLevels[levelIndex], ...patch };
    dispatch({ type: "UPDATE_BULLET_LEVELS", blockId, levels: newLevels });
  };

  return (
    <>
      {!hasOverride && (
        <div style={{ marginBottom: 8 }}>
          <span className={styles.inheritLabel}>Using theme defaults</span>
        </div>
      )}
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
                title="Marker char"
              >
                {MARKER_PRESETS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={styles.propInput}
                style={{ width: "auto", flex: 1 }}
                value={lvl.image ?? ""}
                placeholder="Image URL"
                title="Marker image URL (overrides char)"
                onChange={(e) => updateLevel(i, { image: e.target.value || undefined })}
              />
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
                    ref={(el) => {
                      colorInputRefs.current[i] = el;
                    }}
                    type="color"
                    className={styles.colorSwatchHiddenInput}
                    value="#000000"
                    onChange={(e) => updateLevel(i, { style: { ...lvl.style, color: e.target.value } })}
                  />
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <span className={styles.inheritLabel}>marker</span>
              <span className={styles.inheritLabel}>{lvl.image ? "image \u2713" : "image"}</span>
              <span className={styles.inheritLabel}>indent</span>
              <span className={styles.inheritLabel}>gap</span>
              <span className={styles.inheritLabel}>{lvl.style?.color ? "color" : "Inherit"}</span>
            </div>
          </div>
        );
      })}
      <button
        className={styles.propBtn}
        disabled={effectiveLevels.length >= 6}
        onClick={() => {
          const newLevels = [...effectiveLevels, { char: "\u2022" }];
          dispatch({ type: "UPDATE_BULLET_LEVELS", blockId, levels: newLevels });
        }}
      >
        + Add Level{effectiveLevels.length >= 6 ? " (max)" : ""}
      </button>
    </>
  );
}
