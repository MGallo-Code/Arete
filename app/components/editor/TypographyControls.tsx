"use client";

import type { Style } from "../../models";
import { FONT_PRESETS } from "../../data/constants";
import { X } from "lucide-react";
import PropertyRow from "./PropertyRow";
import UnitInput from "./UnitInput";
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
  showFontStyle?: boolean;
  showTextDecoration?: boolean;
}

export default function TypographyControls({
  style,
  updateStyle,
  clearStyle,
  showTextAlign = true,
  showTextTransform = true,
  showLineHeight = true,
  showLetterSpacing = true,
  showFontStyle = true,
  showTextDecoration = true,
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
            <button className={styles.clearBtn} onClick={() => clearStyle("fontFamily")} title="Clear"><X size={12} /></button>
          )}
        </div>
      </PropertyRow>

      {/* Font size + Line height paired */}
      <div className={styles.propertyPair}>
        <div>
          <div className={styles.propertyPairLabel}>Font size</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <UnitInput
              value={(style.fontSize as string) ?? ""}
              placeholder="0"
              onChange={(v) => updateStyle({ fontSize: v })}
            />
            {style.fontSize && (
              <button className={styles.clearBtn} onClick={() => clearStyle("fontSize")} title="Clear"><X size={12} /></button>
            )}
          </div>
        </div>
        {showLineHeight && (
          <div>
            <div className={styles.propertyPairLabel}>Line height</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <UnitInput
                value={(style.lineHeight as string) ?? ""}
                placeholder="Inherit"
                allowUnitless
                allowKeywords={["inherit", "normal"]}
                onChange={(v) => updateStyle({ lineHeight: v || undefined })}
              />
              {style.lineHeight && (
                <button className={styles.clearBtn} onClick={() => clearStyle("lineHeight")} title="Clear"><X size={12} /></button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Font weight + Font style paired */}
      <div className={styles.propertyPair}>
        <div>
          <div className={styles.propertyPairLabel}>Font weight</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div className={styles.toggleGroup}>
              <button
                className={`${styles.toggleBtn} ${!style.fontWeight || style.fontWeight === "normal" ? styles.toggleActive : ""}`}
                onClick={() => {
                  if (style.fontWeight && style.fontWeight !== "normal") updateStyle({ fontWeight: "normal" });
                }}
              >
                N
              </button>
              <button
                className={`${styles.toggleBtn} ${style.fontWeight === "bold" ? styles.toggleActive : ""}`}
                onClick={() => {
                  if (style.fontWeight !== "bold") updateStyle({ fontWeight: "bold" });
                }}
              >
                B
              </button>
            </div>
            {style.fontWeight ? (
              <button className={styles.clearBtn} onClick={() => clearStyle("fontWeight")} title="Clear"><X size={12} /></button>
            ) : (
              <span className={styles.inheritLabel}>Inherit</span>
            )}
          </div>
        </div>
        {showFontStyle && (
          <div>
            <div className={styles.propertyPairLabel}>Font style</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleBtn} ${!style.fontStyle || style.fontStyle === "normal" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.fontStyle && style.fontStyle !== "normal") updateStyle({ fontStyle: "normal" });
                  }}
                >
                  N
                </button>
                <button
                  className={`${styles.toggleBtn} ${style.fontStyle === "italic" ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (style.fontStyle !== "italic") updateStyle({ fontStyle: "italic" });
                  }}
                >
                  I
                </button>
              </div>
              {style.fontStyle ? (
                <button className={styles.clearBtn} onClick={() => clearStyle("fontStyle")} title="Clear"><X size={12} /></button>
              ) : (
                <span className={styles.inheritLabel}>Inherit</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Letter spacing + Text align paired */}
      <div className={styles.propertyPair}>
        {showLetterSpacing && (
          <div>
            <div className={styles.propertyPairLabel}>Letter spacing</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <UnitInput
                value={(style.letterSpacing as string) ?? ""}
                placeholder="Inherit"
                allowUnitless
                allowKeywords={["inherit", "normal"]}
                onChange={(v) => updateStyle({ letterSpacing: v || undefined })}
              />
              {style.letterSpacing && (
                <button className={styles.clearBtn} onClick={() => clearStyle("letterSpacing")} title="Clear"><X size={12} /></button>
              )}
            </div>
          </div>
        )}
        {showTextAlign && (
          <div>
            <div className={styles.propertyPairLabel}>Text align</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div className={styles.toggleGroup}>
                {(["left", "center", "right", "justify"] as const).map((align) => (
                  <button
                    key={align}
                    className={`${styles.toggleBtn} ${style.textAlign === align ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.textAlign !== align) updateStyle({ textAlign: align });
                    }}
                    title={align}
                  >
                    {align[0].toUpperCase()}
                  </button>
                ))}
              </div>
              {style.textAlign && (
                <button className={styles.clearBtn} onClick={() => clearStyle("textAlign")} title="Clear"><X size={12} /></button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text transform + Text decoration paired */}
      {(showTextTransform || showTextDecoration) && (
        <div className={styles.propertyPair}>
          {showTextTransform && (
            <div>
              <div className={styles.propertyPairLabel}>Transform</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <select
                  className={styles.propSelect}
                  style={{ flex: 1 }}
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
                  <button className={styles.clearBtn} onClick={() => clearStyle("textTransform")} title="Clear"><X size={12} /></button>
                )}
              </div>
            </div>
          )}
          {showTextDecoration && (
            <div>
              <div className={styles.propertyPairLabel}>Decoration</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className={styles.toggleGroup}>
                  <button
                    className={`${styles.toggleBtn} ${style.textDecoration === "none" ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.textDecoration !== "none") updateStyle({ textDecoration: "none" });
                    }}
                    title="None"
                  >
                    N
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${style.textDecoration === "underline" ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.textDecoration !== "underline") updateStyle({ textDecoration: "underline" });
                    }}
                    title="Underline"
                  >
                    U
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${style.textDecoration === "line-through" ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.textDecoration !== "line-through") updateStyle({ textDecoration: "line-through" });
                    }}
                    title="Strikethrough"
                  >
                    S
                  </button>
                </div>
                {style.textDecoration ? (
                  <button className={styles.clearBtn} onClick={() => clearStyle("textDecoration")} title="Clear"><X size={12} /></button>
                ) : (
                  <span className={styles.inheritLabel}>Inherit</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
