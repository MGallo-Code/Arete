"use client";
import { sampleResume } from "../fixtures";
import { Block, Content } from "../models";
import { JSX } from "react";

export default function ResumePreview() {
  const resume = sampleResume;

  const blockContent = (content: Content) => {
    return <p>{content.type}</p>;
  };

  const regionBlocks = (blocks: Record<string, Block>, blockIds: string[]) => {
    return blockIds.map((blockId) => {
      const block = blocks[blockId];
      let header: JSX.Element | null = null;
      if (block.header) {
        const Tag = `h${block.header.level}` as keyof JSX.IntrinsicElements;
        header = <Tag>{block.header.content.map((r) => r.text).join("")}</Tag>;
      }
      return (
        <div key={blockId} style={block.style}>
          {header}
          {blockContent(block.content)}
        </div>
      );
    });
  };

  return (
    <main style={{ display: "grid", gridTemplate: resume.template.grid }}>
      {Object.entries(resume.blockIdsByRegion).map(([regionId, blockIds]) => (
        <div key={regionId} style={resume.template.areas[regionId].style}>
          {regionBlocks(resume.blocks, blockIds)}
        </div>
      ))}
    </main>
  );
}
