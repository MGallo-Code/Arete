"use client";

import type { EditorAction } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

interface Props {
  blockId: string;
  regionId: string;
  blockIndex: number;
  totalBlocks: number;
  dispatch: (action: EditorAction) => void;
  onRequestInsert?: (regionId: string, index: number) => void;
}

export default function FloatingToolbar({
  blockId,
  regionId,
  blockIndex,
  totalBlocks,
  dispatch,
  onRequestInsert,
}: Props) {
  const handleInsert = () => {
    if (onRequestInsert) {
      onRequestInsert(regionId, blockIndex + 1);
    } else {
      dispatch({ type: "ADD_BLOCK", regionId, index: blockIndex + 1 });
    }
  };

  return (
    <div
      className={styles.floatingToolbar}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <button
        type="button"
        className={styles.toolbarBtn}
        title="Move up"
        aria-label="Move block up"
        disabled={blockIndex === 0}
        onClick={() =>
          dispatch({
            type: "MOVE_BLOCK_IN_REGION",
            regionId,
            fromIndex: blockIndex,
            toIndex: blockIndex - 1,
          })
        }
      >
        &#8593;
      </button>
      <button
        type="button"
        className={styles.toolbarBtn}
        title="Move down"
        aria-label="Move block down"
        disabled={blockIndex === totalBlocks - 1}
        onClick={() =>
          dispatch({
            type: "MOVE_BLOCK_IN_REGION",
            regionId,
            fromIndex: blockIndex,
            toIndex: blockIndex + 1,
          })
        }
      >
        &#8595;
      </button>
      <button
        type="button"
        className={styles.toolbarBtn}
        title="Duplicate"
        aria-label="Duplicate block"
        onClick={() => dispatch({ type: "DUPLICATE_BLOCK", regionId, blockId })}
      >
        &#10697;
      </button>
      <button
        type="button"
        className={styles.toolbarBtn}
        title="Insert block below"
        aria-label="Insert block"
        onClick={handleInsert}
      >
        +
      </button>
      <button
        type="button"
        className={`${styles.toolbarBtn} ${styles.toolbarBtnDanger}`}
        title="Delete block"
        aria-label="Delete block"
        onClick={() => dispatch({ type: "REMOVE_BLOCK", regionId, blockId })}
      >
        &#215;
      </button>
    </div>
  );
}
