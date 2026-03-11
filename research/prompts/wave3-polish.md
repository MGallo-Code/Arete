# Research Assignment: Lucide Icons, Style Copy/Paste, Template Confirmation

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary areas:** (1) Icon library adoption, (2) Style copy/paste, (3) Template switch confirmation
**Findings file:** `research/findings/visual-design.md`

## Context

### Problem 1: Inconsistent Icons
The editor uses three different icon languages:
- `FloatingToolbar.tsx`: HTML entities (`&#8593;` arrows, `&#10697;` duplicate, `×` delete)
- `InlineToolbar.tsx`: styled HTML text (`<strong>B</strong>`, `<em>I</em>`)
- `SectionIcons.tsx`: 14 hand-drawn SVGs (14x14, stroke-based, currentColor) — now visible

Lucide (`lucide-react`) is the proposed replacement: open-source, tree-shakeable, 1500+ icons, 24x24 grid, 2px strokes. It would provide a consistent visual language across all toolbars.

### Problem 2: Style Copy/Paste
There's no way to copy a block's styles and paste them onto another block. A "Format Painter" (like Canva/Google Docs) would save significant time when formatting multiple similar blocks.

### Problem 3: Template Switch Confirmation
`TemplatePicker.tsx` immediately dispatches `SWITCH_TEMPLATE` on click with no confirmation. The reducer remaps blocks and dumps orphans into the first new region. Users need a warning before this potentially destructive operation.

## Steps

1. Read `research/instructions.md` for full project context.
2. Read `CLAUDE.md` for architecture context.
3. Read these files thoroughly:
   - `app/components/editor/FloatingToolbar.tsx` — current toolbar icons
   - `app/components/editor/InlineToolbar.tsx` — current formatting icons
   - `app/components/editor/SectionIcons.tsx` — current SVG icons
   - `app/components/editor/TemplatePicker.tsx` — template switching
   - `app/components/editor/editor.module.css` — icon and button CSS
   - `app/contexts/EditorContext.tsx` — for SWITCH_TEMPLATE action and potential COPY/PASTE_STYLE actions
4. Study reference apps:
   - Figma: icon system, style copy/paste, component swap confirmation
   - Canva: format painter, template switching UX
   - Google Docs: paint format tool
   - Webflow: style copy/paste between elements
5. Write findings under `### AGENT_SECTION` in the Agent Findings section.

## Key Questions — Lucide Icons
- Which specific Lucide icons map to each current toolbar button? List exact icon names.
- Should icon size be 16px (matching current SectionIcons) or 18px (slightly larger for toolbar buttons)?
- Should SectionIcons.tsx be kept alongside Lucide, or fully replaced?
- What's the bundle size impact of adding `lucide-react`?
- How should InlineToolbar format buttons look with Lucide? (The current styled text "B", "I" is actually quite recognizable)

## Key Questions — Style Copy/Paste
- Where should the Copy/Paste Style buttons live? FloatingToolbar? Sidebar header? Both?
- What exactly gets copied? The entire `block.style` object? Or individual sections (typography, colors, etc.)?
- Should headers be included in the paste? (Pasting a style from an h2 block to an h3 block — does the tag change?)
- What's the UX for "paste style"? Click Copy Style → click another block → click Paste Style? Or Copy → automatic paste-on-next-select?
- Should there be keyboard shortcuts? (Cmd+Shift+C / Cmd+Shift+V for style copy/paste?)

## Key Questions — Template Confirmation
- What should the confirmation dialog say? What information helps users decide?
- Should it show a preview of the new template?
- Should it explain what happens to orphaned blocks?
- Should there be an "Undo" option after switching (the undo stack already captures this)?

## Important
- For Lucide, provide exact icon name mappings (e.g., FloatingToolbar "move up" → `lucide-react/ArrowUp`).
- For style copy/paste, describe the complete user flow step by step.
- For template confirmation, describe the dialog content and buttons.
- Look for related polish opportunities you'd notice while working on these features.
