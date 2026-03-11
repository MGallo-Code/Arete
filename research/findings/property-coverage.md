# Property Coverage & Consistency — Research Findings

## Current State

Different editable targets in Arete expose different property subsets:

### Block (BlockStylePanel)
- **Has:** backgroundColor, color, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, margin (all 4), padding (all 4), border (all 4 + radius), boxShadow
- **Missing:** textDecoration, opacity, width, height (except images), maxWidth, minWidth, fontStyle (italic), display, overflow

### Region (RegionStylePanel)
- **Has:** backgroundColor, color, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, textTransform, textAlign, alignItems, gap, padding (all 4), border (all 4 + radius), boxShadow
- **Missing:** margin (intentionally — regions use grid), textDecoration, opacity, width/height (grid-controlled), fontStyle

### Theme Heading (ThemePanel h1–h6)
- **Has:** fontSize, color, letterSpacing, textTransform, borderBottom (width + color)
- **Missing:** backgroundColor, fontFamily, fontWeight, fontStyle, lineHeight, textAlign, textDecoration, padding, margin, borderRadius, boxShadow

### Theme Link (ThemePanel)
- **Has:** color
- **Missing:** textDecoration, fontWeight, backgroundColor, padding, borderRadius, fontStyle

### Content-Type-Specific (conditional sections)
- **Image content:** src, alt, width, height — adequate
- **Bullet content:** per-level char, image, paddingLeft, gap, color — adequate but no font/size per level

### Key Gaps
1. `textDecoration` is missing everywhere — no underline/strikethrough controls
2. `fontStyle` (italic) is only available via inline Cmd+I, not in sidebar
3. Theme headings are severely limited compared to block-level controls
4. Theme links only have color — very restrictive for resume styling
5. No `width` control on blocks (except image content)
6. No `opacity` anywhere

## Industry Analysis

### Figma
- **What they do well:** Every selected element shows its full property set in the right panel — font, size, weight, style, line height, letter spacing, paragraph spacing, text decoration, text case, auto-layout padding/gap, fill, stroke, effects (shadow, blur), opacity, blend mode. Override indicators show when an instance deviates from its component master. "Reset" functionality per property or per instance returns to the component default. Text styles can be detached and re-linked.
- **What they do poorly:** No direct CSS mapping — properties use Figma-native nomenclature (e.g., "Auto" vs CSS auto, "Fill" vs background). The override reset model for deeply nested component instances can get into bad states where styles silently detach.
- **Transferable patterns:** (1) Every editable target surfaces the *same property groups* (fill, stroke, effects, text, layout) — just context-appropriate. This is the key lesson: consistency by category, not by target type. (2) Override indicators (dot/highlight on changed properties) make inheritance visible. (3) "Detach style" / "Reset to style" as explicit user actions.

### Webflow
- **What they do well:** The Style panel is comprehensive and applies typography settings like line height and text decoration to text elements, with global defaults set on the Body tag that cascade to children unless overridden. Text decoration controls include underline/line-through with thickness/offset options. This reinforces that textDecoration, lineHeight, and other typography properties are considered first-class for element styling.
- **What they do poorly:** The range of controls can overwhelm non-designer users; some controls (transitions, breakpoints) are web-only and not applicable to print/PDF workflows. (Observation based on UI complexity, not a documented issue.)
- **Transferable patterns:** (1) Global defaults that cascade, with local overrides. (2) Text decoration treated as a core typography control, not an “advanced” option. (3) Clear distinction between global defaults and element overrides.

### Canva
- **What they do well:** Brand Kit centralizes fonts and colors so teams can apply consistent brand assets while designing. This maps directly to Arete’s Theme + Palette system as a global source of truth.
- **What they do poorly:** Fine-grained per-heading controls are not emphasized in Canva’s brand tooling; it’s optimized for consistency and speed over typographic nuance. (Inference from Brand Kit feature scope rather than explicit documentation.)
- **Transferable patterns:** (1) “Brand Kit” as a global theme preset concept (fonts + colors). (2) Quick-apply presets for casual users who don’t want to tune individual properties.

### Framer
- **What they do well:** Text styles are reusable global objects; editing a text style updates all instances. The text style editor includes font size, line height, letter spacing, and paragraph spacing, and supports breakpoints.
- **What they do poorly:** The style system can be conceptually heavy for casual users (global objects, breakpoints). (Inference from tool complexity.)
- **Transferable patterns:** (1) Global style objects that propagate across instances. (2) Text style sets that always include line height and letter spacing by default.

