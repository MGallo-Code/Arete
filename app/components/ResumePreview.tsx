"use client";
import type { Block, Content, Resume, Template } from "../models";
import BlockView from "./BlockView";

interface Props {
  resume: Resume;
}
export default function ResumePreview({ resume }: Props) {
  const margins = resume.template.page.margins;

  return (
    <main style={{ display: "grid", gridTemplate: resume.template.grid, ...margins }}>
      {Object.entries(resume.regionBlockIds).map(([regionId, blockIds]) => (
        <div
          key={regionId}
          style={{ gridArea: regionId, ...resume.template.regionStyles[regionId] }}
        >
          {blockIds.map((blockId) => (
            <BlockView key={blockId} block={resume.blocks[blockId]} theme={resume.template.theme} />
          ))}
        </div>
      ))}
    </main>
  );
}
