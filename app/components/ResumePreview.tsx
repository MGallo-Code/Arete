"use client";
import { useEditor } from "../contexts/EditorContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import type { Resume } from "../models";
import BlockView from "./BlockView";
import styles from "./editor/editor.module.css";

const PAGE_SIZES = {
  letter: { width: "8.5in", height: "11in" },
  a4: { width: "210mm", height: "297mm" },
};

interface Props {
  resume: Resume;
}

export default function ResumePreview({ resume }: Props) {
  const editor = useEditor();
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
            <div
              key={regionId}
              style={{ display: "flex", flexDirection: "column" as const, gridArea: regionId, ...regionStyles[regionId] }}
              {...(editor
                ? {
                    className: `${styles.selectableBlock} ${
                      editor.selectedRegionId === regionId ? styles.selectedBlock : ""
                    }`,
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      editor.dispatch({ type: "SELECT_REGION", regionId });
                    },
                  }
                : {})}
            >
              {blockIds.map((blockId, index) => (
                <BlockView
                  key={blockId}
                  block={resume.blocks[blockId]}
                  regionId={editor ? regionId : undefined}
                  blockIndex={editor ? index : undefined}
                  totalBlocks={editor ? blockIds.length : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </main>
    </ThemeProvider>
  );
}
