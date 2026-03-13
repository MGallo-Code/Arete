"use client";

import type { ColorPalette } from "../../models";
import { PALETTE_VAR_MAP } from "../../utils/paletteUtils";
import styles from "./editor.module.css";

const PALETTE_KEYS: { key: keyof ColorPalette; label: string }[] = [
  { key: "primary", label: "Pri" },
  { key: "secondary", label: "Sec" },
  { key: "accent", label: "Acc" },
  { key: "muted", label: "Mut" },
  { key: "background", label: "Bg" },
];

interface PaletteSwatchesProps {
  palette: ColorPalette;
  activeKey: keyof ColorPalette | null;
  onChange: (varRef: string) => void;
  style?: React.CSSProperties;
}

export default function PaletteSwatches({ palette, activeKey, onChange, style: containerStyle }: PaletteSwatchesProps) {
  return (
    <div className={styles.paletteSwatches} style={containerStyle}>
      {PALETTE_KEYS.map(({ key, label }) => (
        <div key={key} className={styles.paletteSwatchItem}>
          <button
            className={`${styles.paletteSwatch} ${activeKey === key ? styles.paletteSwatchActive : ""}`}
            style={{ backgroundColor: palette[key] }}
            title={key}
            onClick={() => onChange(PALETTE_VAR_MAP[key])}
          />
          <span className={styles.paletteSwatchLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
