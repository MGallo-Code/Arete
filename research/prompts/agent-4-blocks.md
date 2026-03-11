# Research Assignment: Block Layout & Content Editing

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary areas:** Block Layout & Sizing (Area 4) + Content Editing Workflows (Area 5)
**Findings files:** `research/findings/block-layout.md` AND `research/findings/content-editing.md`

## Steps

1. Read `research/instructions.md` fully — complete context, problems, constraints, research questions.
2. Read `CLAUDE.md` for architecture context.
3. Read `app/models.ts` — understand Content union type, Block structure.
4. Read these files thoroughly:
   - `app/components/BlockView.tsx` — how blocks render and handle selection/editing
   - `app/components/BulletsView.tsx` — bullet list inline editing
   - `app/components/editor/EditableRichText.tsx` — contentEditable wrapper
   - `app/components/editor/BlockStylePanel.tsx` — current block controls (note: no width/alignment)
   - `app/components/editor/ImageControls.tsx` (if exists) — image editing controls
   - `app/components/editor/BulletStyleControls.tsx` (if exists) — bullet sidebar controls
   - `app/components/editor/FloatingToolbar.tsx` (if exists) — block action toolbar
   - `app/components/ResumePreview.tsx` — region rendering (flex column, how blocks lay out)
   - `app/contexts/EditorContext.tsx` — state management, available actions
5. Study reference applications (Notion, Google Docs, Canva, Webflow, WordPress Gutenberg, Confluence) — use web search.
6. Write findings in BOTH `research/findings/block-layout.md` and `research/findings/content-editing.md` under `### AGENT_SECTION`.
7. Fill in Industry Analysis, Recommendations, and Discovered Issues.

## Key Questions to Answer

### Block Layout
- How should block width control work? (input field, slider, preset buttons like auto/50%/100%/fit-content?)
- How should horizontal alignment work? (alignSelf on flex child vs margin auto?)
- Should the width/alignment controls be in the sidebar, floating toolbar, or both?
- How should the preview visually indicate a block that's less than 100% width?
- Should blocks support min-width / max-width?
- How do resume tools handle centering elements like contact info bars or skill grids?

### Content Editing
- How should content type switching work? (text → bullets, bullets → text, add image)
- What UI affordance should empty blocks have?
- Should there be a "change content type" dropdown/button in the sidebar?
- How should "add bullet" work from the sidebar?
- How should image editing work inline (currently sidebar-only)?
- What paste behaviors are expected? (paste text into bullets → split into items?)
- How do resume builders handle content type-specific actions?

## Important
- Replace `AGENT_SECTION` with `Claude`, `Gemini`, or `Codex`.
- Think about the resume context — these aren't generic document blocks, they're resume sections.
- Consider both casual users and power users.
- Look for issues BEYOND the stated problems.
