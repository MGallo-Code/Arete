"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./editor.module.css";

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
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

/** Walk DOM from selection anchor to determine bold/italic state */
function getFormatStateFromSelection(): FormatState {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !sel.anchorNode) return { bold: false, italic: false };

  let bold = false;
  let italic = false;
  let node: Node | null = sel.anchorNode;

  while (node && node.nodeType !== Node.DOCUMENT_NODE) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === "b" || tag === "strong") bold = true;
      if (tag === "i" || tag === "em") italic = true;
      const computed = window.getComputedStyle(el);
      if (!bold && (computed.fontWeight === "bold" || parseInt(computed.fontWeight) >= 700)) bold = true;
      if (!italic && computed.fontStyle === "italic") italic = true;
    }
    node = node.parentNode;
  }

  return { bold, italic };
}

function InlineToolbarButton({
  label,
  shortcut,
  active,
  onAction,
  children,
}: {
  label: string;
  shortcut?: string;
  active?: boolean;
  onAction: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          className={`${styles.inlineToolbarBtn} ${active ? styles.inlineToolbarBtnActive : ""}`}
          onMouseDown={onAction}
          aria-label={label}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} sideOffset={5} side="top">
          {shortcut ? `${label} (${shortcut})` : label}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
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

    const range = sel.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    if (rangeRect.width === 0 && rangeRect.height === 0) {
      setPosition(null);
      return;
    }

    const toolbarWidth = toolbarRef.current?.offsetWidth ?? 100;
    const top = rangeRect.top - 36;
    const left = rangeRect.left + rangeRect.width / 2 - toolbarWidth / 2;

    const clampedLeft = Math.max(4, Math.min(left, window.innerWidth - toolbarWidth - 4));
    const clampedTop = Math.max(4, top);

    setPosition({ top: clampedTop, left: clampedLeft });
    setFormatState(getFormatStateFromSelection());
  }, [containerRef]);

  useEffect(() => {
    const handler = () => updateToolbar();
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, [updateToolbar]);

  const handleBold = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("bold");
    setFormatState((prev) => ({ ...prev, bold: !prev.bold }));
  }, []);

  const handleItalic = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("italic");
    setFormatState((prev) => ({ ...prev, italic: !prev.italic }));
  }, []);

  const handleLink = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onLinkClick();
    },
    [onLinkClick],
  );

  if (!position) return null;

  return (
    <Tooltip.Provider delayDuration={400}>
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
        <InlineToolbarButton label="Bold" shortcut="Cmd+B" active={formatState.bold} onAction={handleBold}>
          <strong>B</strong>
        </InlineToolbarButton>
        <InlineToolbarButton label="Italic" shortcut="Cmd+I" active={formatState.italic} onAction={handleItalic}>
          <em>I</em>
        </InlineToolbarButton>
        <InlineToolbarButton label="Link" shortcut="Cmd+K" onAction={handleLink}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </InlineToolbarButton>
      </div>
    </Tooltip.Provider>
  );
}
