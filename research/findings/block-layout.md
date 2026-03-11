# Block Layout & Sizing — Research Findings

## Current State
Arete currently treats blocks as simple vertical elements within a region.
- **Rendering:** `ResumePreview.tsx` renders regions as `display: flex; flex-direction: column`. Blocks are rendered as direct children of these flex containers in `BlockView.tsx`.
- **Sizing:** Blocks have no explicit width controls. They default to the flex container's `align-items: stretch` behavior (implied), occupying 100% of the region's width.
- **Alignment:** There are no horizontal alignment controls for blocks. `textAlign` exists in `TypographyControls` but affects content *inside* the block, not the block's own position or width.
- **Image Sizing:** `ImageControls.tsx` provides width/height inputs for images specifically, but these are part of the `content.style`, not the `block.style`.

## Industry Analysis

### Notion
- **What they do well:** Simple drag-to-resize for columns, which implicitly handles block width. 
- **What they do poorly:** Individual block width/alignment is limited; you mostly achieve it through empty columns or "Center" alignment for specific types like images/videos.
- **Transferable patterns:** Use of "Wide" or "Full width" toggles for specific content types.

### Webflow
- **What they do well:** Extensive "Size" section in the Style panel (Width, Height, Min/Max). "Spacing" section handles alignment via `margin: auto` buttons.
- **What they do poorly:** Can be overwhelming for casual users due to the density of CSS properties.
- **Transferable patterns:** The 3x3 "Align Box" for flex children is a great visual shorthand. Standard unit selection (px, %, auto, fit-content) in a unified input.

### Google Docs / MS Word
- **What they do well:** Alignment buttons (Left, Center, Right) in the toolbar that affect the entire paragraph/block. For images, a sidebar allows setting absolute width/height or scaling.
- **What they do poorly:** "Wrapping" modes are often confusing for users.
- **Transferable patterns:** Preset alignment buttons are the most intuitive for document editing.

### WordPress Gutenberg
- **What they do well:** Distinct "Block Alignment" (container) vs "Text Alignment" (content).
- **What they do poorly:** Alignment options are often restricted by the theme, which can be frustrating.
- **Transferable patterns:** "Wide" and "Full" width presets are very useful for resume sections like headers or dividers.

## Recommendations

### Must-Have Changes
1. **Add "Sizing" section to `BlockStylePanel`:**
   - **Width Control:** Use the unified `SpacingInput` (Area 1) to support `auto`, `px`, `%`, and `fit-content`.
   - **Horizontal Alignment:** A toggle group with icons for Left, Center, Right.
2. **Implementation via Flexbox:** Since regions are `flex-direction: column`, use `align-self` on the block to handle alignment:
   - Left: `align-self: flex-start`
   - Center: `align-self: center`
   - Right: `align-self: flex-end`
3. **Visual Feedback in Preview:** When a block's width is less than 100%, ensure the selection highlight (the blue outline) wraps the *actual* width of the block, not the full region width.
4. **Default Sizing:** Most blocks should default to `width: 100%` or `auto` (stretching).

### Nice-to-Have Improvements
1. **Alignment Presets in FloatingToolbar:** Add Left/Center/Right buttons to the `FloatingToolbar` for quick one-click layout changes without using the sidebar.
2. **Min/Max Width:** Add these to an "Advanced" sub-section in Sizing for power users who want to prevent awkward wrapping.
3. **Aspect Ratio Lock:** Specifically for image blocks, a toggle to maintain the original aspect ratio during width/height changes.

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

**Notion:** Media blocks get drag handles on left/right edges for resizing. Alignment is a three-button control (left/center/right) on hover. Text blocks cannot be individually width-constrained. No numeric width input -- everything is drag-based. For Arete, text blocks DO need width control (e.g., centered contact bar at 80% width), so we must go beyond Notion's model.

**Canva:** Elements have explicit Width/Height fields in the Position panel. Alignment via Position menu with Left/Center/Right/Top/Middle/Bottom relative to the page. Smart snap guides appear as dotted lines when elements align with each other. The Position panel concept of Width + Height + Alignment as a cohesive group is a strong organization model.

**Figma/Framer:** Three clear sizing modes -- "Fill Container" (100% parent), "Hug Contents" (shrink to fit), "Fixed" (explicit value). Presented as a simple dropdown. Best naming convention for non-CSS-savvy users. Alignment is a visual grid in the right panel. The pattern of "sizing mode dropdown + numeric input" is consistent and should be Arete's model.

**Webflow:** The gold standard for CSS-in-a-visual-editor. Width supports auto, px, %, em, rem, vw. `alignSelf` for flex children is the exact CSS mechanism Arete should use. Min/max-width as adjacent controls. Overwhelming for casual users due to raw CSS exposure.

**WordPress Gutenberg:** Three block width presets: default, "Wide," "Full Width" -- toggled via alignment dropdown in the block toolbar. The mental model is excellent: pick a width "tier," not a pixel value. Putting alignment in the toolbar (not just sidebar) reduces clicks.

**Resume-Specific Tools (Zety, Resume.io, Enhancv, Kickresume):** Do NOT expose block-level width controls. Templates determine widths. Contact bars are auto-centered; skills sections use template-defined columns. Casual resume users do not expect to set block widths manually. Implication: make width/alignment available but not required -- smart template defaults handle 90% of cases.

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
