"use client";

import type { ColorPalette, Style } from "../../models";
import ColorPropRow from "./ColorPropRow";

interface ColorControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (key: string) => void;
  palette?: ColorPalette;
}

export default function ColorControls({ style, updateStyle, clearStyle, palette }: ColorControlsProps) {
  return (
    <>
      <ColorPropRow
        label="Background"
        value={style.backgroundColor as string | undefined}
        fallback="#ffffff"
        onChange={(v) => updateStyle({ backgroundColor: v })}
        onClear={() => clearStyle("backgroundColor")}
        palette={palette}
      />
      <ColorPropRow
        label="Text color"
        value={style.color as string | undefined}
        fallback="#000000"
        onChange={(v) => updateStyle({ color: v })}
        onClear={() => clearStyle("color")}
        palette={palette}
      />
    </>
  );
}
