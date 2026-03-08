import { JSX } from "react";
import type { Block } from "../models";

interface Props {
  block: Block;
}

export default function BlockView({ block }: Props) {
  let header: JSX.Element | null = null;
  if (block.header) {
    const Tag = `h${block.header.level}` as keyof JSX.IntrinsicElements;
    header = <Tag>{block.header.content.map((r) => r.text).join("")}</Tag>;
  }
  return (
    <div style={block.style}>
      {header}
      <>CONTENT HERE</>
    </div>
  );
}
