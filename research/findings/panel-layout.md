# Property Panel Layout & Density — Research Findings

## Current State
The Arete property panels are built using Radix UI `Collapsible` components (`CollapsibleSection.tsx`) and a standard `PropertyRow.tsx` component. State is persisted across selection changes using a global `Map`.

- **Layout Pattern:** Most properties occupy a full horizontal row (`PropertyRow`), regardless of the input control's size.
- **Components:**
    - `BlockStylePanel.tsx`: Main panel for block editing. Groups properties into Header, Colors, Typography, Box Model, Borders, Box Shadow, and content-specific sections.
    - `RegionStylePanel.tsx`: Similar to BlockStylePanel but includes a "Layout" section (Align items, Gap).
    - `ThemePanel.tsx`: Dense panel for global styles. Headings are particularly cramped with custom multi-row layouts.
- **Panel Sizing:** Default sidebar width is 300px via `--editor-sidebar-width` and EditorShell’s localStorage initializer; resize clamp is 240–500px.
- **Spacing Tokens:** `propRow` uses `margin-bottom: 10px`, labels are 11px with 3px bottom margin, and `collapsibleContent` adds 8px vertical padding per section. The cumulative vertical padding is a primary contributor to perceived "tall" density.
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
    - **Property Labels Toggle:** Figma explicitly allows turning property labels on/off, which is an effective "compact vs. labeled" mode for new vs. power users.
    - **Panel Resizing:** The properties panel is resizable, and Figma has explicitly streamlined grouping to match modern workflows and reduce scanning overhead.
    - **Source:** Figma Help Center — “Navigating UI3” and “Design, prototype, and explore layer properties in the right sidebar.”

### Webflow
- **What they do well:** The gold standard for visual CSS editing. Uses a literal box model diagram for spacing. Clear hierarchy: Layout -> Spacing -> Size -> Position -> Typography.
- **What they do poorly:** The number of sections can be overwhelming without Focus Mode.
- **Transferable patterns:**
    - **Visual Hierarchy:** Distinct section separators and clear text labels for complex flex/grid controls.
    - **Focus Mode:** Expand-one-section-at-a-time mode prevents the "too many sections" problem and keeps scan effort low.
    - **Section Grouping by CSS Category:** Layout, Spacing, Size, Position, Typography, Backgrounds, Borders, Effects, Custom properties.
    - **Source:** Webflow Help Center — “Style panel overview.”

### Framer
- **What they do well:** Clean, modern aesthetic with high-polish interactions. Uses segmented controls (toggles) for choices with 2-4 options.
- **Transferable patterns:**
    - **Segmented Controls:** Replacing dropdowns with button groups for things like Text Align or Font Weight.
    - **Properties Panel for Text Styles:** Explicit "Text → Styles" entry in the properties panel keeps reusable styling close to the content being edited.
    - **Context-Based Panel:** The right sidebar changes content based on selection (text vs breakpoint vs other elements).
    - **Source:** Framer Help — “Using text styles” and Framer Interface overview (right sidebar properties panel).

### Sketch
- **What they do well:** Inspector dynamically shows/hides controls based on selection, and includes clear groups for alignment, position/rotation, layout sizing, and appearance (fills, borders, shadows, effects).
- **Transferable patterns:**
    - **Dynamic Density:** Show only what applies to the selected layer type to keep the panel sparse without hiding essentials.
    - **Compact Layout:** Sketch has explicitly made the Layout panel more compact for certain selections, validating tighter density for “simple” layers.
    - **Source:** Sketch Docs — “The Inspector” and Sketch changelog (web app updates).

### Adobe XD
- **What they do well:** Property Inspector focuses on a few predictable groups — dimensions/rotation and appearance — which reduces cognitive load for single selections.
- **Transferable patterns:**
    - **Selection-Specific Grouping:** Text selections reveal text properties, shapes reveal appearance properties, minimizing unused sections.
    - **Source:** Adobe XD Help — “View and inspect design specs.”

