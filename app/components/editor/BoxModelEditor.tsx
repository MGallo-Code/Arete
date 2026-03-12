"use client";

import UnitInput from "./UnitInput";
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

/** If all four values match (and at least one is set), return that value. Otherwise return "". */
function unifiedValue(a: string, b: string, c: string, d: string): { value: string; mixed: boolean } {
  const nonEmpty = [a, b, c, d].filter(Boolean);
  if (nonEmpty.length === 0) return { value: "", mixed: false };
  const allSame = nonEmpty.every((v) => v === nonEmpty[0]);
  if (allSame && nonEmpty.length === 4) return { value: nonEmpty[0], mixed: false };
  return { value: "", mixed: true };
}

export default function BoxModelEditor({
  marginTop, marginRight, marginBottom, marginLeft,
  paddingTop, paddingRight, paddingBottom, paddingLeft,
  onMarginChange, onPaddingChange,
  defaultMarginTop, defaultMarginRight, defaultMarginBottom, defaultMarginLeft,
  defaultPaddingTop, defaultPaddingRight, defaultPaddingBottom, defaultPaddingLeft,
  hideMargin,
}: BoxModelEditorProps) {
  const unifiedMargin = unifiedValue(marginTop, marginRight, marginBottom, marginLeft);
  const unifiedPadding = unifiedValue(paddingTop, paddingRight, paddingBottom, paddingLeft);

  const setAllMargins = (v: string) => {
    onMarginChange("top", v);
    onMarginChange("right", v);
    onMarginChange("bottom", v);
    onMarginChange("left", v);
  };

  const setAllPadding = (v: string) => {
    onPaddingChange("top", v);
    onPaddingChange("right", v);
    onPaddingChange("bottom", v);
    onPaddingChange("left", v);
  };

  const paddingLayer = (
    <div className={styles.boxModelPadding}>
      <span className={styles.boxModelLabel}>padding</span>
      <div className={styles.boxModelTop}>
        <UnitInput compact value={paddingTop} placeholder={defaultPaddingTop || "0"} onChange={(v) => onPaddingChange("top", v)} />
      </div>
      <div className={styles.boxModelRight}>
        <UnitInput compact value={paddingRight} placeholder={defaultPaddingRight || "0"} onChange={(v) => onPaddingChange("right", v)} />
      </div>
      <div className={styles.boxModelBottom}>
        <UnitInput compact value={paddingBottom} placeholder={defaultPaddingBottom || "0"} onChange={(v) => onPaddingChange("bottom", v)} />
      </div>
      <div className={styles.boxModelLeft}>
        <UnitInput compact value={paddingLeft} placeholder={defaultPaddingLeft || "0"} onChange={(v) => onPaddingChange("left", v)} />
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
        {/* All-padding shortcut */}
        <div className={styles.boxModelAllRows}>
          <div className={styles.boxModelAllRow}>
            <span className={styles.boxModelAllLabel}>All padding</span>
            <UnitInput
              value={unifiedPadding.mixed ? "" : unifiedPadding.value}
              placeholder={unifiedPadding.mixed ? "mixed" : "0"}
              onChange={setAllPadding}
            />
          </div>
        </div>
        {paddingLayer}
      </div>
    );
  }

  return (
    <div className={styles.boxModel}>
      {/* All-sides shortcuts */}
      <div className={styles.boxModelAllRows}>
        <div className={styles.boxModelAllRow}>
          <span className={styles.boxModelAllLabel}>All margin</span>
          <UnitInput
            value={unifiedMargin.mixed ? "" : unifiedMargin.value}
            placeholder={unifiedMargin.mixed ? "mixed" : "0"}
            onChange={setAllMargins}
          />
        </div>
        <div className={styles.boxModelAllRow}>
          <span className={styles.boxModelAllLabel}>All padding</span>
          <UnitInput
            value={unifiedPadding.mixed ? "" : unifiedPadding.value}
            placeholder={unifiedPadding.mixed ? "mixed" : "0"}
            onChange={setAllPadding}
          />
        </div>
      </div>

      {/* Margin layer (outermost) */}
      <div className={styles.boxModelMargin}>
        <span className={styles.boxModelLabel}>margin</span>
        <div className={styles.boxModelTop}>
          <UnitInput compact value={marginTop} placeholder={defaultMarginTop || "0"} onChange={(v) => onMarginChange("top", v)} />
        </div>
        <div className={styles.boxModelRight}>
          <UnitInput compact value={marginRight} placeholder={defaultMarginRight || "0"} onChange={(v) => onMarginChange("right", v)} />
        </div>
        <div className={styles.boxModelBottom}>
          <UnitInput compact value={marginBottom} placeholder={defaultMarginBottom || "0"} onChange={(v) => onMarginChange("bottom", v)} />
        </div>
        <div className={styles.boxModelLeft}>
          <UnitInput compact value={marginLeft} placeholder={defaultMarginLeft || "0"} onChange={(v) => onMarginChange("left", v)} />
        </div>

        {paddingLayer}
      </div>
    </div>
  );
}
