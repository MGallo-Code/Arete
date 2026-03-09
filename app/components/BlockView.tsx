import { JSX } from "react";
import type { Block, Theme } from "../models";
import ContentView from "./ContentView";
import RichTextView from "./RichTextView";

interface Props {
  block: Block;
  theme: Theme;
}

export default function BlockView({ block, theme }: Props) {
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
      <ContentView content={block.content} theme={theme} />
    </div>
  );
}
