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
  defaults?: Record<string, string>;
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
  defaults = {},
  showTextAlign = true,
  showTextTransform = true,
  showLineHeight = true,
  showLetterSpacing = true,
  showFontStyle = true,
  showTextDecoration = true,
}: TypographyControlsProps) {
  /** Short label for an inherited font family */
  const inheritedFontLabel = defaults.fontFamily
    ? `Inherit (${defaults.fontFamily.split(",")[0].trim()})`
    : "Inherit";
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
            <option value="">{inheritedFontLabel}</option>
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
              placeholder={defaults.fontSize || "Inherit"}
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
                placeholder={defaults.lineHeight || "Inherit"}
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
            {(() => {
              const effective = (style.fontWeight as string) || defaults.fontWeight || "normal";
              return (
                <div className={styles.toggleGroup}>
                  <button
                    className={`${styles.toggleBtn} ${effective === "normal" ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.fontWeight && style.fontWeight !== "normal") updateStyle({ fontWeight: "normal" });
                    }}
                  >
                    Normal
                  </button>
                  <button
                    className={`${styles.toggleBtn} ${effective === "bold" ? styles.toggleActive : ""}`}
                    onClick={() => {
                      if (style.fontWeight !== "bold") updateStyle({ fontWeight: "bold" });
                    }}
                  >
                    Bold
                  </button>
                </div>
              );
            })()}
            {style.fontWeight && (
              <button className={styles.clearBtn} onClick={() => clearStyle("fontWeight")} title="Clear"><X size={12} /></button>
            )}
          </div>
        </div>
        {showFontStyle && (
          <div>
            <div className={styles.propertyPairLabel}>Font style</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {(() => {
                const effective = (style.fontStyle as string) || defaults.fontStyle || "normal";
                return (
                  <div className={styles.toggleGroup}>
                    <button
                      className={`${styles.toggleBtn} ${effective === "normal" ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.fontStyle && style.fontStyle !== "normal") updateStyle({ fontStyle: "normal" });
                      }}
                    >
                      Normal
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${effective === "italic" ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.fontStyle !== "italic") updateStyle({ fontStyle: "italic" });
                      }}
                    >
                      Italic
                    </button>
                  </div>
                );
              })()}
              {style.fontStyle && (
                <button className={styles.clearBtn} onClick={() => clearStyle("fontStyle")} title="Clear"><X size={12} /></button>
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
                placeholder={defaults.letterSpacing || "0"}
                units={["em", "px", "pt", "rem"]}
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
                {(["left", "center", "right", "justify"] as const).map((align) => {
                  const effective = (style.textAlign as string) || defaults.textAlign || "left";
                  return (
                    <button
                      key={align}
                      className={`${styles.toggleBtn} ${effective === align ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.textAlign !== align) updateStyle({ textAlign: align });
                      }}
                      title={align}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  );
                })}
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
          {showTextTransform && (() => {
            const effective = (style.textTransform as string) || defaults.textTransform || "none";
            return (
              <div>
                <div className={styles.propertyPairLabel}>Transform</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div className={styles.toggleGroup}>
                    {TEXT_TRANSFORM_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        className={`${styles.toggleBtn} ${effective === opt ? styles.toggleActive : ""}`}
                        onClick={() => {
                          if (style.textTransform !== opt) {
                            updateStyle({ textTransform: opt === "none" ? undefined : opt });
                          }
                        }}
                        title={opt}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                  {style.textTransform && (
                    <button className={styles.clearBtn} onClick={() => clearStyle("textTransform")} title="Clear"><X size={12} /></button>
                  )}
                </div>
              </div>
            );
          })()}
          {showTextDecoration && (() => {
            const effective = (style.textDecoration as string) || defaults.textDecoration || "none";
            return (
              <div>
                <div className={styles.propertyPairLabel}>Decoration</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div className={styles.toggleGroup}>
                    <button
                      className={`${styles.toggleBtn} ${effective === "none" ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.textDecoration !== "none") updateStyle({ textDecoration: "none" });
                      }}
                      title="None"
                    >
                      None
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${effective === "underline" ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.textDecoration !== "underline") updateStyle({ textDecoration: "underline" });
                      }}
                      title="Underline"
                    >
                      Underline
                    </button>
                    <button
                      className={`${styles.toggleBtn} ${effective === "line-through" ? styles.toggleActive : ""}`}
                      onClick={() => {
                        if (style.textDecoration !== "line-through") updateStyle({ textDecoration: "line-through" });
                      }}
                      title="Strikethrough"
                    >
                      Strike
                    </button>
                  </div>
                  {style.textDecoration && (
                    <button className={styles.clearBtn} onClick={() => clearStyle("textDecoration")} title="Clear"><X size={12} /></button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </>
  );
}
