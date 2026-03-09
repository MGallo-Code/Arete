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
    case "text":
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

    case "bullets":
      return <BulletsView items={content.items} levels={content.levels ?? theme.bullets} blockId={blockId} />;

    case "image":
      return <img src={content.src} alt={content.alt} style={content.style} />;

    case "blocks":
      return content.children.map((child, index) => (
        <BlockView key={index} block={child} ancestorPath={ancestorPath} />
      ));
  }
}
