/**
 * ContentView renders block content inside the resume preview.
 *
 * IMPORTANT — RESUME LAYOUT INTEGRITY:
 * This component renders INSIDE the resume page. It must NEVER add visible
 * elements (text, placeholders, borders, backgrounds, icons) that would alter
 * the resume's visual layout. The preview must always match the PDF output.
 *
 * Allowed in the preview area:
 *   - Selection outlines (CSS pseudo-elements, don't affect layout)
 *   - Floating toolbars (position: absolute, outside document flow)
 *   - Inline contentEditable editing (replaces existing content in-place)
 *
 * NOT allowed in the preview area:
 *   - Placeholder text ("Click to edit", "Add image URL", etc.)
 *   - Min-height spacers on empty content
 *   - Styled placeholder divs (dashed borders, gray backgrounds)
 *   - Any element that would cause the preview to differ from PDF export
 *
 * Empty blocks are still selectable — the parent block div in BlockView
 * provides the click target. Empty content simply renders nothing.
 * Content editing for empty blocks is handled via the sidebar controls.
 */

import type { Content } from "../models";
import { useTheme } from "../contexts/ThemeContext";
import { useEditor } from "../contexts/EditorContext";
import BlockView from "./BlockView";
import BulletsView from "./BulletsView";
import RichTextView from "./RichTextView";
import EditableRichText from "./editor/EditableRichText";

interface Props {
  content: Content;
  blockId: string;
  ancestorPath?: string[];
}

export default function ContentView({ content, blockId, ancestorPath }: Props) {
  const theme = useTheme();
  const editor = useEditor();

  const isEditing = editor?.editingBlockId === blockId && editor?.editingField === "content";

  switch (content.type) {
    case "text": {
      const isEmpty =
        !content.value ||
        content.value.length === 0 ||
        (content.value.length === 1 && !content.value[0].text.trim());

      if (isEditing) {
        return (
          <EditableRichText
            richText={content.value}
            onSave={(rt) => {
              editor!.dispatch({ type: "UPDATE_RICH_TEXT", blockId, field: "content", richText: rt });
              editor!.dispatch({ type: "STOP_EDITING" });
            }}
            onCancel={() => editor!.dispatch({ type: "STOP_EDITING" })}
          />
        );
      }

      // Empty content renders nothing — block is still selectable via its
      // parent div in BlockView. Editing is available via sidebar controls.
      if (isEmpty) return null;

      return (
        <div
          onDoubleClick={
            editor
              ? (e) => {
                  e.stopPropagation();
                  editor.dispatch({ type: "START_EDITING", blockId, field: "content" });
                }
              : undefined
          }
        >
          <RichTextView richText={content.value} />
        </div>
      );
    }

    case "bullets":
      return <BulletsView items={content.items} levels={content.levels ?? theme.bullets} blockId={blockId} />;

    case "image":
      // Empty src renders nothing — no placeholder elements in the resume area.
      if (!content.src || !content.src.trim()) return null;
      return <img src={content.src} alt={content.alt} style={content.style} />;

    case "blocks":
      return content.children.map((child, index) => (
        <BlockView key={index} block={child} ancestorPath={ancestorPath} />
      ));
  }
}
