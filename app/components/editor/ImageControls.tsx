"use client";

import type { Content, Style } from "../../models";
import type { EditorAction } from "../../contexts/EditorContext";
import PropertyRow from "./PropertyRow";
import UnitInput from "./UnitInput";
import styles from "./editor.module.css";

interface ImageControlsProps {
  blockId: string;
  content: Content & { type: "image" };
  dispatch: (action: EditorAction) => void;
}

export default function ImageControls({ blockId, content, dispatch }: ImageControlsProps) {
  return (
    <>
      <PropertyRow label="Source URL">
        <input
          className={styles.propInput}
          style={{ width: "auto", flex: 1 }}
          value={content.src}
          placeholder="https://..."
          onChange={(e) =>
            dispatch({ type: "UPDATE_IMAGE_CONTENT", blockId, src: e.target.value })
          }
        />
      </PropertyRow>
      <PropertyRow label="Alt text">
        <input
          className={styles.propInput}
          style={{ width: "auto", flex: 1 }}
          value={content.alt ?? ""}
          placeholder="Describe the image"
          onChange={(e) =>
            dispatch({ type: "UPDATE_IMAGE_CONTENT", blockId, alt: e.target.value })
          }
        />
      </PropertyRow>
      <PropertyRow label="Width">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UnitInput
            value={(content.style?.width as string) ?? ""}
            placeholder="auto"
            onChange={(v) =>
              dispatch({ type: "UPDATE_IMAGE_CONTENT", blockId, style: { width: v || undefined } as Style })
            }
          />
        </div>
      </PropertyRow>
      <PropertyRow label="Height">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <UnitInput
            value={(content.style?.height as string) ?? ""}
            placeholder="auto"
            onChange={(v) =>
              dispatch({ type: "UPDATE_IMAGE_CONTENT", blockId, style: { height: v || undefined } as Style })
            }
          />
        </div>
      </PropertyRow>
    </>
  );
}