### Canva
- **What they do well:** Side panel width is explicitly constrained (roughly 350px in their app panel guidelines) and uses vertical stacking with scroll as a baseline.
- **Transferable patterns:**
    - **Known Panel Width Target:** A ~350px panel width is considered "normal" for a mainstream editor, giving a useful reference point for Arete’s default width.
    - **Source:** Canva Apps SDK — Design guidelines (Layout).

### Notion
- **What they do well:** Formatting and structure are driven by inline controls and a command menu rather than a permanent dense property panel.
- **Transferable patterns:**
    - **Command-First Discovery:** The `/` command menu surfaces available block types without forcing a sidebar-based configuration UI.
    - **Source:** Notion Help Center — “Keyboard shortcuts” (Slash commands).

### Google Docs
- **What they do well:** Uses contextual sidebars for specific objects (e.g., tables) with clearly separated sections and labels.
- **Transferable patterns:**
    - **Contextual Sidebars:** Only appear when editing a specific object (table), reducing always-on panel clutter.
    - **Sectioned Sidebar:** Table properties are split into Table and Cell sections for clarity.
    - **Source:** Google Workspace Updates — “Improvements to content organization in Google Docs.”

## Recommendations

### Must-Have Changes
1.  ✅ **Unified Property Grid:** Created `PropertyPair` component for 2-column layouts.
    - ✅ **Typography Pairing:** Pair Font Size + Line Height; Font Weight + Font Style; Letter Spacing + Text Align.
    - ✅ **Box Shadow Pairing:** Pair X Offset + Y Offset; Blur + Spread.
    - **Layout Pairing:** Pair Align Items + Gap.
2.  **Section Header Redesign:** Use all-caps, bold, 9px/10px font for `CollapsibleSection` triggers to create a stronger visual hierarchy. Add a subtle 1px divider between sections.
3.  **Selection Breadcrumbs:** Add a "Selection Path" at the top of the sidebar (e.g., `Template > Main Region > Text Block`) to give users context of where they are in the hierarchy.
4.  **Default Width Adjustment:** Set the default sidebar width to **320–340px** and tighten min/max to **280–480px** to better support 2-up fields without truncation, while staying within mainstream editor expectations.
5.  ✅ (partial) **Standardize Property Rows:** Ensure `BlockStylePanel`, `RegionStylePanel`, and `ThemePanel` all use the same `PropertyRow` component and grid patterns. *(ThemePanel headings now reuse shared components: TypographyControls, ColorControls, BoxModelEditor, BorderControls, BoxShadowControls. CollapsibleSection state keying fixed with panelId prop.)*

### Nice-to-Have Improvements
1.  **Scrubbable Labels:** Implement drag-to-scrub on numeric labels to allow quick adjustments without typing.
2.  **Advanced Toggles:** Hide niche properties (e.g., Spread in Box Shadow, Letter Spacing in Typography) behind a "More" or "Advanced" toggle at the bottom of each section.
3.  **Inheritance Visualization:** Show a small indicator (e.g., a colored dot or label) when a property is overriding a theme-level or region-level default.
4.  **Compact vs. Labeled Mode:** Add a toggle similar to Figma’s property labels on/off to let new users see full labels and power users opt into compact density.
5.  **Selection-Adaptive Sections:** When selecting images or bullet lists, pin the content-specific section to the top of the panel and auto-expand it to reduce hunting.
6.  **Focus Mode (One Section Open):** Optional toggle to keep only one `CollapsibleSection` open at a time, reducing vertical scan when many sections exist.
7.  **First-Time Helper Row:** A one-line helper at the top of the panel (“Select a block to edit typography, colors, and spacing”) that disappears after first use.

### Things to Avoid
-   **Too Many Icons:** Avoid replacing text labels with icons for complex CSS properties (like Flexbox align-items) without tooltips or clear visual affordances.
-   **Deeply Nested Collapsibles:** Keep the hierarchy flat (max 2 levels) to avoid "poking" through menus.

## Agent Findings

