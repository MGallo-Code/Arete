"use client";
import { ThemeProvider } from "../contexts/ThemeContext";
import type { Resume } from "../models";
import BlockView from "./BlockView";

const PAGE_SIZES = {
  letter: { width: "8.5in", height: "11in" },
  a4: { width: "210mm", height: "297mm" },
};

interface Props {
  resume: Resume;
}

export default function ResumePreview({ resume }: Props) {
  const { page, grid, regionStyles, theme } = resume.template;
  const { width, height } = PAGE_SIZES[page.size];

  return (
    <ThemeProvider theme={theme}>
      <main
        style={{
          ...theme.root,
          width,
          height,
          paddingTop: page.margins.top,
          paddingRight: page.margins.right,
          paddingBottom: page.margins.bottom,
          paddingLeft: page.margins.left,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            ...theme.canvas,
            display: "grid",
            gridTemplate: grid,
            height: "100%",
          }}
        >
          {Object.entries(resume.regionBlockIds).map(([regionId, blockIds]) => (
            <div key={regionId} style={{ gridArea: regionId, ...regionStyles[regionId] }}>
              {blockIds.map((blockId) => (
                <BlockView key={blockId} block={resume.blocks[blockId]} />
              ))}
            </div>
          ))}
        </div>
      </main>
    </ThemeProvider>
  );
}
