"use client";

import { useState } from "react";
import type { Style } from "../../models";
import SpacingInput from "./SpacingInput";
import styles from "./editor.module.css";

// --- Border parsing helpers ---

const BORDER_SIDES = ["Top", "Right", "Bottom", "Left"] as const;
const BORDER_CORNERS = ["TopLeft", "TopRight", "BottomRight", "BottomLeft"] as const;

const BORDER_REGEX = /^(\d+(?:\.\d+)?)(px|pt)\s+solid\s+(#[0-9a-fA-F]{3,8})$/;

function parseBorder(val: string): { width: string; color: string } | null {
  const match = val.match(BORDER_REGEX);
  if (!match) return null;
  return { width: `${match[1]}${match[2]}`, color: match[3] };
}

/** Read all four border sides and determine if they share a single value */
function getUnifiedBorder(style: Style): { width: string; color: string; mixed: boolean } {
  const values = BORDER_SIDES.map((s) => (style[`border${s}` as keyof Style] as string) ?? "");
  const nonEmpty = values.filter(Boolean);
  if (nonEmpty.length === 0) return { width: "", color: "#000000", mixed: false };
  const parsed = nonEmpty.map(parseBorder).filter(Boolean) as { width: string; color: string }[];
  if (parsed.length !== nonEmpty.length) return { width: "", color: "#000000", mixed: true };
  const allSame = parsed.every((p) => p.width === parsed[0].width && p.color === parsed[0].color);
  if (!allSame) return { width: "", color: "#000000", mixed: true };
  // All match but maybe not all four sides are set — only "unified" if all 4 are set or none are
  if (nonEmpty.length !== 0 && nonEmpty.length !== 4) return { width: "", color: "#000000", mixed: true };
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

// --- Component ---

interface BorderControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (key: string) => void;
}

export default function BorderControls({ style, updateStyle, clearStyle }: BorderControlsProps) {
  const [showPerSide, setShowPerSide] = useState(false);
  const [showPerCorner, setShowPerCorner] = useState(false);

  // --- Unified border ---
  const unified = getUnifiedBorder(style);

  const setAllBorders = (width: string, color: string) => {
    if (!width) {
      const patch: Record<string, undefined> = {};
      for (const side of BORDER_SIDES) patch[`border${side}`] = undefined;
      // Clear by setting undefined — the caller's clearStyle handles delete
      // Actually, we need to clear all four. Use updateStyle with empty strings won't work.
      // Let's clear them one by one.
      for (const side of BORDER_SIDES) clearStyle(`border${side}`);
      return;
    }
    const val = `${width} solid ${color}`;
    const patch: Record<string, string> = {};
    for (const side of BORDER_SIDES) patch[`border${side}`] = val;
    updateStyle(patch);
  };

  // --- Unified radius ---
  const unifiedRadius = getUnifiedRadius(style);

  const setAllRadii = (val: string) => {
    if (!val) {
      for (const corner of BORDER_CORNERS) clearStyle(`border${corner}Radius`);
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
      {/* ---- Borders ---- */}
      <div className={styles.themeSectionTitle}>Borders</div>

      {/* Unified border row */}
      <div className={styles.propRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={unified.mixed ? "" : unified.width}
            placeholder={unified.mixed ? "mixed" : "0"}
            onChange={(v) => {
              const color = unified.mixed ? "#000000" : unified.color;
              setAllBorders(v, color);
            }}
          />
          <input
            type="color"
            className={styles.colorInput}
            value={unified.mixed ? "#000000" : unified.color}
            onChange={(e) => {
              const w = unified.width || "1px";
              setAllBorders(w, e.target.value);
            }}
          />
          {hasBorder ? (
            <button
              className={styles.clearBtn}
              onClick={() => {
                for (const side of BORDER_SIDES) clearStyle(`border${side}`);
              }}
              title="Clear all borders"
            >
              ×
            </button>
          ) : (
            <span className={styles.inheritLabel}>none</span>
          )}
        </div>
      </div>

      {/* Per-side toggle */}
      <button
        className={styles.advancedToggle}
        onClick={() => setShowPerSide((p) => !p)}
      >
        Per side {showPerSide ? "\u25BE" : "\u25B8"}
      </button>

      {/* Per-side grid */}
      {showPerSide && (
        <div className={styles.bordersGrid}>
          {BORDER_SIDES.map((side) => {
            const key = `border${side}` as keyof typeof style;
            const borderVal = (style[key] as string) ?? "";
            const parsed = parseBorder(borderVal);
            const borderWidth = parsed ? parsed.width : "";
            const borderColor = parsed ? parsed.color : "#000000";
            return [
              <span key={`${side}-label`} className={styles.borderSideLabel}>{side}</span>,
              <SpacingInput
                key={`${side}-width`}
                compact
                value={borderWidth}
                placeholder="0"
                onChange={(v) => {
                  if (v) {
                    updateStyle({ [key]: `${v} solid ${borderColor}` });
                  } else {
                    clearStyle(key);
                  }
                }}
              />,
              <input
                key={`${side}-color`}
                type="color"
                className={styles.colorInput}
                value={borderColor}
                onChange={(e) => {
                  const w = borderWidth || "1px";
                  updateStyle({ [key]: `${w} solid ${e.target.value}` });
                }}
              />,
              style[key] ? (
                <button key={`${side}-clear`} className={styles.clearBtn} onClick={() => clearStyle(key)} title="Clear">
                  ×
                </button>
              ) : (
                <span key={`${side}-none`} className={styles.inheritLabel}>none</span>
              ),
            ];
          })}
        </div>
      )}

      {/* ---- Border Radius ---- */}
      <div className={styles.themeSectionTitle} style={{ marginTop: 8 }}>Border Radius</div>

      {/* Unified radius row */}
      <div className={styles.propRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <SpacingInput
            value={unifiedRadius.mixed ? "" : unifiedRadius.value}
            placeholder={unifiedRadius.mixed ? "mixed" : "0"}
            onChange={(v) => setAllRadii(v)}
          />
          {hasRadius ? (
            <button
              className={styles.clearBtn}
              onClick={() => {
                for (const corner of BORDER_CORNERS) clearStyle(`border${corner}Radius`);
              }}
              title="Clear all radii"
            >
              ×
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

      {/* Per-corner grid */}
      {showPerCorner && (
        <div className={styles.bordersGrid}>
          {BORDER_CORNERS.map((corner) => {
            const key = `border${corner}Radius` as keyof typeof style;
            const val = (style[key] as string) ?? "";
            return [
              <span key={`${corner}-label`} className={styles.borderSideLabel}>
                {corner.replace(/([A-Z])/g, " $1").trim()}
              </span>,
              <SpacingInput
                key={`${corner}-input`}
                compact
                value={val}
                placeholder="0"
                onChange={(v) => updateStyle({ [key]: v })}
              />,
              <span key={`${corner}-spacer`} />,
              val ? (
                <button key={`${corner}-clear`} className={styles.clearBtn} onClick={() => clearStyle(key)} title="Clear">
                  ×
                </button>
              ) : (
                <span key={`${corner}-none`} />
              ),
            ];
          })}
        </div>
      )}
    </>
  );
}