### Gemini
- **Property Pairing for Density:** I recommend introducing a `PropertyGrid` component (or adding a `columns` prop to a new `PropertyPair` wrapper) to support side-by-side controls. 
    - **Implementation:** Use `display: grid; grid-template-columns: 1fr 1fr; gap: 8px;`.
    - **Labeling:** In 2-up mode, labels should be placed **above each input** but using a smaller font size (10px) than standard full-row labels to maintain vertical savings.
    - **Recommended Pairings:**
        - **Typography:** Font Size + Line Height; Font Weight + Font Style; Letter Spacing + Text Align.
        - **Box Shadow:** X Offset + Y Offset; Blur + Spread.
        - **Borders:** Border Width + Border Style.
- **Sidebar Width Optimization:** The current 300px width is slightly narrow for 2-up controls with descriptive labels. 
    - **Finding:** Truncation occurs on labels longer than 12-14 characters in a 50% column.
    - **Recommendation:** Increase default sidebar width to **320px** or **340px**. This provides enough "breathing room" for 2-up `SpacingInput` components and `select` dropdowns without feeling overly bulky on standard 13-15" laptop screens.
- **Structural Standardization:** `ThemePanel` headings currently use a custom 3-row layout that wastes space. These should be refactored to use the new `PropertyGrid` pattern, pairing Font Size + Line Height and Font Weight + Color in two rows instead of four.
- **CollapsibleSection Badges:** Add a "count" badge to collapsed section headers (e.g., "Typography (3)") to indicate how many properties in that section have been modified from the theme default. This helps users quickly find overrides without expanding every section.
- **Breadcrumb Orientation:** Add a navigation breadcrumb at the top of the "Selection" tab (e.g., `Region > Block > Content`). This clarifies the hierarchy and provides a quick way to select parent elements (Region) when a block is selected.

### Claude

**Cross-cutting findings from visual design audit relevant to panel layout:**

1. **Palette preset UI is duplicated in ThemePanel.** Lines 116-133 of `ThemePanel.tsx` render a `<select>` dropdown of 4 presets, AND lines 134-152 render the same 4 presets as clickable button rows with swatch previews. The button rows are more informative (they show color swatches); the dropdown is redundant and wastes ~40px of vertical space.

2. **History section (Undo/Redo buttons) should be removed per P8.** The `CollapsibleSection title="History"` in ThemePanel has two buttons that duplicate Cmd+Z/Cmd+Shift+Z. Removing this section saves ~60px including the section header.

3. **BulletStyleControls layout is extremely dense and hard to parse.** Each bullet level renders a single row containing: a marker select, an image URL input, a paddingLeft SpacingInput, a gap SpacingInput, and a color picker -- all in one flex-wrap row. Below that, tiny gray labels ("marker", "image", "indent", "gap", "color") identify each input. This is visually overwhelming and would benefit from being restructured into labeled sub-rows.

4. **Section icon display is disabled.** `.collapsibleIcon { display: none; }` in `editor.module.css` means the 13 SVG icons in `SectionIcons.tsx` are invisible. Enabling them would add visual scanning cues that help users locate sections faster, reducing the need for excessive reading.

5. **PropertyRow forces full-width label+content vertical stacking.** The component (`PropertyRow.tsx`) is just a `div.propRow` with `label.propLabel` + children. The label always takes a full line above the input. For small inputs (color picker, toggle), this wastes significant space. Consider a horizontal layout variant: label on left (fixed width), input on right.

### Codex

**Concrete layout metrics and panel mechanics (from code audit):**

1. **Section padding compounds vertical height.** Each `CollapsibleSection` adds `padding: 8px 12px`, and each `propRow` adds `margin-bottom: 10px`. In practice, two single-input controls consume ~40–48px of vertical space before control height. Reducing `propRow` margin to 6px and `collapsibleContent` vertical padding to 6px is a straightforward density win.

2. **Section state persistence is global by title.** `CollapsibleSection` stores open state in a `Map` keyed by `title` only, so collapsing "Colors" in Block also collapses "Colors" in Theme. That makes scanning unpredictable and can make the panel feel "lost" after selection changes. Keying state by panel + title would improve perceived stability.

3. **Visual hierarchy is split between two header systems.** `panelHeader` uses a mixed-case title, while `collapsibleTrigger` uses uppercase labels and a tinted background. The result is two competing hierarchy styles and extra vertical separation. Aligning section headers to a single typographic system will reduce visual noise.

