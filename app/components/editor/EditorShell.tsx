"use client";

import { useState, useEffect } from "react";
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

function EditorInner() {
  const { resume, selectedBlockId, selectedRegionId, dispatch } = useEditorRequired();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>("theme");

  const hasSelection = !!selectedBlockId || !!selectedRegionId;

  // Auto-switch tab when selection changes
  useEffect(() => {
    if (hasSelection) {
      setActiveTab("selection");
    } else {
      setActiveTab("theme");
    }
  }, [hasSelection]);

  const closeSidebar = () => {
    dispatch({ type: "SELECT_BLOCK", path: [] });
    setSidebarOpen(false);
  };

  return (
    <div className={styles.shell}>
      {/* Preview */}
      <div
        className={styles.previewArea}
        onClick={() => dispatch({ type: "SELECT_BLOCK", path: [] })}
      >
        <div className={styles.previewWrapper} onClick={(e) => e.stopPropagation()}>
          <ResumePreview resume={resume} />
        </div>
      </div>

      {/* Toggle button when sidebar is closed */}
      {!sidebarOpen && (
        <button className={styles.openSidebarBtn} onClick={() => setSidebarOpen(true)}>
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
              <button className={styles.closeBtn} title="Close editor" onClick={closeSidebar}>
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
              className={styles.insertBlockBtn}
              onClick={() => setLibraryOpen(true)}
            >
              + Insert Block
            </button>
          </div>

          {/* Tabs */}
          {hasSelection && (
            <div className={styles.sidebarTabs}>
              <button
                className={`${styles.sidebarTab} ${activeTab === "selection" ? styles.sidebarTabActive : ""}`}
                onClick={() => setActiveTab("selection")}
              >
                {selectedBlockId ? "Block" : "Region"}
              </button>
              <button
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
      {libraryOpen && <BlockLibrary onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}

export default function EditorShell() {
  return (
    <EditorProvider resume={sampleResume}>
      <EditorInner />
    </EditorProvider>
  );
}
