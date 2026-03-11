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
- **What they do well:** Brand Kit provides a clean global styling system — set heading font, subheading font, body font, and a color palette. One-click "Brand" application to a whole document. Visual palette presets with swatch buttons. "Copy Style" (format painter) copies all style properties between elements. Templates apply consistent styling automatically.
- **What they do poorly:** All heading levels share a single font — no per-level differentiation. No global lineHeight, letterSpacing, or textDecoration control. Can't define heading styles with backgrounds, borders, or padding. No inheritance visualization — no way to tell if a local style overrides Brand Kit defaults. Very limited spacing controls.
- **Transferable patterns:** (1) "Brand Kit" concept maps to "Theme Presets" — apply a full set of styles (colors, fonts, headings) with one click. (2) Font pairing as a top-level concept (heading font + body font as a two-font selection). (3) Effect presets rendered as visual thumbnails for casual users (shadow: none/soft/hard).

### Webflow
- **What they do well:** Best-in-class inheritance visualization — orange indicators for inherited styles, blue for local overrides. Clicking an orange indicator reveals the source. Clicking a blue indicator offers "Reset" to remove the local override. Global styles apply to HTML tags ("All H1 Headings") with full CSS property access. Typography includes every standard CSS text property: fontFamily, fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, textAlign, textDecoration, textTransform, textIndent, textShadow. "Computed" view shows final resolved value and its source.
- **What they do poorly:** Global tag styles panel is buried — not immediately obvious how to style "All H2 Headings." The class/combo-class system adds complexity that non-developers find confusing. No one-click "theme presets."
- **Transferable patterns:** (1) Color-coded inheritance indicators are the single most important missing feature in Arete. (2) "Reset to inherited" button per property. (3) Per-tag global heading styles with full property access. (4) "Computed" value display showing effective inherited values.

### Squarespace
- **What they do well:** Clean global font system — pick heading/paragraph/button/miscellaneous categories, set font + weight + size + line height + letter spacing + text transform per category. Extremely approachable for non-designers. Global changes propagate instantly. Per-heading customization includes font, weight, size, line height, letter spacing, and text transform.
- **What they do poorly:** Historically forced all heading levels to share one style. Per-level customization requires custom CSS. Limited color control (palette only). No background/border/padding on text styles.
- **Transferable patterns:** (1) Category-based typography ("Headings" / "Paragraphs" / "Links") as top-level concepts. (2) "Base heading style" that all tags inherit from, with per-tag overrides for differences. (3) The property set per category (font, weight, size, line height, letter spacing, text transform) is exactly what Arete headings need as a minimum.

