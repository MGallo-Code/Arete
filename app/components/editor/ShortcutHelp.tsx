"use client";

import * as Dialog from "@radix-ui/react-dialog";
import styles from "./editor.module.css";

interface ShortcutHelpProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SHORTCUTS = [
  { section: "Selection", items: [
    { keys: "Click", desc: "Select block" },
    { keys: "Escape", desc: "Deselect / stop editing" },
    { keys: "↑ / ↓", desc: "Navigate blocks" },
    { keys: "Enter", desc: "Start editing selected block" },
  ]},
  { section: "Editing", items: [
    { keys: "Cmd+B", desc: "Bold" },
    { keys: "Cmd+I", desc: "Italic" },
    { keys: "Cmd+K", desc: "Insert/edit link" },
    { keys: "Enter", desc: "Save (single-line) / New bullet (bullets)" },
    { keys: "Tab", desc: "Indent bullet" },
    { keys: "Shift+Tab", desc: "Outdent bullet" },
  ]},
  { section: "Actions", items: [
    { keys: "Cmd+Z", desc: "Undo" },
    { keys: "Cmd+Shift+Z", desc: "Redo" },
    { keys: "Delete / Backspace", desc: "Delete selected block" },
    { keys: "Cmd+C", desc: "Copy block text" },
    { keys: "?", desc: "Show this help" },
  ]},
];

export default function ShortcutHelp({ open, onOpenChange }: ShortcutHelpProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalCard} style={{ width: 420 }} aria-describedby={undefined}>
          <div className={styles.modalHeader}>
            <Dialog.Title className={styles.modalTitle}>Keyboard Shortcuts</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeBtn} title="Close">×</button>
            </Dialog.Close>
          </div>
          <div className={styles.modalBody} style={{ padding: "12px 20px" }}>
            {SHORTCUTS.map((section) => (
              <div key={section.section} style={{ marginBottom: 16 }}>
                <div className={styles.themeSectionTitle}>{section.section}</div>
                {section.items.map((item) => (
                  <div key={item.keys} className={styles.shortcutRow}>
                    <kbd className={styles.shortcutKey}>{item.keys}</kbd>
                    <span className={styles.shortcutDesc}>{item.desc}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
