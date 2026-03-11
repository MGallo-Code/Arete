# Arete Project Context

> *Arete (ἀρετή) — excellence, the best possible expression of a thing.*

A resume tailoring tool. Store your full project portfolio once; generate a polished, one-page resume targeted to any job description.

---

## Phases

### Phase 1 — Layout Engine (current)
**Goal:** live WYSIWYG resume editor with PDF export. No accounts, no AI, no backend complexity.

- Prevent text wrapping orphans (no 1-word last lines)
- Consistent line lengths and spacing
- Resume templates with colored/styled backgrounds
- Font, bold, italic, size support
- Single-page constraint enforced at render time

### Phase 2 — Content Selection
AI-assisted project selection: given a job description, rank and select which portfolio items to include. Likely Claude API.

### Phase 3 — Production
Real auth, accounts, persistent storage, shareable links, etc.

---

## Stack (Phase 1)

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js + TypeScript | API routes for Puppeteer; full-stack in one project |
| UI | React (no Tailwind) | Plain CSS modules for the editor shell |
| Linting/Formatting | ESLint + Prettier | ESLint for rules, Prettier for formatting |
| Preview | HTML + CSS (browser layout engine) | Native text measurement, wrapping, fonts |
| PDF export | Puppeteer (headless Chrome) | Pixel-identical to the browser preview |
| Storage | Local JSON files (Phase 1) | No backend complexity yet |

**Why HTML/CSS as the source of truth:**
The browser already solves text measurement, font rendering, wrapping, and orphan/widow handling. Building the preview as a live HTML `div` means the preview IS the output — no compile step, no layout engine to maintain. Puppeteer exports what you see exactly.

CSS handles orphans/widows natively: `orphans: 2`, `widows: 2`, `break-inside: avoid`.

**Height measurement — hidden div:**
To measure block heights without full layout (e.g. for overflow detection), render blocks into an off-screen hidden div with identical CSS and read `offsetHeight`. Same engine as Puppeteer (Chrome), so measurements are always consistent with PDF output.

---

## Core Data Model

Source of truth: `app/models.ts`. Do not recreate or duplicate these types elsewhere.

```typescript
type Style = Partial<CSSProperties>  // React CSSProperties

interface TextRun {
  text: string
  link?: string
  style?: Style
}

type RichText = TextRun[]

interface BulletLevel {
  char?: string    // marker character e.g. "•", "–", "▸"
  image?: string   // marker image URL — takes precedence over char
  style?: Style    // text style + paddingLeft for indentation
}

interface BulletItem {
  content: RichText
  level?: number   // index into BulletLevel[]
}

type Content =
  | { type: 'text';    value: RichText }
  | { type: 'bullets'; items: BulletItem[]; levels?: BulletLevel[] }  // levels overrides theme.bullets
  | { type: 'blocks';  children: Block[] }
  | { type: 'image';   src: string; alt?: string; style?: Style }

interface Block {
  id: string
  tags?: string[]
  header?: { content: RichText; tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }
  content: Content
  style?: Style
}

interface PageSettings {
  size: 'letter' | 'a4'
  margins: { top: string; right: string; bottom: string; left: string }
}

interface Theme {
  root: Style      // full page — font/color cascade + background/watermark
  canvas: Style    // content area inside margins — grid container background
  h1–h6: Style
  bullets: BulletLevel[]  // template-wide defaults per indent level
  link: Style
}

interface Template {
  id: string
  name: string
  grid: string                       // CSS grid-template value
  regionStyles: Record<string, Style> // style per named grid region
  page: PageSettings
  fonts?: string[]                   // font families to load for Puppeteer
  theme: Theme
}

interface Resume {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  template: Template
  regionBlockIds: Record<string, string[]>  // ordered block IDs per named grid region
  blocks: Record<string, Block>             // block lookup by ID
}
```

**Key design decisions:**
- Layout uses CSS Grid with named areas. `Template.grid` is a raw `grid-template` CSS value. `Template.regionStyles` maps each region name to its style. The browser handles spanning, sizing, and alignment natively.
- Region names are the contract between `Template.regionStyles` (visual) and `Resume.regionBlockIds` (content) — they must match and also match the area names in `Template.grid`.
- `ResumePreview` renders two layers: `<main>` (`theme.root` + page size + margins as padding) wrapping a `<div>` (`theme.canvas` + CSS Grid). Puppeteer margins are set to zero — CSS handles all spacing for preview/PDF parity.
- `blocks` is a flat lookup; child blocks (inside `content: { type: 'blocks' }`) are owned by their parent block, not in the top-level table.
- `Style` is `Partial<CSSProperties>` — no custom wrapper types.
- `Theme.root` cascades font/color to all children. No separate `body` or `main` — they were redundant.
- `Block.header.tag` is `"h1"–"h6"` (not a numeric level) — doubles as the JSX tag name and the `theme[tag]` style lookup key, no casting needed.
- `Block.header.content` is `RichText` — supports inline styling within headings.
- `Block.tags` and `Resume.tags` are free-form string arrays for Phase 2 AI selection.
- `BulletLevel` is flat: `char`, `image`, `style` (includes `paddingLeft` for indentation, `gap` for marker spacing). Per-list `levels` override `theme.bullets`. No magic numbers in components — all spacing lives in the data.

