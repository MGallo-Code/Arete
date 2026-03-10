"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
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

function ToolbarButton({
  label,
  shortcut,
  disabled,
  danger,
  confirmDelete,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  confirmDelete?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const tooltipContent = shortcut ? `${label} (${shortcut})` : label;

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <button
          type="button"
          className={`${styles.toolbarBtn} ${confirmDelete ? styles.toolbarBtnConfirmDelete : danger ? styles.toolbarBtnDanger : ""}`}
          aria-label={label}
          disabled={disabled}
          onClick={onClick}
        >
          {children}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className={styles.tooltipContent} sideOffset={5} side="bottom">
          {tooltipContent}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
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
    <Tooltip.Provider delayDuration={400}>
      <div
        className={styles.floatingToolbar}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.preventDefault()}
      >
        <ToolbarButton
          label="Move up"
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
        </ToolbarButton>
        <ToolbarButton
          label="Move down"
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
        </ToolbarButton>
        <ToolbarButton
          label="Duplicate"
          onClick={() => dispatch({ type: "DUPLICATE_BLOCK", regionId, blockId })}
        >
          &#10697;
        </ToolbarButton>
        <ToolbarButton
          label="Insert block below"
          onClick={handleInsert}
        >
          +
        </ToolbarButton>
        <ToolbarButton
          label={confirmingDelete ? "Click again to confirm" : "Delete block"}
          shortcut={confirmingDelete ? undefined : "Delete"}
          danger={!confirmingDelete}
          confirmDelete={confirmingDelete}
          onClick={handleDelete}
        >
          {confirmingDelete ? "Delete?" : "\u00D7"}
        </ToolbarButton>
      </div>
    </Tooltip.Provider>
  );
}
