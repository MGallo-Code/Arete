"use client";

import SpacingInput from "./SpacingInput";
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
        <div className={styles.boxModelTop}>
          <SpacingInput compact value={marginTop} onChange={(v) => onMarginChange("top", v)} />
        </div>
        <div className={styles.boxModelRight}>
          <SpacingInput compact value={marginRight} onChange={(v) => onMarginChange("right", v)} />
        </div>
        <div className={styles.boxModelBottom}>
          <SpacingInput compact value={marginBottom} onChange={(v) => onMarginChange("bottom", v)} />
        </div>
        <div className={styles.boxModelLeft}>
          <SpacingInput compact value={marginLeft} onChange={(v) => onMarginChange("left", v)} />
        </div>

        {/* Padding layer (middle) */}
        <div className={styles.boxModelPadding}>
          <span className={styles.boxModelLabel}>padding</span>
          <div className={styles.boxModelTop}>
            <SpacingInput compact value={paddingTop} onChange={(v) => onPaddingChange("top", v)} />
          </div>
          <div className={styles.boxModelRight}>
            <SpacingInput compact value={paddingRight} onChange={(v) => onPaddingChange("right", v)} />
          </div>
          <div className={styles.boxModelBottom}>
            <SpacingInput compact value={paddingBottom} onChange={(v) => onPaddingChange("bottom", v)} />
          </div>
          <div className={styles.boxModelLeft}>
            <SpacingInput compact value={paddingLeft} onChange={(v) => onPaddingChange("left", v)} />
          </div>

          {/* Content area (innermost) */}
          <div className={styles.boxModelContent}>
            content
          </div>
        </div>
      </div>
    </div>
  );
}
