"use client";

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { EditorProvider, useEditorRequired } from "../../contexts/EditorContext";
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
  const { resume, selectedBlockId, selectedRegionId, dispatch } = useEditorRequired();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [manualTab, setManualTab] = useState<SidebarTab | null>(null);
  const [prevHasSelection, setPrevHasSelection] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [shortcutHelpOpen, setShortcutHelpOpen] = useState(false);

  // Resizable sidebar
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("arete-sidebar-width");
      return saved ? parseInt(saved, 10) : 300;
    }
    return 300;
  });
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

  const closeSidebar = () => {
    dispatch({ type: "SELECT_BLOCK", path: [] });
    setSidebarOpen(false);
  };

  return (
    <div className={styles.shell}>
      <ScreenReaderAnnounce />
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
