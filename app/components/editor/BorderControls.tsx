"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { ColorPalette, Style } from "../../models";
import { isPaletteVar, paletteKeyFromVar, resolvePaletteVar } from "../../utils/paletteUtils";
import { colorToHex, colorAlpha, setColorAlpha, setColorHex } from "../../utils/colorUtils";
import PaletteSwatches from "./PaletteSwatches";
import UnitInput from "./UnitInput";
import styles from "./editor.module.css";

// --- Border parsing helpers ---

const BORDER_SIDES = ["Top", "Right", "Bottom", "Left"] as const;
const BORDER_CORNERS = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"] as const;

const BORDER_STYLES = ["solid", "dashed", "dotted", "double", "none"] as const;
type BorderStyle = (typeof BORDER_STYLES)[number];

// Permissive regex: {width}{unit} {style} {color}
// Color can be #hex, rgb(...), rgba(...), hsl(...), hsla(...), var(...), or a named color
const BORDER_REGEX =
  /^(\d+(?:\.\d+)?)(px|pt)\s+(solid|dashed|dotted|double|none)\s+(.+)$/;

interface ParsedBorder {
  width: string;
  borderStyle: BorderStyle;
  color: string;
}

function parseBorder(val: string): ParsedBorder | null {
  const match = val.match(BORDER_REGEX);
  if (!match) return null;
  return {
    width: `${match[1]}${match[2]}`,
    borderStyle: match[3] as BorderStyle,
    color: match[4].trim(),
  };
}

interface UnifiedBorder {
  width: string;
  borderStyle: BorderStyle;
  color: string;
  mixed: boolean;
}

/** Read all four border sides and determine if they share a single value */
function getUnifiedBorder(style: Style): UnifiedBorder {
  const values = BORDER_SIDES.map((s) => (style[`border${s}` as keyof Style] as string) ?? "");
  const nonEmpty = values.filter(Boolean);
  if (nonEmpty.length === 0) return { width: "", borderStyle: "solid", color: "#000000", mixed: false };
  const parsed = nonEmpty.map(parseBorder).filter(Boolean) as ParsedBorder[];
  if (parsed.length !== nonEmpty.length) return { width: "", borderStyle: "solid", color: "#000000", mixed: true };
  const allSame = parsed.every(
    (p) => p.width === parsed[0].width && p.borderStyle === parsed[0].borderStyle && p.color === parsed[0].color,
  );
  if (!allSame) return { width: "", borderStyle: "solid", color: "#000000", mixed: true };
  // All match but maybe not all four sides are set — only "unified" if all 4 are set or none are
  if (nonEmpty.length !== 0 && nonEmpty.length !== 4) return { width: "", borderStyle: "solid", color: "#000000", mixed: true };
  return { ...parsed[0], mixed: false };
}

/** Read all four corner radii and determine if they share a single value */
function getUnifiedRadius(style: Style): { value: string; mixed: boolean } {
  const values = BORDER_CORNERS.map((c) => (style[`border${c}Radius` as keyof Style] as string) ?? "");
  const nonEmpty = values.filter(Boolean);
  if (nonEmpty.length === 0) return { value: "", mixed: false };
  const allSame = nonEmpty.every((v) => v === nonEmpty[0]);
  if (!allSame) return { value: "", mixed: true };
  if (nonEmpty.length !== 0 && nonEmpty.length !== 4) return { value: "", mixed: true };
  return { value: nonEmpty[0], mixed: false };
}

/** Resolve a color that may be a palette var, for display purposes */
function resolveColor(color: string, palette?: ColorPalette): string {
  if (palette && isPaletteVar(color)) return resolvePaletteVar(color, palette);
  return color;
}

// --- Component ---

interface BorderControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (...keys: string[]) => void;
  palette?: ColorPalette;
}

