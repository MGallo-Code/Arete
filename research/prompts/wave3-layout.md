# Research Assignment: Compact Property Rows & Inheritance Visualization

You are a research agent auditing the Arete resume editor UI. **Do not write code.** Read the codebase, study reference applications, and write findings.

## Your Assignment
**Primary areas:** (1) Property pairing for density, (2) Inheritance visualization
**Findings files:** `research/findings/panel-layout.md` and `research/findings/visual-design.md`

## Context

### Problem 1: Property Pairing
Many small controls waste full rows. The sidebar feels stretched vertically. Research identified these optimal pairings:
- Font Size + Line Height (same row)
- Font Weight + Font Style (same row)
- Letter Spacing + Text Align (same row)
- Box Shadow X + Y offsets (same row)
- Box Shadow Blur + Spread (same row)
- Border Width + Style (same row)

The challenge: PropertyRow currently renders label-above-input, always full width. We need a way to put 2 controls side-by-side on one row.

### Problem 2: Inheritance Visualization
When a block overrides a theme property (e.g., fontSize on a block with an h2 header), there's no visual indicator. Users can't tell if a value is inherited from theme or set locally. Webflow solves this with color-coded labels (orange=inherited, blue=local override) and a reset button.

## Steps

1. Read `research/instructions.md` for full project context.
2. Read `CLAUDE.md` for architecture context.
3. Read these files thoroughly:
   - `app/components/editor/PropertyRow.tsx` — current single-column layout
   - `app/components/editor/TypographyControls.tsx` — where pairing would apply most
   - `app/components/editor/BoxShadowControls.tsx` — box shadow rows to pair
   - `app/components/editor/BorderControls.tsx` — border rows to pair
   - `app/components/editor/BlockStylePanel.tsx` — how sections are structured, how style/clearStyle work
   - `app/components/editor/CollapsibleSection.tsx` — section wrapper
   - `app/components/editor/editor.module.css` — current layout CSS
   - `app/styles/tokens.css` — CSS variables available
4. Study how Figma, Webflow, Framer place multiple controls on one row. Use web search. Focus on:
   - Grid/flex layout patterns for 2-up controls
   - Label placement when controls are paired (shared label? individual small labels?)
   - Responsive behavior when sidebar is narrow vs wide
5. Study how Webflow and Figma show inheritance/override state. Focus on:
   - Visual indicators (colored dots, label colors, background tinting)
   - Reset-to-inherited affordance (where it appears, how it works)
   - "Computed value" vs "set value" display
6. Write findings under `### AGENT_SECTION` in the Agent Findings sections of both findings files.

## Key Questions — Property Pairing
- Should PropertyRow support a `columns={2}` prop, or should there be a new `PropertyPair` component?
- Where should labels go? Above each input (stacked), or to the left of each?
- What minimum sidebar width supports 2-up controls without truncation?
- Should pairing be mandatory or optional per section?

## Key Questions — Inheritance
- Should indicators be per-property (dots next to each label) or per-section (badge on collapsed section header)?
- What's the simplest implementation that provides the most value? (Full Webflow-style = complex)
- How should the "inherited value" be displayed? (Placeholder text? Muted text below the input?)
- Should "Reset to theme" be per-property, per-section, or per-panel?
- How does this interact with the palette variable system? (Properties using var(--palette-*) are a third state: neither inherited nor raw)

## Important
- Be concrete — describe the actual CSS layout, component props, visual appearance.
- Consider both density gain (how much vertical space is saved) and readability (can users still scan quickly).
- For inheritance, consider the two-level cascade: theme → block. Regions inherit from theme.root.
