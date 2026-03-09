"use client";

import { useRef, useEffect, useCallback } from "react";
import type { RichText, Style } from "../../models";
import { richTextToHtml, domToRichText } from "../../utils/richTextUtils";

interface Props {
  richText: RichText;
  onSave: (newText: RichText) => void;
  onCancel: () => void;
  as?: string;
  style?: Style;
  saveOnEnter?: boolean;
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelledRef.current = true;
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
        const url = prompt("Link URL:");
        if (url) document.execCommand("createLink", false, url);
      }
    },
    [onCancel, save, saveOnEnter],
  );

  const handleBlur = useCallback(() => {
    if (!cancelledRef.current) {
      save();
    }
    cancelledRef.current = false;
  }, [save]);

  // Render empty element — innerHTML is set in useEffect
  const Wrapper = Tag as React.ElementType;
  return (
    <Wrapper
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      style={{ ...style, outline: "none", cursor: "text" }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    />
  );
}
