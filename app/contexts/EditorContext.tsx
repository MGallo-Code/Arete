"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import type { Resume, Block, Content, RichText, BulletItem, Style, PageSettings } from "../models";

// --- State ---

interface EditorState {
  resume: Resume;
  selectedBlockId: string | null;
  selectedRegionId: string | null;
  editingBlockId: string | null;
  editingField: "header" | "content" | null;
  past: Resume[];
  future: Resume[];
}

// --- Actions ---

export type EditorAction =
  | { type: "SELECT_BLOCK"; blockId: string | null }
  | { type: "SET_RESUME"; resume: Resume }
  | { type: "START_EDITING"; blockId: string; field: "header" | "content" }
  | { type: "STOP_EDITING" }
  | { type: "UNDO" }
  | { type: "REDO" }
  // Block mutations
  | { type: "UPDATE_BLOCK_HEADER"; blockId: string; text: string }
  | { type: "UPDATE_BLOCK_HEADER_TAG"; blockId: string; tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
  | { type: "ADD_HEADER"; blockId: string }
  | { type: "REMOVE_HEADER"; blockId: string }
  | { type: "UPDATE_BLOCK_STYLE"; blockId: string; style: Style }
  | { type: "UPDATE_TEXT_CONTENT"; blockId: string; text: string }
  | { type: "UPDATE_RICH_TEXT"; blockId: string; field: "header" | "content"; richText: RichText }
  | { type: "UPDATE_BULLET_ITEMS"; blockId: string; items: BulletItem[] }
  | { type: "SELECT_REGION"; regionId: string | null }
  | { type: "UPDATE_REGION_STYLE"; regionId: string; style: Style }
  // Region mutations
  | { type: "MOVE_BLOCK_IN_REGION"; regionId: string; fromIndex: number; toIndex: number }
  | { type: "MOVE_BLOCK_TO_REGION"; blockId: string; fromRegion: string; toRegion: string; toIndex: number }
  | { type: "ADD_BLOCK"; regionId: string; index: number; block?: Block }
  | { type: "REMOVE_BLOCK"; regionId: string; blockId: string }
  | { type: "REMOVE_BLOCK_ANYWHERE"; blockId: string }
  | { type: "DUPLICATE_BLOCK"; regionId: string; blockId: string }
  // Theme/page mutations
  | { type: "UPDATE_THEME_ROOT"; style: Style }
  | {
      type: "UPDATE_HEADING_STYLE";
      tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      style: Style;
    }
  | { type: "UPDATE_PAGE_SIZE"; size: "letter" | "a4" }
  | { type: "UPDATE_PAGE_MARGINS"; margins: PageSettings["margins"] };

// Actions that mutate the resume (push to undo stack)
const MUTATING = new Set([
  "UPDATE_BLOCK_HEADER",
  "UPDATE_BLOCK_HEADER_TAG",
  "ADD_HEADER",
  "REMOVE_HEADER",
  "UPDATE_BLOCK_STYLE",
  "UPDATE_TEXT_CONTENT",
  "UPDATE_RICH_TEXT",
  "UPDATE_BULLET_ITEMS",
  "MOVE_BLOCK_IN_REGION",
  "MOVE_BLOCK_TO_REGION",
  "ADD_BLOCK",
  "REMOVE_BLOCK",
  "REMOVE_BLOCK_ANYWHERE",
  "DUPLICATE_BLOCK",
  "UPDATE_THEME_ROOT",
  "UPDATE_HEADING_STYLE",
  "UPDATE_PAGE_SIZE",
  "UPDATE_PAGE_MARGINS",
  "UPDATE_REGION_STYLE",
]);

// --- Helpers ---

export function getBlockLabel(block: Block): string {
  if (block.header) {
    const text = block.header.content.map((r) => r.text).join("");
    return text || block.id;
  }
  if (block.content.type === "text" && block.content.value.length > 0) {
    const text = block.content.value.map((r) => r.text).join("");
    return text.length > 40 ? text.slice(0, 37) + "\u2026" : text;
  }
  if (block.content.type === "bullets") return `Bullets (${block.content.items.length})`;
  if (block.content.type === "image") return "Image";
  if (block.content.type === "blocks") return `Group (${block.content.children.length})`;
  return block.id;
}

export function getContentTypeLabel(content: Content): string {
  switch (content.type) {
    case "text":
      return "Text";
    case "bullets":
      return `Bullets (${content.items.length})`;
    case "blocks":
      return `Nested (${content.children.length})`;
    case "image":
      return "Image";
  }
}

function updateBlockInContent(
  content: Content,
  blockId: string,
  updater: (b: Block) => Block,
): Content {
  if (content.type !== "blocks") return content;
  let changed = false;
  const children = content.children.map((child) => {
    if (child.id === blockId) {
      changed = true;
      return updater(child);
    }
    const nc = updateBlockInContent(child.content, blockId, updater);
    if (nc !== child.content) {
      changed = true;
      return { ...child, content: nc };
    }
    return child;
  });
  return changed ? { ...content, children } : content;
}

function updateBlock(resume: Resume, blockId: string, updater: (b: Block) => Block): Resume {
  if (resume.blocks[blockId]) {
    return {
      ...resume,
      blocks: { ...resume.blocks, [blockId]: updater(resume.blocks[blockId]) },
    };
  }
  const newBlocks: Record<string, Block> = {};
  let found = false;
  for (const [id, block] of Object.entries(resume.blocks)) {
    const nc = updateBlockInContent(block.content, blockId, updater);
    if (nc !== block.content) {
      found = true;
      newBlocks[id] = { ...block, content: nc };
    } else {
      newBlocks[id] = block;
    }
  }
  return found ? { ...resume, blocks: newBlocks } : resume;
}

function cloneBlockWithNewIds(block: Block): Block {
  const newId = `${block.id}-copy-${Date.now()}`;
  const newBlock: Block = { ...block, id: newId };
  if (newBlock.content.type === "blocks") {
    newBlock.content = {
      ...newBlock.content,
      children: newBlock.content.children.map(cloneBlockWithNewIds),
    };
  }
  return newBlock;
}

function removeBlockFromContent(content: Content, blockId: string): Content {
  if (content.type !== "blocks") return content;
  // Check if block is a direct child
  const filtered = content.children.filter((c) => c.id !== blockId);
  if (filtered.length !== content.children.length) {
    return { ...content, children: filtered };
  }
  // Recurse into children
  let changed = false;
  const children = content.children.map((child) => {
    const nc = removeBlockFromContent(child.content, blockId);
    if (nc !== child.content) {
      changed = true;
      return { ...child, content: nc };
    }
    return child;
  });
  return changed ? { ...content, children } : content;
}

export function findBlockRegion(resume: Resume, blockId: string): string | null {
  for (const [regionId, ids] of Object.entries(resume.regionBlockIds)) {
    if (ids.includes(blockId)) return regionId;
  }
  return null;
}

/** Recursively find a block by ID (top-level or nested) */
export function findBlock(blocks: Record<string, Block>, blockId: string): Block | null {
  if (blocks[blockId]) return blocks[blockId];
  for (const block of Object.values(blocks)) {
    const found = findBlockNested(block, blockId);
    if (found) return found;
  }
  return null;
}

function findBlockNested(block: Block, blockId: string): Block | null {
  if (block.content.type !== "blocks") return null;
  for (const child of block.content.children) {
    if (child.id === blockId) return child;
    const found = findBlockNested(child, blockId);
    if (found) return found;
  }
  return null;
}

// --- Reducer ---

function coreReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SELECT_BLOCK":
      return { ...state, selectedBlockId: action.blockId, selectedRegionId: null, editingBlockId: null, editingField: null };

    case "SET_RESUME":
      return { ...state, resume: action.resume, selectedBlockId: null, selectedRegionId: null, editingBlockId: null, editingField: null, past: [], future: [] };

    case "START_EDITING":
      return { ...state, selectedBlockId: action.blockId, editingBlockId: action.blockId, editingField: action.field };

    case "STOP_EDITING":
      return { ...state, editingBlockId: null, editingField: null };

    case "SELECT_REGION":
      return { ...state, selectedRegionId: action.regionId, selectedBlockId: null, editingBlockId: null, editingField: null };

    case "UPDATE_REGION_STYLE": {
      const t = state.resume.template;
      return {
        ...state,
        resume: {
          ...state.resume,
          template: {
            ...t,
            regionStyles: {
              ...t.regionStyles,
              [action.regionId]: { ...t.regionStyles[action.regionId], ...action.style },
            },
          },
        },
      };
    }

    case "UPDATE_BLOCK_HEADER":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => ({
          ...b,
          header: b.header ? { ...b.header, content: [{ text: action.text }] } : undefined,
        })),
      };

    case "UPDATE_BLOCK_HEADER_TAG":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => ({
          ...b,
          header: b.header ? { ...b.header, tag: action.tag } : undefined,
        })),
      };

    case "ADD_HEADER":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => ({
          ...b,
          header: { content: [{ text: "New Header" }], tag: "h2" },
        })),
      };

    case "REMOVE_HEADER":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          const { header: _, ...rest } = b;
          return rest as Block;
        }),
      };

    case "UPDATE_BLOCK_STYLE":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => ({
          ...b,
          style: { ...b.style, ...action.style },
        })),
      };

    case "UPDATE_TEXT_CONTENT":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          if (b.content.type !== "text") return b;
          return { ...b, content: { type: "text", value: [{ text: action.text }] } };
        }),
      };

    case "UPDATE_RICH_TEXT": {
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          if (action.field === "header" && b.header) {
            return { ...b, header: { ...b.header, content: action.richText } };
          }
          if (action.field === "content" && b.content.type === "text") {
            return { ...b, content: { type: "text", value: action.richText } };
          }
          return b;
        }),
      };
    }

    case "UPDATE_BULLET_ITEMS": {
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          if (b.content.type !== "bullets") return b;
          return { ...b, content: { ...b.content, items: action.items } };
        }),
      };
    }

    case "MOVE_BLOCK_IN_REGION": {
      const { regionId, fromIndex, toIndex } = action;
      const ids = [...(state.resume.regionBlockIds[regionId] ?? [])];
      const [moved] = ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, moved);
      return {
        ...state,
        resume: { ...state.resume, regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids } },
      };
    }

    case "MOVE_BLOCK_TO_REGION": {
      const { blockId, fromRegion, toRegion, toIndex } = action;
      const fromIds = (state.resume.regionBlockIds[fromRegion] ?? []).filter((id) => id !== blockId);
      const toIds = [...(state.resume.regionBlockIds[toRegion] ?? [])];
      toIds.splice(toIndex, 0, blockId);
      return {
        ...state,
        resume: {
          ...state.resume,
          regionBlockIds: { ...state.resume.regionBlockIds, [fromRegion]: fromIds, [toRegion]: toIds },
        },
      };
    }

    case "ADD_BLOCK": {
      const { regionId, index, block: providedBlock } = action;
      const newBlock: Block = providedBlock ?? {
        id: `block-${Date.now()}`,
        header: { content: [{ text: "New Section" }], tag: "h2" },
        content: { type: "text", value: [{ text: "" }] },
      };
      const ids = [...(state.resume.regionBlockIds[regionId] ?? [])];
      ids.splice(index, 0, newBlock.id);
      return {
        ...state,
        selectedBlockId: newBlock.id,
        resume: {
          ...state.resume,
          regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids },
          blocks: { ...state.resume.blocks, [newBlock.id]: newBlock },
        },
      };
    }

    case "REMOVE_BLOCK": {
      const { regionId, blockId } = action;
      const ids = (state.resume.regionBlockIds[regionId] ?? []).filter((id) => id !== blockId);
      const { [blockId]: _, ...rest } = state.resume.blocks;
      return {
        ...state,
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        editingBlockId: state.editingBlockId === blockId ? null : state.editingBlockId,
        resume: { ...state.resume, regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids }, blocks: rest },
      };
    }

    case "REMOVE_BLOCK_ANYWHERE": {
      const { blockId } = action;
      const clearSelection = {
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        editingBlockId: state.editingBlockId === blockId ? null : state.editingBlockId,
        editingField: state.editingBlockId === blockId ? null : state.editingField,
      };
      // Check if top-level
      const regionId = findBlockRegion(state.resume, blockId);
      if (regionId) {
        const ids = (state.resume.regionBlockIds[regionId] ?? []).filter((id) => id !== blockId);
        const { [blockId]: _, ...rest } = state.resume.blocks;
        return {
          ...state,
          ...clearSelection,
          resume: { ...state.resume, regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids }, blocks: rest },
        };
      }
      // Not top-level — remove from nested content
      const newBlocks: Record<string, Block> = {};
      let found = false;
      for (const [id, block] of Object.entries(state.resume.blocks)) {
        const nc = removeBlockFromContent(block.content, blockId);
        if (nc !== block.content) {
          found = true;
          newBlocks[id] = { ...block, content: nc };
        } else {
          newBlocks[id] = block;
        }
      }
      if (!found) return state;
      return {
        ...state,
        ...clearSelection,
        resume: { ...state.resume, blocks: newBlocks },
      };
    }

    case "DUPLICATE_BLOCK": {
      const { regionId, blockId } = action;
      const original = state.resume.blocks[blockId];
      if (!original) return state;
      const clone = cloneBlockWithNewIds(original);
      const ids = [...(state.resume.regionBlockIds[regionId] ?? [])];
      ids.splice(ids.indexOf(blockId) + 1, 0, clone.id);
      return {
        ...state,
        selectedBlockId: clone.id,
        resume: {
          ...state.resume,
          regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids },
          blocks: { ...state.resume.blocks, [clone.id]: clone },
        },
      };
    }

    case "UPDATE_THEME_ROOT": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, theme: { ...t.theme, root: { ...t.theme.root, ...action.style } } } },
      };
    }

    case "UPDATE_HEADING_STYLE": {
      const t = state.resume.template;
      return {
        ...state,
        resume: {
          ...state.resume,
          template: { ...t, theme: { ...t.theme, [action.tag]: { ...t.theme[action.tag], ...action.style } } },
        },
      };
    }

    case "UPDATE_PAGE_SIZE": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, page: { ...t.page, size: action.size } } },
      };
    }

    case "UPDATE_PAGE_MARGINS": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, page: { ...t.page, margins: action.margins } } },
      };
    }

    default:
      return state;
  }
}

