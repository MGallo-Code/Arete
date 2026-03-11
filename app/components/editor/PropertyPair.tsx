"use client";

import styles from "./editor.module.css";

interface PropertyPairProps {
  children: [React.ReactNode, React.ReactNode];
}

export default function PropertyPair({ children }: PropertyPairProps) {
  return (
    <div className={styles.propertyPair}>
      {children[0]}
      {children[1]}
    </div>
  );
}
