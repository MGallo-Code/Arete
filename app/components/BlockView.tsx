import { JSX } from "react";
import type { Block, Theme } from "../models";
import ContentView from "./ContentView";

interface Props {
  block: Block;
  theme: Theme;
}

export default function BlockView({ block, theme }: Props) {
  let header: JSX.Element | null = null;
  if (block.header) {
    const Tag = `h${block.header.level}` as keyof JSX.IntrinsicElements;
    header = <Tag>{block.header.content.map((r) => r.text).join("")}</Tag>;
  }
  return (
    <div style={block.style}>
      {header}
      <ContentView content={block.content} theme={theme} />
    </div>
  );
}
