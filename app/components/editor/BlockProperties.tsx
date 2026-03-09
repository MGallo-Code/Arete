"use client";

import { useEditorRequired, getContentTypeLabel, findBlockRegion, findBlock } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

function getTextContent(block: import("../../models").Block): string {
  if (block.content.type === "text") return block.content.value.map((r) => r.text).join("");
  if (block.content.type === "bullets")
    return block.content.items.map((item) => item.content.map((r) => r.text).join("")).join("\n");
  return "";
}

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

export default function BlockProperties() {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();

  if (!selectedBlockId) return null;

  const block = findBlock(resume.blocks, selectedBlockId);
  if (!block) return null;

  const regionId = findBlockRegion(resume, block.id);
  const isTopLevel = !!regionId;
  const headerText = block.header ? block.header.content.map((r) => r.text).join("") : "";

  return (
    <div className={styles.propertiesPanel}>
      <div className={styles.propertiesTitle}>Properties</div>

      <div className={styles.propRow}>
        <span className={styles.propLabel}>ID</span>
        <span className={styles.propBadge}>{block.id}</span>
      </div>

      {block.header ? (
        <>
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Header text</label>
            <input
              className={styles.propInput}
              value={headerText}
              onChange={(e) =>
                dispatch({ type: "UPDATE_BLOCK_HEADER", blockId: block.id, text: e.target.value })
              }
            />
          </div>
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Header tag</label>
            <select
              className={styles.propSelect}
              value={block.header.tag}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_BLOCK_HEADER_TAG",
                  blockId: block.id,
                  tag: e.target.value as (typeof TAGS)[number],
                })
              }
            >
              {TAGS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className={styles.propRow}>
            <button
              className={`${styles.propBtn} ${styles.propBtnDanger}`}
              onClick={() => dispatch({ type: "REMOVE_HEADER", blockId: block.id })}
            >
              Remove header
            </button>
          </div>
        </>
      ) : (
        <div className={styles.propRow}>
          <button
            className={styles.propBtn}
            onClick={() => dispatch({ type: "ADD_HEADER", blockId: block.id })}
          >
            + Add header
          </button>
        </div>
      )}

      <div className={styles.propRow}>
        <span className={styles.propLabel}>Content</span>
        <span className={styles.propBadge}>{getContentTypeLabel(block.content)}</span>
      </div>

      {block.content.type === "text" && block.content.value.length > 0 && (
        <div className={styles.propRow}>
          <label className={styles.propLabel}>Text</label>
          <textarea
            className={styles.propTextarea}
            value={getTextContent(block)}
            onChange={(e) =>
              dispatch({ type: "UPDATE_TEXT_CONTENT", blockId: block.id, text: e.target.value })
            }
          />
        </div>
      )}

      {block.content.type === "bullets" && (
        <div className={styles.propRow}>
          <label className={styles.propLabel}>Bullets (read-only)</label>
          <textarea className={styles.propTextarea} value={getTextContent(block)} readOnly style={{ opacity: 0.6 }} />
        </div>
      )}

      {block.tags && block.tags.length > 0 && (
        <div className={styles.propRow}>
          <span className={styles.propLabel}>Tags</span>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {block.tags.map((tag) => (
              <span key={tag} className={styles.propBadge}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      {isTopLevel && regionId && (
        <>
          <div className={styles.propRow}>
            <label className={styles.propLabel}>Region</label>
            <select
              className={styles.propSelect}
              value={regionId}
              onChange={(e) => {
                const toRegion = e.target.value;
                if (toRegion !== regionId) {
                  dispatch({
                    type: "MOVE_BLOCK_TO_REGION",
                    blockId: block.id,
                    fromRegion: regionId,
                    toRegion,
                    toIndex: (resume.regionBlockIds[toRegion] ?? []).length,
                  });
                }
              }}
            >
              {Object.keys(resume.regionBlockIds).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className={styles.propRow} style={{ marginTop: 8 }}>
            <div className={styles.propBtnRow}>
              <button
                className={styles.propBtn}
                onClick={() => dispatch({ type: "DUPLICATE_BLOCK", regionId, blockId: block.id })}
              >
                Duplicate
              </button>
              <button
                className={`${styles.propBtn} ${styles.propBtnDanger}`}
                onClick={() => dispatch({ type: "REMOVE_BLOCK", regionId, blockId: block.id })}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
