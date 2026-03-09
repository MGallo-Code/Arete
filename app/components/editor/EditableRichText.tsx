"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { RichText, Style } from "../../models";
import { richTextToHtml, domToRichText } from "../../utils/richTextUtils";
import LinkModal from "./LinkModal";
import InlineToolbar from "./InlineToolbar";

interface Props {
  richText: RichText;
  onSave: (newText: RichText) => void;
  onCancel: () => void;
  as?: string;
  style?: Style;
  saveOnEnter?: boolean;
}

/** Get the existing link URL from the current selection, if any */
function getSelectedLinkUrl(): string {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return "";
  let node: Node | null = sel.anchorNode;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "A") {
      return (node as HTMLAnchorElement).href || "";
    }
    node = node.parentNode;
  }
  return "";
}

/** Get a position rect near the current selection for anchoring the modal */
function getSelectionRect(): { top: number; left: number } | undefined {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return undefined;
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return undefined;
  return { top: rect.bottom, left: rect.left };
}

export default function EditableRichText({
  richText,
  onSave,
  onCancel,
  as: Tag = "div",
  style,
  saveOnEnter = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const cancelledRef = useRef(false);

  // Link modal state
  const [linkModal, setLinkModal] = useState<{
    initialUrl: string;
    anchorRect?: { top: number; left: number };
    savedRange: Range;
  } | null>(null);

  // Set initial HTML and focus
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = richTextToHtml(richText);
    el.focus();
    // Place cursor at end
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = useCallback(() => {
    if (ref.current) {
      onSave(domToRichText(ref.current));
    }
  }, [onSave]);

  const openLinkModal = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const savedRange = sel.getRangeAt(0).cloneRange();
    const existingUrl = getSelectedLinkUrl();
    const anchorRect = getSelectionRect();
    setLinkModal({ initialUrl: existingUrl, anchorRect, savedRange });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelledRef.current = true;
        ref.current?.blur();
        onCancel();
        return;
      }
      if (saveOnEnter && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        save();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        document.execCommand("bold");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        document.execCommand("italic");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openLinkModal();
      }
    },
    [onCancel, save, saveOnEnter, openLinkModal],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      // If the link modal is open, don't treat blur as save/cancel —
      // focus is moving to the modal input
      if (linkModal) return;
      // Check if focus is moving to a child of the link modal overlay
      const related = e.relatedTarget as HTMLElement | null;
      if (related?.closest("[data-link-modal]")) return;

      if (!cancelledRef.current) {
        save();
      }
      cancelledRef.current = false;
    },
    [save, linkModal],
  );

  const restoreSelection = useCallback((range: Range) => {
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, []);

  const handleLinkApply = useCallback(
    (url: string) => {
      if (!linkModal) return;
      // Restore selection, then apply link
      restoreSelection(linkModal.savedRange);
      document.execCommand("createLink", false, url);
      setLinkModal(null);
      ref.current?.focus();
    },
    [linkModal, restoreSelection],
  );

  const handleLinkRemove = useCallback(() => {
    if (!linkModal) return;
    restoreSelection(linkModal.savedRange);
    document.execCommand("unlink");
    setLinkModal(null);
    ref.current?.focus();
  }, [linkModal, restoreSelection]);

  const handleLinkCancel = useCallback(() => {
    setLinkModal(null);
    // Restore focus back to contentEditable
    if (linkModal) {
      restoreSelection(linkModal.savedRange);
    }
    ref.current?.focus();
  }, [linkModal, restoreSelection]);

  // Render empty element — innerHTML is set in useEffect
  const Wrapper = Tag as React.ElementType;
  return (
    <>
      <Wrapper
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        style={{ ...style, outline: "none", cursor: "text" }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <InlineToolbar containerRef={ref} onLinkClick={openLinkModal} />
      {linkModal && (
        <LinkModal
          initialUrl={linkModal.initialUrl}
          anchorRect={linkModal.anchorRect}
          onApply={handleLinkApply}
          onRemove={handleLinkRemove}
          onCancel={handleLinkCancel}
        />
      )}
    </>
  );
}
