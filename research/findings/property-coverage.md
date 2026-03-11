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
- **What they do well:** The style panel is organized into 7 clear sections — Layout, Spacing, Size, Typography, Backgrounds, Borders, Effects — each controlling a well-defined set of CSS properties. Every element gets the same sections. Typography includes: fontFamily, fontSize, fontWeight, fontStyle, lineHeight, letterSpacing, textAlign, textDecoration, textTransform, textIndent, textDirection, textShadow. Effects includes: opacity, box-shadow, 2D/3D transforms, transitions, filters, blend mode. **Inheritance visualization is excellent:** orange indicators for inherited styles, blue for local overrides, pink for context-specific (grid child). Clicking an orange indicator reveals the source. Clicking a blue override offers "Reset" to remove local override. The 2025 update reduced icon reliance and tightened spacing for better readability.
- **What they do poorly:** The sheer number of controls can overwhelm non-designer users. The Effects section includes properties irrelevant to print/PDF (transitions, cursor, hover states). Grid value inputs are raw text with no visual helpers.
- **Transferable patterns:** (1) Consistent sections across all element types. (2) **Orange (inherited) / blue (local override) / reset** pattern is the gold standard for inheritance visualization — directly applicable to Arete's theme cascade. (3) Typography section treats textDecoration, fontStyle, textShadow as first-class properties alongside the basics. (4) "Custom CSS" escape hatch for power users who need properties not in the UI.

### Canva
- **What they do well:** Progressive disclosure — basic users see font, size, color, alignment on the toolbar; effects/advanced options are behind an "Effects" panel. Brand Kit enforces global typography: one font for headings, one for subheadings, one for body — forcing consistency. "Copy Style" (format painter) copies font, size, color, alignment in one click. Style presets for effects (shadow: none/soft/hard, glow, etc.) as visual thumbnails — users pick visually instead of entering numbers.
- **What they do poorly:** Limited fine-grained control — font weight is a simple bold toggle, no numeric weight. Can't style heading levels differently within Brand Kit (one heading style for all). No per-property reset. Limited spacing controls.
- **Transferable patterns:** (1) **Style Copy/Paste** — a "Copy Style" action on the floating toolbar that copies a block's full style, then "Paste Style" on another block. (2) **Effect presets as visual thumbnails** — for box-shadow (none/soft/medium/hard), border-radius (none/slight/rounded/pill), users pick from visual options rather than entering raw values. (3) Brand Kit as a concept maps to theme: set heading/body/link defaults globally, individual blocks can override.

### Framer
- **What they do well:** Text and Color Styles are reusable and global — changes propagate everywhere. The Style Board plugin generates a complete style guide from defined styles. Text styles include font, size, weight, line height, letter spacing, paragraph spacing, text decoration, text transform. Breakpoint-aware typography (desktop/tablet/mobile sizes per style). Design tokens for color variables with automatic theme support.
- **What they do poorly:** Style system can be complex for beginners; connecting variables to components passes objects rather than plain values, causing confusion.
- **Transferable patterns:** (1) Reusable style definitions with per-heading-level customization. (2) Style guide generation from defined styles — could be useful as a "theme summary" view. (3) Text styles include textDecoration and lineHeight as standard.

### Resume-Specific Tools (Zety, Resume.io, Novoresume, Enhancv)
- **What they do well:** Simplified property sets — they expose only resume-relevant properties: font family, font size (often as a global slider 8pt-14pt), line spacing, section spacing, color theme. One-click template switching preserves content. ATS-compatibility warnings guide formatting choices. Enhancv allows margin/spacing adjustment and A4/Letter toggle.
- **What they do poorly:** Very limited customization — Resume.io doesn't even let you change fonts independently of templates. Can't style individual headings differently. No per-block styling. Section titles often can't be renamed (Kickresume).
- **Transferable patterns:** (1) **ATS-friendly formatting warnings** — e.g., "Underlined text may confuse ATS parsers" when adding textDecoration to non-links. (2) **Global spacing slider** — a single control that proportionally adjusts all margins/padding/gap across the resume. This is a casual-user power feature. (3) **Section heading style as a theme-level concept** — all resume builders treat "section heading" as a single style applied uniformly. Arete's per-tag (h1-h6) system is more powerful but should offer a "sync all headings" shortcut.

## Recommendations

### Must-Have Changes

1. **Add `textDecoration` to TypographyControls** — expose as a toggle group: none / underline / line-through / underline+line-through. Use this shared component in Block, Region, and Theme Heading panels. Critical for resume formatting (underlined section dividers, strikethrough for corrections).

2. **Add `fontStyle` (italic) to TypographyControls** — expose as a toggle (Normal / Italic) alongside fontWeight. Currently only available via inline Cmd+I. Should be a sidebar control for block-level italic (e.g., entire date ranges in italic).

3. **Expand Theme Heading properties** — Theme headings (h1-h6) should expose the same property groups as blocks: fontFamily, fontWeight, fontStyle, lineHeight, textAlign, textDecoration, backgroundColor, padding, margin, borderRadius, boxShadow. Currently only 5 properties (fontSize, color, letterSpacing, textTransform, borderBottom). The fixtures already use fontWeight, fontStyle, padding, and margin on heading styles but the UI provides no way to edit them.

4. **Expand Theme Link properties** — Add: textDecoration (critical — links are underlined by convention), fontWeight, backgroundColor (for pill/tag styles), padding (for pill spacing), borderRadius (for pill shape). Currently only color.

5. **Add `opacity` to Block and Region panels** — Add as a slider (0-100%) in a new "Effects" subsection or alongside box-shadow. Useful for watermarks, decorative elements, and de-emphasizing content.

6. **Add block `width` control** — Add width property with presets (auto / fit-content / 50% / 75% / 100%) plus custom input. Pair with horizontal alignment (left / center / right via `alignSelf` or margin-auto). This addresses P4 directly.

7. **Consistent property groups across all editable targets** — Establish standard sections: Colors, Typography, Layout, Box Model, Borders, Effects. Each target gets all applicable sections. Theme headings and links get full Typography + Colors + Box Model + Borders sections. This eliminates the ad-hoc "what's included where" problem.

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

### Claude

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

