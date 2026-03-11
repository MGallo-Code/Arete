"use client";

import { createContext, useContext, useReducer, useEffect, useMemo, useRef, type ReactNode } from "react";
import type { Resume, Block, Content, RichText, BulletItem, BulletLevel, Style, PageSettings, ColorPalette } from "../models";

// --- State ---

interface EditorState {
  resume: Resume;
  selectedPath: string[];
  selectedRegionId: string | null;
  editingBlockId: string | null;
  editingField: "header" | "content" | null;
  past: Resume[];
  future: Resume[];
  lastActionTime: number;
  lastActionType: string | null;
}

// --- Actions ---

export type EditorAction =
  | { type: "SELECT_BLOCK"; path: string[] }
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
  | { type: "SET_BLOCK_STYLE"; blockId: string; style: Style | undefined }
  | { type: "UPDATE_TEXT_CONTENT"; blockId: string; text: string }
  | { type: "UPDATE_RICH_TEXT"; blockId: string; field: "header" | "content"; richText: RichText }
  | { type: "UPDATE_BULLET_ITEMS"; blockId: string; items: BulletItem[] }
  | { type: "SELECT_REGION"; regionId: string | null }
  | { type: "UPDATE_REGION_STYLE"; regionId: string; style: Style }
  | { type: "SET_REGION_STYLE"; regionId: string; style: Style }
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
  | { type: "UPDATE_PAGE_MARGINS"; margins: PageSettings["margins"] }
  | { type: "UPDATE_BULLET_LEVELS"; blockId: string; levels: BulletLevel[] }
  | { type: "UPDATE_THEME_CANVAS"; style: Style }
  | { type: "UPDATE_THEME_LINK"; style: Style }
  | { type: "UPDATE_GRID"; grid: string }
  | { type: "UPDATE_THEME_PALETTE"; palette: ColorPalette | undefined }
  | { type: "APPLY_PALETTE_PRESET"; palette: ColorPalette }
  | { type: "UPDATE_IMAGE_CONTENT"; blockId: string; src?: string; alt?: string; style?: Style }
  | { type: "SWITCH_TEMPLATE"; template: import("../models").Template }
  | { type: "CHANGE_CONTENT_TYPE"; blockId: string; newType: "text" | "bullets" | "image" };

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
  "SET_BLOCK_STYLE",
  "SET_REGION_STYLE",
  "UPDATE_BULLET_LEVELS",
  "UPDATE_THEME_CANVAS",
  "UPDATE_THEME_LINK",
  "UPDATE_GRID",
  "UPDATE_THEME_PALETTE",
  "APPLY_PALETTE_PRESET",
  "UPDATE_IMAGE_CONTENT",
  "SWITCH_TEMPLATE",
  "CHANGE_CONTENT_TYPE",
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

// --- Text extraction for copy ---

function richTextToPlain(rt: RichText): string {
  return rt.map((r) => r.text).join("");
}

function extractContentText(content: Content): string {
  switch (content.type) {
    case "text":
      return richTextToPlain(content.value);
    case "bullets":
      return content.items.map((item) => richTextToPlain(item.content)).join("\n");
    case "blocks":
      return content.children.map(extractBlockText).join("\n");
    case "image":
      return content.alt ?? "";
  }
}

function extractBlockText(block: Block): string {
  const parts: string[] = [];
  if (block.header) {
    parts.push(richTextToPlain(block.header.content));
  }
  const contentText = extractContentText(block.content);
  if (contentText) parts.push(contentText);
  return parts.join("\n");
}

// --- Reducer ---

function coreReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "SELECT_BLOCK":
      return { ...state, selectedPath: action.path, selectedRegionId: null, editingBlockId: null, editingField: null };

    case "SET_RESUME":
      return { ...state, resume: action.resume, selectedPath: [], selectedRegionId: null, editingBlockId: null, editingField: null, past: [], future: [], lastActionTime: 0, lastActionType: null };

    case "START_EDITING":
      return { ...state, selectedPath: state.selectedPath.length > 0 ? state.selectedPath : [action.blockId], selectedRegionId: null, editingBlockId: action.blockId, editingField: action.field };

    case "STOP_EDITING":
      return { ...state, editingBlockId: null, editingField: null };

    case "SELECT_REGION":
      return { ...state, selectedRegionId: action.regionId, selectedPath: [], editingBlockId: null, editingField: null };

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
          const { header: _header, ...rest } = b;
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

    case "SET_BLOCK_STYLE":
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => ({
          ...b,
          style: action.style,
        })),
      };

    case "SET_REGION_STYLE": {
      const t = state.resume.template;
      return {
        ...state,
        resume: {
          ...state.resume,
          template: {
            ...t,
            regionStyles: {
              ...t.regionStyles,
              [action.regionId]: action.style,
            },
          },
        },
      };
    }

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

    case "UPDATE_BULLET_LEVELS": {
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          if (b.content.type !== "bullets") return b;
          return { ...b, content: { ...b.content, levels: action.levels } };
        }),
      };
    }

    case "UPDATE_IMAGE_CONTENT": {
      return {
        ...state,
        resume: updateBlock(state.resume, action.blockId, (b) => {
          if (b.content.type !== "image") return b;
          return {
            ...b,
            content: {
              ...b.content,
              ...(action.src !== undefined ? { src: action.src } : {}),
              ...(action.alt !== undefined ? { alt: action.alt } : {}),
              ...(action.style !== undefined ? { style: { ...b.content.style, ...action.style } } : {}),
            },
          };
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
        selectedPath: [newBlock.id],
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
      const { [blockId]: _removed, ...rest } = state.resume.blocks;
      return {
        ...state,
        selectedPath: state.selectedPath.includes(blockId) ? [] : state.selectedPath,
        editingBlockId: state.editingBlockId === blockId ? null : state.editingBlockId,
        resume: { ...state.resume, regionBlockIds: { ...state.resume.regionBlockIds, [regionId]: ids }, blocks: rest },
      };
    }

    case "REMOVE_BLOCK_ANYWHERE": {
      const { blockId } = action;
      const clearSelection = {
        selectedPath: state.selectedPath.includes(blockId) ? [] : state.selectedPath,
        editingBlockId: state.editingBlockId === blockId ? null : state.editingBlockId,
        editingField: state.editingBlockId === blockId ? null : state.editingField,
      };
      // Check if top-level
      const regionId = findBlockRegion(state.resume, blockId);
      if (regionId) {
        const ids = (state.resume.regionBlockIds[regionId] ?? []).filter((id) => id !== blockId);
        const { [blockId]: _removed, ...rest } = state.resume.blocks;
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
        selectedPath: [clone.id],
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

    case "UPDATE_THEME_CANVAS": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, theme: { ...t.theme, canvas: { ...t.theme.canvas, ...action.style } } } },
      };
    }

    case "UPDATE_THEME_LINK": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, theme: { ...t.theme, link: { ...t.theme.link, ...action.style } } } },
      };
    }

    case "UPDATE_GRID": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, grid: action.grid } },
      };
    }

    case "UPDATE_THEME_PALETTE": {
      const t = state.resume.template;
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, theme: { ...t.theme, palette: action.palette } } },
      };
    }

    case "APPLY_PALETTE_PRESET": {
      const t = state.resume.template;
      // Only update the palette hex values — CSS vars auto-cascade
      const newTheme = { ...t.theme, palette: action.palette };
      return {
        ...state,
        resume: { ...state.resume, template: { ...t, theme: newTheme } },
      };
    }

    case "SWITCH_TEMPLATE": {
      const newTemplate = action.template;
      const oldResume = state.resume;
      const oldRegionIds = Object.keys(oldResume.regionBlockIds);
      const newRegionIds = Object.keys(newTemplate.regionStyles);

      // Remap blocks: match region names where possible, dump leftover into first new region
      const newRegionBlockIds: Record<string, string[]> = {};
      for (const r of newRegionIds) newRegionBlockIds[r] = [];

      const usedBlockIds = new Set<string>();
      for (const regionId of newRegionIds) {
        if (oldResume.regionBlockIds[regionId]) {
          newRegionBlockIds[regionId] = [...oldResume.regionBlockIds[regionId]];
          for (const id of newRegionBlockIds[regionId]) usedBlockIds.add(id);
        }
      }

      // Collect orphaned blocks from old regions not present in new template
      const orphanedIds: string[] = [];
      for (const regionId of oldRegionIds) {
        if (!newRegionIds.includes(regionId)) {
          for (const id of oldResume.regionBlockIds[regionId]) {
            if (!usedBlockIds.has(id)) orphanedIds.push(id);
          }
        }
      }
      if (orphanedIds.length > 0 && newRegionIds.length > 0) {
        newRegionBlockIds[newRegionIds[0]].push(...orphanedIds);
      }

      return {
        ...state,
        resume: {
          ...oldResume,
          template: newTemplate,
          regionBlockIds: newRegionBlockIds,
        },
        selectedPath: [],
        selectedRegionId: null,
      };
    }

    case "CHANGE_CONTENT_TYPE": {
      const { blockId, newType } = action;
      const block = findBlock(state.resume.blocks, blockId);
      if (!block || block.content.type === newType) return state;

      let newContent: Content;
      const oldContent = block.content;

      switch (newType) {
        case "text": {
          if (oldContent.type === "bullets") {
            // Join all bullet items' content with newline separators
            const runs: RichText = [];
            oldContent.items.forEach((item, i) => {
              if (i > 0) runs.push({ text: "\n" });
              runs.push(...item.content);
            });
            newContent = { type: "text", value: runs.length > 0 ? runs : [{ text: "" }] };
          } else if (oldContent.type === "image") {
            newContent = { type: "text", value: [{ text: oldContent.alt || "" }] };
          } else {
            // blocks → text (extract plain text)
            newContent = { type: "text", value: [{ text: "" }] };
          }
          break;
        }
        case "bullets": {
          if (oldContent.type === "text") {
            newContent = {
              type: "bullets",
              items: [{ content: oldContent.value, level: 0 }],
            };
          } else if (oldContent.type === "image") {
            newContent = {
              type: "bullets",
              items: [{ content: [{ text: oldContent.alt || "" }], level: 0 }],
            };
          } else {
            newContent = { type: "bullets", items: [{ content: [{ text: "" }], level: 0 }] };
          }
          break;
        }
        case "image": {
          let altText = "";
          if (oldContent.type === "text") {
            altText = oldContent.value.map((r) => r.text).join("");
          } else if (oldContent.type === "bullets") {
            altText = oldContent.items.map((item) => item.content.map((r) => r.text).join("")).join(", ");
          }
          newContent = { type: "image", src: "", alt: altText };
          break;
        }
      }

      const clearEditing =
        state.editingBlockId === blockId
          ? { editingBlockId: null as string | null, editingField: null as "header" | "content" | null }
          : {};

      return {
        ...state,
        ...clearEditing,
        resume: updateBlock(state.resume, blockId, (b) => ({
          ...b,
          content: newContent,
        })),
      };
    }

    default:
      return state;
  }
}

