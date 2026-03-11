"use client";

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { EditorProvider, useEditorRequired, findBlockRegion, findBlock, getBlockLabel } from "../../contexts/EditorContext";
import { sampleResume, sampleResume2, sampleResume3, sampleResume4, sampleResume5, sampleResume6, sampleResume7, testResume } from "../../fixtures";
import type { Resume } from "../../models";
import ResumePreview from "../ResumePreview";
import BlockStylePanel from "./BlockStylePanel";

const BlockLibrary = lazy(() => import("./BlockLibrary"));
import RegionStylePanel from "./RegionStylePanel";
import ScreenReaderAnnounce from "./ScreenReaderAnnounce";
import ShortcutHelp from "./ShortcutHelp";
import TemplatePicker from "./TemplatePicker";
import ThemePanel from "./ThemePanel";
import styles from "./editor.module.css";

const RESUMES: Record<string, Resume> = {
  "sample-001": sampleResume,
  "sample-002": sampleResume2,
  "sample-003": sampleResume3,
  "sample-004": sampleResume4,
  "sample-005": sampleResume5,
  "sample-006": sampleResume6,
  "sample-007": sampleResume7,
  "test-all-features": testResume,
};

type SidebarTab = "selection" | "theme";

function EditorInner({
  libraryOpen,
  insertTarget,
  onCloseLibrary,
}: {
  libraryOpen: boolean;
  insertTarget: { regionId: string; index: number } | null;
  onCloseLibrary: () => void;
}) {
  const { resume, selectedBlockId, selectedRegionId, selectedPath, dispatch, onRequestInsert } = useEditorRequired();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [manualTab, setManualTab] = useState<SidebarTab | null>(null);
  const [prevHasSelection, setPrevHasSelection] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  // Resizable sidebar — defer localStorage read to avoid hydration mismatch
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!hydratedRef.current) {
      hydratedRef.current = true;
      const saved = localStorage.getItem("arete-sidebar-width");
      if (saved) setSidebarWidth(parseInt(saved, 10));
    }
  }, []);
  const resizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(300);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizingRef.current) return;
      const delta = startXRef.current - e.clientX;
      const newWidth = Math.max(240, Math.min(500, startWidthRef.current + delta));
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (resizingRef.current) {
        resizingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        localStorage.setItem("arete-sidebar-width", String(sidebarWidth));
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [sidebarWidth]);

  // ? key opens shortcut help
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLElement && e.target.isContentEditable))) {
        e.preventDefault();
        setShortcutHelpOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const startResize = useCallback((e: React.MouseEvent) => {
    resizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  }, [sidebarWidth]);

  const hasSelection = !!selectedBlockId || !!selectedRegionId;

  if (hasSelection !== prevHasSelection) {
    setPrevHasSelection(hasSelection);
    setManualTab(null);
  }

  const activeTab = manualTab ?? (hasSelection ? "selection" : "theme");

  // Build breadcrumb segments
  const breadcrumbSegments: { label: string; onClick: () => void }[] = [];
  if (selectedRegionId && !selectedBlockId) {
    breadcrumbSegments.push({
      label: `Region: ${selectedRegionId}`,
      onClick: () => dispatch({ type: "SELECT_REGION", regionId: selectedRegionId }),
    });
  }
  if (selectedBlockId && selectedPath.length > 0) {
    const regionId = findBlockRegion(resume, selectedPath[0]);
    if (regionId) {
      breadcrumbSegments.push({
        label: regionId,
        onClick: () => dispatch({ type: "SELECT_REGION", regionId }),
      });
    }
    selectedPath.forEach((bId, idx) => {
      const block = findBlock(resume.blocks, bId);
      const label = block ? getBlockLabel(block) : bId;
      breadcrumbSegments.push({
        label,
        onClick: () => dispatch({ type: "SELECT_BLOCK", path: selectedPath.slice(0, idx + 1) }),
      });
    });
  }

  const closeSidebar = () => {
    dispatch({ type: "SELECT_BLOCK", path: [] });
    setSidebarOpen(false);
  };

  return (
    <div className={styles.shell}>
      <ScreenReaderAnnounce />
      {/* Preview — click on empty area deselects */}
      <div
        className={styles.previewArea}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            dispatch({ type: "SELECT_BLOCK", path: [] });
          }
        }}
      >
        <div
          className={styles.previewWrapper}
          onClick={(e) => {
            // Clicks on the wrapper shadow/padding (not on the resume page itself)
            // won't reach here due to stopPropagation in regions/blocks,
            // but if they do, deselect
            if (e.target === e.currentTarget) {
              dispatch({ type: "SELECT_BLOCK", path: [] });
            }
          }}
        >
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
        <div className={styles.sidebar} style={{ width: sidebarWidth, minWidth: sidebarWidth }}>
          {/* Resize handle */}
          <div className={styles.sidebarResizeHandle} onMouseDown={startResize} />
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
              className={styles.propBtn}
              style={{ marginTop: 4, width: "100%" }}
              onClick={() => setTemplatePickerOpen(true)}
            >
              Switch Template
            </button>
          </div>

          {/* Tabs */}
          {hasSelection ? (
            <Tabs.Root
              value={activeTab}
              onValueChange={(v) => setManualTab(v as SidebarTab)}
              className={styles.sidebarTabsRoot}
            >
              <Tabs.List className={styles.sidebarTabs} aria-label="Editor panels">
                <Tabs.Trigger
                  value="selection"
                  className={`${styles.sidebarTab} ${activeTab === "selection" ? styles.sidebarTabActive : ""}`}
                >
                  {selectedBlockId ? "Block" : "Region"}
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="theme"
                  className={`${styles.sidebarTab} ${activeTab === "theme" ? styles.sidebarTabActive : ""}`}
                >
                  Theme
                </Tabs.Trigger>
              </Tabs.List>

              {/* Breadcrumbs */}
              {breadcrumbSegments.length > 0 && (
                <div className={styles.breadcrumbs}>
                  {breadcrumbSegments.map((seg, i) => (
                    <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                      {i > 0 && <span className={styles.breadcrumbSep}>&rsaquo;</span>}
                      <button
                        type="button"
                        className={styles.breadcrumbBtn}
                        onClick={seg.onClick}
                        title={seg.label}
                      >
                        {seg.label}
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <ScrollArea.Root className={styles.sidebarScrollRoot}>
                <ScrollArea.Viewport
                  className={styles.sidebarBody}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                      (e.target as HTMLElement).blur();
                    }
                  }}
                >
                  <Tabs.Content value="selection" tabIndex={-1}>
                    <BlockStylePanel />
                    <RegionStylePanel />
                  </Tabs.Content>
                  <Tabs.Content value="theme" tabIndex={-1}>
                    <ThemePanel />
                  </Tabs.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
                  <ScrollArea.Thumb className={styles.scrollbarThumb} />
                </ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </Tabs.Root>
          ) : (
            <ScrollArea.Root className={styles.sidebarScrollRoot}>
              <ScrollArea.Viewport
                className={styles.sidebarBody}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
                    (e.target as HTMLElement).blur();
                  }
                }}
              >
                {/* Guidance card */}
                <div className={styles.guidanceCard}>
                  <div className={styles.guidanceTitle}>No selection</div>
                  <div className={styles.guidanceDesc}>
                    Select a block or region in the preview to edit it
                  </div>
                  <div className={styles.guidanceActions}>
                    <button
                      type="button"
                      className={styles.propBtn}
                      onClick={() => {
                        // Open block library with first region at end
                        const firstRegion = Object.keys(resume.regionBlockIds)[0];
                        if (firstRegion && onRequestInsert) {
                          const count = resume.regionBlockIds[firstRegion]?.length ?? 0;
                          onRequestInsert(firstRegion, count);
                        }
                      }}
                    >
                      Insert Block
                    </button>
                    <button
                      type="button"
                      className={styles.propBtn}
                      onClick={() => setTemplatePickerOpen(true)}
                    >
                      Switch Template
                    </button>
                  </div>
                </div>
                <ThemePanel />
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar orientation="vertical" className={styles.scrollbar}>
                <ScrollArea.Thumb className={styles.scrollbarThumb} />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          )}
        </div>
      )}

      {/* Template Picker */}
      <TemplatePicker open={templatePickerOpen} onOpenChange={setTemplatePickerOpen} />

      {/* Shortcut Help */}
      <ShortcutHelp open={shortcutHelpOpen} onOpenChange={setShortcutHelpOpen} />

      {/* Block Library Modal */}
      {libraryOpen && (
        <Suspense fallback={null}>
          <BlockLibrary
            open={libraryOpen}
            onOpenChange={(open) => { if (!open) onCloseLibrary(); }}
            initialRegionId={insertTarget?.regionId}
            initialIndex={insertTarget?.index}
          />
        </Suspense>
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

  return (
    <EditorProvider resume={sampleResume} onRequestInsert={openLibraryAt}>
      <EditorInner
        libraryOpen={libraryOpen}
        insertTarget={insertTarget}
        onCloseLibrary={closeLibrary}
      />
    </EditorProvider>
  );
}
