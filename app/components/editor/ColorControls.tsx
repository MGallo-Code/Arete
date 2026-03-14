"use client";

import type { ColorPalette, Style } from "../../models";
import ColorPropRow from "./ColorPropRow";
import BackgroundImageControls from "./BackgroundImageControls";
import styles from "./editor.module.css";

interface ColorControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (...keys: string[]) => void;
  palette?: ColorPalette;
}

export default function ColorControls({ style, updateStyle, clearStyle, palette }: ColorControlsProps) {
  return (
    <>
      <ColorPropRow
        label="Background Color"
        value={style.backgroundColor as string | undefined}
        fallback="#ffffff"
        onChange={(v) => updateStyle({ backgroundColor: v })}
        onClear={() => clearStyle("backgroundColor")}
        palette={palette}
      />
      <ColorPropRow
        label="Text Color"
        value={style.color as string | undefined}
        fallback="#000000"
        onChange={(v) => updateStyle({ color: v })}
        onClear={() => clearStyle("color")}
        palette={palette}
      />

      <div className={styles.colorSectionDivider} />
      <div className={styles.themeSectionTitle}>Background Image</div>
      <BackgroundImageControls
        backgroundImage={style.backgroundImage as string | undefined}
        backgroundSize={style.backgroundSize as string | undefined}
        backgroundPosition={style.backgroundPosition as string | undefined}
        backgroundRepeat={style.backgroundRepeat as string | undefined}
        backgroundImageOpacity={(style as Record<string, unknown>).backgroundImageOpacity as string | undefined}
        onUpdate={(patch) => updateStyle(patch)}
        onClear={(...keys) => clearStyle(...keys)}
      />
    </>
  );
}
