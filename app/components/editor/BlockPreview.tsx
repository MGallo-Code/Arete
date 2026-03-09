"use client";

import { useMemo } from "react";
import type { Block, Theme } from "../../models";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { useEditorRequired } from "../../contexts/EditorContext";
import ContentView from "../ContentView";
import RichTextView from "../RichTextView";

/**
 * Renders a miniature preview of a block using the current resume's theme.
 * Wrapped in its own ThemeProvider so it picks up theme styles,
 * but NOT inside EditorContext awareness — no click-to-select or editing.
 */
export default function BlockPreview({ create }: { create: () => Block }) {
  const { resume } = useEditorRequired();
  const theme = resume.template.theme;

  // Memoize the block so we don't regenerate on every render
  const block = useMemo(() => create(), [create]);

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          ...theme.root,
          // Override page-level stuff for the miniature
          fontSize: "7pt",
          lineHeight: "1.4",
          padding: "6px 8px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <BlockMini block={block} theme={theme} />
      </div>
    </ThemeProvider>
  );
}

/** Minimal block renderer — no editor context, no selection. Scaled-down theme styles. */
function BlockMini({ block, theme }: { block: Block; theme: Theme }) {
  let header = null;
  if (block.header) {
    const { tag, content } = block.header;
    const themeStyle = theme[tag];
    // Scale down heading sizes
    const scaledStyle = {
      ...themeStyle,
      fontSize: scaleSize(themeStyle.fontSize as string | undefined),
      marginTop: scaleSize(themeStyle.marginTop as string | undefined),
      marginBottom: scaleSize(themeStyle.marginBottom as string | undefined),
    };
    const Tag = tag;
    header = (
      <Tag style={scaledStyle}>
        <RichTextView richText={content} />
      </Tag>
    );
  }

  return (
    <div style={block.style}>
      {header}
      <ContentMini content={block.content} theme={theme} />
    </div>
  );
}

function ContentMini({
  content,
  theme,
}: {
  content: Block["content"];
  theme: Theme;
}) {
  switch (content.type) {
    case "text":
      return <RichTextView richText={content.value} />;
    case "bullets":
      return (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {content.items.slice(0, 3).map((item, i) => {
            const levels = content.levels ?? theme.bullets;
            const level = levels[item.level ?? 0] ?? {};
            return (
              <li key={i} style={{ display: "flex", gap: "0.3em", fontSize: "7pt", lineHeight: "1.4", paddingLeft: level.style?.paddingLeft }}>
                {level.char && <span aria-hidden>{level.char}</span>}
                <RichTextView richText={item.content} />
              </li>
            );
          })}
          {content.items.length > 3 && (
            <li style={{ fontSize: "7pt", color: "#999", fontStyle: "italic" }}>
              +{content.items.length - 3} more...
            </li>
          )}
        </ul>
      );
    case "image":
      return (
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: content.style?.borderRadius ?? 0,
            background: "#e5e7eb",
          }}
        />
      );
    case "blocks":
      return (
        <>
          {content.children.map((child, i) => (
            <BlockMini key={i} block={child} theme={theme} />
          ))}
        </>
      );
  }
}

/** Scale a CSS size down for the miniature (rough: divide numeric portion by ~1.4) */
function scaleSize(size: string | undefined): string | undefined {
  if (!size) return undefined;
  const match = size.match(/^([\d.]+)(pt|px|em|rem)$/);
  if (!match) return size;
  const val = parseFloat(match[1]);
  const unit = match[2];
  return `${(val * 0.6).toFixed(1)}${unit}`;
}
