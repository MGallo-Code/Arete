"use client";

import { useEffect, useRef, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useEditorRequired } from "../../contexts/EditorContext";

/**
 * Live region that announces editor actions to screen readers.
 * Listens to editor state changes and provides status updates.
 */
export default function ScreenReaderAnnounce() {
  const { selectedBlockId, selectedRegionId } = useEditorRequired();
  const [message, setMessage] = useState("");
  const prevBlockId = useRef(selectedBlockId);
  const prevRegionId = useRef(selectedRegionId);

  useEffect(() => {
    if (selectedBlockId !== prevBlockId.current) {
      prevBlockId.current = selectedBlockId;
      if (selectedBlockId) {
        setMessage("Block selected");
      } else if (!selectedRegionId) {
        setMessage("Selection cleared");
      }
    }
    if (selectedRegionId !== prevRegionId.current) {
      prevRegionId.current = selectedRegionId;
      if (selectedRegionId) {
        setMessage(`Region ${selectedRegionId} selected`);
      }
    }
  }, [selectedBlockId, selectedRegionId]);

  return (
    <VisuallyHidden.Root>
      <div role="status" aria-live="polite" aria-atomic="true">
        {message}
      </div>
    </VisuallyHidden.Root>
  );
}
