"use client";

import { X } from "lucide-react";
import styles from "./editor.module.css";

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
  isOverridden?: boolean;
  onReset?: () => void;
}

export default function PropertyRow({ label, children, isOverridden, onReset }: PropertyRowProps) {
  return (
    <div className={styles.propRow}>
      <label className={`${styles.propLabel} ${isOverridden ? styles.propLabelOverridden : ""}`}>
        {isOverridden && <span className={styles.propLabelDot} />}
        {label}
        {isOverridden && onReset && (
          <button
            type="button"
            className={styles.propLabelReset}
            onClick={(e) => {
              e.preventDefault();
              onReset();
            }}
            title="Reset to inherited"
            aria-label={`Reset ${label}`}
          >
            <X size={10} />
          </button>
        )}
      </label>
      {children}
    </div>
  );
}
