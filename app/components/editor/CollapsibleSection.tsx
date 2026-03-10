"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import styles from "./editor.module.css";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  defaultOpen = true,
  badge,
  children,
}: CollapsibleSectionProps) {
  return (
    <Collapsible.Root defaultOpen={defaultOpen}>
      <Collapsible.Trigger asChild>
        <button className={styles.collapsibleTrigger}>
          <span className={styles.collapsibleArrow} />
          <span>{title}</span>
          {badge}
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.collapsibleContent}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
