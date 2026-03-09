"use client";

import { useMemo } from "react";
import { useEditorRequired } from "../../contexts/EditorContext";
import { FONT_PRESETS } from "../../data/constants";
import { parseShorthand } from "../../utils/cssUtils";
import BorderControls from "./BorderControls";
import BoxModelEditor from "./BoxModelEditor";
import ColorPropRow from "./ColorPropRow";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;

export default function RegionStylePanel() {
  const { resume, selectedRegionId, dispatch } = useEditorRequired();

  if (!selectedRegionId) return null;

  const theme = resume.template.theme;
  const regionStyle = resume.template.regionStyles[selectedRegionId] ?? {};

  // Parse shorthand padding to show as defaults when longhand isn't set
  const defaults = useMemo(() => {
    const result: Record<string, string> = {};

    if (regionStyle.padding && typeof regionStyle.padding === "string") {
      const parsed = parseShorthand(regionStyle.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }

    return result;
  }, [regionStyle.padding]);

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

      {/* 1. Spacing — Box Model (Margin + Padding) */}
      <BoxModelEditor
        hideMargin
        marginTop=""
        marginRight=""
        marginBottom=""
        marginLeft=""
        paddingTop={(regionStyle.paddingTop as string) ?? ""}
        paddingRight={(regionStyle.paddingRight as string) ?? ""}
        paddingBottom={(regionStyle.paddingBottom as string) ?? ""}
        paddingLeft={(regionStyle.paddingLeft as string) ?? ""}
        defaultPaddingTop={defaults.paddingTop}
        defaultPaddingRight={defaults.paddingRight}
        defaultPaddingBottom={defaults.paddingBottom}
        defaultPaddingLeft={defaults.paddingLeft}
        onMarginChange={() => {}}
        onPaddingChange={(side, value) => {
          const key = `padding${side[0].toUpperCase()}${side.slice(1)}`;
          updateStyle({ [key]: value });
        }}
      />

      {/* 2. Colors */}
      <div className={styles.themeSectionTitle}>Colors</div>
      <ColorPropRow
        label="Background"
        value={regionStyle.backgroundColor as string | undefined}
        fallback="#ffffff"
        onChange={(v) => updateStyle({ backgroundColor: v })}
        onClear={() => clearStyle("backgroundColor")}
        palette={theme.palette}
      />
      <ColorPropRow
        label="Text color"
        value={regionStyle.color as string | undefined}
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

      {/* Font weight */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Font weight</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className={styles.toggleGroup}>
            <button
              className={`${styles.toggleBtn} ${!regionStyle.fontWeight || regionStyle.fontWeight === "normal" ? styles.toggleActive : ""}`}
              onClick={() => updateStyle({ fontWeight: "normal" })}
            >
              Normal
            </button>
            <button
              className={`${styles.toggleBtn} ${regionStyle.fontWeight === "bold" ? styles.toggleActive : ""}`}
              onClick={() => updateStyle({ fontWeight: "bold" })}
            >
              Bold
            </button>
          </div>
          {regionStyle.fontWeight && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontWeight")} title="Clear">
              ×
            </button>
          )}
          {!regionStyle.fontWeight && <span className={styles.inheritLabel}>inherit</span>}
        </div>
      </div>

      {/* Line height */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Line height</label>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            className={styles.propInput}
            style={{ width: "auto", flex: 1 }}
            value={(regionStyle.lineHeight as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ lineHeight: e.target.value })}
          />
          {regionStyle.lineHeight && (
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
            value={(regionStyle.letterSpacing as string) ?? ""}
            placeholder="inherit"
            onChange={(e) => updateStyle({ letterSpacing: e.target.value || undefined })}
          />
          {regionStyle.letterSpacing && (
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
            value={(regionStyle.textTransform as string) ?? "none"}
            onChange={(e) => {
              const val = e.target.value;
              updateStyle({ textTransform: val === "none" ? undefined : val });
            }}
          >
            {TEXT_TRANSFORM_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {regionStyle.textTransform && (
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
                className={`${styles.toggleBtn} ${regionStyle.textAlign === align ? styles.toggleActive : ""}`}
                onClick={() => updateStyle({ textAlign: align })}
                title={align}
              >
                {align[0].toUpperCase()}
              </button>
            ))}
          </div>
          {regionStyle.textAlign && (
            <button className={styles.clearBtn} onClick={() => clearStyle("textAlign")} title="Clear">×</button>
          )}
        </div>
      </div>

      {/* Align items */}
      <div className={styles.propRow}>
        <label className={styles.propLabel}>Align items</label>
        <select
          className={styles.propSelect}
          value={(regionStyle.alignItems as string) ?? ""}
          onChange={(e) => updateStyle({ alignItems: e.target.value || undefined })}
        >
          <option value="">Default</option>
          <option value="flex-start">Top</option>
          <option value="center">Center</option>
          <option value="flex-end">Bottom</option>
          <option value="stretch">Stretch</option>
        </select>
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

      {/* 5 & 6. Borders + Border Radius */}
      <BorderControls style={regionStyle} updateStyle={updateStyle} clearStyle={clearStyle} />
    </div>
  );
}
