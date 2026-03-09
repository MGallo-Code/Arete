"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import styles from "./editor.module.css";

interface Props {
  /** The contentEditable container to monitor for selections */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Called when the user clicks the link button */
  onLinkClick: () => void;
}

interface ToolbarPosition {
  top: number;
  left: number;
}

interface FormatState {
  bold: boolean;
  italic: boolean;
}

export default function InlineToolbar({ containerRef, onLinkClick }: Props) {
  const [position, setPosition] = useState<ToolbarPosition | null>(null);
  const [formatState, setFormatState] = useState<FormatState>({ bold: false, italic: false });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updateToolbar = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setPosition(null);
      return;
    }

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setPosition(null);
      return;
    }

    // Check that the selection is within our container
    const anchorNode = sel.anchorNode;
    const focusNode = sel.focusNode;
    if (!anchorNode || !focusNode) {
      setPosition(null);
      return;
    }
    if (!container.contains(anchorNode) || !container.contains(focusNode)) {
      setPosition(null);
      return;
    }

    // Get the selection's bounding rect
    const range = sel.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    if (rangeRect.width === 0 && rangeRect.height === 0) {
      setPosition(null);
      return;
    }

    // Position above the selection, centered horizontally
    const toolbarWidth = toolbarRef.current?.offsetWidth ?? 100;
    const top = rangeRect.top - 36;
    const left = rangeRect.left + rangeRect.width / 2 - toolbarWidth / 2;

    // Clamp to viewport
    const clampedLeft = Math.max(4, Math.min(left, window.innerWidth - toolbarWidth - 4));
    const clampedTop = Math.max(4, top);

    setPosition({ top: clampedTop, left: clampedLeft });

    // Query format state
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
    });
  }, [containerRef]);

  useEffect(() => {
    const handler = () => updateToolbar();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [updateToolbar]);

  const handleBold = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      document.execCommand("bold");
      // Update format state immediately
      setFormatState((prev) => ({ ...prev, bold: !prev.bold }));
    },
    [],
  );

  const handleItalic = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      document.execCommand("italic");
      setFormatState((prev) => ({ ...prev, italic: !prev.italic }));
    },
    [],
  );

  const handleLink = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onLinkClick();
    },
    [onLinkClick],
  );

  if (!position) return null;

  return (
    <div
      ref={toolbarRef}
      className={styles.inlineToolbar}
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        className={`${styles.inlineToolbarBtn} ${formatState.bold ? styles.inlineToolbarBtnActive : ""}`}
        onMouseDown={handleBold}
        title="Bold (Cmd+B)"
      >
        <strong>B</strong>
      </button>
      <button
        className={`${styles.inlineToolbarBtn} ${formatState.italic ? styles.inlineToolbarBtnActive : ""}`}
        onMouseDown={handleItalic}
        title="Italic (Cmd+I)"
      >
        <em>I</em>
      </button>
      <button
        className={styles.inlineToolbarBtn}
        onMouseDown={handleLink}
        title="Link (Cmd+K)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
    </div>
  );
}
