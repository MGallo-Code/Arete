"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset confirmation state when selected block changes
  useEffect(() => {
    setConfirmingDelete(false);
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, [blockId]);

  const handleDelete = useCallback(() => {
    if (confirmingDelete) {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
      dispatch({ type: "REMOVE_BLOCK", regionId, blockId });
      setConfirmingDelete(false);
    } else {
      setConfirmingDelete(true);
      confirmTimerRef.current = setTimeout(() => {
        setConfirmingDelete(false);
      }, 2000);
    }
  }, [confirmingDelete, dispatch, regionId, blockId]);

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
        className={`${styles.toolbarBtn} ${confirmingDelete ? styles.toolbarBtnConfirmDelete : styles.toolbarBtnDanger}`}
        title={confirmingDelete ? "Click again to confirm" : "Delete block"}
        aria-label={confirmingDelete ? "Confirm delete" : "Delete block"}
        onClick={handleDelete}
      >
        {confirmingDelete ? "Delete?" : "\u00D7"}
      </button>
    </div>
  );
}
