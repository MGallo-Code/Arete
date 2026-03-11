# Block Layout & Sizing — Research Findings

## Current State
Arete currently treats blocks as simple vertical elements within a region.
- **Rendering:** `ResumePreview.tsx` renders regions as `display: flex; flex-direction: column`. Blocks are rendered as direct children of these flex containers in `BlockView.tsx`.
- **Sizing:** Blocks have no explicit width controls. They default to the flex container's `align-items: stretch` behavior (implied), occupying 100% of the region's width.
- **Alignment:** There are no horizontal alignment controls for blocks. `textAlign` exists in `TypographyControls` but affects content *inside* the block, not the block's own position or width.
- **Image Sizing:** `ImageControls.tsx` provides width/height inputs for images specifically, but these are part of the `content.style`, not the `block.style`.

## Industry Analysis

### Figma / Framer (Sizing Modes)
- **What they do well:** Present width/height as semantic sizing modes rather than raw CSS. Figma exposes `Hug contents`, `Fill container`, and `Fixed` sizing for auto layout frames and children, with clear behavior differences. citeturn0search0  
- **Framer:** Auto-sizing supports `auto` and `fixed` modes and lets components declare which modes are available, reinforcing the idea of “mode first, number second.” citeturn1search0  
- **Transferable patterns:** A compact “Sizing mode” control that swaps between Fill/Auto/Fit/Fixed, with a numeric input only appearing for the fixed/custom mode.

### Webflow (Flex Child Alignment)
- **What they do well:** Exposes flex-child alignment controls (auto, top, center, bottom, stretch, baseline) directly in the Style panel, which maps cleanly to `align-self`. citeturn2search0  
- **Transferable patterns:** Use a simple alignment control for block-level alignment in a flex column region, without requiring users to understand flexbox.

### WordPress Gutenberg (Width Presets)
- **What they do well:** Width is a small set of presets (content/default, wide, full) shown in the block toolbar’s alignment dropdown. citeturn3search2  
- **Transferable patterns:** A width preset group that feels non-technical and safe for casual users.

### Canva (Position / Align Controls)
- **What they do well:** The Position panel consolidates alignment, spacing, and sizing controls in one place. citeturn4search0  
- **Transferable patterns:** Keep layout and sizing in one place rather than scattering across multiple sections.

## Recommendations

### Must-Have Changes
1. ✅ **Add "Sizing" section to `BlockStylePanel`:**
   - **Width Control:** Use the unified `SpacingInput` (Area 1) to support `auto`, `px`, `%`, and `fit-content`.
   - **Sizing Mode Pattern:** Follow the “mode first” mental model from Figma/Framer (Fill/Hug/Fit/Fixed). Only show the numeric input for Fixed/Custom. citeturn0search0turn1search0
   - **Horizontal Alignment:** A toggle group with icons for Left, Center, Right, modeled after the align-self controls seen in Webflow-style panels. citeturn2search0
2. ✅ **Implementation via Flexbox:** Since regions are `flex-direction: column`, use `align-self` on the block to handle alignment:
   - Left: `align-self: flex-start`
   - Center: `align-self: center`
   - Right: `align-self: flex-end`
3. **Visual Feedback in Preview:** When a block's width is less than 100%, ensure the selection highlight (the blue outline) wraps the *actual* width of the block, not the full region width.
4. ✅ **Default Sizing:** Most blocks should default to `width: 100%` or `auto` (stretching).

### Nice-to-Have Improvements
1. **Alignment Presets in FloatingToolbar:** Add Left/Center/Right buttons to the `FloatingToolbar` for quick one-click layout changes without using the sidebar.
2. **Width Presets:** Offer quick buttons for “Content / Wide / Full” similar to Gutenberg’s width presets, especially useful for resume headers and section dividers. citeturn3search2
3. **Min/Max Width:** Add these to an "Advanced" sub-section in Sizing for power users who want to prevent awkward wrapping (aligns with Figma’s min/max sizing model). citeturn0search0
4. **Aspect Ratio Lock:** Specifically for image blocks, a toggle to maintain the original aspect ratio during width/height changes.

### Things to Avoid
- **Avoid `float`:** It's legacy and unnecessary in a Flex/Grid system.
- **Avoid Absolute Positioning:** Resumes need to flow naturally. Absolute positioning breaks the PDF export logic for multi-page resumes.

## Agent Findings

### Gemini
- **CSS Mechanism:** `align-self` is the cleanest way to align blocks within the existing `flex-direction: column` regions. It avoids the "margin: auto" hack which only works if a width is explicitly set.
- **Constraint:** We must ensure that setting a block width doesn't break the "Direct-on-preview selection" system. The clickable area of the block should match its visual bounds.
- **Resume Context:** Centering is highly common for "Contact Info" bars or "Education/Experience" headers in certain resume styles (e.g., "Modern" or "Creative" templates). 100% width is not always desirable.
- **Visual Feedback for Sizing:** When a block's width is less than 100%, the selection outline should clearly show the "empty space" within the region.
    - **Idea:** A subtle "ghost" border or patterned background in the unused area of the region when a block is selected. This helps users understand *why* their block is centered or offset.
