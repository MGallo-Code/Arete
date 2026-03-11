# Property Panel Layout & Density — Research Findings

## Current State
The Arete property panels are built using Radix UI `Collapsible` components (`CollapsibleSection.tsx`) and a standard `PropertyRow.tsx` component. State is persisted across selection changes using a global `Map`.

- **Layout Pattern:** Most properties occupy a full horizontal row (`PropertyRow`), regardless of the input control's size.
- **Components:**
    - `BlockStylePanel.tsx`: Main panel for block editing. Groups properties into Header, Colors, Typography, Box Model, Borders, Box Shadow, and content-specific sections.
    - `RegionStylePanel.tsx`: Similar to BlockStylePanel but includes a "Layout" section (Align items, Gap).
    - `ThemePanel.tsx`: Dense panel for global styles. Headings are particularly cramped with custom multi-row layouts.
- **Density Issues:**
    - Significant vertical waste: Small toggles (Font Weight) or single color pickers take up 100% of the sidebar width.
    - Inconsistent grouping: Some panels use `PropertyRow`, others use manual `div.propRow`.
    - `ThemePanel` headings use a custom 3-row layout per tag (H1-H6) that deviates from the rest of the editor's UI patterns.

## Industry Analysis

### Figma
- **What they do well:** Exceptional density. Properties are grouped into 2 or 3 columns where appropriate (e.g., X/Y/W/H/Rotation/Corner Radius are all in a compact grid).
- **What they do poorly:** Can be overwhelming for new users due to high icon density and minimal text labels.
- **Transferable patterns:** 
    - **Property Pairing:** W+H, X+Y, H+V padding.
    - **Visual Headers:** All-caps, bold, small font (9px) for section titles.
    - **Scrubbable Labels:** Clicking and dragging on a property label (e.g., "W") to change the value.

### Webflow
- **What they do well:** The gold standard for visual CSS editing. Uses a literal box model diagram for spacing. Clear hierarchy: Layout -> Spacing -> Size -> Position -> Typography.
- **What they do poorly:** The "Style Manager" and "Interactions" panels can lead to tab-fatigue.
- **Transferable patterns:**
    - **Visual Hierarchy:** Distinct section separators and clear text labels for complex flex/grid controls.
    - **Inheritance Indicators:** Highlighting values that are inherited vs. overridden (orange/blue).

### Framer
- **What they do well:** Clean, modern aesthetic with high-polish interactions. Uses segmented controls (toggles) for choices with 2-4 options.
- **Transferable patterns:**
    - **Segmented Controls:** Replacing dropdowns with button groups for things like Text Align or Font Weight.

## Recommendations

### Must-Have Changes
1.  **Unified Property Grid:** Replace the single-child `PropertyRow` with a grid-based system that supports 1, 2, or 3 columns.
    - **Typography Pairing:** Pair Font Size + Line Height; Font Weight + Text Transform.
    - **Box Shadow Pairing:** Pair X Offset + Y Offset; Blur + Spread.
    - **Layout Pairing:** Pair Align Items + Gap.
2.  **Section Header Redesign:** Use all-caps, bold, 9px/10px font for `CollapsibleSection` triggers to create a stronger visual hierarchy. Add a subtle 1px divider between sections.
3.  **Selection Breadcrumbs:** Add a "Selection Path" at the top of the sidebar (e.g., `Template > Main Region > Text Block`) to give users context of where they are in the hierarchy.
4.  **Standardize Property Rows:** Ensure `BlockStylePanel`, `RegionStylePanel`, and `ThemePanel` all use the same `PropertyRow` component and grid patterns.

### Nice-to-Have Improvements
1.  **Scrubbable Labels:** Implement drag-to-scrub on numeric labels to allow quick adjustments without typing.
2.  **Advanced Toggles:** Hide niche properties (e.g., Spread in Box Shadow, Letter Spacing in Typography) behind a "More" or "Advanced" toggle at the bottom of each section.
3.  **Inheritance Visualization:** Show a small indicator (e.g., a colored dot or label) when a property is overriding a theme-level or region-level default.

### Things to Avoid
-   **Too Many Icons:** Avoid replacing text labels with icons for complex CSS properties (like Flexbox align-items) without tooltips or clear visual affordances.
-   **Deeply Nested Collapsibles:** Keep the hierarchy flat (max 2 levels) to avoid "poking" through menus.

## Agent Findings

### Gemini
- **Current Layout Waste:** I've identified that `BoxShadowControls` and `TypographyControls` are the primary culprits for vertical waste. `BoxShadowControls` uses 6 full rows for a single shadow definition. This can be reduced to 3 rows.
- **ThemePanel Inconsistency:** The `ThemePanel` headings section is a "UI outlier." It uses a very dense, custom layout that doesn't match the `PropertyRow` pattern used elsewhere. We should standardize this into a "Compact Heading Row" component.
- **Sidebar Width:** The default width of 300px is appropriate, but the internal "gutters" and label widths need to be fixed to prevent text truncation when doubling up properties.
- **Breadcrumb Opportunity:** Users currently have no way to see the parent of a selected block (e.g., which region it belongs to) without clicking around. A breadcrumb at the top of the "Selection" tab would solve this.
- **Proposed Pairings Detail:**
    - **Typography:**
        - Row 1: Font Family (Full)
        - Row 2: Size (50%) | Line Height (50%)
        - Row 3: Weight (50%) | Transform (50%)
        - Row 4: Align (Full)
    - **Box Shadow:**
        - Row 1: X (50%) | Y (50%)
        - Row 2: Blur (50%) | Spread (50%)
        - Row 3: Color (50%) | Inset (50%)
    - **Border:**
        - Row 1: Width (40%) | Style (60%)
        - Row 2: Color (Full)
- **Discovered Issue:** `BoxModelEditor` is a great visual component, but it's used inconsistently. In `ThemePanel`, it's used for Page Margins, but in `BlockStylePanel`, it's a dedicated section. We should ensure the "Box Model" visual is the standard way to edit all spacing.

## Discovered Issues & Opportunities
- **Empty State:** When no block or region is selected, the sidebar defaults to the Theme panel. While functional, it could benefit from a more welcoming "Welcome/Get Started" state or a quick-links section to common tasks.
- **Undo/Redo Bloat:** Per P8 in the instructions, the History buttons in `ThemePanel` are redundant. Removing them will save ~40px of vertical space.
- **Floating Toolbar vs. Sidebar:** Some properties (like Text Align) might be better placed in the `FloatingToolbar` for quicker access, while keeping the full controls in the sidebar.
