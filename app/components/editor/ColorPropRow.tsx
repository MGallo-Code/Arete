"use client";

import { useRef } from "react";
import type { ColorPalette } from "../../models";
import styles from "./editor.module.css";

export default function ColorPropRow({
  label,
  value,
  fallback,
  onChange,
  onClear,
  palette,
}: {
  label: string;
  value: string | undefined;
  fallback: string;
  onChange: (color: string) => void;
  onClear: () => void;
  palette?: ColorPalette;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteColors = palette
    ? [
        { key: "primary", color: palette.primary },
        { key: "secondary", color: palette.secondary },
        { key: "accent", color: palette.accent },
        { key: "muted", color: palette.muted },
        { key: "background", color: palette.background },
      ]
    : [];

  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      {paletteColors.length > 0 && (
        <div className={styles.paletteSwatches}>
          {paletteColors.map(({ key, color }) => (
            <button
              key={key}
              className={`${styles.paletteSwatch} ${value === color ? styles.paletteSwatchActive : ""}`}
              style={{ backgroundColor: color }}
              title={key}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {value ? (
          <>
            <input
              type="color"
              className={styles.colorInput}
              value={value}
              aria-label={`Pick ${label.toLowerCase()} color`}
              onChange={(e) => onChange(e.target.value)}
            />
            <button className={styles.clearBtn} onClick={onClear} title="Clear" aria-label={`Clear ${label.toLowerCase()}`}>
              ×
            </button>
          </>
        ) : (
          <>
            <button
              className={styles.colorSwatchBtn}
              onClick={() => inputRef.current?.click()}
              title={`Set ${label.toLowerCase()}`}
              aria-label={`Set ${label.toLowerCase()}`}
            >
              +
            </button>
            <input
              ref={inputRef}
              type="color"
              className={styles.colorSwatchHiddenInput}
              value={fallback}
              aria-label={`Pick ${label.toLowerCase()} color`}
              onChange={(e) => onChange(e.target.value)}
            />
            <span className={styles.inheritLabel}>inherit</span>
          </>
        )}
      </div>
    </div>
  );
}
