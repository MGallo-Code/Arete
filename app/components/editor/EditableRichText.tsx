"use client";

import { useRef, useEffect, useCallback } from "react";
import type { RichText, TextRun, Style } from "../../models";

interface Props {
  richText: RichText;
  onSave: (newText: RichText) => void;
  onCancel: () => void;
  as?: string;
  style?: Style;
  saveOnEnter?: boolean;
}

/** Escape HTML for dangerouslySetInnerHTML */
function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Convert camelCase CSS key to kebab-case */
function kebab(key: string): string {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Build HTML string from RichText for initial contentEditable content */
function richTextToHtml(richText: RichText): string {
  return richText
    .map((run) => {
      const styleStr = run.style
        ? Object.entries(run.style)
            .map(([k, v]) => `${kebab(k)}:${v}`)
            .join(";")
        : "";
      const text = esc(run.text);
      if (run.link) {
        return `<a href="${esc(run.link)}"${styleStr ? ` style="${styleStr}"` : ""}>${text}</a>`;
      }
      if (styleStr) {
        return `<span style="${styleStr}">${text}</span>`;
      }
      return text;
    })
    .join("");
}

/** Parse contentEditable DOM back to RichText */
function domToRichText(container: HTMLElement): RichText {
  const runs: TextRun[] = [];

  function walk(node: Node, inherited: Style, link?: string) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text) return;
      const run: TextRun = { text };
      if (link) run.link = link;
      if (Object.keys(inherited).length > 0) run.style = { ...inherited };
      runs.push(run);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    const style: Style = { ...inherited };
    if (tag === "b" || tag === "strong") style.fontWeight = "bold";
    if (tag === "i" || tag === "em") style.fontStyle = "italic";
    if (tag === "u") style.textDecoration = "underline";

    // Pick up inline styles
    const s = el.style;
    if (s.fontWeight) style.fontWeight = s.fontWeight as string;
    if (s.fontStyle) style.fontStyle = s.fontStyle as string;
    if (s.color) style.color = s.color;
    if (s.fontSize) style.fontSize = s.fontSize;
    if (s.textDecoration) style.textDecoration = s.textDecoration as string;
    if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
    if (s.letterSpacing) style.letterSpacing = s.letterSpacing;

    const href = tag === "a" ? el.getAttribute("href") || undefined : link;

    for (const child of el.childNodes) {
      walk(child, style, href);
    }
  }

  for (const child of container.childNodes) {
    walk(child, {});
  }

  // Merge adjacent runs with identical style+link
  const merged: TextRun[] = [];
  for (const run of runs) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      prev.link === run.link &&
      JSON.stringify(prev.style ?? null) === JSON.stringify(run.style ?? null)
    ) {
      prev.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }
  return merged;
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
      onCancel();
    }
    cancelledRef.current = false;
  }, [onCancel]);

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