- **Drag-to-Resize Handles:** For blocks with "Custom" or "Fixed" width, show small circular handles on the left/right edges of the selection box in the preview.
    - **Action:** Dragging these handles updates the `width` property in real-time. This is a "Gold Standard" interaction (Figma/Notion) that makes the editor feel truly WYSIWYG.
- **Alignment Icon Consistency:** Use "Box-in-Container" icons for block alignment (Layout section) to distinguish them from "Text-Lines" icons used for text alignment (Typography section). This prevents the "Double Alignment" confusion mentioned in the industry analysis.
- **Snap-to-Grid Visuals:** When dragging to resize or moving blocks, show temporary "Snap Guides" (thin purple/blue lines) when the block edge aligns with another block's edge or a regional center point.

### Claude

#### Deep-Dive Industry Analysis

**Notion:** Slash commands support inserting and turning blocks into headings/lists, which is a good model for low-friction type switching. citeturn5search1

**Canva:** Position tools centralize alignment and sizing controls in one location, which keeps layout changes discoverable. citeturn4search0

**Figma/Framer:** Clear sizing modes (“Fill container,” “Hug contents,” “Fixed”) provide a clean mental model for users without forcing raw CSS input. citeturn0search0turn1search0

**Webflow:** Flex child alignment controls map directly to `align-self`, which is the right mechanism for block alignment in a flex-column region. citeturn2search0

**WordPress Gutenberg:** Width presets (default / wide / full) are a lightweight, non-technical way to adjust block width. citeturn3search2

#### Specific Recommendations

1. **Width control model:** A segmented button group with semantic labels adapted from Figma/Framer:
   - "Fill" (width: 100%, the default -- no explicit width needed)
   - "Fit" (width: fit-content -- block shrinks to content size)
   - "Custom" (reveals a SpacingInput for px/% values)
   CSS implementation is straightforward since `Block.style` is `Partial<CSSProperties>` -- just set `width` directly. No data model changes.

2. **Alignment buttons in both FloatingToolbar and sidebar.** Centering a contact bar or name block is the single most common layout operation. L/C/R toggle in FloatingToolbar gives one-click access. The sidebar Layout section provides full width + alignment + max-width for advanced use.

3. **`maxWidth` as a secondary control** (collapsed by default). Useful for "fill the region but cap at 500px" patterns, common for centered name/contact blocks.

#### Discovered Issues

- **RegionStylePanel `alignItems` labels are wrong.** At `/Users/michael/Documents/Projects/arete/app/components/editor/RegionStylePanel.tsx` lines 80-91, the dropdown options say "Default / Top / Center / Bottom / Stretch." But `alignItems` on a column-direction flex container controls **horizontal** (cross-axis) alignment, not vertical. "Top/Center/Bottom" implies vertical positioning. Labels must be corrected to "Default / Left / Center / Right / Stretch" -- or better, use the same L/C/R visual buttons proposed for block alignment.

- **textAlign vs alignSelf confusion risk.** Users may not distinguish "Text Align" (Typography) from "Block Align" (Layout). Use distinct visual language: text-lines icons for textAlign, box-in-container icons for block alignment. Add tooltips: "Positions this block within its region" vs "Aligns text within this block."

- **Vertical spacing between blocks:** Controlled by region `gap`, not block margins. Block `marginTop`/`marginBottom` can add spacing but interacts unpredictably with `gap`. A "Block Spacing" shortcut in BlockStylePanel (labeled "Extra Spacing") could clarify this.

- **Block width affects one-page constraint.** Changing block width alters content wrapping and can affect whether content fits on one page. The overflow indicator still works (checks `scrollHeight > clientHeight` on the grid) but users should be aware.

- **No block `display` property control.** All blocks render as block-level divs. Skills-as-inline-tags or contact-info-as-horizontal-row patterns would benefit from `display: flex` + `flexDirection` on the block. Future enhancement: a "Direction" control (Vertical/Horizontal) in the Layout section.

- **Image content width vs block width.** `ImageControls` controls `content.style.width` (the `<img>` element), while the proposed Layout section controls `block.style.width` (the container). Both may be needed -- an image block that's 50% width and centered, with the image filling that block. The distinction should be clear in the UI.

### Codex
- **Current layout mechanics:** Regions are `display: flex; flex-direction: column` (`ResumePreview.tsx`), so block alignment is naturally the flex cross‑axis. `BlockView` renders blocks as direct flex children; there’s no block-level alignment or width control today beyond `block.style`.  
- **Best-fit alignment mechanism:** `align-self` is the most direct mapping for block alignment in this layout model (left/center/right on a column flex container) and mirrors the way Webflow exposes flex-child alignment controls. citeturn2search0
- **Width control UX:** A “mode + input” pattern will reduce confusion for resume users: `Fill` (default), `Fit` (hug contents), `Fixed` (numeric), `Wide/Full` (preset). This aligns with Figma/Framer’s sizing modes and Gutenberg’s width presets. citeturn0search0turn1search0turn3search2
- **Preview affordance:** When a block is narrower than the region, the selection outline should match the block’s width so users immediately see that width is constrained. This is critical because the region itself remains full-width.  
- **Resume-specific centering:** A dedicated width/alignment path is most relevant for header/contact bars and skills grids; keep the default “Fill” path one click away to avoid burdening casual users.
