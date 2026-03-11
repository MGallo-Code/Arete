# Research Assignment: Input Controls & Interactions

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary area:** Input Controls & Interactions (Area 1 from `research/instructions.md`)
**Findings file:** `research/findings/input-controls.md`

## Steps

1. Read `research/instructions.md` fully — it contains the complete project context, problems to solve, constraints, and research questions.
2. Read `CLAUDE.md` for architecture context.
3. Read these files thoroughly:
   - `app/components/editor/SpacingInput.tsx` — current dimension input
   - `app/components/editor/TypographyControls.tsx` — how typography inputs work
   - `app/components/editor/ThemePanel.tsx` — the font-size dropdown vs SpacingInput inconsistency
   - `app/components/editor/BlockStylePanel.tsx` — block property inputs
   - `app/components/editor/BoxModelEditor.tsx` — margin/padding diagram inputs
   - `app/components/editor/BoxShadowControls.tsx` — shadow value inputs
   - `app/components/editor/editor.module.css` — input styling
   - `app/utils/cssUtils.ts` — value nudging utilities
4. Study reference applications (Figma, Canva, Webflow, Framer, Sketch, Adobe XD) for their input control patterns — use web search to find details about their property panel interactions.
5. Write your findings in `research/findings/input-controls.md` under the appropriate sections. Write your agent-specific findings under the `### AGENT_SECTION` heading in the "Agent Findings" section.
6. Also fill in the "Industry Analysis" section with what you learn from reference tools.
7. Propose concrete "Must-Have Changes" and "Nice-to-Have Improvements" in the Recommendations section.
8. Fill in the "Discovered Issues & Opportunities" section with anything you find that wasn't in the original brief — friction points, missing affordances, accessibility issues, ideas for serving casual vs power users, etc.

## Key Questions to Answer
- What's the best unified dimension input component design? (visual +/- steppers, drag-to-scrub, unit dropdown, presets)
- How should "inherit" / "auto" / "unset" special values work in numeric inputs?
- Should we support drag-to-scrub on number inputs like Figma?
- How should color inputs work better? (recent colors, opacity, palette integration)
- What keyboard shortcuts should dimension inputs support?
- What would make inputs feel good for both casual users (presets, sliders) and power users (raw values, keyboard nudging)?

## Important
- Replace `AGENT_SECTION` with `Claude`, `Gemini`, or `Codex` depending on which platform you are.
- Be concrete and specific — cite component names, file paths, line numbers.
- Don't just say "make it better" — describe exactly what the input should look like and how it should behave.
- Look for issues BEYOND the stated problems. What else is wrong or could be improved about input controls?
