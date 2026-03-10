"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { templatePresets } from "../../data/templates";
import { useEditorRequired } from "../../contexts/EditorContext";
import styles from "./editor.module.css";

interface TemplatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplatePicker({ open, onOpenChange }: TemplatePickerProps) {
  const { resume, dispatch } = useEditorRequired();

  const handleSelect = (presetId: string) => {
    const preset = templatePresets.find((p) => p.id === presetId);
    if (!preset) return;
    dispatch({ type: "SWITCH_TEMPLATE", template: preset.template });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content className={styles.modalCard} aria-describedby={undefined}>
          <div className={styles.modalHeader}>
            <Dialog.Title className={styles.modalTitle}>Switch Template</Dialog.Title>
            <Dialog.Close asChild>
              <button className={styles.closeBtn} title="Close">×</button>
            </Dialog.Close>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.templatePickerGrid}>
              {templatePresets.map((preset) => {
                const isActive = resume.template.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    className={`${styles.templatePickerCard} ${isActive ? styles.templatePickerCardActive : ""}`}
                    onClick={() => handleSelect(preset.id)}
                  >
                    <div className={styles.templatePickerPreview}>
                      <TemplateMiniPreview preset={preset} />
                    </div>
                    <div className={styles.templatePickerName}>{preset.name}</div>
                    <div className={styles.templatePickerDesc}>{preset.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Miniature visual representation of the template's grid layout */
function TemplateMiniPreview({ preset }: { preset: (typeof templatePresets)[number] }) {
  const { grid, regionStyles } = preset.template;
  const regions = Object.keys(regionStyles);
  const primaryColor = preset.template.theme.palette?.primary ?? "#2563eb";

  return (
    <div
      style={{
        display: "grid",
        gridTemplate: grid,
        width: "100%",
        aspectRatio: "8.5 / 11",
        background: "#ffffff",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {regions.map((r) => {
        const rs = regionStyles[r];
        const bg =
          (rs.background as string) ??
          (rs.backgroundColor as string) ??
          "transparent";
        // Resolve palette vars to actual color for preview
        const resolvedBg = bg.includes("var(--palette-primary)")
          ? primaryColor
          : bg.includes("var(--palette-background)")
            ? (preset.template.theme.palette?.background ?? "#f5f5f5")
            : bg;

        return (
          <div
            key={r}
            style={{
              gridArea: r,
              background: resolvedBg,
              borderBottom: r === "header" ? `2px solid ${primaryColor}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
