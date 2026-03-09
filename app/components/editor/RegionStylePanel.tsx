"use client";

import { useRef, useMemo } from "react";
import { useEditorRequired } from "../../contexts/EditorContext";
import { FONT_PRESETS } from "../../data/constants";
import { parseShorthand } from "../../utils/cssUtils";
import BoxModelEditor from "./BoxModelEditor";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

function ColorPropRow({
  label,
  value,
  fallback,
  onChange,
  onClear,
}: {
  label: string;
  value: string | undefined;
  fallback: string;
  onChange: (color: string) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {value ? (
          <>
            <input
              type="color"
              className={styles.colorInput}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <button className={styles.clearBtn} onClick={onClear} title="Clear">
              ×
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.colorSwatchBtn}
              onClick={() => inputRef.current?.click()}
              title={`Set ${label.toLowerCase()}`}
            >
              +
            </button>
            <input
              ref={inputRef}
              type="color"
              className={styles.colorSwatchHiddenInput}
              value={fallback}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className={styles.inheritLabel}>inherit</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegionStylePanel() {
  const { resume, selectedRegionId, dispatch } = useEditorRequired();

  if (!selectedRegionId) return null;

  const regionStyle = resume.template.regionStyles[selectedRegionId] ?? {};

  // Parse shorthand margin/padding to show as defaults when longhand isn't set
  const defaults = useMemo(() => {
    const result: Record<string, string> = {};

    if (regionStyle.margin && typeof regionStyle.margin === "string") {
      const parsed = parseShorthand(regionStyle.margin as string);
      result.marginTop = parsed.top;
      result.marginRight = parsed.right;
      result.marginBottom = parsed.bottom;
      result.marginLeft = parsed.left;
    }
    if (regionStyle.padding && typeof regionStyle.padding === "string") {
      const parsed = parseShorthand(regionStyle.padding as string);
      result.paddingTop = parsed.top;
      result.paddingRight = parsed.right;
      result.paddingBottom = parsed.bottom;
      result.paddingLeft = parsed.left;
    }

    return result;
  }, [regionStyle.margin, regionStyle.padding]);

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
      <ColorPropRow
        label="Background"
        value={regionStyle.backgroundColor as string | undefined}
        fallback="#ffffff"
        onChange={(v) => updateStyle({ backgroundColor: v })}
        onClear={() => clearStyle("backgroundColor")}
      />

      {/* Text color */}
      <ColorPropRow
        label="Text color"
        value={regionStyle.color as string | undefined}
        fallback="#000000"
        onChange={(v) => updateStyle({ color: v })}
        onClear={() => clearStyle("color")}
      />

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
          <option value="">Default</option>
          <option value="flex-start">Top</option>
          <option value="center">Center</option>
          <option value="flex-end">Bottom</option>
          <option value="stretch">Stretch</option>
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

      {/* Border right */}
      {(() => {
        const borderVal = (regionStyle.borderRight as string) ?? "";
        const match = borderVal.match(/^(\d+(?:\.\d+)?)(px|pt)\s+solid\s+(#[0-9a-fA-F]{3,8})$/);
        const borderWidth = match ? `${match[1]}${match[2]}` : "";
        const borderColor = match ? match[3] : "#000000";
        return (
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Border right</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <SpacingInput
                compact
                value={borderWidth}
                placeholder="0"
                onChange={(v) => {
                  if (v) {
                    updateStyle({ borderRight: `${v} solid ${borderColor}` });
                  } else {
                    clearStyle("borderRight");
                  }
                }}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={borderColor}
                onChange={(e) => {
                  const w = borderWidth || "1px";
                  updateStyle({ borderRight: `${w} solid ${e.target.value}` });
                }}
              />
              {regionStyle.borderRight ? (
                <button className={styles.clearBtn} onClick={() => clearStyle("borderRight")} title="Clear">×</button>
              ) : (
                <span className={styles.inheritLabel}>none</span>
              )}
            </div>
          </div>
        );
      })()}

      {/* Border bottom */}
      {(() => {
        const borderVal = (regionStyle.borderBottom as string) ?? "";
        const match = borderVal.match(/^(\d+(?:\.\d+)?)(px|pt)\s+solid\s+(#[0-9a-fA-F]{3,8})$/);
        const borderWidth = match ? `${match[1]}${match[2]}` : "";
        const borderColor = match ? match[3] : "#000000";
        return (
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Border bottom</label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <SpacingInput
                compact
                value={borderWidth}
                placeholder="0"
                onChange={(v) => {
                  if (v) {
                    updateStyle({ borderBottom: `${v} solid ${borderColor}` });
                  } else {
                    clearStyle("borderBottom");
                  }
                }}
              />
              <input
                type="color"
                className={styles.colorInput}
                value={borderColor}
                onChange={(e) => {
                  const w = borderWidth || "1px";
                  updateStyle({ borderBottom: `${w} solid ${e.target.value}` });
                }}
              />
              {regionStyle.borderBottom ? (
                <button className={styles.clearBtn} onClick={() => clearStyle("borderBottom")} title="Clear">×</button>
              ) : (
                <span className={styles.inheritLabel}>none</span>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
