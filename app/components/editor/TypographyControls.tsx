"use client";

import type { Style } from "../../models";
import { FONT_PRESETS } from "../../data/constants";
import PropertyRow from "./PropertyRow";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

const TEXT_TRANSFORM_OPTIONS = ["none", "uppercase", "lowercase", "capitalize"] as const;

interface TypographyControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (key: string) => void;
  showTextAlign?: boolean;
  showTextTransform?: boolean;
  showLineHeight?: boolean;
  showLetterSpacing?: boolean;
}

export default function TypographyControls({
  style,
  updateStyle,
  clearStyle,
  showTextAlign = true,
  showTextTransform = true,
  showLineHeight = true,
  showLetterSpacing = true,
}: TypographyControlsProps) {
  return (
    <>
      {/* Font family */}
      <PropertyRow label="Font family">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <select
            className={styles.propSelect}
            value={(style.fontFamily as string) ?? ""}
            onChange={(e) => updateStyle({ fontFamily: e.target.value || undefined })}
          >
            <option value="">Inherit</option>
            {FONT_PRESETS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
          {style.fontFamily && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontFamily")} title="Clear">×</button>
          )}
        </div>
      </PropertyRow>

      {/* Font size */}
      <PropertyRow label="Font size">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={(style.fontSize as string) ?? ""}
            placeholder="0"
            onChange={(v) => updateStyle({ fontSize: v })}
          />
          {style.fontSize && (
            <button className={styles.clearBtn} onClick={() => clearStyle("fontSize")} title="Clear">×</button>
          )}
        </div>
      </PropertyRow>

      {/* Font weight */}
      <PropertyRow label="Font weight">
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
            <button className={styles.clearBtn} onClick={() => clearStyle("fontWeight")} title="Clear">×</button>
          )}
          {!style.fontWeight && <span className={styles.inheritLabel}>Inherit</span>}
        </div>
      </PropertyRow>

      {/* Line height */}
      {showLineHeight && (
        <PropertyRow label="Line height">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              className={styles.propInput}
              style={{ width: "auto", flex: 1 }}
              value={(style.lineHeight as string) ?? ""}
              placeholder="Inherit"
              onChange={(e) => updateStyle({ lineHeight: e.target.value })}
            />
            {style.lineHeight && (
              <button className={styles.clearBtn} onClick={() => clearStyle("lineHeight")} title="Clear">×</button>
            )}
          </div>
        </PropertyRow>
      )}

      {/* Letter spacing */}
      {showLetterSpacing && (
        <PropertyRow label="Letter spacing">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="text"
              className={styles.propInput}
              style={{ width: "auto", flex: 1 }}
              value={(style.letterSpacing as string) ?? ""}
              placeholder="Inherit"
              onChange={(e) => updateStyle({ letterSpacing: e.target.value || undefined })}
            />
            {style.letterSpacing && (
              <button className={styles.clearBtn} onClick={() => clearStyle("letterSpacing")} title="Clear">×</button>
            )}
          </div>
        </PropertyRow>
      )}

      {/* Text transform */}
      {showTextTransform && (
        <PropertyRow label="Text transform">
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <select
              className={styles.propSelect}
              value={(style.textTransform as string) ?? "none"}
              onChange={(e) => {
                const val = e.target.value;
                updateStyle({ textTransform: val === "none" ? undefined : val });
              }}
            >
              {TEXT_TRANSFORM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {style.textTransform && (
              <button className={styles.clearBtn} onClick={() => clearStyle("textTransform")} title="Clear">×</button>
            )}
          </div>
        </PropertyRow>
      )}

      {/* Text align */}
      {showTextAlign && (
        <PropertyRow label="Text align">
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
        </PropertyRow>
      )}
    </>
  );
}
