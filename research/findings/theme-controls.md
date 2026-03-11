# Theme & Global Style Controls — Research Findings

## Current State

ThemePanel (`app/components/editor/ThemePanel.tsx`) provides global style controls. The theme cascades: `theme.root` → all blocks inherit font/color. `theme.h1`–`theme.h6` style headings globally. `theme.link` styles all links. `theme.bullets` provides default bullet levels.

### Current Theme Sections
1. **Colors:** root text color, canvas background, root background (page)
2. **Color Palette:** 5-key palette (primary/secondary/accent/muted/background) with presets
3. **Typography:** fontFamily dropdown (7 presets), fontSize dropdown (8pt–12pt fixed options)
4. **Links:** color only
5. **Headings (h1–h6):** fontSize (SpacingInput), color, letterSpacing, textTransform, borderBottom (width + color)
6. **Page:** size (Letter/A4), margins (BoxModelEditor)
7. **Grid:** column widths, row heights (raw text inputs)
8. **History:** undo/redo buttons (TO BE REMOVED)

### Key Gaps

**Theme Links missing:**
- textDecoration (none/underline/dotted underline — critical for resumes)
- fontWeight
- backgroundColor (for pill/tag-style links)
- padding (for pill-style)
- borderRadius (for pill-style)

**Theme Headings missing:**
- fontFamily (can't set headings to a different font than body)
- fontWeight (Bold is extremely common for headings)
- fontStyle (italic headings)
- lineHeight
- textAlign
- textDecoration
- backgroundColor (colored heading bars)
- padding (spacing inside colored headings)
- margin (spacing between heading and content)
- borderRadius (rounded heading backgrounds)
- boxShadow

**Theme Typography limited:**
- fontSize is a dropdown with fixed values — should match the SpacingInput pattern used elsewhere
- No lineHeight global default
- No letterSpacing global default
- No fontWeight global default

**No inheritance visualization:**
- When a block overrides a theme property, there's no visual indicator
- No "reset to theme default" button on overridden properties

## Industry Analysis

### Canva
- **What they do well:** Brand Kits for global consistency (logos, colors, fonts). One-click "Brand" application to a whole document.
- **What they do poorly:** Lacks deep CSS-style inheritance (e.g., "Heading 1" can't have a specific `lineHeight` that differs from the global font).
- **Transferable patterns:** "Brand Kit" concept can translate to "Theme Presets" in Arete—applying a full set of styles (colors, fonts, headings) with one click.

### Webflow
- **What they do well:** Inheritance visualization is the industry standard—color-coded labels (orange = inherited, blue = local override). "Reset" functionality is clear and accessible. Global classes and tag styles provide powerful control.
- **What they do poorly:** Can be overly complex; the relationship between "Body (All Pages)" and specific element tags isn't always clear to casual users.
- **Transferable patterns:** Color-coded indicator dots next to property labels. "Reset to inherited" button.

### Resume-Specific Tools (Zety, Resume.io, Novoresume)
- **What they do well:** "Global Spacing" sliders that proportionally scale margins/padding/gap across the entire document. This is critical for fitting content to a single page.
- **What they do poorly:** Usually very limited in individual property control.
- **Transferable patterns:** "Spacing Density" slider. High-level "Theme Presets" (Modern, Professional, Creative).

## Recommendations

### Must-Have Changes
1. **Reorganize ThemePanel:** Group into sections: **Global Typography** (Body), **Heading Styles** (h1-h6), **Link Styles**, **Bullet Defaults**, **Page & Layout**, **Palette**.
2. **Expand Heading Property Coverage:** Headings must expose full `TypographyControls` (fontFamily, fontWeight, fontStyle, lineHeight, textDecoration, textAlign) plus `BoxModel` (padding, margin) and `Borders`.
3. **Expand Link Property Coverage:** Links need `textDecoration` (toggle underline), `fontWeight`, `backgroundColor`, `padding`, `borderRadius` for pill-style tags.
4. **Inheritance Visualization:** Add a visual indicator (e.g., a small dot or colored text) next to property labels in `BlockStylePanel` to show if a value is **Inherited** from the theme or **Overridden** locally.
5. **Reset to Theme Button:** Add a "Reset" (×) button next to any overridden property in the block/region panels.

### Nice-to-Have Improvements
1. **Theme Presets:** "Modern," "Professional," "Creative" visual presets that set fonts, colors, and heading styles in one click.
2. **Global Spacing Multiplier:** A theme-level "Spacing Density" slider (e.g., 0.8x to 1.2x) that multiplies all `margin`, `padding`, and `gap` values globally.
3. **Heading Edit Mode:** Instead of all 6 headings (h1-h6) as separate rows, show a dropdown to pick which tag to edit, then show a full property panel for that tag. This saves massive vertical space.
4. **"Applied to X Blocks" Indicator:** In the Theme panel, show how many blocks are currently using a specific heading tag.

### Things to Avoid
1. **No direct CSS input:** Stick to the established `Style` data model.
2. **No screen-only pseudo-states:** Avoid `:hover`, `:active`, etc., to maintain PDF parity.

## Discovered Issues & Opportunities

### Issue: Theme Round-trip Failure
The editor's built-in fixtures (e.g., `sampleResume`) define properties on headings like `fontWeight: "bold"`, `padding`, and `margin`. However, the current `ThemePanel` provides no way to edit these. A user can select a template but then cannot modify its most basic spacing or weight settings, or recreate the look if they accidentally clear a style.

### Issue: "Inherit" vs "Default" Confusion
The UI uses "Inherit" and "Default" somewhat interchangeably. In the `TypographyControls`, a blank value implies "Inherit from Theme," but there's no visual feedback of *what* is being inherited until the user looks at the preview.

### Opportunity: Theme Style Diff
When switching themes, show a "diff" or a summary of what's changing (e.g., "This theme uses a serif font and tighter spacing"). This helps users make informed decisions without just clicking through every option.

### Opportunity: Global Spacing Multiplier (P6/P4 overlap)
Implementing a "Global Spacing" slider in the Theme panel that scales all margins and paddings by a percentage (80% to 120%) would be a major value-add for users trying to hit the "one-page" target.


## Agent Findings

### Claude


### Gemini
- **"Spacing Density" Slider:** A single global slider that proportionally scales all whitespace (margins, padding, gap) across the entire resume. This is a "power feature" for users struggling to fit their content onto one page—extremely common in tools like Enhancv.
- **Theme Inheritance Dots:** Use the Webflow-style indicator dot (e.g., blue for override, orange for inherited) next to every property label. Hovering over an inherited value should show a tooltip: "Inherited from Theme [H1]".
- **Compact Heading Management:** The current h1-h6 list is cramped. Switch to a "Selection" model: pick the heading tag from a dropdown, then reveal a full-fledged property panel for that tag. This allows for deep styling (padding, margins, backgrounds) without making the sidebar a mile long.
- **"Reset All Overrides" Action:** A single button in the Theme panel to clear all local block/region style overrides, effectively "re-syncing" the entire document to the current theme.
- **Heading Styles for Content:** "Heading 1" should be more than just a tag—it should be a reusable style. If I change H2 padding in the Theme panel, all H2s in the document should update instantly.

