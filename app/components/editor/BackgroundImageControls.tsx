"use client";

import { X } from "lucide-react";
import UnitInput from "./UnitInput";
import styles from "./editor.module.css";

/** Extract url(...) from backgroundImage value */
export function extractBgUrl(value: string | undefined): string {
  if (!value) return "";
  const m = value.match(/url\(["']?(.+?)["']?\)/);
  return m ? m[1] : "";
}

const SIZE_PRESETS = ["cover", "contain", "auto"] as const;
const POSITION_GRID = [
  { value: "top left", label: "Top Left" },
  { value: "top", label: "Top Center" },
  { value: "top right", label: "Top Right" },
  { value: "left", label: "Center Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Center Right" },
  { value: "bottom left", label: "Bottom Left" },
  { value: "bottom", label: "Bottom Center" },
  { value: "bottom right", label: "Bottom Right" },
];

interface BackgroundImageControlsProps {
  /** Current backgroundImage CSS value (e.g. "url(...)") */
  backgroundImage: string | undefined;
  backgroundSize: string | undefined;
  backgroundPosition: string | undefined;
  backgroundRepeat: string | undefined;
  /** Custom opacity (0-1 string), stored outside normal CSS */
  backgroundImageOpacity: string | undefined;
  /** Update one or more style properties */
  onUpdate: (patch: Record<string, string | undefined>) => void;
  /** Clear one or more style properties */
  onClear: (...keys: string[]) => void;
}

const BG_KEYS = ["backgroundImage", "backgroundSize", "backgroundPosition", "backgroundRepeat", "backgroundImageOpacity"] as const;

export default function BackgroundImageControls({
  backgroundImage,
  backgroundSize,
  backgroundPosition,
  backgroundRepeat,
  backgroundImageOpacity,
  onUpdate,
  onClear,
}: BackgroundImageControlsProps) {
  const imageUrl = extractBgUrl(backgroundImage);
  const hasBg = !!backgroundImage;

  const sizeValue = backgroundSize || "cover";
  const isCustomSize = hasBg && !SIZE_PRESETS.includes(sizeValue as typeof SIZE_PRESETS[number]);
  const posValue = backgroundPosition || "center";
  const opacity = Math.round(Number(backgroundImageOpacity ?? 1) * 100);

  return (
    <>
      {/* URL input */}
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
                onUpdate({
                  backgroundImage: `url(${url})`,
                  backgroundSize: backgroundSize || "cover",
                  backgroundPosition: backgroundPosition || "center",
                });
              } else {
                onClear(...BG_KEYS);
              }
            }}
          />
          {hasBg && (
            <button
              className={styles.clearBtn}
              onClick={() => onClear(...BG_KEYS)}
              title="Clear background image"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {hasBg && (
        <>
          {/* Size */}
          <div className={styles.propRow}>
            <div className={styles.propertyPairLabel}>Size</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className={styles.toggleGroup}>
                {SIZE_PRESETS.map((v) => (
                  <button
                    key={v}
                    className={`${styles.toggleBtn} ${sizeValue === v ? styles.toggleActive : ""}`}
                    onClick={() => onUpdate({ backgroundSize: v })}
                  >
                    {v[0].toUpperCase() + v.slice(1)}
                  </button>
                ))}
                <button
                  className={`${styles.toggleBtn} ${isCustomSize ? styles.toggleActive : ""}`}
                  onClick={() => {
                    if (!isCustomSize) onUpdate({ backgroundSize: "100% auto" });
                  }}
                >
                  Custom
                </button>
              </div>
            </div>
          </div>
          {isCustomSize && (() => {
            const parts = sizeValue.split(/\s+/);
            const w = parts[0] || "auto";
            const h = parts[1] || "auto";
            return (
              <div className={styles.propertyPair}>
                <div>
                  <div className={styles.propertyPairLabel}>Width</div>
                  <UnitInput
                    value={w === "auto" ? "" : w}
                    placeholder="auto"
                    units={["px", "pt", "%", "em"]}
                    allowKeywords={["auto"]}
                    onChange={(v) => {
                      onUpdate({ backgroundSize: `${v || "auto"} ${h}` });
                    }}
                  />
                </div>
                <div>
                  <div className={styles.propertyPairLabel}>Height</div>
                  <UnitInput
                    value={h === "auto" ? "" : h}
                    placeholder="auto"
                    units={["px", "pt", "%", "em"]}
                    allowKeywords={["auto"]}
                    onChange={(v) => {
                      onUpdate({ backgroundSize: `${w} ${v || "auto"}` });
                    }}
                  />
                </div>
              </div>
            );
          })()}

          {/* Opacity */}
          <div className={styles.propRow}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <label className={styles.propLabel} style={{ marginBottom: 0 }}>Opacity</label>
              <input
                type="range"
                className={styles.alphaSlider}
                min={0}
                max={100}
                value={opacity}
                title={`Image opacity: ${opacity}%`}
                aria-label="Background image opacity"
                onChange={(e) => {
                  onUpdate({ backgroundImageOpacity: String(Number(e.target.value) / 100) });
                }}
              />
              <span className={styles.inheritLabel}>{opacity}%</span>
            </div>
          </div>

          {/* Position — 3x3 grid */}
          <div className={styles.propRow}>
            <div className={styles.propertyPairLabel}>Position</div>
            <div className={styles.positionGrid}>
              {POSITION_GRID.map(({ value: v, label }) => (
                <button
                  key={v}
                  className={`${styles.positionDot} ${posValue === v ? styles.positionDotActive : ""}`}
                  title={label}
                  aria-label={label}
                  onClick={() => onUpdate({ backgroundPosition: v })}
                >
                  <span className={styles.positionDotInner} />
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
