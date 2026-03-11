# Research Assignment: Property Panel Layout & Density

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary area:** Property Panel Layout & Density (Area 2 from `research/instructions.md`)
**Findings file:** `research/findings/panel-layout.md`

## Steps

1. Read `research/instructions.md` fully — it contains the complete project context, problems to solve, constraints, and research questions.
2. Read `CLAUDE.md` for architecture context.
3. Read these files thoroughly:
   - `app/components/editor/BlockStylePanel.tsx` — block property panel layout
   - `app/components/editor/RegionStylePanel.tsx` — region property panel layout
   - `app/components/editor/ThemePanel.tsx` — theme panel layout
   - `app/components/editor/EditorShell.tsx` — overall sidebar structure
   - `app/components/editor/CollapsibleSection.tsx` — section expand/collapse
   - `app/components/editor/PropertyRow.tsx` (if it exists) — individual property row layout
   - `app/components/editor/editor.module.css` — all panel styling
   - `app/styles/tokens.css` — design tokens (spacing, sizing)
4. Study reference applications (Figma, Canva, Webflow, Framer, Sketch) for their sidebar organization — use web search to find details about their property panel density and grouping.
5. Write your findings in `research/findings/panel-layout.md` under the appropriate sections. Write agent-specific findings under `### AGENT_SECTION`.
6. Also fill in the "Industry Analysis" section.
7. Propose concrete recommendations.
8. Fill in "Discovered Issues & Opportunities" with anything beyond the original brief.

## Key Questions to Answer
- Which properties should share a row? (e.g., font-weight + font-style, width + height, X + Y offsets)
- How should section headers look to create visual hierarchy without wasting space?
- What's the ideal sidebar default width?
- How should the panel adapt when different content types are selected?
- Should there be a selection breadcrumb at the top of the sidebar?
- How do other tools handle the "too many sections" problem?
- What would help a first-time user understand the sidebar without a tutorial?
- How do tools make dense panels feel organized rather than overwhelming?

## Important
- Replace `AGENT_SECTION` with `Claude`, `Gemini`, or `Codex` depending on which platform you are.
- Be concrete — propose specific property pairings, section groupings, and pixel-level layout suggestions.
- Look for issues BEYOND the stated problems.
