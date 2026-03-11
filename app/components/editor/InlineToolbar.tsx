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
  underline: boolean;
  strikethrough: boolean;
  superscript: boolean;
  subscript: boolean;
}

const EMPTY_FORMAT: FormatState = { bold: false, italic: false, underline: false, strikethrough: false, superscript: false, subscript: false };

/** Walk DOM from selection anchor to determine format state */
function getFormatStateFromSelection(): FormatState {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || !sel.anchorNode) return EMPTY_FORMAT;

  const state = { ...EMPTY_FORMAT };
  let node: Node | null = sel.anchorNode;

  while (node && node.nodeType !== Node.DOCUMENT_NODE) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === "b" || tag === "strong") state.bold = true;
      if (tag === "i" || tag === "em") state.italic = true;
      if (tag === "u") state.underline = true;
      if (tag === "s" || tag === "strike" || tag === "del") state.strikethrough = true;
      if (tag === "sup") state.superscript = true;
      if (tag === "sub") state.subscript = true;
      const computed = window.getComputedStyle(el);
      if (!state.bold && (computed.fontWeight === "bold" || parseInt(computed.fontWeight) >= 700)) state.bold = true;
      if (!state.italic && computed.fontStyle === "italic") state.italic = true;
      const td = computed.textDecorationLine || computed.textDecoration;
      if (td.includes("underline")) state.underline = true;
      if (td.includes("line-through")) state.strikethrough = true;
      if (computed.verticalAlign === "super") state.superscript = true;
      if (computed.verticalAlign === "sub") state.subscript = true;
    }
    node = node.parentNode;
  }

  return state;
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
  const [formatState, setFormatState] = useState<FormatState>(EMPTY_FORMAT);
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

  const handleUnderline = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("underline");
    setFormatState((prev) => ({ ...prev, underline: !prev.underline }));
  }, []);

  const handleStrikethrough = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("strikeThrough");
    setFormatState((prev) => ({ ...prev, strikethrough: !prev.strikethrough }));
  }, []);

  const handleSuperscript = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("superscript");
    setFormatState((prev) => ({ ...prev, superscript: !prev.superscript, subscript: false }));
  }, []);

  const handleSubscript = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand("subscript");
    setFormatState((prev) => ({ ...prev, subscript: !prev.subscript, superscript: false }));
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
        <InlineToolbarButton label="Underline" shortcut="Cmd+U" active={formatState.underline} onAction={handleUnderline}>
          <span style={{ textDecoration: "underline" }}>U</span>
        </InlineToolbarButton>
        <InlineToolbarButton label="Strikethrough" active={formatState.strikethrough} onAction={handleStrikethrough}>
          <span style={{ textDecoration: "line-through" }}>S</span>
        </InlineToolbarButton>
        <span className={styles.inlineToolbarSep} />
        <InlineToolbarButton label="Superscript" active={formatState.superscript} onAction={handleSuperscript}>
          <span>A<sup style={{ fontSize: "0.65em" }}>²</sup></span>
        </InlineToolbarButton>
        <InlineToolbarButton label="Subscript" active={formatState.subscript} onAction={handleSubscript}>
          <span>A<sub style={{ fontSize: "0.65em" }}>₂</sub></span>
        </InlineToolbarButton>
        <span className={styles.inlineToolbarSep} />
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
