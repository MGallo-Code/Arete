"use client";

import { X } from "lucide-react";
import type { ColorPalette, Style } from "../../models";
import ColorPropRow from "./ColorPropRow";
import styles from "./editor.module.css";

interface ColorControlsProps {
  style: Style;
  updateStyle: (patch: Record<string, string | undefined>) => void;
  clearStyle: (...keys: string[]) => void;
  palette?: ColorPalette;
}

/** Extract url(...) from backgroundImage value */
function extractUrl(value: string | undefined): string {
  if (!value) return "";
  const m = value.match(/url\(["']?(.+?)["']?\)/);
  return m ? m[1] : "";
}

export default function ColorControls({ style, updateStyle, clearStyle, palette }: ColorControlsProps) {
  const bgImage = style.backgroundImage as string | undefined;
  const imageUrl = extractUrl(bgImage);

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

      {/* Background Image */}
      <div className={styles.colorSectionDivider} />
      <div className={styles.themeSectionTitle}>Background Image</div>
      <div className={styles.propRow}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="text"
            className={styles.propInput}
            value={imageUrl}
            placeholder="Paste image URL"
            onChange={(e) => {
              const url = e.target.value.trim();
              if (url) {
                updateStyle({
                  backgroundImage: `url(${url})`,
                  backgroundSize: (style.backgroundSize as string) || "cover",
                  backgroundPosition: (style.backgroundPosition as string) || "center",
                });
              } else {
                clearStyle("backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "backgroundImageOpacity");
              }
            }}
          />
          {bgImage && (
            <button
              className={styles.clearBtn}
              onClick={() => clearStyle("backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "backgroundImageOpacity")}
              title="Clear background image"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      {bgImage && (
        <>
          <div className={styles.propertyPair}>
            <div>
              <div className={styles.propertyPairLabel}>Size</div>
              <div className={styles.toggleGroup}>
                {(["cover", "contain", "auto"] as const).map((v) => (
                  <button
                    key={v}
                    className={`${styles.toggleBtn} ${(style.backgroundSize || "cover") === v ? styles.toggleActive : ""}`}
                    onClick={() => updateStyle({ backgroundSize: v })}
                  >
                    {v[0].toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.propertyPairLabel}>Position</div>
              <select
                className={styles.propSelect}
                value={(style.backgroundPosition as string) || "center"}
                onChange={(e) => updateStyle({ backgroundPosition: e.target.value })}
              >
                {["center", "top", "bottom", "left", "right", "top left", "top right", "bottom left", "bottom right"].map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.propRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label className={styles.propLabel} style={{ marginBottom: 0 }}>Opacity</label>
              <input
                type="range"
                className={styles.alphaSlider}
                min={0}
                max={100}
                value={Math.round(Number((style as Record<string, unknown>).backgroundImageOpacity ?? 1) * 100)}
                title={`Image opacity: ${Math.round(Number((style as Record<string, unknown>).backgroundImageOpacity ?? 1) * 100)}%`}
                aria-label="Background image opacity"
                onChange={(e) => {
                  updateStyle({ backgroundImageOpacity: String(Number(e.target.value) / 100) } as Record<string, string>);
                }}
              />
              <span className={styles.inheritLabel}>
                {Math.round(Number((style as Record<string, unknown>).backgroundImageOpacity ?? 1) * 100)}%
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
