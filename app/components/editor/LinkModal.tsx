"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import styles from "./editor.module.css";

interface LinkModalProps {
  initialUrl: string;
  anchorRect?: { top: number; left: number };
  onApply: (url: string) => void;
  onRemove: () => void;
  onCancel: () => void;
}

export default function LinkModal({
  initialUrl,
  anchorRect,
  onApply,
  onRemove,
  onCancel,
}: LinkModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasExistingLink = initialUrl.length > 0;

  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = url.trim();
    if (trimmed) {
      onApply(trimmed);
    }
  }, [url, onApply]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    },
    [handleSubmit, onCancel],
  );

  const positionStyle: React.CSSProperties = anchorRect
    ? {
        position: "fixed",
        top: anchorRect.top,
        left: anchorRect.left,
        transform: "translateY(4px)",
      }
    : {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onCancel(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={styles.linkModalOverlay}
          data-link-modal
        />
        <Dialog.Content
          className={styles.linkModalCard}
          style={positionStyle}
          onOpenAutoFocus={(e) => e.preventDefault()}
          aria-describedby={undefined}
        >
          <VisuallyHidden.Root asChild>
            <Dialog.Title>Edit Link</Dialog.Title>
          </VisuallyHidden.Root>
          <label className={styles.linkModalLabel}>URL</label>
          <input
            ref={inputRef}
            className={styles.linkModalInput}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://..."
          />
          <div className={styles.linkModalActions}>
            <button
              className={styles.linkModalApplyBtn}
              onClick={handleSubmit}
              disabled={!url.trim()}
            >
              Apply
            </button>
            {hasExistingLink && (
              <button className={styles.linkModalRemoveBtn} onClick={onRemove}>
                Remove link
              </button>
            )}
            <button className={styles.linkModalCancelBtn} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
