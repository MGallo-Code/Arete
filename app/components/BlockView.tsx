import { JSX } from "react";
import type { Block } from "../models";
import { useTheme } from "../contexts/ThemeContext";
import ContentView from "./ContentView";
import RichTextView from "./RichTextView";

interface Props {
  block: Block;
}

export default function BlockView({ block }: Props) {
  const theme = useTheme();
  let header: JSX.Element | null = null;
  if (block.header) {
    const { tag: Tag, content } = block.header;
    header = (
      <Tag style={theme[Tag]}>
        <RichTextView richText={content} />
      </Tag>
    );
  }
  return (
    <div style={block.style}>
      {header}
      <ContentView content={block.content} />
    </div>
  );
}
