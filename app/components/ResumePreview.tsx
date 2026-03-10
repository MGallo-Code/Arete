"use client";
import type { EditorAction } from "../contexts/EditorContext";
import { useEditor } from "../contexts/EditorContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import type { Resume } from "../models";
import BlockView from "./BlockView";
import styles from "./editor/editor.module.css";

function InsertionZone({
  regionId,
  index,
  onRequestInsert,
  dispatch,
}: {
  regionId: string;
  index: number;
  onRequestInsert?: (regionId: string, index: number) => void;
  dispatch: React.Dispatch<EditorAction>;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRequestInsert) {
      onRequestInsert(regionId, index);
    } else {
      dispatch({ type: "ADD_BLOCK", regionId, index });
    }
  };

  return (
    <div className={styles.insertionZone} onClick={handleClick}>
      <div className={styles.insertionZoneLine} />
      <button
        type="button"
        className={styles.insertionZoneBtn}
        aria-label={`Insert block at position ${index}`}
        onClick={handleClick}
      >
        +
      </button>
    </div>
  );
}

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

  // Emit palette as CSS custom properties so var(--palette-*) works
  const paletteVars: Record<string, string> = {};
  if (theme.palette) {
    for (const [key, value] of Object.entries(theme.palette)) {
      paletteVars[`--palette-${key}`] = value;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <main
        style={{
          ...theme.root,
          ...paletteVars,
          width,
          height,
          paddingTop: page.margins.top,
          paddingRight: page.margins.right,
          paddingBottom: page.margins.bottom,
          paddingLeft: page.margins.left,
          boxSizing: "border-box",
          overflow: "hidden",
        } as React.CSSProperties}
      >
        <div
          style={{
            ...theme.canvas,
            display: "grid",
            gridTemplate: grid,
            height: "100%",
          }}
        >
          {Object.entries(resume.regionBlockIds).map(([regionId, blockIds]) => {
            const isRegionSelected = editor?.selectedRegionId === regionId;
            return (
            <div
              key={regionId}
              style={{ display: "flex", flexDirection: "column" as const, gridArea: regionId, ...regionStyles[regionId] }}
              {...(editor
                ? {
                    className: `${styles.selectableBlock} ${
                      isRegionSelected ? styles.selectedRegion : ""
                    }`,
                    onClick: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      editor.dispatch({ type: "SELECT_REGION", regionId });
                    },
                  }
                : {})}
            >
              {editor
                ? blockIds.flatMap((blockId, index) => {
                    const items = [];
                    if (index === 0) {
                      items.push(
                        <InsertionZone
                          key={`insert-${regionId}-0`}
                          regionId={regionId}
                          index={0}
                          onRequestInsert={editor.onRequestInsert}
                          dispatch={editor.dispatch}
                        />
                      );
                    }
                    items.push(
                      <BlockView
                        key={blockId}
                        block={resume.blocks[blockId]}
                        regionId={regionId}
                        blockIndex={index}
                        totalBlocks={blockIds.length}
                      />
                    );
                    items.push(
                      <InsertionZone
                        key={`insert-${regionId}-${index + 1}`}
                        regionId={regionId}
                        index={index + 1}
                        onRequestInsert={editor.onRequestInsert}
                        dispatch={editor.dispatch}
                      />
                    );
                    return items;
                  })
                : blockIds.map((blockId, index) => (
                    <BlockView
                      key={blockId}
                      block={resume.blocks[blockId]}
                      blockIndex={index}
                      totalBlocks={blockIds.length}
                    />
                  ))
              }
            </div>
          );
          })}
        </div>
      </main>
    </ThemeProvider>
  );
}
