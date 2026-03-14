/**
 * BlockView renders a single block inside the resume preview.
 *
 * RESUME LAYOUT INTEGRITY: This component renders inside the resume page.
 * Never add visible placeholder elements (text, spacers, backgrounds) that
 * would alter the layout or differ from PDF export. Selection outlines use
 * CSS pseudo-elements (::after) which don't affect layout. The FloatingToolbar
 * uses position:absolute and lives outside document flow. See ContentView.tsx
 * header comment for the full policy.
 */

import { JSX } from "react";
import type { Block } from "../models";
import { useTheme } from "../contexts/ThemeContext";
import { useEditor, getBlockLabel } from "../contexts/EditorContext";
import ContentView from "./ContentView";
import RichTextView from "./RichTextView";
import EditableRichText from "./editor/EditableRichText";
import FloatingToolbar from "./editor/FloatingToolbar";
import styles from "./editor/editor.module.css";

interface Props {
  block: Block;
  ancestorPath?: string[];
  regionId?: string;
  blockIndex?: number;
  totalBlocks?: number;
  inheritedTextDecoration?: string;
  inheritedFontSize?: string;
}

export default function BlockView({ block, ancestorPath, regionId, blockIndex, totalBlocks, inheritedTextDecoration, inheritedFontSize }: Props) {
  const theme = useTheme();
  const editor = useEditor();

  const blockPath = [...(ancestorPath ?? []), block.id];

  const isInPath = editor?.selectedPath.includes(block.id) ?? false;
  const isSelected = editor?.selectedBlockId === block.id; // last in path
  const isExpanded = isInPath && !isSelected; // in path but not last
  const isEditing = editor?.editingBlockId === block.id;
  const editingField = editor?.editingField;

  // text-decoration is special in CSS: it "paints" across all descendant text
  // and children cannot remove it. We implement our own inheritance chain via
  // props: strip textDecoration from the div, compute the effective value
  // (explicit > inherited), apply to heading/content, pass to children.
  const {
    textDecoration: blockTextDecoration,
    backgroundImage: bgImage,
    backgroundSize: bgSize,
    backgroundPosition: bgPosition,
    backgroundRepeat: bgRepeat,
    backgroundImageOpacity: bgImageOpacity,
    ...divStyle
  } = (block.style ?? {}) as Record<string, string | undefined>;
  const effectiveTextDecoration = blockTextDecoration || inheritedTextDecoration;
  const blockFontSize = divStyle.fontSize as string | undefined;
  const effectiveFontSize = blockFontSize || inheritedFontSize;

  // Background image rendered as a separate overlay div so its opacity
  // can be controlled independently from the background color.
  const hasBgImage = !!bgImage;
  if (hasBgImage) {
    divStyle.position = divStyle.position || "relative";
  }

  // --- Header ---
  let header: JSX.Element | null = null;
  if (block.header) {
    const { tag: Tag, content } = block.header;

    // Apply effective textDecoration onto heading (overrides theme style)
    const headingStyle = effectiveTextDecoration
      ? { ...theme[Tag], textDecoration: effectiveTextDecoration }
      : theme[Tag];

    if (isEditing && editingField === "header") {
      // Inline editing mode
      header = (
        <EditableRichText
          richText={content}
          as={Tag}
          style={headingStyle}
          linkStyle={theme.link}
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
          style={headingStyle}
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
  const parentId = ancestorPath && ancestorPath.length > 0 ? ancestorPath[ancestorPath.length - 1] : null;
  const canSelect = !parentId || (editor?.selectedPath.includes(parentId) ?? false);

  const blockLabel = getBlockLabel(block);

  const editorProps = editor && canSelect
    ? {
        role: "group" as const,
        "aria-label": blockLabel,
        tabIndex: 0,
        className: [
          styles.selectableBlock,
          isEditing ? styles.editingBlock : isSelected ? styles.selectedBlock : "",
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

  // --- Floating toolbar (only for top-level selected blocks, not when editing) ---
  const showToolbar = isSelected && !isEditing && regionId != null && blockIndex != null && totalBlocks != null;

  return (
    <div style={divStyle as React.CSSProperties} {...editorProps}>
      {hasBgImage && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: bgImage,
            backgroundSize: bgSize || "cover",
            backgroundPosition: bgPosition || "center",
            backgroundRepeat: bgRepeat || "no-repeat",
            opacity: bgImageOpacity != null ? Number(bgImageOpacity) : 1,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      {showToolbar && (
        <FloatingToolbar
          blockId={block.id}
          regionId={regionId!}
          blockIndex={blockIndex!}
          totalBlocks={totalBlocks!}
          dispatch={editor!.dispatch}
          onRequestInsert={editor!.onRequestInsert}
          hasCopiedStyle={!!editor!.copiedStyle}
        />
      )}
      {hasBgImage ? (
        <div style={{ position: "relative", zIndex: 1 }}>
          {header}
          <ContentView content={block.content} blockId={block.id} ancestorPath={blockPath} textDecoration={effectiveTextDecoration} blockFontSize={effectiveFontSize} />
        </div>
      ) : (
        <>
          {header}
          <ContentView content={block.content} blockId={block.id} ancestorPath={blockPath} textDecoration={effectiveTextDecoration} blockFontSize={effectiveFontSize} />
        </>
      )}
    </div>
  );
}
