"use client";

import { useState, useCallback } from "react";
import { EditorProvider, useEditorRequired } from "../../contexts/EditorContext";
import { sampleResume, sampleResume2, sampleResume3, testResume } from "../../fixtures";
import type { Resume } from "../../models";
import ResumePreview from "../ResumePreview";
import BlockLibrary from "./BlockLibrary";
import BlockStylePanel from "./BlockStylePanel";
import RegionStylePanel from "./RegionStylePanel";
import ThemePanel from "./ThemePanel";
import styles from "./editor.module.css";

const RESUMES: Record<string, Resume> = {
  "sample-001": sampleResume,
  "sample-002": sampleResume2,
  "sample-003": sampleResume3,
  "test-all-features": testResume,
};

type SidebarTab = "selection" | "theme";

function EditorInner({
  onOpenLibrary,
  onOpenLibraryAt,
  libraryOpen,
  insertTarget,
  onCloseLibrary,
}: {
  onOpenLibrary: () => void;
  onOpenLibraryAt: (regionId: string, index: number) => void;
  libraryOpen: boolean;
  insertTarget: { regionId: string; index: number } | null;
  onCloseLibrary: () => void;
}) {
  const { resume, selectedBlockId, selectedRegionId, dispatch } = useEditorRequired();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [manualTab, setManualTab] = useState<SidebarTab | null>(null);
  const [prevHasSelection, setPrevHasSelection] = useState(false);

  const hasSelection = !!selectedBlockId || !!selectedRegionId;

  // Reset manual override when selection state changes
  if (hasSelection !== prevHasSelection) {
    setPrevHasSelection(hasSelection);
    setManualTab(null);
  }

  // Derive active tab: manual override, or auto based on selection
  const activeTab = manualTab ?? (hasSelection ? "selection" : "theme");
  const setActiveTab = (tab: SidebarTab) => setManualTab(tab);

  const closeSidebar = () => {
    dispatch({ type: "SELECT_BLOCK", path: [] });
    setSidebarOpen(false);
  };

  return (
    <div className={styles.shell}>
      {/* Preview */}
      <div className={styles.previewArea}>
        <div className={styles.previewWrapper}>
          <ResumePreview resume={resume} />
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!sidebarOpen && (
        <button
          type="button"
          className={styles.openSidebarBtn}
          onClick={() => setSidebarOpen(true)}
        >
          Edit
        </button>
      )}

      {/* Sidebar */}
      {sidebarOpen && (
        <div className={styles.sidebar}>
          {/* Header */}
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarHeaderRow}>
              <div className={styles.sidebarTitle}>Arete Editor</div>
              <button
                type="button"
                className={styles.closeBtn}
                title="Close editor"
                onClick={closeSidebar}
              >
                ×
              </button>
            </div>
            <select
              className={styles.resumeSelect}
              value={resume.id}
              onChange={(e) => {
                const r = RESUMES[e.target.value];
                if (r) dispatch({ type: "SET_RESUME", resume: r });
              }}
            >
              {Object.values(RESUMES).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.insertBlockBtn}
              onClick={onOpenLibrary}
            >
              + Insert Block
            </button>
          </div>

          {/* Tabs */}
          {hasSelection && (
            <div className={styles.sidebarTabs}>
              <button
                type="button"
                className={`${styles.sidebarTab} ${activeTab === "selection" ? styles.sidebarTabActive : ""}`}
                onClick={() => setActiveTab("selection")}
              >
                {selectedBlockId ? "Block" : "Region"}
              </button>
              <button
                type="button"
                className={`${styles.sidebarTab} ${activeTab === "theme" ? styles.sidebarTabActive : ""}`}
                onClick={() => setActiveTab("theme")}
              >
                Theme
              </button>
            </div>
          )}

          {/* Panel content */}
          <div className={styles.sidebarBody}>
            {hasSelection && activeTab === "selection" ? (
              <>
                <BlockStylePanel />
                <RegionStylePanel />
              </>
            ) : (
              <ThemePanel />
            )}
          </div>
        </div>
      )}

      {/* Block Library Modal */}
      {libraryOpen && (
        <BlockLibrary
          onClose={onCloseLibrary}
          initialRegionId={insertTarget?.regionId}
          initialIndex={insertTarget?.index}
        />
      )}
    </div>
  );
}

export default function EditorShell() {
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [insertTarget, setInsertTarget] = useState<{ regionId: string; index: number } | null>(null);

  const openLibraryAt = useCallback((regionId: string, index: number) => {
    setInsertTarget({ regionId, index });
    setLibraryOpen(true);
  }, []);

  const closeLibrary = useCallback(() => {
    setLibraryOpen(false);
    setInsertTarget(null);
  }, []);

  const openLibrary = useCallback(() => {
    setLibraryOpen(true);
  }, []);

  return (
    <EditorProvider resume={sampleResume} onRequestInsert={openLibraryAt}>
      <EditorInner
        onOpenLibrary={openLibrary}
        onOpenLibraryAt={openLibraryAt}
        libraryOpen={libraryOpen}
        insertTarget={insertTarget}
        onCloseLibrary={closeLibrary}
      />
    </EditorProvider>
  );
}
