"use client";

import { useState } from "react";
import { useEditorRequired, findBlockRegion } from "../../contexts/EditorContext";
import { blockTemplates, categories } from "../../data/blockTemplates";
import BlockPreview from "./BlockPreview";
import styles from "./editor.module.css";

interface BlockLibraryProps {
  onClose: () => void;
}

export default function BlockLibrary({ onClose }: BlockLibraryProps) {
  const { resume, selectedBlockId, dispatch } = useEditorRequired();
  const [search, setSearch] = useState("");

  const regionNames = Object.keys(resume.regionBlockIds);
  const selectedRegion = selectedBlockId ? findBlockRegion(resume, selectedBlockId) : null;
  const [targetRegion, setTargetRegion] = useState<string>(selectedRegion ?? regionNames[0] ?? "");

  const filtered = search
    ? blockTemplates.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase()),
      )
    : blockTemplates;

  const handleInsert = (templateId: string) => {
    const template = blockTemplates.find((t) => t.id === templateId);
    if (!template) return;
    const block = template.create();
    const region = targetRegion || regionNames[0];

    let index = (resume.regionBlockIds[region] ?? []).length;
    if (selectedBlockId) {
      const ids = resume.regionBlockIds[region] ?? [];
      const selIdx = ids.indexOf(selectedBlockId);
      if (selIdx >= 0) index = selIdx + 1;
    }

    dispatch({ type: "ADD_BLOCK", regionId: region, index, block });
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>Insert Block</div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            ×
          </button>
        </div>
        <div className={styles.modalControls}>
          <input
            className={styles.propInput}
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <div style={{ marginTop: 6 }}>
            <label className={styles.propLabel}>Insert into</label>
            <select
              className={styles.propSelect}
              value={targetRegion}
              onChange={(e) => setTargetRegion(e.target.value)}
            >
              {regionNames.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.modalBody}>
          {categories.map((cat) => {
            const items = filtered.filter((t) => t.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id} className={styles.libraryCategory}>
                <div className={styles.categoryTitle}>{cat.label}</div>
                <div className={styles.templateGrid}>
                  {items.map((t) => (
                    <button
                      key={t.id}
                      className={styles.templateCard}
                      onClick={() => handleInsert(t.id)}
                    >
                      <div className={styles.templateCardHeader}>
                        <div className={styles.templateName}>{t.name}</div>
                      </div>
                      <div className={styles.templatePreview}>
                        <BlockPreview create={t.create} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
