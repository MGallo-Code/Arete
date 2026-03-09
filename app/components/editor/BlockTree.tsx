"use client";

import type { Block } from "../../models";
import { useEditorRequired, getBlockLabel, findBlockRegion } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

/** Icon for content type */
function contentIcon(block: Block): string {
  if (block.content.type === "text") return "T";
  if (block.content.type === "bullets") return "≡";
  if (block.content.type === "blocks") return "▤";
  if (block.content.type === "image") return "◻";
  return "·";
}

/** Recursively render child blocks */
function ChildBlockNodes({ blocks }: { blocks: Block[] }) {
  const { selectedBlockId, dispatch } = useEditorRequired();

  return (
    <div className={styles.childNodes}>
      {blocks.map((block) => (
        <div key={block.id}>
          <div
            className={`${styles.treeNode} ${selectedBlockId === block.id ? styles.treeNodeSelected : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "SELECT_BLOCK", path: [block.id] });
            }}
          >
            <span className={styles.nodeIcon}>{contentIcon(block)}</span>
            <span className={styles.nodeLabel}>{getBlockLabel(block)}</span>
          </div>
          {block.content.type === "blocks" && block.content.children.length > 0 && (
            <ChildBlockNodes blocks={block.content.children} />
          )}
        </div>
      ))}
    </div>
  );
}

/** A top-level block in a region with reorder/move controls */
function TopLevelBlockNode({
  block,
  regionId,
  index,
  count,
}: {
  block: Block;
  regionId: string;
  index: number;
  count: number;
}) {
  const { selectedBlockId, dispatch } = useEditorRequired();
  const isFirst = index === 0;
  const isLast = index === count - 1;

  return (
    <div>
      <div
        className={`${styles.treeNode} ${selectedBlockId === block.id ? styles.treeNodeSelected : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: "SELECT_BLOCK", path: [block.id] });
        }}
      >
        <span className={styles.nodeIcon}>{contentIcon(block)}</span>
        <span className={styles.nodeLabel}>{getBlockLabel(block)}</span>
        <span className={styles.nodeActions}>
          <button
            className={styles.nodeActionBtn}
            title="Move up"
            disabled={isFirst}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "MOVE_BLOCK_IN_REGION", regionId, fromIndex: index, toIndex: index - 1 });
            }}
          >
            ↑
          </button>
          <button
            className={styles.nodeActionBtn}
            title="Move down"
            disabled={isLast}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "MOVE_BLOCK_IN_REGION", regionId, fromIndex: index, toIndex: index + 1 });
            }}
          >
            ↓
          </button>
          <button
            className={styles.nodeActionBtn}
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "DUPLICATE_BLOCK", regionId, blockId: block.id });
            }}
          >
            ⧉
          </button>
          <button
            className={`${styles.nodeActionBtn} ${styles.nodeActionBtnDanger}`}
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "REMOVE_BLOCK", regionId, blockId: block.id });
            }}
          >
            ×
          </button>
        </span>
      </div>
      {block.content.type === "blocks" && block.content.children.length > 0 && (
        <ChildBlockNodes blocks={block.content.children} />
      )}
    </div>
  );
}

export default function BlockTree() {
  const { resume, dispatch } = useEditorRequired();
  const regions = Object.entries(resume.regionBlockIds);

  return (
    <div>
      {regions.map(([regionId, blockIds]) => (
        <div key={regionId} className={styles.regionGroup}>
          <div className={styles.regionHeader}>
            <span>{regionId}</span>
            <button
              className={styles.addBlockBtn}
              title={`Add block to ${regionId}`}
              onClick={() => dispatch({ type: "ADD_BLOCK", regionId, index: blockIds.length })}
            >
              +
            </button>
          </div>
          {blockIds.map((blockId, index) => {
            const block = resume.blocks[blockId];
            if (!block) return null;
            return (
              <TopLevelBlockNode
                key={blockId}
                block={block}
                regionId={regionId}
                index={index}
                count={blockIds.length}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
