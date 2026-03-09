"use client";

import { useEditorRequired } from "../../contexts/EditorContext";
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
    <div className={styles.selectionPanel}>
      <div className={styles.panelHeader}>
        <div>
          <div className={styles.selectionPanelTitle}>Region</div>
          <div className={styles.panelSubtitle}>{selectedRegionId}</div>
        </div>
      </div>

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
          <SpacingInput
            value={(regionStyle.fontSize as string) ?? ""}
            placeholder="0"
            onChange={(v) => updateStyle({ fontSize: v })}
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

      {/* Font family */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font family</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <select
            className={styles.propSelect}
            value={(regionStyle.fontFamily as string) ?? ""}
            onChange={(e) => updateStyle({ fontFamily: e.target.value || undefined })}
          >
            <option value="">inherit</option>
            {FONT_PRESETS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {regionStyle.fontFamily && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontFamily")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Gap */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Gap</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={(regionStyle.gap as string) ?? ""}
            placeholder="0"
            onChange={(v) => updateStyle({ gap: v })}
          />
          {regionStyle.gap && (
            <button className={styles.clearBtn} onClick={() => clearStyle("gap")} title="Clear">×</button>
          )}
        </div>
      </div>
    </div>
  );
}
