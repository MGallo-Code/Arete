"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { BulletItem, BulletLevel, RichText } from "../models";
import { useEditor } from "../contexts/EditorContext";
import { richTextToHtml, domToRichText } from "../utils/richTextUtils";
import RichTextView from "./RichTextView";
import LinkModal from "./editor/LinkModal";
import InlineToolbar from "./editor/InlineToolbar";

interface Props {
  items: BulletItem[];
  levels: BulletLevel[];
  blockId?: string;
}

// --- Stable key generation (ref-based per instance to survive HMR) ---

function useKeyGenerator() {
  const counterRef = useRef(0);
  return useCallback(() => `bi-${counterRef.current++}`, []);
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
  onPaste,
  registerRef,
}: {
  itemKey: string;
  content: RichText;
  index: number;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onBlur: (e: React.FocusEvent) => void;
  onPaste: (e: React.ClipboardEvent, index: number) => void;
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
      onPaste={(e) => onPaste(e, index)}
    />
  );
}

// --- Main component ---

export default function BulletsView({ items, levels, blockId }: Props) {
  const editor = useEditor();
  const genKey = useKeyGenerator();
  const [editingItems, setEditingItems] = useState<EditingItem[] | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const listRef = useRef<HTMLUListElement>(null);

  // Link modal state
  const [linkModal, setLinkModal] = useState<{
    initialUrl: string;
    anchorRect?: { top: number; left: number };
    savedRange: Range;
  } | null>(null);

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

  const openLinkModal = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const savedRange = sel.getRangeAt(0).cloneRange();
    let existingUrl = "";
    let node: Node | null = sel.anchorNode;
    while (node) {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "A") {
        existingUrl = (node as HTMLAnchorElement).href || "";
        break;
      }
      node = node.parentNode;
    }
    const rect = savedRange.getBoundingClientRect();
    const anchorRect =
      rect.width > 0 || rect.height > 0 ? { top: rect.bottom, left: rect.left } : undefined;
    setLinkModal({ initialUrl: existingUrl, anchorRect, savedRange });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent, index: number) => {
      if (!editingItems) return;
      e.preventDefault();
      const text = e.clipboardData.getData("text/plain");
      const lines = text.split(/\r?\n/).filter((line) => line.length > 0);

      if (lines.length <= 1) {
        // Single line — just insert as plain text in the current bullet
        document.execCommand("insertText", false, text);
        return;
      }

      // Multi-line paste: insert first line at cursor, create new bullets for the rest
      document.execCommand("insertText", false, lines[0]);

      // Read back the current bullet content after inserting the first line
      const currentKey = editingItems[index].key;
      const currentContent = readRef(currentKey);
      const currentLevel = editingItems[index].item.level;

      const newEditingItems = [...editingItems];
      newEditingItems[index] = {
        ...newEditingItems[index],
        item: { ...newEditingItems[index].item, content: currentContent },
      };

      // Create new bullets for remaining lines
      const newBullets: EditingItem[] = lines.slice(1).map((line) => ({
        key: genKey(),
        item: { content: [{ text: line }], level: currentLevel },
      }));
      newEditingItems.splice(index + 1, 0, ...newBullets);

      setEditingItems(newEditingItems);
      setFocusIndex(index + newBullets.length);
    },
    [editingItems, readRef],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (!editingItems) return;

      // Enter → save current text, insert new empty bullet below
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const currentKey = editingItems[index].key;
        const el = refsMap.current.get(currentKey);
        const isEmpty = (el?.textContent ?? "").trim() === "";

        // If current bullet is empty, treat Enter as "finish list":
        // delete this bullet; if that empties the list, remove all bullets.
        if (isEmpty) {
          const remaining = editingItems.filter((_, i) => i !== index);

          if (editor && blockId) {
            if (remaining.length === 0) {
              // Entire list deleted
              editor.dispatch({ type: "UPDATE_BULLET_ITEMS", blockId, items: [] });
            } else {
              // Save remaining bullets' DOM back to the model
              const finalItems = remaining.map((ei) => ({
                ...ei.item,
                content: readRef(ei.key),
              }));
              editor.dispatch({ type: "UPDATE_BULLET_ITEMS", blockId, items: finalItems });
            }
          }

          // Exit editing mode
          setEditingItems(null);
          setFocusIndex(null);
          return;
        }

        // Non-empty bullet: save current text and insert a new bullet below
        const currentContent = readRef(currentKey);
        const currentLevel = editingItems[index].item.level;

        const newEditingItems = [...editingItems];
        newEditingItems[index] = {
          ...newEditingItems[index],
          item: { ...newEditingItems[index].item, content: currentContent },
        };
        const newItem: EditingItem = {
          key: genKey(),
          item: { content: [{ text: "" }], level: currentLevel },
        };
        newEditingItems.splice(index + 1, 0, newItem);
        setEditingItems(newEditingItems);
        setFocusIndex(index + 1);
        return;
      }

      // Backspace in an empty bullet → delete it and focus previous
      if (e.key === "Backspace") {
        const el = refsMap.current.get(editingItems[index].key);
        const isEmpty = (el?.textContent ?? "").trim() === "";

        if (isEmpty) {
          e.preventDefault();
          if (editingItems.length > 1) {
            // Remove this bullet and focus the previous one
            const newEditingItems = editingItems.filter((_, i) => i !== index);
            setEditingItems(newEditingItems);
            setFocusIndex(Math.max(0, index - 1));
          } else {
            // Last bullet — just save and exit editing mode
            saveAndExit();
          }
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
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openLinkModal();
      }
    },
    [editingItems, levels.length, readRef, saveAndExit, openLinkModal],
  );

  // Link modal callbacks
  const handleLinkApply = useCallback(
    (url: string) => {
      if (!linkModal) return;
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(linkModal.savedRange);
      document.execCommand("createLink", false, url);
      setLinkModal(null);
    },
    [linkModal],
  );

  const handleLinkRemove = useCallback(() => {
    if (!linkModal) return;
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(linkModal.savedRange);
    document.execCommand("unlink");
    setLinkModal(null);
  }, [linkModal]);

  const handleLinkCancel = useCallback(() => {
    if (linkModal) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(linkModal.savedRange);
    }
    setLinkModal(null);
  }, [linkModal]);

  // Handle blur — check if focus is still within the list
  const handleBlur = useCallback(
    () => {
      // If link modal is open, don't save/exit — focus moved to the modal
      if (linkModal) return;
      setTimeout(() => {
        const active = document.activeElement;
        // Check if focus moved to the link modal overlay
        if (active?.closest("[data-link-modal]")) return;
        for (const el of refsMap.current.values()) {
          if (el === active) return;
        }
        // Focus left the list entirely
        saveAndExit();
      }, 0);
    },
    [saveAndExit, linkModal],
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
    <>
    <ul ref={listRef} style={{ listStyle: "none" }}>
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
                onPaste={handlePaste}
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
    {editing && <InlineToolbar containerRef={listRef} onLinkClick={openLinkModal} />}
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