const MAX_HISTORY = 50;

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  // Undo/redo bypass the core reducer
  if (action.type === "UNDO") {
    if (state.past.length === 0) return state;
    const prev = state.past[state.past.length - 1];
    return {
      ...state,
      resume: prev,
      past: state.past.slice(0, -1),
      future: [state.resume, ...state.future].slice(0, MAX_HISTORY),
    };
  }
  if (action.type === "REDO") {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    return {
      ...state,
      resume: next,
      past: [...state.past, state.resume].slice(-MAX_HISTORY),
      future: state.future.slice(1),
    };
  }

  const newState = coreReducer(state, action);

  // Push undo history for mutating actions
  if (MUTATING.has(action.type) && newState.resume !== state.resume) {
    return {
      ...newState,
      past: [...state.past, state.resume].slice(-MAX_HISTORY),
      future: [],
    };
  }

  return { ...newState, past: state.past, future: state.future };
}

// --- Context ---

interface EditorContextValue {
  resume: Resume;
  selectedBlockId: string | null;
  selectedRegionId: string | null;
  editingBlockId: string | null;
  editingField: "header" | "content" | null;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ resume: initial, children }: { resume: Resume; children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, {
    resume: initial,
    selectedBlockId: null,
    selectedRegionId: null,
    editingBlockId: null,
    editingField: null,
    past: [],
    future: [],
  });

  // Global keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't intercept when editing (let browser handle contentEditable keys)
      if (state.editingBlockId) return;

      // Undo/redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "REDO" : "UNDO" });
        return;
      }

      // Delete selected block
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedBlockId) {
        e.preventDefault();
        dispatch({ type: "REMOVE_BLOCK_ANYWHERE", blockId: state.selectedBlockId });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.editingBlockId, state.selectedBlockId, state.resume]);

  return (
    <EditorContext.Provider
      value={{
        resume: state.resume,
        selectedBlockId: state.selectedBlockId,
        selectedRegionId: state.selectedRegionId,
        editingBlockId: state.editingBlockId,
        editingField: state.editingField,
        canUndo: state.past.length > 0,
        canRedo: state.future.length > 0,
        dispatch,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}

export function useEditorRequired() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditorRequired must be used within EditorProvider");
  return ctx;
}
