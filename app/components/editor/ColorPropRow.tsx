"use client";

import { useRef } from "react";
import type { ColorPalette } from "../../models";
import { isPaletteVar, paletteKeyFromVar, resolvePaletteVar, PALETTE_VAR_MAP } from "../../utils/paletteUtils";
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

  // Resolve var(--palette-*) to hex for display and <input type="color">
  const linkedKey = value ? paletteKeyFromVar(value) : null;
  const resolvedValue =
    value && palette && isPaletteVar(value)
      ? resolvePaletteVar(value, palette)
      : value;

  const paletteColors = palette
    ? ([
        { key: "primary" as const, color: palette.primary },
        { key: "secondary" as const, color: palette.secondary },
        { key: "accent" as const, color: palette.accent },
        { key: "muted" as const, color: palette.muted },
        { key: "background" as const, color: palette.background },
      ])
    : [];

  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      {paletteColors.length > 0 && (
        <div className={styles.paletteSwatches}>
          {paletteColors.map(({ key, color }) => (
            <button
              key={key}
              className={`${styles.paletteSwatch} ${linkedKey === key ? styles.paletteSwatchActive : ""}`}
              style={{ backgroundColor: color }}
              title={`${key} — click to link`}
              onClick={() => onChange(PALETTE_VAR_MAP[key])}
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
              value={resolvedValue}
              aria-label={`Pick ${label.toLowerCase()} color`}
              onChange={(e) => onChange(e.target.value)}
            />
            {linkedKey && (
              <span className={styles.inheritLabel}>{linkedKey}</span>
            )}
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
            <span className={styles.inheritLabel}>Inherit</span>
          </>
        )}
      </div>
    </div>
  );
}
