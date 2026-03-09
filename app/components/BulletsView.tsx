"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { BulletItem, BulletLevel, RichText, TextRun, Style } from "../models";
import { useEditor } from "../contexts/EditorContext";
import RichTextView from "./RichTextView";

interface Props {
  items: BulletItem[];
  levels: BulletLevel[];
  blockId?: string;
}

// --- Utility functions (duplicated from EditableRichText to avoid circular deps) ---

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function kebab(key: string): string {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

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

// --- Stable key generation ---

let nextKey = 0;
function genKey(): string {
  return `bi-${nextKey++}`;
}

// --- Editing item with stable key ---

interface EditingItem {
  key: string;
  item: BulletItem;
}

// --- Sub-component for editable bullet content ---
// Manages its own ref, sets innerHTML on mount only (DOM is source of truth during editing)

function EditableBulletContent({
  itemKey,
  content,
  index,
  onKeyDown,
  onBlur,
  registerRef,
}: {
  itemKey: string;
  content: RichText;
  index: number;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onBlur: (e: React.FocusEvent) => void;
  registerRef: (key: string, el: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Set innerHTML only on mount — after that, DOM is the source of truth
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = richTextToHtml(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    registerRef(itemKey, ref.current);
    return () => registerRef(itemKey, null);
  }, [itemKey, registerRef]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      style={{ flex: 1, outline: "none", cursor: "text", minHeight: "1em" }}
      onKeyDown={(e) => onKeyDown(e, index)}
      onBlur={onBlur}
    />
  );
}

// --- Main component ---

export default function BulletsView({ items, levels, blockId }: Props) {
  const editor = useEditor();
  const [editingItems, setEditingItems] = useState<EditingItem[] | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());

  const editing = editingItems !== null;

  // Read RichText from a specific ref's DOM
  const readRef = useCallback((key: string): RichText => {
    const el = refsMap.current.get(key);
    return el ? domToRichText(el) : [{ text: "" }];
  }, []);

  // Save all editing items and exit editing mode
  const saveAndExit = useCallback(() => {
    if (editor && blockId && editingItems) {
      const finalItems = editingItems.map((ei) => ({
        ...ei.item,
        content: readRef(ei.key),
      }));
      editor.dispatch({ type: "UPDATE_BULLET_ITEMS", blockId, items: finalItems });
    }
    setEditingItems(null);
    setFocusIndex(null);
  }, [editor, blockId, editingItems, readRef]);

  // Focus management: when focusIndex or editingItems change, focus the target bullet
  useEffect(() => {
    if (focusIndex !== null && editingItems && editingItems[focusIndex]) {
      const key = editingItems[focusIndex].key;
      requestAnimationFrame(() => {
        const el = refsMap.current.get(key);
        if (el) {
          el.focus();
          const range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(false);
          const sel = window.getSelection();
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      });
    }
  }, [focusIndex, editingItems]);

  // Stable ref registration callback
  const registerRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) {
      refsMap.current.set(key, el);
    } else {
      refsMap.current.delete(key);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (!editingItems) return;

      // Enter → save current text, insert new empty bullet below
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const currentKey = editingItems[index].key;
        const currentContent = readRef(currentKey);
        const currentLevel = editingItems[index].item.level;

        const newEditingItems = [...editingItems];
        // Update current item with its DOM content
        newEditingItems[index] = {
          ...newEditingItems[index],
          item: { ...newEditingItems[index].item, content: currentContent },
        };
        // Insert new empty item after current
        const newItem: EditingItem = {
          key: genKey(),
          item: { content: [{ text: "" }], level: currentLevel },
        };
        newEditingItems.splice(index + 1, 0, newItem);
        setEditingItems(newEditingItems);
        setFocusIndex(index + 1);
        return;
      }

      // Backspace at start of bullet → delete if empty, or merge with previous
      if (e.key === "Backspace" && editingItems.length > 1) {
        const sel = window.getSelection();
        const atStart = sel && sel.rangeCount > 0 && sel.getRangeAt(0).collapsed && sel.getRangeAt(0).startOffset === 0;
        // Also check if the selection anchor is the element itself (fully empty div)
        const el = refsMap.current.get(editingItems[index].key);
        const isEmpty = (el?.textContent ?? "").trim() === "";

        if (atStart && isEmpty) {
          e.preventDefault();
          const newEditingItems = editingItems.filter((_, i) => i !== index);
          setEditingItems(newEditingItems);
          setFocusIndex(Math.max(0, index - 1));
          return;
        }
      }

      // Tab → indent (increase level)
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        const maxLevel = Math.max(levels.length - 1, 0);
        const currentLevel = editingItems[index].item.level ?? 0;
        if (currentLevel < maxLevel) {
          const currentContent = readRef(editingItems[index].key);
          const newEditingItems = editingItems.map((ei, i) =>
            i === index
              ? { ...ei, item: { ...ei.item, content: currentContent, level: currentLevel + 1 } }
              : ei,
          );
          setEditingItems(newEditingItems);
          setFocusIndex(index);
        }
        return;
      }

      // Shift+Tab → outdent (decrease level)
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        const currentLevel = editingItems[index].item.level ?? 0;
        if (currentLevel > 0) {
          const currentContent = readRef(editingItems[index].key);
          const newEditingItems = editingItems.map((ei, i) =>
            i === index
              ? { ...ei, item: { ...ei.item, content: currentContent, level: currentLevel - 1 } }
              : ei,
          );
          setEditingItems(newEditingItems);
          setFocusIndex(index);
        }
        return;
      }

      // Escape → save and exit
      if (e.key === "Escape") {
        e.preventDefault();
        saveAndExit();
        return;
      }

      // ArrowUp at start of line → move to previous bullet
      if (e.key === "ArrowUp" && index > 0) {
        const sel = window.getSelection();
        if (
          sel &&
          sel.rangeCount > 0 &&
          sel.getRangeAt(0).startOffset === 0 &&
          sel.getRangeAt(0).collapsed
        ) {
          e.preventDefault();
          setFocusIndex(index - 1);
        }
        return;
      }

      // ArrowDown at end of line → move to next bullet
      if (e.key === "ArrowDown" && index < editingItems.length - 1) {
        const sel = window.getSelection();
        const el = refsMap.current.get(editingItems[index].key);
        if (sel && sel.rangeCount > 0 && el) {
          const range = sel.getRangeAt(0);
          const atEnd =
            range.endOffset === (range.endContainer.textContent?.length ?? 0) && range.collapsed;
          if (atEnd) {
            e.preventDefault();
            setFocusIndex(index + 1);
          }
        }
        return;
      }

      // Rich text shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        document.execCommand("bold");
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "i") {
        e.preventDefault();
        document.execCommand("italic");
      }
    },
    [editingItems, levels.length, readRef, saveAndExit],
  );

  // Handle blur — check if focus is still within the list
  const handleBlur = useCallback(
    (_e: React.FocusEvent) => {
      setTimeout(() => {
        const active = document.activeElement;
        for (const el of refsMap.current.values()) {
          if (el === active) return;
        }
        // Focus left the list entirely
        saveAndExit();
      }, 0);
    },
    [saveAndExit],
  );

  const startEditing = useCallback(
    (index: number) => {
      setEditingItems(items.map((item) => ({ key: genKey(), item })));
      setFocusIndex(index);
    },
    [items],
  );

  // Render
  const renderItems = editing ? editingItems! : items.map((item, i) => ({ key: `v-${i}`, item }));

  return (
    <ul style={{ listStyle: "none" }}>
      {renderItems.map(({ key, item }, index) => {
        const level = levels[item.level ?? 0] ?? {};

        const marker = level.image ? (
          <img src={level.image} alt="" style={{ display: "inline", height: "1em" }} />
        ) : level.char ? (
          <span aria-hidden>{level.char}</span>
        ) : null;

        if (editing) {
          return (
            <li key={key} style={{ display: "flex", ...level.style }}>
              {marker}
              <EditableBulletContent
                itemKey={key}
                content={item.content}
                index={index}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                registerRef={registerRef}
              />
            </li>
          );
        }

        return (
          <li key={key} style={{ display: "flex", ...level.style }}>
            {marker}
            <div
              onDoubleClick={
                editor && blockId
                  ? (e) => {
                      e.stopPropagation();
                      startEditing(index);
                    }
                  : undefined
              }
              style={{ flex: 1 }}
            >
              <RichTextView richText={item.content} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
