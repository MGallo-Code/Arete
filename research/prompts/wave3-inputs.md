# Research Assignment: Unified Dimension Input (UnitInput)

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary area:** Replacing SpacingInput with a unified UnitInput component
**Findings file:** `research/findings/input-controls.md`

## Context
SpacingInput is the current dimension input used across the editor. It works but has several limitations:
- No visible +/- stepper buttons (only keyboard arrow nudging)
- No support for unitless values (needed for line-height like "1.5")
- No support for `auto`, `inherit`, `unset`, `fr` (needed for grid)
- No inline math (e.g., "+2", "*1.5")
- Fixed unit list (px|pt|in|em|rem|%)
- Error state is transient and uninformative

The goal is to design a unified `UnitInput` component that replaces SpacingInput everywhere AND replaces the raw text inputs used for line-height, letter-spacing, and grid values.

## Steps

1. Read `research/instructions.md` for full project context.
2. Read `CLAUDE.md` for architecture context.
3. Read these files thoroughly:
   - `app/components/editor/SpacingInput.tsx` — current implementation
   - `app/components/editor/TypographyControls.tsx` — raw text inputs for lineHeight/letterSpacing
   - `app/components/editor/ThemePanel.tsx` — how typography and grid inputs work now
   - `app/components/editor/editor.module.css` — existing input CSS classes
   - `app/utils/cssUtils.ts` — nudgeCSSValue utility
4. Study how Figma, Webflow, Framer, and Sketch handle dimension inputs. Use web search. Focus on:
   - Visual +/- stepper buttons (placement, size, when visible)
   - Drag-to-scrub on labels
   - Unit selection UI (inline dropdown vs type-to-change)
   - How they handle `auto`/`inherit`/unitless values
   - Keyboard shortcuts for nudging (step sizes, modifier keys)
   - Inline math support
5. Write your findings under `### AGENT_SECTION` in the "Agent Findings" section of `research/findings/input-controls.md`.
6. Propose a concrete UnitInput component design:
   - Props interface
   - Visual layout (describe the HTML/CSS structure)
   - Behavior for each interaction (type, arrow keys, stepper buttons, unit change, special values)
   - How it replaces SpacingInput (same props or migration path)
   - How it handles unitless values (line-height "1.5")
   - How it handles special values (auto, inherit, unset)
   - How it handles grid units (fr, minmax())
   - Error states and validation

## Key Questions
- Should stepper buttons be always visible, or only on hover/focus?
- Should the unit selector be a dropdown inside the input, or a suffix button?
- How to handle mixed-mode inputs (some contexts allow units, some don't)?
- What's the right step size for different units? (1px, 0.1pt, 0.1em?)
- Should there be a "presets" popover for common values?

## Important
- Be concrete and specific — describe the actual HTML/CSS structure and interaction model.
- Don't just say "like Figma" — describe exactly what Figma does and how to adapt it.
- Consider both casual users (who want simple +/- buttons) and power users (who want keyboard-driven workflows).
