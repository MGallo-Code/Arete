"use client";
import { useRef, useState, useEffect, useCallback } from "react";
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
  const gridRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { page, grid, regionStyles, theme } = resume.template;
  const { width, height } = PAGE_SIZES[page.size];

  const checkOverflow = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => checkOverflow());
    observer.observe(el);
    checkOverflow();
    return () => observer.disconnect();
  }, [checkOverflow]);

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
          ref={gridRef}
          style={{
            ...theme.canvas,
            display: "grid",
            gridTemplate: grid,
            height: "100%",
            position: "relative",
          }}
        >
          {Object.entries(resume.regionBlockIds).map(([regionId, blockIds]) => {
            const isRegionSelected = editor?.selectedRegionId === regionId;
            return (
            <div
              key={regionId}
              role="region"
              aria-label={regionId}
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
              {blockIds.map((blockId, index) => (
                <BlockView
                  key={blockId}
                  block={resume.blocks[blockId]}
                  regionId={editor ? regionId : undefined}
                  blockIndex={index}
                  totalBlocks={blockIds.length}
                />
              ))}
            </div>
          );
          })}
          {isOverflowing && editor && (
            <div className={styles.overflowIndicator} aria-label="Content overflows page boundary" />
          )}
        </div>
      </main>
    </ThemeProvider>
  );
}