const MAX_HISTORY = 50;

// Coalesce rapid mutations of the same type into one undo entry
const COALESCE_MS = 500;

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
      lastActionTime: 0,
      lastActionType: null,
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
      lastActionTime: 0,
      lastActionType: null,
    };
  }

  const newState = coreReducer(state, action);

  // Push undo history for mutating actions
  if (MUTATING.has(action.type) && newState.resume !== state.resume) {
    const now = Date.now();
    const shouldCoalesce =
      state.lastActionType === action.type &&
      now - state.lastActionTime < COALESCE_MS;

    if (shouldCoalesce) {
      // Don't push new undo entry — keep existing past, just update resume
      return {
        ...newState,
        past: state.past,
        future: [],
        lastActionTime: now,
        lastActionType: action.type,
      };
    }

    // New undo entry
    return {
      ...newState,
      past: [...state.past, state.resume].slice(-MAX_HISTORY),
      future: [],
      lastActionTime: now,
      lastActionType: action.type,
    };
  }

  return {
    ...newState,
    past: state.past,
    future: state.future,
    lastActionTime: state.lastActionTime,
    lastActionType: state.lastActionType,
  };
}

// --- Context ---

interface EditorContextValue {
  resume: Resume;
  selectedBlockId: string | null;
  selectedPath: string[];
  selectedRegionId: string | null;
  editingBlockId: string | null;
  editingField: "header" | "content" | null;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<EditorAction>;
  onRequestInsert?: (regionId: string, index: number) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
  resume: initial,
  children,
  onRequestInsert,
}: {
  resume: Resume;
  children: ReactNode;
  onRequestInsert?: (regionId: string, index: number) => void;
}) {
  const [state, dispatch] = useReducer(editorReducer, {
    resume: initial,
    selectedPath: [],
    selectedRegionId: null,
    editingBlockId: null,
    editingField: null,
    past: [],
    future: [],
    lastActionTime: 0,
    lastActionType: null,
  });

  const selectedBlockId = state.selectedPath.length > 0 ? state.selectedPath[state.selectedPath.length - 1] : null;

  // Ref for accessing current resume in keyboard handler without re-registering on every mutation
  const resumeRef = useRef(state.resume);
  useEffect(() => { resumeRef.current = state.resume; }, [state.resume]);

  // Global keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // If a child handler has already handled this key, don't apply global shortcuts
      if (e.defaultPrevented) return;

      // Don't intercept when editing (let browser handle contentEditable keys)
      if (state.editingBlockId) return;

      // Undo/redo
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        dispatch({ type: e.shiftKey ? "REDO" : "UNDO" });
        return;
      }

      // Copy all text in selected block
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && selectedBlockId) {
        const active = document.activeElement;
        // Only intercept if nothing specific is focused (no text selection in inputs)
        if (
          !(active instanceof HTMLInputElement) &&
          !(active instanceof HTMLTextAreaElement) &&
          !(active as HTMLElement)?.isContentEditable
        ) {
          const block = findBlock(resumeRef.current.blocks, selectedBlockId);
          if (block) {
            const text = extractBlockText(block);
            if (text) {
              e.preventDefault();
              navigator.clipboard.writeText(text);
            }
          }
        }
        return;
      }

      // Delete selected block (but not when focus is in a form input)
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlockId) {
        const active = document.activeElement;
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          active instanceof HTMLSelectElement ||
          (active as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        dispatch({ type: "REMOVE_BLOCK_ANYWHERE", blockId: selectedBlockId });
        return;
      }

      // Guard: remaining shortcuts need no focus in form inputs
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        (active as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Escape: deselect current block
      if (e.key === "Escape" && state.selectedPath.length > 0) {
        e.preventDefault();
        dispatch({ type: "SELECT_BLOCK", path: [] });
        return;
      }

      // Enter: start editing selected block
      if (e.key === "Enter" && selectedBlockId) {
        e.preventDefault();
        const block = findBlock(resumeRef.current.blocks, selectedBlockId);
        if (block) {
          // Prefer editing content; fall back to header if content is empty/image
          const field: "header" | "content" =
            block.content.type === "text" || block.content.type === "bullets"
              ? "content"
              : block.header
                ? "header"
                : "content";
          dispatch({ type: "START_EDITING", blockId: selectedBlockId, field });
        }
        return;
      }

      // Arrow key navigation between blocks
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && selectedBlockId) {
        e.preventDefault();
        const resume = resumeRef.current;
        const regions = Object.entries(resume.regionBlockIds);
        if (regions.length === 0) return;

        // Build a flat ordered list of all top-level block IDs with their region+path info
        const allBlocks: { blockId: string; regionId: string }[] = [];
        for (const [regionId, blockIds] of regions) {
          for (const blockId of blockIds) {
            allBlocks.push({ blockId, regionId });
          }
        }
        if (allBlocks.length === 0) return;

        const currentIndex = allBlocks.findIndex((b) => b.blockId === selectedBlockId);
        if (currentIndex === -1) return;

        let nextIndex: number;
        if (e.key === "ArrowDown") {
          nextIndex = currentIndex + 1;
          if (nextIndex >= allBlocks.length) return; // already at the end
        } else {
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) return; // already at the start
        }

        const next = allBlocks[nextIndex];
        dispatch({ type: "SELECT_BLOCK", path: [next.blockId] });
        return;
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.editingBlockId, selectedBlockId, state.selectedPath]);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const contextValue = useMemo<EditorContextValue>(
    () => ({
      resume: state.resume,
      selectedBlockId,
      selectedPath: state.selectedPath,
      selectedRegionId: state.selectedRegionId,
      editingBlockId: state.editingBlockId,
      editingField: state.editingField,
      canUndo,
      canRedo,
      dispatch,
      onRequestInsert,
    }),
    [state.resume, selectedBlockId, state.selectedPath, state.selectedRegionId, state.editingBlockId, state.editingField, canUndo, canRedo, dispatch, onRequestInsert],
  );

  return (
    <EditorContext.Provider value={contextValue}>
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
