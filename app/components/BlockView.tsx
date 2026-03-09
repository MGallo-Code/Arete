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
  ancestorPath?: string[];
}

export default function BlockView({ block, parentBlockId, ancestorPath }: Props) {
  const theme = useTheme();
  const editor = useEditor();

  const blockPath = [...(ancestorPath ?? []), block.id];

  const isInPath = editor?.selectedPath.includes(block.id) ?? false;
  const isSelected = editor?.selectedBlockId === block.id; // last in path
  const isExpanded = isInPath && !isSelected; // in path but not last
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
  // A block is selectable if it's top-level OR its parent is in the selection path
  const canSelect = !parentBlockId || (editor?.selectedPath.includes(parentBlockId) ?? false);

  const editorProps = editor && canSelect
    ? {
        className: [
          styles.selectableBlock,
          isSelected ? styles.selectedBlock : "",
          isExpanded ? styles.expandedBlock : "",
        ].filter(Boolean).join(" "),
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          if (!isSelected) {
            editor.dispatch({ type: "SELECT_BLOCK", path: blockPath });
          }
        },
      }
    : {};

  return (
    <div style={block.style} {...editorProps}>
      {header}
      <ContentView content={block.content} blockId={block.id} ancestorPath={blockPath} />
    </div>
  );
}
