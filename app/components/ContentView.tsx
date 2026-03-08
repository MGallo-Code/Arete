import type { Content, Theme } from "../models";
import BlockView from "./BlockView";
import BulletsView from "./BulletsView";
import RichTextView from "./RichTextView";

interface Props {
  content: Content;
  theme: Theme;
}

export default function ContentView({ content, theme }: Props) {
  switch (content.type) {
    case "text":
      return <RichTextView richText={content.value} />;
    case "bullets":
      return <BulletsView items={content.items} levels={content.levels || theme.bullets} />;
    case "image":
      return <img src={content.src} alt={content.alt} style={content.style} />;
    case "blocks":
      return content.children.map((block, index) => (
        <BlockView key={index} block={block} theme={theme} />
      ));
    default:
      console.log("Block content not recognized.");
      return <>Error occurred!</>;
  }
}
