"use client";

import { useState, useEffect } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import styles from "./editor.module.css";

// Persists open/closed state across remounts (e.g. block selection changes)
const sectionState = new Map<string, boolean>();

interface CollapsibleSectionProps {
  title: string;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  panelId?: string;
  children: React.ReactNode;
}

function Chevron() {
  return (
    <svg className={styles.collapsibleChevron} viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2l4 3-4 3" />
    </svg>
  );
}

export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  badge,
  panelId,
  children,
}: CollapsibleSectionProps) {
  const key = panelId ? `${panelId}::${title}` : title;
  // Always use defaultOpen for SSR/initial render to avoid hydration mismatch.
  // Restore persisted state after mount.
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const saved = sectionState.get(key);
    if (saved != null && saved !== defaultOpen) {
      setOpen(saved);
    }
  }, [key, defaultOpen]);

  const handleChange = (value: boolean) => {
    sectionState.set(key, value);
    setOpen(value);
  };

  return (
    <Collapsible.Root open={open} onOpenChange={handleChange} className={styles.collapsibleRoot}>
      <Collapsible.Trigger asChild>
        <button className={styles.collapsibleTrigger}>
          <Chevron />
          {icon && <span className={styles.collapsibleIcon}>{icon}</span>}
          <span className={styles.collapsibleLabel}>{title}</span>
          {badge}
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className={styles.collapsibleContent}>
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
