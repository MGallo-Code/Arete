"use client";

import { useState } from "react";
import type { BulletItem, BulletLevel } from "../models";
import { useEditor } from "../contexts/EditorContext";
import RichTextView from "./RichTextView";
import EditableRichText from "./editor/EditableRichText";

interface Props {
  items: BulletItem[];
  levels: BulletLevel[];
  blockId?: string;
}

export default function BulletsView({ items, levels, blockId }: Props) {
  const editor = useEditor();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  return (
    <ul style={{ listStyle: "none" }}>
      {items.map((item, index) => {
        const level = levels[item.level ?? 0] ?? {};

        const marker = level.image ? (
          <img src={level.image} alt="" style={{ display: "inline", height: "1em" }} />
        ) : level.char ? (
          <span aria-hidden>{level.char}</span>
        ) : null;

        const isEditingThis = editingIndex === index;

        return (
          <li key={index} style={{ display: "flex", ...level.style }}>
            {marker}
            {isEditingThis && blockId ? (
              <EditableRichText
                richText={item.content}
                saveOnEnter
                onSave={(rt) => {
                  const newItems = items.map((it, i) =>
                    i === index ? { ...it, content: rt } : it,
                  );
                  editor!.dispatch({ type: "UPDATE_BULLET_ITEMS", blockId, items: newItems });
                  setEditingIndex(null);
                }}
                onCancel={() => setEditingIndex(null)}
              />
            ) : (
              <div
                onDoubleClick={
                  editor && blockId
                    ? (e) => {
                        e.stopPropagation();
                        setEditingIndex(index);
                      }
                    : undefined
                }
                style={{ flex: 1 }}
              >
                <RichTextView richText={item.content} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
