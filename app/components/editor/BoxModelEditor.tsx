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
  defaultMarginTop?: string;
  defaultMarginRight?: string;
  defaultMarginBottom?: string;
  defaultMarginLeft?: string;
  defaultPaddingTop?: string;
  defaultPaddingRight?: string;
  defaultPaddingBottom?: string;
  defaultPaddingLeft?: string;
  hideMargin?: boolean;
}

export default function BoxModelEditor({
  marginTop, marginRight, marginBottom, marginLeft,
  paddingTop, paddingRight, paddingBottom, paddingLeft,
  onMarginChange, onPaddingChange,
  defaultMarginTop, defaultMarginRight, defaultMarginBottom, defaultMarginLeft,
  defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft,
  hideMargin,
}: BoxModelEditorProps) {
  const paddingLayer = (
    <div className={styles.boxModelPadding}>
      <span className={styles.boxModelLabel}>padding</span>
      <div className={styles.boxModelTop}>
        <SpacingInput compact value={paddingTop} placeholder={defaultPaddingTop || "0"} onChange={(v) => onPaddingChange("top", v)} />
      </div>
      <div className={styles.boxModelRight}>
        <SpacingInput compact value={paddingRight} placeholder={defaultPaddingRight || "0"} onChange={(v) => onPaddingChange("right", v)} />
      </div>
      <div className={styles.boxModelBottom}>
        <SpacingInput compact value={paddingBottom} placeholder={defaultPaddingBottom || "0"} onChange={(v) => onPaddingChange("bottom", v)} />
      </div>
      <div className={styles.boxModelLeft}>
        <SpacingInput compact value={paddingLeft} placeholder={defaultPaddingLeft || "0"} onChange={(v) => onPaddingChange("left", v)} />
      </div>

      {/* Content area (innermost) */}
      <div className={styles.boxModelContent}>
        content
      </div>
    </div>
  );

  if (hideMargin) {
    return (
      <div className={styles.boxModel}>
        {paddingLayer}
      </div>
    );
  }

  return (
    <div className={styles.boxModel}>
      {/* Margin layer (outermost) */}
      <div className={styles.boxModelMargin}>
        <span className={styles.boxModelLabel}>margin</span>
        <div className={styles.boxModelTop}>
          <SpacingInput compact value={marginTop} placeholder={defaultMarginTop || "0"} onChange={(v) => onMarginChange("top", v)} />
        </div>
        <div className={styles.boxModelRight}>
          <SpacingInput compact value={marginRight} placeholder={defaultMarginRight || "0"} onChange={(v) => onMarginChange("right", v)} />
        </div>
        <div className={styles.boxModelBottom}>
          <SpacingInput compact value={marginBottom} placeholder={defaultMarginBottom || "0"} onChange={(v) => onMarginChange("bottom", v)} />
        </div>
        <div className={styles.boxModelLeft}>
          <SpacingInput compact value={marginLeft} placeholder={defaultMarginLeft || "0"} onChange={(v) => onMarginChange("left", v)} />
        </div>

        {paddingLayer}
      </div>
    </div>
  );
}
