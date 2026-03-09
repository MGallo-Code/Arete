"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styles from "./editor.module.css";

interface LinkModalProps {
  initialUrl: string;
  /** Pixel position to anchor near (top-left of the modal) */
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
  const cardRef = useRef<HTMLDivElement>(null);
  const hasExistingLink = initialUrl.length > 0;

  // Auto-focus input on mount
  useEffect(() => {
    // Small delay to ensure DOM is ready
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

  // Position the modal near the selection, or center it
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
    <div
      className={styles.linkModalOverlay}
      data-link-modal
      onMouseDown={(e) => {
        // Clicking the backdrop cancels
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div ref={cardRef} className={styles.linkModalCard} style={positionStyle}>
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
      </div>
    </div>
  );
}