### Resume-Specific Tools (Zety, Resume.io, Novoresume)
- **What they do well:** Resume.io’s template selector explicitly exposes theme colors and line spacing adjustments as global controls. Novorésumé advertises multiple fonts and dozens of color themes, emphasizing preset-driven customization. Zety’s template library is organized by style and color filters, showing how users pick visual themes quickly without per-property editing.
- **What they do poorly:** They provide limited per-element control; customization tends to be template-level rather than block-level. (Inference from how their customization is presented.)
- **Transferable patterns:** (1) “Theme colors + line spacing” as a top-level, global control. (2) Preset-driven theming (style categories, color themes) for casual users.

## Recommendations

### Must-Have Changes

1. ✅ **Add `textDecoration` to TypographyControls** — expose as a toggle group: none / underline / line-through / underline+line-through. Use this shared component in Block, Region, and Theme Heading panels. Critical for resume formatting (underlined section dividers, strikethrough for corrections).

2. ✅ **Add `fontStyle` (italic) to TypographyControls** — expose as a toggle (Normal / Italic) alongside fontWeight. Currently only available via inline Cmd+I. Should be a sidebar control for block-level italic (e.g., entire date ranges in italic).

3. ✅ **Expand Theme Heading properties** — Theme headings (h1-h6) should expose the same property groups as blocks: fontFamily, fontWeight, fontStyle, lineHeight, textAlign, textDecoration, backgroundColor, padding, margin, borderRadius, boxShadow. Currently only 5 properties (fontSize, color, letterSpacing, textTransform, borderBottom). The fixtures already use fontWeight, fontStyle, padding, and margin on heading styles but the UI provides no way to edit them.

4. ✅ **Expand Theme Link properties** — Add: textDecoration (critical — links are underlined by convention), fontWeight, backgroundColor (for pill/tag styles), padding (for pill spacing), borderRadius (for pill shape). Currently only color.

5. ✅ **Add `opacity` to Block and Region panels** — Add as a slider (0-100%) in a new "Effects" subsection or alongside box-shadow. Useful for watermarks, decorative elements, and de-emphasizing content.

6. ✅ **Add block `width` control** — Add width property with presets (auto / fit-content / 50% / 75% / 100%) plus custom input. Pair with horizontal alignment (left / center / right via `alignSelf` or margin-auto). This addresses P4 directly.

7. ✅ **Consistent property groups across all editable targets** — Establish standard sections: Colors, Typography, Layout, Box Model, Borders, Effects. Each target gets all applicable sections. Theme headings and links get full Typography + Colors + Box Model + Borders sections. This eliminates the ad-hoc "what's included where" problem and mirrors how professional tools expose consistent property sets.

### Nice-to-Have Improvements

1. **Style presets for common properties** — (a) box-shadow presets: none / soft / medium / hard as visual thumbnails. (b) border-radius presets: none / slight (2px) / rounded (6px) / pill (999px). (c) textDecoration presets: none / thin underline / thick underline / double / wavy. Users pick visually; can still enter custom values.

2. **Style copy/paste** — Add "Copy Style" and "Paste Style" actions to the floating toolbar. Copies the entire `block.style` object and applies it to another block. Canva's format painter pattern.