---

## What We Are NOT Doing Yet

- No accounts or auth
- No database (local file / JSON is fine for now)
- No AI / Claude API
- No Tailwind (plain CSS modules for the editor UI)
- No production deployment concerns

---

## Export Formats

Phase 1: **PDF only.**

| Format | How | Fidelity | Notes |
|--------|-----|----------|-------|
| **PDF** | Puppeteer | Pixel-perfect | Primary format; same render path as preview. Text is real (selectable, copyable, ATS-readable) — not an image. |

DOCX, PNG, and plain text are deferred to later phases.

---

## Resume Layout Integrity (CRITICAL)

The resume preview is the source of truth for PDF export. **Everything inside `<main>` must render identically in Puppeteer.** This means:

**NEVER add to the preview area:**
- Placeholder text ("Click to edit", "Add image URL", "Empty block", etc.)
- Min-height spacer divs on empty content
- Styled placeholder containers (dashed borders, gray backgrounds, icons)
- Any visible element that would cause the preview to differ from PDF output

**ALLOWED in the preview area (these don't affect document flow):**
- Selection outlines — CSS `::after` pseudo-elements, don't affect layout
- Floating toolbars — `position: absolute`, outside document flow
- Inline `contentEditable` editing — replaces existing content in-place
- Between-block insertion lines — `position: absolute` overlays

Empty blocks (no header, no content) render as zero-height divs. They are still selectable — the block's container div provides the click target. Empty content editing is handled via the sidebar controls.

---

## Rendering Architecture

The data model drives an HTML/CSS renderer. Puppeteer captures that as PDF.

```
<main>                          ← theme.root + page size + margins as CSS padding
  <div>                         ← theme.canvas + display:grid + gridTemplate
    <div style={gridArea+regionStyle}>  ← one per region
      <BlockView>               ← header (RichText → hN tag) + ContentView
        <ContentView>           ← switches on content.type
          <RichTextView>        ← TextRun[] → spans/anchors
          <BulletsView>         ← BulletItem[] → ul/li with marker
          <BlockView> (recurse) ← type:'blocks' children
```

- `theme.root` spreads onto `<main>` — font/color cascade applies to all descendants
- `theme.canvas` spreads onto the grid container div
- `regionStyles[name]` spreads onto each region div, with `gridArea: name`
- `Block.header.tag` → used as both the JSX element and `theme[tag]` style key directly
- `ThemeContext` provides `theme` to all renderer components — no prop drilling. `ResumePreview` is the provider; `BlockView`, `RichTextView`, `BulletsView` consume via `useTheme()`.
- `RichTextView` merges `theme.link` onto `<a>` elements (`{ ...theme.link, ...run.style }`)
- `BulletsView` spreads `level.style` directly onto `<li>` — `display:flex` is the only component-owned style. `gap` and `paddingLeft` come from `level.style` in the data.
- `BulletsView` uses `theme.bullets` as default levels; per-list `levels` override
- `ul/ol` padding reset in `globals.css`; `listStyle: none` on `<ul>` in `BulletsView`
- Puppeteer margins = 0; page margins are baked into CSS padding for preview/PDF parity

---

## Phase 1 Build Order

1. ~~Data model~~ — done (`app/models.ts`)
2. ~~Next.js scaffold~~ — done
3. ~~Sample data~~ — done (`app/fixtures.ts` — 3 resumes + `testResume` feature-test + block/theme fixtures)
4. ~~Renderer~~ — done (`ResumePreview`, `BlockView`, `ContentView`, `RichTextView`, `BulletsView`, `ThemeContext`)
5. Editor UI — **in progress** (see Editor Plan below)
6. Local persistence — load/save resume as JSON
7. PDF export — Puppeteer + Docker

---

## Key Formatting Goals

- **No orphan words** — last line of any block must have ≥ 2 words, or reflow the block
- **Consistent rhythm** — line height, spacing between sections must be uniform
- **One page hard limit** — content is cut or scaled to fit, never overflows (defer until editor is functional)
- **Template backgrounds** — support colored headers, sidebars, watermarks
- **Typography** — per-element font family, size, weight (bold), style (italic), color
- **Inline editing** — clicking any text element in the preview opens it for editing in place; changes sync back to the data model in real time

---

## Editor Plan

The editor UI is being prototyped. Current code in `app/components/editor/` is **experimental** — not committed, not final. The following features have been agreed upon and are planned:

### Core Interaction: Inline Editing on the Preview
The preview IS the editor. The sidebar is a control panel, not a structural mirror.

- **Click to select** a block (blue outline)
- **Click on already-selected block's text** (or double-click) → enters contentEditable mode
- **Escape** = cancel (revert to original)
- **Click outside the block** = cancel (revert to original)
- **Enter** = save (for single-line: headers, text). In bullets: Enter creates new bullet.
- **Cmd+B** bold, **Cmd+I** italic, **Cmd+K** insert link
- Rich text runs (TextRun[]) are preserved during editing — DOM is parsed back to RichText on save
- Paste handling: strip external formatting or convert to TextRuns
- For bullets: Enter = new bullet, Tab = indent (change level), Shift+Tab = outdent, Backspace on empty = remove bullet

### Block Selection + Contextual Controls
- Selected block shows floating toolbar (top-right): ↑ ↓ duplicate, delete, "+" above/below
- **Hover between blocks** → "+" insertion line appears (like Notion)
- The "+" opens the **block picker** (modal)

### Block Picker / Snippet Library (Modal)
- Categorized templates ("puzzle pieces"): Header, Contact, Summary, Experience, Education, Skills, Projects, Certifications, Awards, Languages, Volunteer, etc.
- Each template is a pre-built Block (or nested blocks) with placeholder text
- **Live mini previews** of each template rendered with the current theme
- Search/filter
- Eventually: hundreds of variations per category, user-saved custom snippets
- Should open as a **modal** (not a sidebar tab)

### Sidebar = Control Panel (Right Side)
The sidebar provides things the preview can't show directly:
- **Template picker** — visual thumbnails, click to switch (content preserved)
- **Theme controls** — font family, base size, accent color, heading style presets
- **Page settings** — letter/A4, margins
- **Region manager** (power users) — see/rename grid regions, adjust column ratios

### Direct Manipulation on the Preview
- **Draggable divider** between grid regions to resize (e.g. sidebar 30% → 35%)
- Drag blocks between regions on the preview itself
- Resize margins by dragging page edges
- Visual overflow indicator — red line at page cut point when content exceeds one page

### Undo/Redo
- History stack in the reducer (50 levels)
- Cmd+Z / Cmd+Shift+Z (when not inline-editing — let browser handle contentEditable undo)

### Keyboard Navigation
- Arrow keys to move between blocks (when not editing)
- Enter to start editing selected block
- Escape to stop editing → back to selection mode
- Tab to move to next block

### Deferred Editor Features
- One-page enforcement UI (after editor is functional)
- Multi-select for bulk operations (later)
- Export/save controls (later)

---

## Current State

**Committed (main):**
- `app/models.ts` — data model complete
- `app/fixtures.ts` — 3 sample resumes + `testResume` + block/theme/richtext fixtures
- `app/globals.css` — Comeau CSS reset + theme CSS variables + dark mode
- `app/contexts/ThemeContext.tsx` — `ThemeProvider` + `useTheme()` hook
- `app/components/ResumePreview.tsx` — two-layer page container + grid regions + region click selection
- `app/components/BlockView.tsx` — header + content rendering + hierarchical selection (path-based)
- `app/components/ContentView.tsx` — switches on content.type
- `app/components/RichTextView.tsx` — TextRun[] → spans/anchors with theme.link merge
- `app/components/BulletsView.tsx` — full inline bullet editor (Enter/Backspace/Tab/Escape/ArrowUp/Down)

**Experimental (branch `editor-ui-experimental`):**
- `app/page.tsx` — renders `<EditorShell />`
- `app/contexts/EditorContext.tsx` — state + reducer + undo/redo + keyboard shortcuts (delete/copy)
- `app/components/editor/EditorShell.tsx` — split layout, tabbed sidebar (selection vs theme)
- `app/components/editor/BlockStylePanel.tsx` — per-block styles (box model, colors, fonts, bullet levels)
- `app/components/editor/RegionStylePanel.tsx` — per-region styles
- `app/components/editor/ThemePanel.tsx` — global theme controls
- `app/components/editor/BoxModelEditor.tsx` — DevTools-style margin/padding diagram
- `app/components/editor/SpacingInput.tsx` — smart CSS unit input (px/pt/in/em/rem/%)
- `app/components/editor/EditableRichText.tsx` — contentEditable ↔ RichText wrapper
- `app/components/editor/BlockLibrary.tsx` — categorized block template picker (modal)
- `app/components/editor/BlockPreview.tsx` — scaled-down block renderer for library
- `app/data/blockTemplates.ts` — 28 block templates across 8 categories
