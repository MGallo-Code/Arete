# Research Assignment: Property Coverage & Theme Controls

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary areas:** Property Coverage & Consistency (Area 3) + Theme & Global Style Controls (Area 6)
**Findings files:** `research/findings/property-coverage.md` AND `research/findings/theme-controls.md`

## Steps

1. Read `research/instructions.md` fully — complete context, problems, constraints, research questions.
2. Read `CLAUDE.md` for architecture context.
3. Read `app/models.ts` — understand the data model, especially `Style`, `Theme`, `Block`, `BulletLevel`.
4. Read these files thoroughly:
   - `app/components/editor/BlockStylePanel.tsx` — what block properties are exposed
   - `app/components/editor/RegionStylePanel.tsx` — what region properties are exposed
   - `app/components/editor/ThemePanel.tsx` — what theme properties are exposed (headings, links, global)
   - `app/components/editor/TypographyControls.tsx` — shared typography component
   - `app/components/editor/ColorControls.tsx` (if exists) — shared color component
   - `app/components/editor/BorderControls.tsx` (if exists) — shared border component
   - `app/components/editor/BulletStyleControls.tsx` (if exists) — bullet level editing
5. Study reference applications (Webflow, Canva, Framer, Squarespace) for property coverage and theming — use web search.
6. Write findings in BOTH `research/findings/property-coverage.md` and `research/findings/theme-controls.md` under `### AGENT_SECTION`.
7. Fill in Industry Analysis, Recommendations, and Discovered Issues sections in both files.

## Key Questions to Answer

### Property Coverage
- What CSS properties are most important for resume styling that we're missing?
- Should `textDecoration`, `fontStyle` (italic), `opacity`, `width` be added to blocks?
- What properties should theme headings (h1–h6) expose beyond current (fontSize, color, letterSpacing, textTransform, borderBottom)?
- What properties should theme links expose beyond current (color only)?
- Should there be style presets? (e.g., border-radius: none/slight/rounded/pill, shadow: none/soft/medium/hard)
- How should the panel change based on content type (text vs bullets vs image)?

### Theme Controls
- How should the theme panel organize heading styles? (current per-tag rows are cramped)
- Should theme have one-click style presets beyond palette? ("Professional", "Creative", "Minimalist")
- How should inheritance be visualized? ("inherited from theme" vs "overridden locally")
- Should there be a "reset to theme" button on overridden properties?
- What resume-specific theme patterns exist? (study Zety, Resume.io, Novoresume)

## Important
- Replace `AGENT_SECTION` with `Claude`, `Gemini`, or `Codex`.
- Be specific about WHICH properties to add WHERE and WHY for resume styling.
- Consider both casual users (presets, smart defaults) and power users (raw CSS access).
- Look for issues BEYOND the stated problems.
