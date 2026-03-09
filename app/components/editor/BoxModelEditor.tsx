"use client";

import styles from "./editor.module.css";

interface BoxModelEditorProps {
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  onMarginChange: (side: "top" | "right" | "bottom" | "left", value: string) => void;
  onPaddingChange: (side: "top" | "right" | "bottom" | "left", value: string) => void;
}

export default function BoxModelEditor({
  marginTop, marginRight, marginBottom, marginLeft,
  paddingTop, paddingRight, paddingBottom, paddingLeft,
  onMarginChange, onPaddingChange,
}: BoxModelEditorProps) {
  return (
    <div className={styles.boxModel}>
      {/* Margin layer (outermost) */}
      <div className={styles.boxModelMargin}>
        <span className={styles.boxModelLabel}>margin</span>
        <input
          className={`${styles.boxModelInput} ${styles.boxModelTop}`}
          value={marginTop}
          placeholder="0"
          onChange={(e) => onMarginChange("top", e.target.value)}
        />
        <input
          className={`${styles.boxModelInput} ${styles.boxModelRight}`}
          value={marginRight}
          placeholder="0"
          onChange={(e) => onMarginChange("right", e.target.value)}
        />
        <input
          className={`${styles.boxModelInput} ${styles.boxModelBottom}`}
          value={marginBottom}
          placeholder="0"
          onChange={(e) => onMarginChange("bottom", e.target.value)}
        />
        <input
          className={`${styles.boxModelInput} ${styles.boxModelLeft}`}
          value={marginLeft}
          placeholder="0"
          onChange={(e) => onMarginChange("left", e.target.value)}
        />

        {/* Padding layer (middle) */}
        <div className={styles.boxModelPadding}>
          <span className={styles.boxModelLabel}>padding</span>
          <input
            className={`${styles.boxModelInput} ${styles.boxModelTop}`}
            value={paddingTop}
            placeholder="0"
            onChange={(e) => onPaddingChange("top", e.target.value)}
          />
          <input
            className={`${styles.boxModelInput} ${styles.boxModelRight}`}
            value={paddingRight}
            placeholder="0"
            onChange={(e) => onPaddingChange("right", e.target.value)}
          />
          <input
            className={`${styles.boxModelInput} ${styles.boxModelBottom}`}
            value={paddingBottom}
            placeholder="0"
            onChange={(e) => onPaddingChange("bottom", e.target.value)}
          />
          <input
            className={`${styles.boxModelInput} ${styles.boxModelLeft}`}
            value={paddingLeft}
            placeholder="0"
            onChange={(e) => onPaddingChange("left", e.target.value)}
          />

          {/* Content area (innermost) */}
          <div className={styles.boxModelContent}>
            content
          </div>
        </div>
      </div>
    </div>
  );
}
