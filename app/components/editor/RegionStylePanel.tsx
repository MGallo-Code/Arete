"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
import BoxModelEditor from "./BoxModelEditor";
import styles from "./editor.module.css";

export default function RegionStylePanel() {
  const { resume, selectedRegionId, dispatch } = useEditorRequired();

  if (!selectedRegionId) return null;

  const regionStyle = resume.template.regionStyles[selectedRegionId] ?? {};

  const updateStyle = (patch: Record<string, string | undefined>) => {
    dispatch({ type: "UPDATE_REGION_STYLE", regionId: selectedRegionId, style: patch });
  };

  const clearStyle = (key: string) => {
    const newStyle = { ...regionStyle };
    delete (newStyle as Record<string, unknown>)[key];
    dispatch({ type: "SET_REGION_STYLE", regionId: selectedRegionId, style: newStyle });
  };

  return (
    <div className={styles.themePanel}>
      <div className={styles.themeSectionTitle}>Region: {selectedRegionId}</div>

      {/* Background color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Background</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="color"
            className={styles.colorInput}
            value={(regionStyle.backgroundColor as string) || "#ffffff"}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
          />
          {regionStyle.backgroundColor ? (
            <button className={styles.clearBtn} onClick={() => clearStyle("backgroundColor")} title="Clear">
              ×
            </button>
          ) : (
            <span className={styles.inheritLabel}>inherit</span>
          )}
        </div>
      </div>

      {/* Text color */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Text color</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="color"
            className={styles.colorInput}
            value={(regionStyle.color as string) || "#000000"}
            onChange={(e) => updateStyle({ color: e.target.value })}
          />
          {regionStyle.color ? (
            <button className={styles.clearBtn} onClick={() => clearStyle("color")} title="Clear">
              ×
            </button>
          ) : (
            <span className={styles.inheritLabel}>inherit</span>
          )}
        </div>
      </div>

      {/* Box Model (Margin + Padding) */}
      <BoxModelEditor
        marginTop={(regionStyle.marginTop as string) ?? ""}
        marginRight={(regionStyle.marginRight as string) ?? ""}
        marginBottom={(regionStyle.marginBottom as string) ?? ""}
        marginLeft={(regionStyle.marginLeft as string) ?? ""}
        paddingTop={(regionStyle.paddingTop as string) ?? ""}
        paddingRight={(regionStyle.paddingRight as string) ?? ""}
        paddingBottom={(regionStyle.paddingBottom as string) ?? ""}
        paddingLeft={(regionStyle.paddingLeft as string) ?? ""}
        onMarginChange={(side, value) => {
          const key = `margin${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
        onPaddingChange={(side, value) => {
          const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
      />

      {/* Font size */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font size</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            className={styles.propInput}
            style={{ width: "auto", flex: 1 }}
            value={(regionStyle.fontSize as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ fontSize: e.target.value })}
          />
          {regionStyle.fontSize && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontSize")} title="Clear">
              ×
            </button>
          )}
        </div>
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
