"use client";

import { X } from "lucide-react";
import type { ColorPalette } from "../../models";
import { isPaletteVar, paletteKeyFromVar, resolvePaletteVar } from "../../utils/paletteUtils";
import { colorToHex, colorAlpha, setColorAlpha, setColorHex } from "../../utils/colorUtils";
import PaletteSwatches from "./PaletteSwatches";
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
  const linkedKey = value ? paletteKeyFromVar(value) : null;
  const resolvedValue =
    value && palette && isPaletteVar(value)
      ? resolvePaletteVar(value, palette)
      : value;

  const alpha = resolvedValue ? colorAlpha(resolvedValue) : 1;
  const hexForPicker = resolvedValue ? colorToHex(resolvedValue) : fallback;

  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="color"
          className={`${styles.colorInput} ${!value ? styles.colorInputUnset : ""}`}
          value={hexForPicker}
          aria-label={`Pick ${label.toLowerCase()} color`}
          onChange={(e) => {
            if (value) {
              onChange(setColorHex(resolvedValue || fallback, e.target.value));
            } else {
              onChange(e.target.value);
            }
          }}
        />
        {value && (
          <>
            <input
              type="range"
              className={styles.alphaSlider}
              min={0}
              max={100}
              value={Math.round(alpha * 100)}
              title={`Opacity: ${Math.round(alpha * 100)}%`}
              aria-label={`${label} opacity`}
              onChange={(e) => {
                const a = Number(e.target.value) / 100;
                onChange(setColorAlpha(resolvedValue || fallback, a));
              }}
            />
            <span className={styles.inheritLabel}>{Math.round(alpha * 100)}%</span>
            {linkedKey && (
              <span className={styles.inheritLabel}>{linkedKey}</span>
            )}
            <button className={styles.clearBtn} onClick={onClear} title="Clear" aria-label={`Clear ${label.toLowerCase()}`}>
              <X size={12} />
            </button>
          </>
        )}
      </div>
      {palette && (
        <PaletteSwatches
          palette={palette}
          activeKey={linkedKey}
          onChange={onChange}
        />
      )}
    </div>
  );
}
