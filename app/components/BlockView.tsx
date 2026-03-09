import { JSX } from "react";
import type { Block } from "../models";
import { useTheme } from "../contexts/ThemeContext";
import { useEditor } from "../contexts/EditorContext";
import ContentView from "./ContentView";
import RichTextView from "./RichTextView";
import EditableRichText from "./editor/EditableRichText";
import styles from "./editor/editor.module.css";

interface Props {
  block: Block;
  parentBlockId?: string;
}

export default function BlockView({ block, parentBlockId }: Props) {
  const theme = useTheme();
  const editor = useEditor();

  const isSelected = editor?.selectedBlockId === block.id;
  const isEditing = editor?.editingBlockId === block.id;
  const editingField = editor?.editingField;

  // --- Header ---
  let header: JSX.Element | null = null;
  if (block.header) {
    const { tag: Tag, content } = block.header;

    if (isEditing && editingField === "header") {
      // Inline editing mode
      header = (
        <EditableRichText
          richText={content}
          as={Tag}
          style={theme[Tag]}
          saveOnEnter
          onSave={(rt) => {
            editor!.dispatch({ type: "UPDATE_RICH_TEXT", blockId: block.id, field: "header", richText: rt });
            editor!.dispatch({ type: "STOP_EDITING" });
          }}
          onCancel={() => editor!.dispatch({ type: "STOP_EDITING" })}
        />
      );
    } else {
      header = (
        <Tag
          style={theme[Tag]}
          onDoubleClick={
            editor
              ? (e: React.MouseEvent) => {
                  e.stopPropagation();
                  editor.dispatch({ type: "START_EDITING", blockId: block.id, field: "header" });
                }
              : undefined
          }
        >
          <RichTextView richText={content} />
        </Tag>
      );
    }
  }

  // --- Editor interaction props ---
  // Only allow direct selection if top-level or parent is selected
  const canSelect = !parentBlockId || editor?.selectedBlockId === parentBlockId;

  const editorProps = editor && canSelect
    ? {
        className: `${styles.selectableBlock} ${isSelected ? styles.selectedBlock : ""}`,
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!isSelected) {
            editor.dispatch({ type: "SELECT_BLOCK", blockId: block.id });
          }
        },
      }
    : {};

  return (
    <div style={block.style} {...editorProps}>
      {header}
      <ContentView content={block.content} blockId={block.id} />
    </div>
  );
}
