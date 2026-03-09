"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

const SIDES = ["top", "right", "bottom", "left"] as const;

type PaddingKey = "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft";

export default function RegionStylePanel() {
  const { resume, selectedRegionId, dispatch } = useEditorRequired();

  if (!selectedRegionId) return null;

  const regionStyle = resume.template.regionStyles[selectedRegionId] ?? {};

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_REGION_STYLE", regionId: selectedRegionId, style: patch });
  };

  return (
    <div className={styles.themePanel}>
      <div className={styles.themeSectionTitle}>Region: {selectedRegionId}</div>

      {/* Background color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background</label>
        <input
          type="color"
          className={styles.colorInput}
          value={(regionStyle.backgroundColor as string) ?? "#ffffff"}
          onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
        />
      </div>

      {/* Text color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text color</label>
        <input
          type="color"
          className={styles.colorInput}
          value={(regionStyle.color as string) ?? "#000000"}
          onChange={(e) => updateStyle({ color: e.target.value })}
        />
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
                  value={(regionStyle[key] as string) ?? ""}
                  placeholder="0"
                  onChange={(e) => updateStyle({ [key]: e.target.value })}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Font size */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font size</label>
        <input
          className={styles.propInput}
          value={(regionStyle.fontSize as string) ?? ""}
          placeholder="inherit"
          onChange={(e) => updateStyle({ fontSize: e.target.value })}
        />
      </div>

      {/* Flex/alignment */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Align items</label>
        <select
          className={styles.propSelect}
          value={(regionStyle.alignItems as string) ?? ""}
          onChange={(e) => updateStyle({ alignItems: e.target.value || undefined })}
        >
          <option value="">default</option>
          <option value="flex-start">start</option>
          <option value="center">center</option>
          <option value="flex-end">end</option>
          <option value="stretch">stretch</option>
        </select>
      </div>
    </div>
  );
}