### Framer
- **What they do well:** Text Styles and Color Styles as first-class reusable objects — created once, applied many times, edited globally. Text styles include: font, size, weight, line height, letter spacing, paragraph spacing, text decoration, text transform. Color styles support dark/light theme variants via design tokens. Style Board plugin generates a visual style guide from all defined styles.
- **What they do poorly:** Style system has a learning curve. No visual "override indicator" in standard UI.
- **Transferable patterns:** (1) Text styles as complete objects with textDecoration and lineHeight by default. (2) Style guide generation — a "Theme Summary" modal showing all heading/link/bullet styles and palette at a glance. (3) Color styles with semantic naming (maps to Arete's palette system).

### Resume-Specific Tools (Zety, Resume.io, Novoresume, Enhancv)
- **What they do well:** Emphasize template-level theming: color themes, line spacing, and font sets are treated as global controls. Template galleries are organized by style categories (e.g., modern/professional/creative) rather than CSS properties, which helps casual users pick a look quickly.
- **What they do poorly:** Very limited individual property control. Can't style individual headings differently. No block-level overrides. Section titles often non-renamable (Kickresume). Resume.io doesn't allow font changes independent of templates.
- **Transferable patterns:** (1) "Spacing Density" slider as the single most impactful one-page-fitting tool. (2) High-level "Theme Presets" (Professional, Creative, Minimalist). (3) ATS compatibility indicator for risky formatting choices.

## Recommendations

### Must-Have Changes
1. ✅ (partial) **Reorganize ThemePanel:** Group into sections: Quick Adjust (new), Colors, Color Palette, Global Typography, Heading Styles (h1-h6), Link Styles, Bullet Defaults (new), Page, Grid. Remove History section (P8). *(History removed, palette dropdown removed, headings/links expanded. Quick Adjust and Bullet Defaults deferred.)*
2. ✅ **Expand Heading Property Coverage:** Refactor heading section to collapsible per-tag panels reusing shared components. Each heading must expose: fontFamily, fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, textAlign, textDecoration, textTransform (via TypographyControls), color, backgroundColor (via ColorPropRow), padding, margin (via BoxModelEditor), borders and borderRadius (via BorderControls), boxShadow (via BoxShadowControls).
3. ✅ **Expand Link Property Coverage:** Links need textDecoration (toggle: none/underline/dotted), fontWeight (toggle: inherit/bold), plus optional expandable section for backgroundColor, padding, borderRadius for pill-style tags.
4. **Inheritance Visualization:** Add visual indicators in BlockStylePanel. When a property is inherited from theme, show the effective value in muted text with "(theme)" label. When overridden locally, show normal text with a reset (x) button. Extend the existing `defaults` pattern from BoxModelEditor to all property groups.
5. **Reset to Theme Button:** Add per-property reset (x) buttons in block/region panels for any locally overridden property. Also add per-section "Reset all to theme" button.
6. ✅ **Replace Theme fontSize dropdown with SpacingInput:** The fixed 8pt-12pt dropdown in Theme Typography is inconsistent with all other dimension inputs (P1). Replace with SpacingInput, keeping common sizes as clickable preset chips above the input.
7. ✅ **Add global lineHeight and letterSpacing:** The fixtures set `lineHeight: "1.5"` on theme.root but the UI cannot change it. Add lineHeight and letterSpacing inputs to Theme Typography section.

### Nice-to-Have Improvements
1. **Theme Presets:** 4-6 one-click presets ("Professional," "Creative," "Minimalist," "Classic," "Modern") as complete Theme objects that set palette + typography + headings + links + bullets. Render as visual cards with font sample + palette strip.
2. **Global Spacing Multiplier:** A "Spacing Density" slider (0.5x to 1.5x) that proportionally scales all margin/padding/gap values. The single most impactful one-page-fitting tool.
3. **Heading Edit Mode:** Either collapsible per-tag sections (h1/h2 open by default, h3-h6 collapsed) or a dropdown to select which tag to edit with a full property panel. Both approaches are valid; collapsible sections are more consistent with the rest of the sidebar.
4. **Font Pairing Presets:** Curated heading+body font combinations (e.g., "Georgia + Inter," "Times New Roman + Helvetica"). One click sets root.fontFamily and all h1-h6.fontFamily.
5. **"Applied to X Blocks" Indicator:** In the Theme panel heading section, show how many blocks currently use each heading tag (e.g., "h2 — used by 5 blocks").
6. **Bullet Defaults Section:** Add a "Bullet Defaults" section to ThemePanel showing theme-level BulletStyleControls for theme.bullets. Currently there is no way to edit default bullet styles from the theme panel.
7. **Theme Summary/Style Guide View:** A modal showing all heading styles rendered, link style sample, bullet style samples, and palette. Quick visual reference inspired by Framer's Style Board.
8. **"Sync heading styles" shortcut:** A button to copy one heading tag's style to all others (proportionally scaled).

### Things to Avoid
1. **No direct CSS input:** Stick to the established `Style = Partial<CSSProperties>` data model. No raw CSS editor escape hatch.
2. **No screen-only pseudo-states:** Avoid `:hover`, `:active`, `:visited` link states. Theme.link applies uniformly for PDF parity.
3. **No responsive breakpoints:** Resumes are fixed-size documents. Framer's breakpoint-aware styles do not apply here.
4. **No over-abstraction:** The palette CSS variable system is the right level of indirection. Do not add a design token system on top.
5. **Do not remove per-heading-level control:** Adding "sync" shortcuts is fine, but removing per-tag granularity (like Squarespace's limitation) would be a regression.

## Discovered Issues & Opportunities

### Issue: Theme Round-trip Failure (CRITICAL)
The editor's built-in fixtures (e.g., `sampleResume`) define properties on headings like `fontWeight: "bold"`, `fontStyle: "italic"`, `padding: "0 0 2px 0"`, and `margin: "0 0 6px 0"`. The ThemePanel provides no way to edit these. Similarly, `theme.root.lineHeight: "1.5"` is set but has no UI control. The `bullets[0].style.fontSize: "10pt"` is used in fixtures but BulletStyleControls exposes no fontSize input. Users can select a template but cannot modify its most basic settings, or recreate the look if they accidentally clear a style.

### Issue: "Inherit" vs "Default" Confusion
The UI uses "Inherit" and "Default" somewhat interchangeably. In TypographyControls, a blank value implies "Inherit from Theme," but there's no visual feedback of *what* is being inherited until the user looks at the preview. Standardize terminology: use "Inherit" when the value comes from a parent (theme to block), "Default" when it's the browser default (no theme value set).

### Issue: Palette Preset Dropdown Redundancy
ThemePanel lines 115-133 show a `<select>` dropdown for palette presets AND lines 134-152 show visual button rows with swatches. Both do the same thing. The visual buttons are more intuitive and space-efficient. Remove the dropdown.

### Issue: No Theme-Level Bullet Editing
Theme.bullets defines default bullet styles per indentation level. But there is no way to edit these from the ThemePanel. The only path is to select a bullet block, which creates a per-block override via BulletStyleControls. Users who want to change the default bullet character for all lists have no UI path.

### Issue: Grid Inputs Have No Validation
Grid section column/row inputs (ThemePanel lines 410-460) accept raw CSS text with no validation. Entering invalid values (e.g., "abc" instead of "30%") silently breaks the grid layout with no error feedback.

### Opportunity: Theme Style Diff
When switching theme presets, show a summary of what's changing (e.g., "Serif to sans-serif font, tighter spacing, new accent color"). Helps users make informed decisions.

### Opportunity: Global Spacing Multiplier (P6/P4 overlap)
A "Spacing Density" slider (0.5x-1.5x) that scales all margins/padding/gap proportionally. Major value-add for one-page fitting — the most common user need in resume builders.

### Opportunity: Heading Usage Count
In the Theme panel heading section, show how many blocks use each tag. If h4-h6 are unused, collapse them and show "not used in this resume." This reduces clutter for the common case (most resumes only use h1-h3).

### Opportunity: "Quick Adjust" Panel for Casual Users
Four controls at the top of the Theme panel: accent color, font pairing, base size, spacing density. Modifies the entire theme with minimal cognitive load. Expand to full controls via "Customize further" link. This is the resume-tool pattern (Zety, Enhancv) adapted for Arete's more powerful system.


## Agent Findings

### Codex

**Previous audit findings (cross-cutting from visual design):**

1. **ThemePanel heading section UX is cramped and hard to use.** Each heading tag (h1-h6) is a `headingGroup` containing: a row with tag label + SpacingInput (fontSize) + color picker, then a detail row with letter-spacing input + textTransform select, then another detail row with border-width input + border-color picker + clear button. Six of these stacked = 18 rows of controls in one section. This is the most visually dense part of the entire sidebar. Agree with Gemini's suggestion of a dropdown selector to show one heading's full controls at a time.

2. **Theme link styles expose only color.** `ThemePanel.tsx` lines 216-239: the Links CollapsibleSection only shows a color picker. Missing: textDecoration (underline is the most common link style), fontWeight, fontSize override. This is listed as P6 but worth reinforcing: links styled with `textDecoration: underline` are a nearly universal resume convention.

3. **No visual connection between theme settings and affected blocks.** When changing a theme heading style (e.g., h2 color), nothing on the preview highlights which blocks use h2. Consider briefly flashing or outlining all h2 blocks when the h2 heading section is focused in the sidebar. This would help users understand the cascade.

4. **Canvas background vs page background distinction is confusing.** ThemePanel Colors section shows three color pickers: "Text color" (theme.root.color), "Page background" (theme.root.background), and "Canvas background" (theme.canvas.backgroundColor). The difference between "page" and "canvas" backgrounds is not obvious to users. "Page" is the outer container (including margins), "Canvas" is the grid content area. Consider better labeling: "Margin area color" and "Content area color" or adding a brief tooltip.

5. **Template switch confirmation needed.** `TemplatePicker.tsx` immediately dispatches `SWITCH_TEMPLATE` on click with no confirmation. The `SWITCH_TEMPLATE` reducer (EditorContext line 620-661) remaps blocks and dumps orphans into the first new region. Users need a confirmation dialog: "Switch to [name]? Your content will be preserved but may need repositioning."

6. **Palette presets should show a "before/after" preview.** When hovering over a palette preset button in ThemePanel, it would be valuable to temporarily preview the palette on the resume (without committing). This "hover to preview, click to apply" pattern is used in Canva and would help users evaluate palettes before committing.

---

**Deep research findings (Area 6 — Theme & Global Style Controls):**

**Theme Panel Section Reorganization Proposal**

After studying Webflow, Canva, Squarespace, Framer, and resume-specific tools, here is a concrete reorganization of the ThemePanel sections:

Proposed section order:
1. **Quick Adjust** (new) — accent color picker, font pairing dropdown, base size slider, spacing density slider. Four controls for casual users to customize a template in under 30 seconds. Collapsed by default for power users.
2. **Colors** (existing) — root text color, page background, canvas background. Keep as-is but improve labels (see finding #4 above).
3. **Color Palette** (existing) — remove the `<select>` dropdown (keep visual preset buttons only), palette key editors. The dropdown and visual buttons do the same thing; the visual buttons with swatches are more intuitive.
4. **Typography** (existing, expanded) — fontFamily (select), fontSize (SpacingInput instead of dropdown), lineHeight (input), letterSpacing (input), fontWeight (toggle: normal/bold). These set theme.root properties that cascade to all content.
5. **Headings** (existing, refactored) — Replace inline rows with collapsible per-tag sections. Each tag gets full shared components. Add "Apply h2 style to all" shortcut button. Default state: h1 and h2 open, h3-h6 collapsed.
6. **Links** (existing, expanded) — color (ColorPropRow), textDecoration (toggle), fontWeight (toggle), with expandable section for backgroundColor/padding/borderRadius.
7. **Bullet Defaults** (new) — theme-level BulletStyleControls for theme.bullets array. Currently there is no way to edit theme.bullets from the Theme panel; users can only create per-block overrides.
8. **Page** (existing) — size toggle, margins via BoxModelEditor. Keep as-is.
9. **Grid** (existing) — column widths, row heights. Replace raw text inputs with validated inputs supporting fr, %, px units.

Remove the **History** section entirely (P8).

**Heading Section Refactoring Detail**

Current implementation (lines 243-367 of ThemePanel.tsx) uses custom inline layouts with `headingSmallInput`, `headingSmallSelect`, and a custom `parseBorder()` function that duplicates what BorderControls already does. No palette integration for heading colors (unlike ColorPropRow used elsewhere).

Proposed replacement: Each heading tag becomes a CollapsibleSection containing the exact same shared components used by BlockStylePanel:
- Typography subsection: fontFamily (select with "Inherit" option), fontSize (SpacingInput), fontWeight (Normal/Bold toggle), fontStyle (Normal/Italic toggle), lineHeight (input with nudging), letterSpacing (input with nudging), textAlign (L/C/R/J toggle group), textDecoration (none/underline/line-through toggle), textTransform (select)
- Colors subsection: color (ColorPropRow with palette), backgroundColor (ColorPropRow with palette)
- Spacing subsection: padding (BoxModelEditor compact), margin (BoxModelEditor compact)
- Borders subsection: border (BorderControls), borderRadius (SpacingInput)
- Effects subsection: boxShadow (BoxShadowControls)

No new components needed. Default open state: only h1 and h2 expanded; h3-h6 collapsed. An alternative to 6 collapsible sections (per Gemini's suggestion) is a dropdown to select which tag to edit, showing a full panel for that tag only.

**Inheritance Visualization Implementation**

For Arete's two-level cascade (theme to block), implement indicators as follows:

In BlockStylePanel's TypographyControls, for a block with a heading tag:
1. Read the theme's heading style: `theme[block.header.tag]`
2. For each property, check if `block.style[prop]` is set
3. If NOT set: show the inherited value from theme as placeholder/muted text (e.g., "Bold (theme)" for fontWeight)
4. If SET: show the local value normally with a small reset (x) button

This requires passing an `inheritedStyle` prop to TypographyControls. The BlockStylePanel already computes `defaults` for BoxModelEditor (lines 25-57); the same pattern should extend to all property groups.

Webflow uses orange/blue color coding. For Arete, a simpler approach: muted italic text showing the inherited value plus an "Inherited" label when the property is not locally set. This is lower visual complexity than color-coded dots.

**One-Click Theme Presets Design**

Implement 5 theme presets as complete Theme objects in `app/data/themePresets.ts`:

| Preset | Font Pairing | Palette | Heading Style | Spacing |
|--------|-------------|---------|---------------|---------|
| Professional | Georgia + Inter | Blues (#2563eb) | Bold uppercase h2, thin bottom border | Standard |
| Creative | DM Sans + DM Sans | Warm (#d97706) | Bold h2 with colored bg, rounded | Generous |
| Minimalist | Helvetica + Helvetica | Neutral (#1a1a1a) | Light weight, no borders | Tight |
| Classic | Times New Roman + Georgia | Dark (#1a1a2e) | Bold, large h1-h2 size gap | Standard |
| Modern | Inter + Inter | Green (#059669) | Semi-bold, accent-colored, letter-spaced | Standard |

`APPLY_THEME_PRESET` action replaces `resume.template.theme` while preserving blocks and regionBlockIds. Render as horizontal cards with "Aa" in heading font, palette color strip, and preset name.

**Link Style Expansion Detail**

theme.link renders on all `<a>` elements in RichTextView via `{ ...theme.link, ...run.style }`. Expanding it to include textDecoration, fontWeight, backgroundColor, padding, and borderRadius requires no rendering changes — only ThemePanel UI additions.

Proposed layout:
```
Links
  Color: [ColorPropRow with palette]
  Decoration: [none] [underline] [dotted]
  Weight: [Inherit] [Bold]
  -- Advanced (expandable) --
  Background: [ColorPropRow with palette]
  Padding: [SpacingInput shorthand]
  Radius: [SpacingInput]
```

**Fixture Data Round-Trip Gap (Critical Finding)**

The fixtures set properties on theme headings that ThemePanel cannot edit:
- `h1: { fontWeight: "bold" }` — no fontWeight control on headings
- `h2: { fontWeight: "bold", textTransform: "uppercase", padding: "0 0 2px 0", margin: "0 0 6px 0" }` — padding/margin have no heading UI
- `h4: { fontStyle: "italic" }` — no fontStyle control on headings
- `bullets[0].style.fontSize: "10pt"` — no fontSize control on bullet levels
- `theme.root.lineHeight: "1.5"` — no lineHeight in Theme Typography

The editor cannot recreate its own built-in templates from scratch and cannot modify commonly-used properties once set. This is the single highest priority fix for theme controls.

**Additional Findings from Industry Research:**

- Webflow's 2025 style panel update reduced reliance on icons and tightened spacing for readability. Arete's ThemePanel should similarly prioritize text labels over icons for heading tag section headers.
- Squarespace's per-heading customization includes font, weight, size, line height, letter spacing, text transform. This exact set is what Arete headings need as a minimum baseline. Arete should go beyond this with backgroundColor, padding, margin, and borders (which Squarespace lacks).
- Font pairing presets are one of the highest-impact casual-user features. Non-designers struggle most with font selection. A curated list of 4-6 heading+body font pairings would eliminate this friction. Example pairings: "Georgia + Inter" (classic serif + modern sans), "DM Sans + DM Sans" (uniform modern), "Times New Roman + Helvetica" (traditional contrast).
- Canva's Brand Kit enforces global typography consistency at the heading/subheading/body level. Arete's theme already does this via h1-h6/root cascade but the UI doesn't surface it clearly. A "Typography Summary" at the top of the heading section showing "H1: 22pt Georgia Bold / H2: 9pt uppercase / H3: 10pt bold / Body: 10pt Georgia" would help users see the hierarchy at a glance before diving into per-tag editing.
- Resume-specific tools universally offer a "spacing density" control because fitting to one page is the number one user need. This should be a theme-level slider, not buried in individual block controls. Implement as a multiplier (0.5x to 1.5x) applied at render time to all margin/padding/gap values.

### Gemini
- **"Spacing Density" Slider:** A single global slider that proportionally scales all whitespace (margins, padding, gap) across the entire resume. This is a "power feature" for users struggling to fit their content onto one page—extremely common in tools like Enhancv.
- **Theme Inheritance Dots:** Use the Webflow-style indicator dot (e.g., blue for override, orange for inherited) next to every property label. Hovering over an inherited value should show a tooltip: "Inherited from Theme [H1]".
- **Compact Heading Management:** The current h1-h6 list is cramped. Switch to a "Selection" model: pick the heading tag from a dropdown, then reveal a full-fledged property panel for that tag. This allows for deep styling (padding, margins, backgrounds) without making the sidebar a mile long.
- **"Reset All Overrides" Action:** A single button in the Theme panel to clear all local block/region style overrides, effectively "re-syncing" the entire document to the current theme.
- **Heading Styles for Content:** "Heading 1" should be more than just a tag—it should be a reusable style. If I change H2 padding in the Theme panel, all H2s in the document should update instantly.