3. **"Reset to theme" button per property** — When a block overrides a theme property (e.g., fontSize on a block with an h2 header), show a small indicator (like Webflow's blue dot) and a reset button that removes the local override, reverting to theme.

4. **Inheritance visualization** — Color-code or mark properties that are inherited from theme vs locally set. For example, in the Typography section of BlockStylePanel, show "Inherited: Georgia, serif" in muted text for fontFamily when the block has no local override.

5. **Content-type-aware panel sections** — When a block contains text content, show a "Text" section. When bullets, show "Bullet Styles". When image, show "Image". When nested blocks, show a "Children" count/list. Current conditional rendering is correct but could add: (a) "Convert to bullets" / "Convert to text" actions, (b) "Add bullet" button for bullet content, (c) objectFit/objectPosition for images.

6. **`textShadow` for text elements** — Separate from boxShadow. Useful for decorative headings. Lower priority than boxShadow (already present).

7. **Bullet level font/size controls** — BulletStyleControls currently expose char, image, paddingLeft, gap, color per level. Adding fontSize per level would allow hierarchical bullet sizing (common in resumes: primary bullets at 10pt, sub-bullets at 9pt). The fixtures already use this pattern.

8. **`maxWidth` for blocks** — Useful for constraining text width independent of region width. Common in professional typesetting (60-70 character line width).

### Things to Avoid

1. **Do not add screen-only properties** — No cursor, pointer-events, z-index, transition, animation, hover/focus states. These break PDF parity and are irrelevant for print.

2. **Do not add `transform`** — While Webflow exposes 2D/3D transforms, they're not useful for resume styling and could break PDF layout.

3. **Do not add `filter` or `backdrop-filter`** — Puppeteer support is inconsistent and these are not resume-relevant.

4. **Do not over-expose CSS to casual users** — Properties like overflow, display, position, flexDirection should not appear in the standard panel. If added at all, gate behind an "Advanced" expandable section. Most resume users should never need these.

5. **Do not add `width`/`height` controls to regions** — Region sizing is controlled by the CSS Grid template. Adding direct width/height would conflict. Grid column/row sizing stays in the Theme panel's Grid section.

6. **Do not implement a raw CSS editor** — While Webflow has "Custom CSS" as an escape hatch, it would bypass the data model (Style = Partial<CSSProperties>) and create PDF rendering risks. Power users can edit the JSON directly if needed.

## Discovered Issues & Opportunities

### Issue: Fixtures use properties the UI can't edit
The sample resume themes (in `app/fixtures.ts`) set `fontWeight: "bold"`, `fontStyle: "italic"`, `padding`, and `margin` on heading styles (h2, h3, h4). The ThemePanel provides no UI to edit these properties on headings. This means: (a) users can't recreate the built-in templates from scratch, (b) users can't modify these properties once set, (c) the theme picker sets values the user then can't change. This is the most critical gap — the editor can't round-trip its own data.

### Issue: ColorControls only expose backgroundColor and color
The shared `ColorControls` component (used by both Block and Region panels) only renders two colors: backgroundColor and color. For resume styling, `borderColor` (independent of border shorthand), gradient backgrounds, and `outlineColor` are occasionally useful. Consider adding a third row for borderColor or a "more colors" expandable.

### Issue: No fontWeight numeric values
TypographyControls only offers Normal/Bold toggle. Professional fonts often have weights 100-900 (thin, light, regular, medium, semibold, bold, extrabold, black). Adding a weight dropdown (at minimum: 300 Light, 400 Normal, 500 Medium, 600 Semibold, 700 Bold) behind an "Advanced" toggle would serve power users.

### Issue: BulletStyleControls has no font size per level
The fixtures define `fontSize: "10pt"` and `fontSize: "9pt"` on bullet level styles, but BulletStyleControls has no fontSize input. Users can't change bullet text size per indentation level through the UI.

### Opportunity: Global spacing multiplier
Resume tools like Enhancv offer a single spacing slider that proportionally scales all whitespace (margins, padding, gap). This is extremely useful for fitting content to one page. Implement as a theme-level control that multiplies all spacing values by 0.5x-1.5x.

### Opportunity: Property grouping consistency
Current block panel order: Header > Colors > Typography > Box Model > Borders > Box Shadow. This is reasonable. Regions add Layout (alignItems, gap) between Typography and Box Model. Theme headings inline everything into tiny rows. Standardize on the same section order everywhere: Colors > Typography > Layout > Box Model > Borders > Effects (shadow + opacity).


## Agent Findings

### Codex

**Property Priority Matrix for Resume Styling**

After analyzing the codebase, reference tools, and resume-specific patterns, here is a prioritized list of every property that should be added, organized by target and importance:

**Tier 1 — Missing from UI but already used in fixture data (breaking round-trip):**
| Property | Target | Evidence |
|----------|--------|----------|
| fontWeight | Theme headings | `h1: { fontWeight: "bold" }` in all fixtures |
| fontStyle | Theme headings | `h4: { fontStyle: "italic" }` in sampleResume |
| padding | Theme headings | `h2: { padding: "0 0 2px 0" }` in sampleResume |
| margin | Theme headings | `h2: { margin: "0 0 6px 0" }` in sampleResume |
| fontSize (bullet level) | BulletStyleControls | `bullets[0]: { style: { fontSize: "10pt" } }` |
| lineHeight (bullet level) | BulletStyleControls | `bullets[0]: { style: { lineHeight: "1.5" } }` |

These are the highest priority because the editor literally cannot edit values it has set.

**Tier 2 — Common resume properties missing from all panels:**
| Property | Where to add | Why |
|----------|-------------|-----|
| textDecoration | TypographyControls (shared) | Underlines for section dividers, link styling. Webflow/Framer treat as standard. |
| fontStyle (italic) | TypographyControls (shared) | Block-level italic for dates, company names. Currently inline-only. |
| opacity | Block + Region (Effects section) | Watermarks, decorative backgrounds, de-emphasis. |

**Tier 3 — Important for resume layout:**
| Property | Where to add | Why |
|----------|-------------|-----|
| width | Block panel (Layout section) | Block width control — P4. |
| alignSelf | Block panel (Layout section) | Horizontal block alignment within region — P4. |
| maxWidth | Block panel (Layout section) | Line-width control for readability. |

**Tier 4 — Theme completeness:**
| Property | Where to add | Why |
|----------|-------------|-----|
| fontFamily | Theme headings | Different heading font from body (very common in resume design). |
| lineHeight | Theme headings | Control heading line height independently. |
| textAlign | Theme headings | Centered headings for certain template styles. |
| textDecoration | Theme headings + links | Underlined headings, underlined links. |
| backgroundColor | Theme headings + links | Colored heading bars, pill-style links. |
| borderRadius | Theme headings + links | Rounded heading backgrounds, pill links. |
| boxShadow | Theme headings | Subtle heading lift effect. |

**Industry-backed rationale for Tier 2–4 adds:**
- Webflow treats text decoration and line height as core typography controls, not advanced options.
- Framer’s global text styles include line height and letter spacing by default, reinforcing that these are baseline text controls.
- Resume-specific builders surface global theme colors and line spacing as first-class controls, underscoring the value of spacing and theme presets for resume workflows.

**Theme Panel Heading Section Redesign Recommendation:**

The current heading section crams fontSize, color, letterSpacing, textTransform, and borderBottom into tiny rows per tag. With the additional properties needed, this layout will not scale. Recommendation:

Replace the current inline rows with a **collapsible per-tag section** pattern: clicking "h2" expands a full property panel for that heading level, reusing the same shared components (TypographyControls, ColorControls, BoxModelEditor, BorderControls) as the block panel. This eliminates code duplication and ensures property parity. Each heading tag gets a CollapsibleSection with the tag name as title.

**Theme Link Section Redesign Recommendation:**

Expand from a single color picker to a small property panel with: color (palette-aware), textDecoration (toggle: none/underline), fontWeight (toggle: normal/bold), and optionally backgroundColor + padding + borderRadius for pill-style link tags. Group under the existing "Links" CollapsibleSection.

**Content-Type Property Differentiation:**

The panel should subtly adapt based on selected block's content type:
- **Text blocks:** Show full Typography. Hide Bullet Styles.
- **Bullet blocks:** Show Typography + Bullet Styles. Consider adding "List style type" (disc/circle/square/none) as a quick-access.
- **Image blocks:** Show Image controls (src, alt, width, height, objectFit). De-emphasize Typography (images don't have text). Add objectFit (cover/contain/fill/none) and objectPosition.
- **Nested blocks (type: "blocks"):** Show a children summary (count, types). Typography applies as cascade to children.

**Style Presets Implementation Approach:**

For box-shadow, border-radius, and textDecoration, implement presets as an array of named objects rendered as small visual thumbnails above the detailed controls:

```
Shadow: [none] [soft] [medium] [hard] [custom...]
Radius: [none] [slight] [rounded] [pill] [custom...]
```

Clicking a preset sets the value. Clicking "custom" reveals the full BoxShadowControls / SpacingInput. The preset buttons highlight to show which preset matches the current value (if any). This serves casual users (one-click) while preserving power user access.

### Gemini
- **Missing Core Typography & Effects:**
    - **`textDecoration` & `fontStyle`:** Critical for standard resume emphasis (underlining section headers, italicizing dates/companies). These should be standard in `TypographyControls`.
    - **`opacity`:** Useful for subtle watermarks or de-emphasizing secondary information (e.g., "References available upon request").
    - **`borderRadius` & `overflow: hidden`:** Essential for modern "pill" tags (skills) or rounded profile images.
- **Block Layout & Sizing (P4):**
    - **Width Control:** Blocks need `width` (auto, %, px, fit-content) and horizontal alignment (`align-self` or margin-auto).
    - **MaxWidth:** Important for maintaining readability in wide regions (e.g., limiting text blocks to ~700px even in a full-width header).
- **Style Presets for Casual Users:**
    - **Shadow Presets:** "None," "Soft," "Medium," "Hard" thumbnails.
    - **Radius Presets:** "None," "Slight," "Rounded," "Pill" thumbnails.
    - **Border Presets:** "None," "Hairline," "Standard," "Thick."
- **Content-Type Adaptive Panels:**
    - The sidebar should contextually hide/show sections based on content. **Text blocks** don't need "Image" controls; **Image blocks** should prioritize `object-fit` and `aspect-ratio` over typography.
    - **Bullet Blocks** should expose `fontSize` and `lineHeight` *per level* to allow for hierarchical sizing (e.g., smaller sub-bullets), which is a common resume pattern.
- **Industry Insight (Webflow/Framer):**
    - Use "Indicator Dots" (e.g., blue for override, orange for inherited) next to property labels. This is the gold standard for communicating where a style comes from.
    - Add a "Reset to Theme" (×) button specifically for overridden properties to quickly revert to global styles.
