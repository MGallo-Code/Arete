"use client";

import type { ColorPalette, Style } from "../../models";
import { isPaletteVar, paletteKeyFromVar, resolvePaletteVar } from "../../utils/paletteUtils";
import { colorToHex, colorAlpha, setColorAlpha, setColorHex } from "../../utils/colorUtils";
import PaletteSwatches from "./PaletteSwatches";
import UnitInput from "./UnitInput";
import styles from "./editor.module.css";

interface ParsedShadow {
  inset: boolean;
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  color: string;
}

const DEFAULT_SHADOW: ParsedShadow = {
  inset: false,
  offsetX: "0px",
  offsetY: "2px",
  blur: "4px",
  spread: "0px",
  color: "rgba(0,0,0,0.15)",
};

function parseShadow(value: string): ParsedShadow | null {
  if (!value) return null;
  const trimmed = value.trim();
  let inset = false;
  let rest = trimmed;
  if (rest.startsWith("inset")) {
    inset = true;
    rest = rest.slice(5).trim();
  }

  // Match color at end: #hex, rgb(...), rgba(...), hsl(...), hsla(...), var(...)
  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|var\([^)]+\))$/;
  const colorMatch = rest.match(colorRegex);
  let color = "rgba(0,0,0,0.15)";
  if (colorMatch) {
    color = colorMatch[1];
    rest = rest.slice(0, colorMatch.index).trim();
  }

  // Check if inset is at the end
  if (rest.endsWith("inset")) {
    inset = true;
    rest = rest.slice(0, -5).trim();
  }

  const parts = rest.split(/\s+/);
  if (parts.length < 2) return null;

  return {
    inset,
    offsetX: parts[0] || "0px",
    offsetY: parts[1] || "0px",
    blur: parts[2] || "0px",
    spread: parts[3] || "0px",
    color,
  };
}

function buildShadow(s: ParsedShadow): string {
  const parts: string[] = [];
  if (s.inset) parts.push("inset");
  parts.push(s.offsetX, s.offsetY, s.blur, s.spread, s.color);
  return parts.join(" ");
}

interface BoxShadowControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (...keys: string[]) => void;
  palette?: ColorPalette;
}

export default function BoxShadowControls({ style, updateStyle, clearStyle, palette }: BoxShadowControlsProps) {
  const rawValue = (style.boxShadow as string) ?? "";
  const parsed = parseShadow(rawValue);
  const hasShadow = !!rawValue;

  const update = (patch: Partial<ParsedShadow>) => {
    const current = parsed ?? DEFAULT_SHADOW;
    const next = { ...current, ...patch };
    updateStyle({ boxShadow: buildShadow(next) });
  };

  const shadowColor = parsed?.color ?? "rgba(0,0,0,0.15)";
  const linkedKey = paletteKeyFromVar(shadowColor);
  const resolvedColor = palette && isPaletteVar(shadowColor)
    ? resolvePaletteVar(shadowColor, palette)
    : shadowColor;
  const alpha = colorAlpha(resolvedColor);


  return (
    <>
      {!hasShadow ? (
        <div className={styles.propRow}>
          <button
            className={styles.propBtn}
            onClick={() => updateStyle({ boxShadow: buildShadow(DEFAULT_SHADOW) })}
          >
            + Add Shadow
          </button>
        </div>
      ) : (
        <>
          <div className={styles.propertyPair}>
            <div>
              <div className={styles.propertyPairLabel}>X offset</div>
              <UnitInput
                value={parsed?.offsetX ?? "0px"}
                placeholder="0"
                units={["px", "pt", "em", "rem"]}
                onChange={(v) => update({ offsetX: v })}
              />
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Y offset</div>
              <UnitInput
                value={parsed?.offsetY ?? "0px"}
                placeholder="0"
                units={["px", "pt", "em", "rem"]}
                onChange={(v) => update({ offsetY: v })}
              />
            </div>
          </div>
          <div className={styles.propertyPair}>
            <div>
              <div className={styles.propertyPairLabel}>Blur</div>
              <UnitInput
                value={parsed?.blur ?? "0px"}
                placeholder="0"
                units={["px", "pt", "em", "rem"]}
                onChange={(v) => update({ blur: v })}
              />
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Spread</div>
              <UnitInput
                value={parsed?.spread ?? "0px"}
                placeholder="0"
                units={["px", "pt", "em", "rem"]}
                onChange={(v) => update({ spread: v })}
              />
            </div>
          </div>

          {/* Palette swatches */}
          {palette && (
            <PaletteSwatches
              palette={palette}
              activeKey={linkedKey}
              onChange={(varRef) => update({ color: varRef })}
            />
          )}

          <div className={styles.propertyPair}>
            <div>
              <div className={styles.propertyPairLabel}>Color</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="color"
                  className={styles.colorInput}
                  value={colorToHex(resolvedColor)}
                  aria-label="Shadow color"
                  onChange={(e) => update({ color: setColorHex(resolvedColor, e.target.value) })}
                />
                <input
                  type="range"
                  className={styles.alphaSlider}
                  min={0}
                  max={100}
                  value={Math.round(alpha * 100)}
                  title={`Opacity: ${Math.round(alpha * 100)}%`}
                  aria-label="Shadow color opacity"
                  onChange={(e) => update({ color: setColorAlpha(resolvedColor, Number(e.target.value) / 100) })}
                />
                <span className={styles.inheritLabel}>{Math.round(alpha * 100)}%</span>
                {linkedKey && <span className={styles.inheritLabel}>{linkedKey}</span>}
              </div>
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Inset</div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", paddingTop: 4 }}>
                <input
                  type="checkbox"
                  checked={parsed?.inset ?? false}
                  onChange={(e) => update({ inset: e.target.checked })}
                />
                <span className={styles.inheritLabel}>Inset shadow</span>
              </label>
            </div>
          </div>
          <div className={styles.propBtnRow}>
            <button
              className={styles.propBtn}
              onClick={() => clearStyle("boxShadow")}
            >
              Remove Shadow
            </button>
          </div>
        </>
      )}
    </>
  );
}