4. **Sidebar width target can be nudged upward.** With the current control sizes and multi-column intent, 300px is workable but cramped. A default width of **320–340px** (with 280–480px resize bounds) would better support 2-up controls without truncation. Canva’s app panel guideline (~350px) suggests this is within user expectation for dense sidebars.

5. **Pairing map for Arete’s specific properties:**

**Typography**
- Row: Font Size | Line Height
- Row: Font Weight | Text Transform
- Row: Letter Spacing | Text Align

**Borders**
- Row: Width | Style
- Row: Color | Radius

**Box Shadow**
- Row: X | Y
- Row: Blur | Spread
- Row: Color | Inset

**Layout (Region)**
- Row: Align Items | Gap
- Row: Justify Content | Flow Direction (if/when added)

**Grid (Theme)**
- Row: Column width | Column regions (label)
- Row: Row height | Row regions (label)

**Property pairing & 2-up layout (focus of this assignment):**

1. **Component structure: prefer a new `PropertyPair`/`PropertyGrid` over `PropertyRow columns`.**
   - `PropertyRow` is currently a strict label-above-input pattern (`PropertyRow.tsx`). Expanding it to multiple columns means changing both semantics and spacing for every row.
   - A dedicated `PropertyPair`/`PropertyGrid` allows explicit usage only where it’s safe (Font Size + Line Height, etc.) and makes fallback-to-single-column behavior easy without touching existing rows.
   - This also keeps per-control `label` elements intact for accessibility, rather than trying to share a single label across two inputs.

2. **Label placement: keep labels *above* each input for paired rows.**
   - Existing visual pattern is label-above-control (`.propLabel`). Mirroring this with small per-control labels keeps scanning consistent.
   - Left-of-input labels compress the already narrow columns and are likely to truncate “Line height”, “Letter spacing”, etc. at the current sidebar width.
   - Use reduced label styling (e.g., 10px text, 2px bottom margin) to reduce height while retaining clarity.

3. **Minimum sidebar width for 2-up controls:**
   - `CollapsibleContent` adds 12px side padding, leaving ~276px of content width at the current 300px sidebar.
   - Two `SpacingInput` fields plus gap can fit at ~130–135px per column without truncation (input + unit selector).
   - **Practical threshold:** allow 2-up at **≥280–300px** content width; below that, auto-stack to one column. This aligns with the current 240px minimum being too narrow for 2-up.

4. **Pairing should be optional, not global.**
   - Apply 2-up only where values are conceptually paired *and* typically edited together (Font Size + Line Height, X + Y offsets).
   - Maintain single-column rows for longer controls (Font family, Text transform with 4 options, color pickers with RGBA toggle).
   - For conditional controls (e.g., `showFontStyle`, `showTextAlign`), the pairing should gracefully collapse to a single column when the sibling isn’t rendered.

5. **Concrete pairings for Arete (prioritized):**
   - Typography: Font Size + Line Height; Font Weight + Font Style; Letter Spacing + Text Align.
   - Box Shadow: X Offset + Y Offset; Blur + Spread.
   - Borders: Border Width + Border Style (Color stays full width).
   - When Section-specific controls get added later (Region layout): Align Items + Gap.

## Discovered Issues & Opportunities
- **Empty State:** When no block or region is selected, the sidebar defaults to the Theme panel. While functional, it could benefit from a more welcoming "Welcome/Get Started" state or a quick-links section to common tasks.
- **Undo/Redo Bloat:** Per P8 in the instructions, the History buttons in `ThemePanel` are redundant. Removing them will save ~40px of vertical space.
- **Floating Toolbar vs. Sidebar:** Some properties (like Text Align) might be better placed in the `FloatingToolbar` for quicker access, while keeping the full controls in the sidebar.
- **Hidden Section Icons:** `.collapsibleIcon { display: none; }` disables all section icons, making scan-only navigation harder than it needs to be.
- **Double Borders:** `panelSection` adds a bottom border, and each `collapsibleRoot` adds another, resulting in stacked dividers that increase visual noise in dense sections.