export default function BorderControls({ style, updateStyle, clearStyle, palette }: BorderControlsProps) {
  const [showPerSide, setShowPerSide] = useState(false);
  const [showPerCorner, setShowPerCorner] = useState(false);

  // --- Unified border ---
  const unified = getUnifiedBorder(style);
  const unifiedLinkedKey = unified.color ? paletteKeyFromVar(unified.color) : null;
  const unifiedResolvedColor = resolveColor(unified.color, palette);

  const setAllBorders = (width: string, bStyle: BorderStyle, color: string) => {
    if (!width) {
      clearStyle(...BORDER_SIDES.map((s) => `border${s}`));
      return;
    }
    const val = `${width} ${bStyle} ${color}`;
    const patch: Record<string, string> = {};
    for (const side of BORDER_SIDES) patch[`border${side}`] = val;
    updateStyle(patch);
  };

  // --- Unified radius ---
  const unifiedRadius = getUnifiedRadius(style);

  const setAllRadii = (val: string) => {
    if (!val) {
      clearStyle(...BORDER_CORNERS.map((c) => `border${c}Radius`));
      return;
    }
    const patch: Record<string, string> = {};
    for (const corner of BORDER_CORNERS) patch[`border${corner}Radius`] = val;
    updateStyle(patch);
  };

  const hasBorder = BORDER_SIDES.some((s) => style[`border${s}` as keyof Style]);
  const hasRadius = BORDER_CORNERS.some((c) => style[`border${c}Radius` as keyof Style]);

  return (
    <>
      {/* Palette swatches for border color */}
      {palette && hasBorder && (
        <PaletteSwatches
          palette={palette}
          activeKey={unifiedLinkedKey}
          onChange={(varRef) => {
            const w = unified.width || "1px";
            const bs = unified.mixed ? "solid" : unified.borderStyle;
            setAllBorders(w, bs, varRef);
          }}
          style={{ marginBottom: 4 }}
        />
      )}

      {/* Unified border: width + style + clear */}
      <div className={styles.propRow} style={{ marginBottom: 4 }}>
        <div className={styles.borderUnifiedRow}>
          <UnitInput
            value={unified.mixed ? "" : unified.width}
            placeholder={unified.mixed ? "mixed" : "0"}
            units={["px", "pt", "em", "rem"]}
            onChange={(v) => {
              const color = unified.mixed ? "#000000" : unified.color;
              const bs = unified.mixed ? "solid" : unified.borderStyle;
              setAllBorders(v, bs, color);
            }}
          />
          <select
            className={styles.borderStyleSelect}
            value={unified.mixed ? "" : unified.borderStyle}
            aria-label="Border style"
            onChange={(e) => {
              const bs = e.target.value as BorderStyle;
              const w = unified.width || "1px";
              const color = unified.mixed ? "#000000" : unified.color;
              setAllBorders(w, bs, color);
            }}
          >
            {unified.mixed && <option value="">mixed</option>}
            {BORDER_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {hasBorder ? (
            <button
              className={styles.clearBtn}
              onClick={() => clearStyle(...BORDER_SIDES.map((s) => `border${s}`))}
              title="Clear all borders"
              aria-label="Clear all borders"
            >
              <X size={12} />
            </button>
          ) : (
            <span className={styles.inheritLabel}>none</span>
          )}
        </div>
      </div>

      {/* Unified border: color + opacity */}
      {hasBorder && (
        <div className={styles.propRow} style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input
              type="color"
              className={styles.colorInput}
              value={colorToHex(unifiedResolvedColor)}
              aria-label="Border color"
              onChange={(e) => {
                const w = unified.width || "1px";
                const bs = unified.mixed ? "solid" : unified.borderStyle;
                setAllBorders(w, bs, setColorHex(unifiedResolvedColor, e.target.value));
              }}
            />
            <input
              type="range"
              className={styles.alphaSlider}
              min={0}
              max={100}
              value={Math.round(colorAlpha(unifiedResolvedColor) * 100)}
              title={`Opacity: ${Math.round(colorAlpha(unifiedResolvedColor) * 100)}%`}
              aria-label="Border color opacity"
              onChange={(e) => {
                const w = unified.width || "1px";
                const bs = unified.mixed ? "solid" : unified.borderStyle;
                setAllBorders(w, bs, setColorAlpha(unifiedResolvedColor, Number(e.target.value) / 100));
              }}
            />
            <span className={styles.inheritLabel}>{Math.round(colorAlpha(unifiedResolvedColor) * 100)}%</span>
            {unifiedLinkedKey && <span className={styles.inheritLabel}>{unifiedLinkedKey}</span>}
          </div>
        </div>
      )}

      {/* Per-side toggle */}
      <button
        className={styles.advancedToggle}
        onClick={() => setShowPerSide((p) => !p)}
      >
        Per side {showPerSide ? "\u25BE" : "\u25B8"}
      </button>

      {/* Per-side grid */}
      {showPerSide && (
        <div className={styles.bordersGridPerSide}>
          {BORDER_SIDES.map((side) => {
            const key = `border${side}` as keyof typeof style;
            const borderVal = (style[key] as string) ?? "";
            const parsed = parseBorder(borderVal);
            const borderWidth = parsed ? parsed.width : "";
            const borderColor = parsed ? parsed.color : "#000000";
            const borderBs = parsed ? parsed.borderStyle : "solid";
            const sideResolved = resolveColor(borderColor, palette);
            return [
              <span key={`${side}-label`} className={styles.borderSideLabel}>{side}</span>,
              <UnitInput
                key={`${side}-width`}
                compact
                value={borderWidth}
                placeholder="0"
                units={["px", "pt", "em", "rem"]}
                onChange={(v) => {
                  if (v) {
                    updateStyle({ [key]: `${v} ${borderBs} ${borderColor}` });
                  } else {
                    clearStyle(key);
                  }
                }}
              />,
              <select
                key={`${side}-style`}
                className={styles.borderStyleSelectCompact}
                value={borderBs}
                aria-label={`${side} border style`}
                onChange={(e) => {
                  const bs = e.target.value as BorderStyle;
                  const w = borderWidth || "1px";
                  updateStyle({ [key]: `${w} ${bs} ${borderColor}` });
                }}
              >
                {BORDER_STYLES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>,
              <input
                key={`${side}-color`}
                type="color"
                className={styles.colorInput}
                value={colorToHex(sideResolved)}
                aria-label={`${side} border color`}
                onChange={(e) => {
                  const w = borderWidth || "1px";
                  updateStyle({ [key]: `${w} ${borderBs} ${setColorHex(sideResolved, e.target.value)}` });
                }}
              />,
              style[key] ? (
                <button key={`${side}-clear`} className={styles.clearBtn} onClick={() => clearStyle(key)} title="Clear" aria-label={`Clear ${side.toLowerCase()} border`}>
                  <X size={12} />
                </button>
              ) : (
                <span key={`${side}-none`} className={styles.inheritLabel}>none</span>
              ),
            ];
          })}
        </div>
      )}

      {/* Border Radius */}
      <div className={styles.themeSectionTitle} style={{ marginTop: 14 }}>Radius</div>

      {/* Unified radius row */}
      <div className={styles.propRow} style={{ marginBottom: 4 }}>
        <div className={styles.radiusUnifiedRow}>
          <UnitInput
            value={unifiedRadius.mixed ? "" : unifiedRadius.value}
            placeholder={unifiedRadius.mixed ? "mixed" : "0"}
            units={["px", "pt", "em", "rem", "%"]}
            onChange={(v) => setAllRadii(v)}
          />
          {hasRadius ? (
            <button
              className={styles.clearBtn}
              onClick={() => clearStyle(...BORDER_CORNERS.map((c) => `border${c}Radius`))}
              title="Clear all radii"
              aria-label="Clear all border radii"
            >
              <X size={12} />
            </button>
          ) : (
            <span key="radius-none" />
          )}
        </div>
      </div>

      {/* Per-corner toggle */}
      <button
        className={styles.advancedToggle}
        onClick={() => setShowPerCorner((p) => !p)}
      >
        Per corner {showPerCorner ? "\u25BE" : "\u25B8"}
      </button>

      {/* Per-corner paired rows */}
      {showPerCorner && (
        <>
          {([["TopLeft", "TopRight"], ["BottomLeft", "BottomRight"]] as const).map(([left, right]) => {
            const leftKey = `border${left}Radius` as keyof typeof style;
            const rightKey = `border${right}Radius` as keyof typeof style;
            const leftVal = (style[leftKey] as string) ?? "";
            const rightVal = (style[rightKey] as string) ?? "";
            return (
              <div key={`${left}-${right}`} className={styles.propertyPair}>
                <div>
                  <div className={styles.propertyPairLabel}>
                    {left.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <UnitInput
                      value={leftVal}
                      placeholder="0"
                      units={["px", "pt", "em", "rem", "%"]}
                      onChange={(v) => updateStyle({ [leftKey]: v })}
                    />
                    {leftVal && (
                      <button className={styles.clearBtn} onClick={() => clearStyle(leftKey)} title="Clear" aria-label={`Clear ${left.replace(/([A-Z])/g, " $1").trim().toLowerCase()} radius`}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <div className={styles.propertyPairLabel}>
                    {right.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <UnitInput
                      value={rightVal}
                      placeholder="0"
                      units={["px", "pt", "em", "rem", "%"]}
                      onChange={(v) => updateStyle({ [rightKey]: v })}
                    />
                    {rightVal && (
                      <button className={styles.clearBtn} onClick={() => clearStyle(rightKey)} title="Clear" aria-label={`Clear ${right.replace(/([A-Z])/g, " $1").trim().toLowerCase()} radius`}>
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
