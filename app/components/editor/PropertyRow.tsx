"use client";

import styles from "./editor.module.css";

interface PropertyRowProps {
  label: string;
  children: React.ReactNode;
}

export default function PropertyRow({ label, children }: PropertyRowProps) {
  return (
    <div className={styles.propRow}>
      <label className={styles.propLabel}>{label}</label>
      {children}
    </div>
  );
}
