# Research Assignment: Visual Design, Polish & Open Discovery

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary area:** Visual Design & Polish (Area 7) + **Open-ended discovery across all areas**
**Findings file:** `research/findings/visual-design.md` (and any other findings file if you discover cross-cutting issues)

This agent has the broadest scope — beyond visual polish, you are specifically tasked with finding issues and opportunities that the other 4 agents might miss.

## Steps

1. Read `research/instructions.md` fully — pay special attention to the "Beyond the Known Problems" section.
2. Read `CLAUDE.md` for architecture context.
3. Read ALL files in `app/components/editor/` — get the full picture.
4. Read `app/styles/tokens.css` and `app/components/editor/editor.module.css` — current visual language.
5. Read `app/components/editor/SectionIcons.tsx` — current icon system.
6. Read `app/components/ResumePreview.tsx`, `app/components/BlockView.tsx` — selection visuals.
7. Study reference applications broadly — Figma, Canva, Webflow, Framer, Sketch for visual design. Also study **resume-specific tools**: Zety, Resume.io, Novoresume, Enhancv, Kickresume for domain UX.
8. Write findings in `research/findings/visual-design.md` under `### AGENT_SECTION`.
9. If you discover issues that belong in other findings files, add notes there too under `### AGENT_SECTION`.

## Key Questions to Answer

### Visual Design
- Should we adopt an icon library (Lucide, Phosphor, Radix Icons) or continue with unicode?
- What color scheme works best for an editor sidebar? (Study the neutral palettes of Figma, VS Code, Linear)
- What micro-animations/transitions would add polish without being distracting?
- How should "inherited" vs "overridden" vs "palette-linked" properties be visually indicated?
- How should error states look for invalid values?
- How should empty states look (nothing selected, empty block, no content)?
- Should there be a selection breadcrumb bar at the top of the sidebar?

### Open Discovery — Things We Haven't Thought Of
- **First-use experience**: What happens when someone opens the editor for the first time? Is it obvious what to do? Should there be an onboarding flow, empty-state guidance, or tooltip tour?
- **Contextual help**: Should properties have "?" tooltips explaining what they do?
- **Keyboard-first**: Can a power user do everything without a mouse? What keyboard shortcuts are missing?
- **Style copy/paste**: Can you copy a block's entire style and apply it to another? Should you be able to?
- **Zoom controls**: Can users zoom in/out on the preview? Should they?
- **Print preview**: Should there be a "see exactly how this prints" mode?
- **ATS compatibility**: Should the editor warn about formatting that doesn't parse well in ATS systems?
- **Accessibility**: Beyond ARIA labels — reduced motion, high contrast, screen reader workflows?
- **Undo granularity**: Is 500ms coalescing right? What do users expect?
- **Multi-select**: What would selecting multiple blocks and editing them together look like?
- **Drag-and-drop**: How polished is the block reordering? Could it be improved?
- **Responsive**: Should users be able to preview at different sizes?
- **Performance**: Any jank when editing? Unnecessary re-renders?
- **Mobile/tablet**: Does the editor work at all on smaller screens? Should it?

### Resume-Specific UX
- What do Zety, Resume.io, Novoresume, Enhancv do that we should learn from?
- What resume-specific quick actions would save time? (e.g., "add experience entry", "add skill tag")
- How do resume tools handle the one-page constraint in their UI?
- Are there resume formatting conventions we should enforce or suggest?

## Important
- Replace `AGENT_SECTION` with `Claude`, `Gemini`, or `Codex`.
- This is the "catch all" agent — surface EVERYTHING you notice, even small things.
- Be specific and actionable, not vague.
- Prioritize findings by impact on user experience.
