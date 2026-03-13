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
  clearStyle: (...keys: string[]) => void;
  defaults?: Record<string, string>;
  showTextAlign?: boolean;
  showTextTransform?: boolean;
  showLineHeight?: boolean;
  showLetterSpacing?: boolean;
  showFontStyle?: boolean;
  showTextDecoration?: boolean;
}

/** Three-state toggle class: explicit (blue) > inherited (subtle) > inactive (muted) */
function toggleCls(explicit: string | undefined, effective: string, opt: string): string {
  if (explicit === opt) return `${styles.toggleBtn} ${styles.toggleActive}`;
  if (effective === opt) return `${styles.toggleBtn} ${styles.toggleInherited}`;
  return styles.toggleBtn;
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

      {/* Font size + Font weight paired */}
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
        <div>
          <div className={styles.propertyPairLabel}>Font weight</div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {(() => {
              const explicit = style.fontWeight as string | undefined;
              const effective = explicit || defaults.fontWeight || "normal";
              return (
                <div className={styles.toggleGroup}>
                  <button
                    className={toggleCls(explicit, effective, "normal")}
                    onClick={() => { if (explicit !== "normal") updateStyle({ fontWeight: "normal" }); }}
                  >
                    Normal
                  </button>
                  <button
                    className={toggleCls(explicit, effective, "bold")}
                    onClick={() => { if (explicit !== "bold") updateStyle({ fontWeight: "bold" }); }}
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
      </div>

      {/* Font style + Text decoration paired */}
      {(showFontStyle || showTextDecoration) && (
        <div className={styles.propertyPair}>
          {showFontStyle && (
            <div>
              <div className={styles.propertyPairLabel}>Font style</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {(() => {
                  const explicit = style.fontStyle as string | undefined;
                  const effective = explicit || defaults.fontStyle || "normal";
                  return (
                    <div className={styles.toggleGroup}>
                      <button
                        className={toggleCls(explicit, effective, "normal")}
                        onClick={() => { if (explicit !== "normal") updateStyle({ fontStyle: "normal" }); }}
                      >
                        Normal
                      </button>
                      <button
                        className={toggleCls(explicit, effective, "italic")}
                        onClick={() => { if (explicit !== "italic") updateStyle({ fontStyle: "italic" }); }}
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
          {showTextDecoration && (() => {
            const explicit = style.textDecoration as string | undefined;
            const effective = explicit || defaults.textDecoration || "none";
            return (
              <div>
                <div className={styles.propertyPairLabel}>Decoration</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div className={styles.toggleGroup}>
                    <button
                      className={toggleCls(explicit, effective, "none")}
                      onClick={() => { if (explicit !== "none") updateStyle({ textDecoration: "none" }); }}
                      title="None"
                    >
                      None
                    </button>
                    <button
                      className={toggleCls(explicit, effective, "underline")}
                      onClick={() => { if (explicit !== "underline") updateStyle({ textDecoration: "underline" }); }}
                      title="Underline"
                    >
                      Underline
                    </button>
                    <button
                      className={toggleCls(explicit, effective, "line-through")}
                      onClick={() => { if (explicit !== "line-through") updateStyle({ textDecoration: "line-through" }); }}
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

      {/* Line height + Letter spacing paired */}
      {(showLineHeight || showLetterSpacing) && (
        <div className={styles.propertyPair}>
          {showLineHeight && (
            <div>
              <div className={styles.propertyPairLabel}>Line height</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <UnitInput
                  value={(style.lineHeight as string) ?? ""}
                  placeholder={defaults.lineHeight || "Inherit"}
                  units={["em", "pt", "px", "%"]}
                  step={0.05}
                  allowKeywords={["inherit", "normal"]}
                  onChange={(v) => updateStyle({ lineHeight: v || undefined })}
                />
                {style.lineHeight && (
                  <button className={styles.clearBtn} onClick={() => clearStyle("lineHeight")} title="Clear"><X size={12} /></button>
                )}
              </div>
            </div>
          )}
          {showLetterSpacing && (
            <div>
              <div className={styles.propertyPairLabel}>Letter spacing</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <UnitInput
                  value={(style.letterSpacing as string) ?? ""}
                  placeholder={defaults.letterSpacing || "0"}
                  units={["em", "px", "pt", "rem"]}
                  allowKeywords={["inherit", "normal"]}
                  onChange={(v) => updateStyle({ letterSpacing: v || undefined })}
                />
                {style.letterSpacing && (
                  <button className={styles.clearBtn} onClick={() => clearStyle("letterSpacing")} title="Clear"><X size={12} /></button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Text align + Text transform paired */}
      {(showTextAlign || showTextTransform) && (
        <div className={styles.propertyPair}>
          {showTextAlign && (
            <div>
              <div className={styles.propertyPairLabel}>Text align</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div className={styles.toggleGroup}>
                  {(() => {
                    const explicit = style.textAlign as string | undefined;
                    const effective = explicit || defaults.textAlign || "left";
                    return (["left", "center", "right", "justify"] as const).map((align) => (
                      <button
                        key={align}
                        className={toggleCls(explicit, effective, align)}
                        onClick={() => { if (explicit !== align) updateStyle({ textAlign: align }); }}
                        title={align}
                      >
                        {align.charAt(0).toUpperCase() + align.slice(1)}
                      </button>
                    ));
                  })()}
                </div>
                {style.textAlign && (
                  <button className={styles.clearBtn} onClick={() => clearStyle("textAlign")} title="Clear"><X size={12} /></button>
                )}
              </div>
            </div>
          )}
          {showTextTransform && (() => {
            const explicit = style.textTransform as string | undefined;
            const effective = explicit || defaults.textTransform || "none";
            return (
              <div>
                <div className={styles.propertyPairLabel}>Transform</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div className={styles.toggleGroup}>
                    {TEXT_TRANSFORM_OPTIONS.map((opt) => {
                      const label = opt === "none" ? "None"
                        : opt === "uppercase" ? "UPPER"
                        : opt === "lowercase" ? "lower"
                        : "Title";
                      return (
                        <button
                          key={opt}
                          className={toggleCls(explicit, effective, opt)}
                          onClick={() => { if (explicit !== opt) updateStyle({ textTransform: opt }); }}
                          title={opt}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {style.textTransform && (
                    <button className={styles.clearBtn} onClick={() => clearStyle("textTransform")} title="Clear"><X size={12} /></button>
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
