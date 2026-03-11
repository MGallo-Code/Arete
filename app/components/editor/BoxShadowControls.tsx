"use client";

import { useState } from "react";
import type { Style } from "../../models";
import PropertyRow from "./PropertyRow";
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

  // Match: <offsetX> <offsetY> [blur] [spread] <color>
  // Color can be #hex, rgb(...), rgba(...), hsl(...), hsla(...)
  const colorRegex = /(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\))$/;
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

/** Convert any color string to hex for <input type="color"> (best effort) */
function colorToHex(color: string): string {
  if (/^#[0-9a-fA-F]{3,8}$/.test(color)) return color;
  return "#000000";
}

interface BoxShadowControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (key: string) => void;
}

export default function BoxShadowControls({ style, updateStyle, clearStyle }: BoxShadowControlsProps) {
  const [useRgba, setUseRgba] = useState(false);
  const rawValue = (style.boxShadow as string) ?? "";
  const parsed = parseShadow(rawValue);
  const hasShadow = !!rawValue;

  const update = (patch: Partial<ParsedShadow>) => {
    const current = parsed ?? DEFAULT_SHADOW;
    const next = { ...current, ...patch };
    updateStyle({ boxShadow: buildShadow(next) });
  };

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
                onChange={(v) => update({ offsetX: v })}
              />
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Y offset</div>
              <UnitInput
                value={parsed?.offsetY ?? "0px"}
                placeholder="0"
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
                onChange={(v) => update({ blur: v })}
              />
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Spread</div>
              <UnitInput
                value={parsed?.spread ?? "0px"}
                placeholder="0"
                onChange={(v) => update({ spread: v })}
              />
            </div>
          </div>
          <PropertyRow label="Color">
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {useRgba ? (
                <input
                  type="text"
                  className={styles.propInput}
                  style={{ width: "auto", flex: 1 }}
                  value={parsed?.color ?? "rgba(0,0,0,0.15)"}
                  placeholder="rgba(0,0,0,0.15)"
                  onChange={(e) => update({ color: e.target.value })}
                />
              ) : (
                <input
                  type="color"
                  className={styles.colorInput}
                  value={colorToHex(parsed?.color ?? "#000000")}
                  onChange={(e) => update({ color: e.target.value })}
                />
              )}
              <button
                className={styles.advancedToggle}
                onClick={() => setUseRgba((p) => !p)}
                title={useRgba ? "Switch to color picker" : "Switch to text input (for rgba/hsla)"}
              >
                {useRgba ? "picker" : "rgba"}
              </button>
            </div>
          </PropertyRow>
          <PropertyRow label="Inset">
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={parsed?.inset ?? false}
                onChange={(e) => update({ inset: e.target.checked })}
              />
              <span className={styles.inheritLabel}>Inset shadow</span>
            </label>
          </PropertyRow>
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
