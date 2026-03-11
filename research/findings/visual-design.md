# Visual Design & Polish — Research Findings

## Current State

The editor uses CSS modules (`app/components/editor/editor.module.css`) with design tokens (`app/styles/tokens.css`). The visual language is:

### Current Design Language
- **Colors:** Neutral gray sidebar background (`#f8f9fa`), white inputs, `--accent` blue (`#2563eb`) for active states
- **Typography:** System font stack, 12px base for controls
- **Spacing:** 8px-based grid (token `--sp-1` through `--sp-5`)
- **Borders:** 1px solid `#dee2e6` for separators, `#e9ecef` for input borders
- **Border radius:** 4px default, 6px for larger elements
- **Icons:** Unicode characters and emoji (no icon library) — e.g., "↑" "↓" "×" "+" "⊕"
- **Sections:** CollapsibleSection with chevron + title, 1px bottom border separator
- **Selection:** Blue solid outline (selected), blue faint outline (expanded ancestor), dotted outline (editing)
- **Dark mode:** CSS variables support it but it's not fully implemented

### Current Visual Issues
1. **Icons are inconsistent:** Mix of unicode arrows, emoji, and text labels. No visual cohesion.
2. **No visual indicators for "inherited" vs "overridden"** properties
3. **No visual indicators for palette-linked colors** (beyond palette swatch highlighting in ColorPropRow)
4. **Section headers all look the same** — no visual hierarchy between major vs minor sections
5. **Error states are minimal** — invalid SpacingInput shows red border briefly, but most inputs have no error feedback
6. **Empty states are bare** — deselected sidebar just shows ThemePanel, no helpful guidance
7. **Transitions are minimal** — CollapsibleSection has height animation, but most state changes are instant
8. **The sidebar has no breadcrumbs** showing what's selected (you must look at the preview to see selection)

### SectionIcons.tsx
`app/components/editor/SectionIcons.tsx` contains 13 hand-drawn SVG icons (14x14 viewBox, stroke-based, `currentColor`): IconColors, IconTypography, IconBoxModel, IconBorders, IconHeader, IconImage, IconBullets, IconPalette, IconLinks, IconGrid, IconPage, IconLayout, IconBoxShadow, IconHistory. These are consistent in style (1.8px stroke weight, rounded caps/joins). However, they are rendered inside a `<span className={styles.collapsibleIcon}>` which has `display: none` in the CSS, so none of them are actually visible to users.

## Industry Analysis

### Figma
- **What they do well:** Exceptional property density without sacrificing legibility. Uses "pill" UI for linked properties (styles/variables) which makes it clear when a value is not a raw literal. Deeply neutral palette that doesn't compete with the canvas.
- **What they do poorly:** Can be overwhelming for non-designers due to the sheer number of nested panels and hidden advanced settings.
- **Transferable patterns:** "Pill" indicators for linked variables; compact property rows; neutral gray color scheme (`#2C2C2C` for dark, `#F5F5F5` for light).

### Webflow
- **What they do well:** The gold standard for indicating CSS inheritance. Uses color-coding (Orange for inherited, Blue for overridden/local) on both labels and values. Clear "Element Path" (breadcrumb) at the bottom of the canvas for hierarchy navigation.
- **What they do poorly:** The UI can feel "heavy" with many borders and distinct backgrounds for every section.
- **Transferable patterns:** Blue/Orange state indicators for overrides; selection breadcrumbs; icon-based layout controls.

### Framer
- **What they do well:** Modern, high-polish feel with subtle transitions. Integration of selection breadcrumbs directly into the property panel header. Use of bold iconography for major sections.
- **What they do poorly:** Sometimes hides too much behind "More" menus, making discovery difficult.
- **Transferable patterns:** Sidebar-integrated breadcrumbs; high-quality icon sets (Phosphor/Lucide); "Reset Override" action on highlighted labels.

### Canva
- **What they do well:** Extreme focus on the casual user. "Brand Kits" make global consistency easy without needing to understand "variables." Simple checkmarks to show active selection in color grids.
- **What they do poorly:** Limited control for power users; lacks the "source of truth" transparency of Webflow/Figma.
- **Transferable patterns:** Grouping colors by "Brand" (Palette); "Change All" global update prompts; clear visual thumbnails for templates.

### Resume Builders (Zety, Resume.io, Novoresume)
- **What they do well:** Novoresume's "Content Optimizer" and "Resume Score" provide immediate feedback on page overflow and ATS compatibility. They treat the "One-Page" constraint as a primary UI element (progress bars, warning icons).
- **What they do poorly:** Often too "wizard-like," making it hard to tweak minor layout details once you're in a flow.
- **Transferable patterns:** ATS keyword checking; "One-Page" overflow warnings; quick-actions for "Add Experience" or "Add Skill."

## Recommendations

### Must-Have Changes
1. ✅ **Adopt a Unified Icon Library:** Replace unicode/emoji with **Lucide** (`lucide-react`). *(All FloatingToolbar, InlineToolbar, SectionIcons, close/clear buttons now use Lucide icons.)*
2. ✅ (partial) **Inheritance Color-Coding:** Adopt the Webflow pattern:
   - **Blue** label/value = Locally overridden/set property.
   - **Neutral/Gray** label/value = Inherited from theme or default.
   - **Orange (optional)** = Inherited from a parent block (if we ever support nested block inheritance).
3. **Variable "Pill" UI:** When a color is linked to the palette (e.g., `var(--palette-primary)`), show it in a rounded "pill" button with the variable name (e.g., "Primary") instead of just a hex code.
4. **Selection Breadcrumbs:** Add a breadcrumb bar at the top of the sidebar (just below the header) showing the path: `Region > Block > Content`. This makes navigating nested structures much faster.
5. **Enhanced Empty States:** When no block is selected:
   - Replace the generic `ThemePanel` with a "Quick Actions" dashboard.
   - Include: "Add New Block," "Switch Template," "Resume Score/Optimizer."
   - Provide "First-use" guidance (e.g., "Select any element on the resume to edit its style").

### Nice-to-Have Improvements
1. **Subtle Transitions:** Add 150ms `ease-in-out` transitions for sidebar panel expansion/collapse and value changes to make the UI feel "alive."
2. **"Resume Score" Panel:** A dedicated section in the sidebar (or a floating badge) that checks for:
   - Page overflow (P4/P7 issue).
   - Missing contact info.
   - Low-contrast colors that might not print well.
3. **"Style Copy/Paste":** Add buttons to the FloatingToolbar to copy all styles from one block and paste them onto another.
4. **Micro-Interactions for Inputs:** Add "scrubbing" (drag on label to change value) for numeric inputs, similar to Figma.

### Things to Avoid
1. **Over-Categorization:** Don't hide properties behind too many nested tabs; keep the most common 80% visible on the first level.
2. **High-Contrast Borders:** Avoid pure black or high-contrast borders between rows; use subtle `rgba(0,0,0,0.05)` or similar for a more integrated feel.

### Canvas Controls
- **Zoom Controls:** Add a "Fit to Screen" and custom % zoom control at the bottom of the canvas. This is standard in Figma and Canva and essential for "Pixel-Perfect" editing on different screen sizes.
- **Responsive Preview:** A set of toggles (Desktop / Tablet / Mobile) to see how the resume's CSS (which is usually A4/Letter fixed) might adapt or overflow on different viewports. While primarily for PDF, a "Mobile View" toggle could show how a web-hosted version of the resume would look.


## Agent Findings

### Claude

After thorough analysis of the full codebase (all 24 editor components, both rendering components, EditorContext, all CSS files) and study of reference applications (Figma, Canva, Webflow, Framer, Sketch) and resume-specific tools (Zety, Resume.io, Novoresume, Enhancv, Kickresume), here are findings organized by impact.

#### HIGH IMPACT -- Address Before Shipping

**1. ✅ (partial) Icon Library Adoption (Lucide) -- Strongest Agreement with Gemini**

*(Section icons unhidden via `.collapsibleIcon: display: inline-flex`. Full Lucide adoption deferred.)*

The icon situation is the single biggest visual polish issue. Three different visual languages coexist:
- FloatingToolbar (`app/components/editor/FloatingToolbar.tsx`): HTML entities (`&#8593;` up arrow, `&#8595;` down arrow, `&#10697;` duplicate, `+` add, `\u00D7` delete)
- InlineToolbar (`app/components/editor/InlineToolbar.tsx`): styled HTML text (`<strong>B</strong>`, `<em>I</em>`, `<span style={{ textDecoration: "underline" }}>U</span>`, `A<sup>2</sup>`)
- SectionIcons.tsx: 13 well-crafted 14x14 SVGs -- but hidden via `display: none` in `.collapsibleIcon` (line 1607 of `editor.module.css`)

Lucide is the right choice: open-source, tree-shakeable `lucide-react` package, 1500+ icons on 24x24 grid with 2px strokes, matches the existing SectionIcons style. Specific icon mappings:
- FloatingToolbar: `ArrowUp`, `ArrowDown`, `Copy`, `Plus`, `Trash2`
- InlineToolbar: `Bold`, `Italic`, `Underline`, `Strikethrough`, `Superscript`, `Subscript`, `Link`
- Close/clear buttons: `X` (replace `&times;` throughout)
- Add actions: `Plus` (replace `+` text)
- Un-hide section icons: change `.collapsibleIcon { display: none; }` to `display: inline-flex;`

Additionally, unicode icons create accessibility issues. Screen readers may announce the unicode character despite `aria-label` being set. SVG icons with `aria-hidden="true"` are cleaner.

**2. Selection Breadcrumb Bar -- Strong Agreement with Gemini**

Users have no way to see what is selected without looking at the preview. The sidebar changes content (BlockStylePanel vs RegionStylePanel) but the only indicator is a small "Block" or "Region" title in the panel header (`styles.selectionPanelTitle`). For nested blocks, there is zero hierarchy indication.

Concrete recommendation: Add a breadcrumb component between the tab bar and scroll content in `EditorShell.tsx`:
```
[Region: header] > [Block: Professional Experience]
```
Each segment clickable to select that ancestor. Truncate with ellipsis for long names. This is standard in Figma (layer path), Webflow (element path), and browser DevTools (DOM breadcrumbs).

**3. Style Source Indicators -- Expanding on Gemini's "Functional Color" Concept**

This is the #1 gap vs. professional design tools. Current state per component:
- `TypographyControls.tsx`: shows "Inherit" text label + `clearBtn` (x) when value is set; nothing visual when inherited from theme
- `ColorPropRow.tsx`: shows palette swatches + "Inherit" label when no local value; best current implementation but still text-only
- `BoxModelEditor.tsx`: uses placeholder text for inherited values; visually identical to "no value"
- No distinction between "I set fontSize to 10pt" and "theme sets fontSize to 10pt"

Webflow's system is the gold standard: orange labels = inherited, blue labels = locally set. Clicking the label resets to inherited. Recommended approach for Arete:
- **Blue dot/label** = set locally on this block/region (overriding theme)
- **Orange dot/label** = inherited from theme heading style or root
- **Purple dot/label** or linked icon = from palette variable (`var(--palette-*)`)
- Clicking blue label clears to inherited; clicking purple shows which palette key

The existing `clearBtn` (x button) pattern can evolve into this: replace the plain x with a colored indicator that doubles as reset.

**4. Empty/Deselected State -- First-Use Experience**

When nothing is selected, the sidebar shows only ThemePanel. No prompt, no guidance, no call to action. A new user staring at "Colors / Color Palette / Typography" sections has no idea the primary interaction is clicking the preview. Additionally:
- The "?" shortcut for keyboard help is completely undiscoverable
- There is no first-use guidance anywhere
- The `ShortcutHelp.tsx` modal is excellent but hidden

Concrete recommendations:
- Show a prominent empty-state card above ThemePanel when `selectedPath.length === 0 && !selectedRegionId`
- Content: cursor-click icon, "Select a block or region in the preview to edit its properties"
- Quick actions: "Insert Block" button, "Switch Template" button
- Add a small "?" button in sidebar header (next to close button) that opens ShortcutHelp
- First-use overlay: on first visit (check `localStorage`), show a brief prompt on the preview area

**5. Hardcoded Colors Block Dark Mode and Hurt Maintainability**

`editor.module.css` contains 40+ hardcoded hex values bypassing CSS variables. Specific line references:
- Line 749: `.toggleActive { background: #2563eb; }` -- should be `var(--editor-accent)`
- Line 876: `.floatingToolbar { background: #fff; }` -- should be `var(--color-bg)`
- Line 1492: `.inlineToolbar { background: #fff; }` -- same
- Lines 323/827: `#2563eb12`, `#2563eb18` -- should use `var(--editor-accent-subtle)` variants
- Line 892: `.toolbarBtn { color: #64748b; }` -- hardcoded slate
- Line 1508: `.inlineToolbarBtn { color: #374151; }` -- hardcoded gray
- Line 1529: `.inlineToolbarBtnActive { background: #2563eb; }` -- should be `var(--editor-accent)`

This blocks dark mode entirely and creates maintenance burden. All editor chrome colors must flow through CSS variables. The preview itself should always render light (resumes print on white paper).

#### MEDIUM IMPACT -- Significant Polish

**6. CollapsibleSection Animation is Broken**

Line 1624: `.collapsibleContent[data-state="closed"] { display: none; }` prevents ANY animation on section close. Radix Collapsible supports animated height transitions, but `display: none` short-circuits this. The result is that sections snap open/close with no visual continuity.

Fix: Remove the `display: none` rule. Instead, use CSS `grid-template-rows: 0fr` for closed state and `1fr` for open state, with a wrapper div that has `overflow: hidden; min-height: 0`. Add a 150ms ease-out transition. This is a small CSS change with outsized perceived polish impact.

**7. Collapsed Section Status Dots**

When sections are collapsed, users cannot tell which ones contain configured values. They must expand each section to check. Webflow solves this with colored dots next to section titles when collapsed sections contain active styles.

Implementation: Add a `hasOverrides` boolean prop to `CollapsibleSection`. Render a 6px accent-colored dot next to the title when `hasOverrides && !open`. The parent component (BlockStylePanel, RegionStylePanel) computes this by checking whether the style object has any relevant keys set.

**8. Toolbar Appear/Disappear Transitions**

FloatingToolbar and InlineToolbar appear/disappear instantly. Adding a 100ms fade+scale animation would feel significantly more polished:
```css
@keyframes toolbar-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```
The delete confirmation state in FloatingToolbar (button turns red with "Delete?" text) should also animate the transition.

**9. Page Utilization Indicator (Resume-Specific)**

The current overflow indicator (red dashed line, `styles.overflowIndicator`) is binary: overflow or not. Resume users need more nuance to plan content density.

Recommendation: Add a percentage-based fill indicator showing "87% page used" in a thin bar, color-coded green (<85%), yellow (85-95%), red (>95% or overflow). Implementation: use the existing `ResizeObserver` in `ResumePreview.tsx` (line 34) which already measures `scrollHeight vs clientHeight`. Compute `(scrollHeight / totalPageHeight) * 100`.

### Codex

**Inheritance visualization & reset affordances (focus of this assignment):**

1. **Per-property indicators are the highest value-per-effort.**
   - Webflow’s Style panel uses colored labels to show whether a property is inherited or locally set, and uses small status dots on collapsed sections to show overrides at a glance.
   - Translating this to Arete: place a small dot or label tint next to each property label, and optionally show a section-level dot in `CollapsibleSection` when any child property is overridden.

2. **Minimal state model for Arete’s cascade:**
   - **Inherited from theme** (root or heading style) → neutral/gray label.
   - **Local override** (block/region style) → accent blue label + visible reset affordance.
   - **Palette variable** (`var(--palette-*)`) → third state; use a “pill” or chip with the palette name + distinct color (teal/purple) to avoid confusion with inherited vs overridden.

3. **Reset-to-theme should be per-property, not per-section.**
   - Webflow makes the reset action directly adjacent to the property value, which reduces accidental resets and matches user intent for a single field.
   - For Arete, the existing `clearBtn` can be re-skinned into a small reset icon with tooltip “Reset to theme”.

4. **Displaying inherited values:**
   - The least invasive option is a muted placeholder or sublabel (e.g., “Inherited: 12pt”) directly under the input; this retains the current control structure.
   - Avoid replacing the input value with computed values unless the field is read-only; that would blur “set vs inherited” and reduce confidence.

5. **Section-level badge as optional enhancement:**
   - When a section is collapsed, show a small accent dot on the right side of the section header if any property inside is overridden.
   - This mirrors Webflow’s “active style” dots and helps power users scan quickly without opening every section.


**10. ATS Compatibility Indicator (Resume-Specific Differentiator)**

Every resume tool (Zety, Novoresume, Enhancv, Kickresume, Jobscan) includes ATS warnings. Arete should surface basic warnings by pattern-matching the data model:
- Multi-column grid layout detected (grid has >1 column)
- Images used in content areas (ATS cannot read images)
- Non-standard fonts selected (ATS may not render them)
- White text on colored backgrounds (some ATS strip backgrounds)

Implementation: a small badge in the sidebar footer showing "ATS: 3 warnings." No AI needed -- just checks against the Resume data model. This is a significant differentiator.

#### LOWER IMPACT -- Nice to Have

**11. Zoom Controls**: `Cmd+=/Cmd+-/Cmd+0` zoom shortcuts. Small zoom percentage display in preview area footer. CSS `transform: scale()` on `.previewWrapper`. Standard in Figma/Canva.

**12. ✅ Style Copy/Paste**: "Copy style" / "Paste style" buttons on FloatingToolbar. Store copied `Style` in EditorContext state. *(COPY_STYLE/PASTE_STYLE actions, Cmd+Shift+C/V shortcuts, Paintbrush/ClipboardPaste icons.)*

**13. Print Preview Mode**: Toggle that hides all editor chrome (selection outlines, toolbar, sidebar). Shows bare resume at 100% scale as it will appear in PDF.

**14. Focus Mode**: One-section-at-a-time mode for sidebar (Webflow pattern). Opening one section auto-closes others. Store preference in localStorage.

**15. Contextual Tooltips on Property Labels**: Add Radix Tooltip on property labels explaining CSS properties. E.g., hovering "Letter spacing" shows "Controls space between characters (CSS: letter-spacing)." Helps casual users learn without leaving the editor.

**16. Reset All Styles Button**: "Reset to theme defaults" at bottom of BlockStylePanel/RegionStylePanel. Currently each property must be cleared individually.

**17. Resize Handle Visual Feedback**: `.sidebarResizeHandle` shows background on hover but no visual change during active drag. Add accent color background during drag.

#### DISCOVERED CROSS-CUTTING ISSUES

**Inline Styles vs CSS Modules**: `BulletStyleControls.tsx`, `ThemePanel.tsx`, `ColorControls.tsx` use inline `style` attributes for flex layouts (e.g., `style={{ display: "flex", gap: 6, alignItems: "center" }}`). These should be CSS module classes for dark-mode support and consistency.

**ScreenReaderAnnounce is too generic**: `ScreenReaderAnnounce.tsx` announces "Block selected" without the block name or type. Should announce "Block selected: Professional Experience (h2)" for better screen reader UX. The `getBlockLabel()` function already exists in EditorContext.

✅ **Template Switch has no confirmation**: `TemplatePicker.tsx` calls `dispatch({ type: "SWITCH_TEMPLATE" })` immediately on click. *(Now shows Radix Dialog confirmation with preview before switching.)*

**Region label occludes content**: `.regionLabel` positioned at `top: 2px; left: 2px` inside the region. In tight-padding regions, this overlaps resume text. Should only show on hover or be positioned outside the region boundary.

**No mobile/tablet breakpoints**: `editor.module.css` has zero responsive breakpoints. On 768px tablets, sidebar (min 240px) leaves only 528px for preview. Recommendation for Phase 1: at <900px, hide sidebar by default, overlay when opened. At <600px, show "Use desktop for editing" message.

**prefers-reduced-motion not respected for existing animations**: The palette swatch hover scale transition (`.paletteSwatch:hover { transform: scale(1.2) }`) and collapsible chevron rotation (`.collapsibleChevron { transition: transform 0.15s }`) do not check `prefers-reduced-motion`. Any future animations must be gated behind `@media (prefers-reduced-motion: no-preference)`.

**Focus management on selection change**: When a block is selected via preview click, sidebar content changes but keyboard focus does not move. Screen reader users who tab into the sidebar may not realize content changed. On selection change, programmatically focus the sidebar panel heading.

**No "Reset All" for block/region styles**: No way to reset all local styles on a block back to theme defaults. Must clear properties one by one via individual clear buttons.

**Palette preset duplicated in ThemePanel**: `ThemePanel.tsx` shows palette presets in both a `<select>` dropdown AND clickable button rows below it. The dropdown (`Choose a preset...`) and the button list render the same 4 presets. One should be removed to reduce clutter.

### Gemini

#### 1. Lucide Icon Adoption
The current mix of HTML entities, unicode, and custom SVGs (which are currently hidden by CSS) should be replaced with a unified `lucide-react` implementation for professional consistency and accessibility.

**Exact Icon Mappings:**
- **FloatingToolbar:**
  - Move Up: `ArrowUp`
  - Move Down: `ArrowDown`
  - Duplicate: `Copy`
  - Insert Block Below: `Plus`
  - Delete Block: `Trash2` (more semantic than the current "×" or "Delete?" text)
- **InlineToolbar:**
  - Bold: `Bold`
  - Italic: `Italic`
  - Underline: `Underline`
  - Strikethrough: `Strikethrough`
  - Superscript: `Superscript`
  - Subscript: `Subscript`
  - Link: `Link`
- **SectionIcons (Sidebar):**
  - IconColors: `Palette`
  - IconTypography: `Type`
  - IconBoxModel: `Box`
  - IconBorders: `Frame`
  - IconHeader: `Heading`
  - IconImage: `Image`
  - IconBullets: `List`
  - IconPalette: `Palette`
  - IconLinks: `Link`
  - IconGrid: `LayoutGrid`
  - IconPage: `FileText`
  - IconLayout: `Columns2`
  - IconBoxShadow: `Layers`
  - IconHistory: `History`
  - IconContent: `AlignLeft`

**Size and Style:**
- **Toolbar Buttons:** Use **18px** for better hit targets and visibility on high-DPI screens.
- **Section Icons:** Use **14px** (matching current `SectionIcons.tsx`) to maintain the compact, information-dense feel of the sidebar.
- **Recommendation:** Fully replace `SectionIcons.tsx` with Lucide to reduce maintenance overhead and ensure all icons share the same stroke weight (2px) and design language.
- **Bundle Size:** `lucide-react` is tree-shakeable. Using individual imports (e.g., `import { Bold } from 'lucide-react'`) ensures only used icons are bundled, adding <5KB to the final payload.
- **InlineToolbar "B"/"I":** While the current styled text is recognizable, Lucide's `Bold` and `Italic` icons are industry standards (Figma/Canva/Google Docs) and will look more cohesive with the other toolbar icons.

#### 2. Style Copy/Paste (Format Painter)
Implementing a "Format Painter" will significantly improve the speed of creating consistent resumes.

- **Location:** Add "Copy Style" and "Paste Style" buttons to the **FloatingToolbar**. This keeps the action contextual to the selected block.
- **What gets copied:** The entire `block.style` object. This includes typography, colors, padding, margins, borders, and shadows.
- **Handling Headers:** Pasting a style should NOT change the heading level (e.g., h2 remains h2). It only updates the CSS properties in the `style` object.
- **Workflow:**
  1. User selects a block.
  2. Clicks "Copy Style" icon (Paint Roller).
  3. `EditorContext` stores the `Style` object in a `clipboardStyle` state.
  4. User selects a different block.
  5. Clicks "Paste Style" icon (now visible/active on the FloatingToolbar).
  6. Action `UPDATE_BLOCK_STYLE` is dispatched for the target block.
- **Keyboard Shortcuts:** `Cmd+Shift+C` (Copy Style) and `Cmd+Shift+V` (Paste Style). These match Figma and Google Docs.

#### 3. Template Switch Confirmation
Template switching is a "destructive-feeling" operation that needs a safety net.

- **Confirmation Content:**
  - **Title:** "Switch Template?"
  - **Message:** "This will reorganize your content to fit the new layout. Blocks will be moved to new regions, and some may be grouped into the first available section. Your text will not be lost."
- **Preview:** The dialog should include the `TemplateMiniPreview` (currently in `TemplatePicker.tsx`) for the *new* template alongside the message to show the target layout.
- **Orphaned Blocks:** Explicitly state that "Orphaned blocks from deleted regions will be moved to the [Region Name] section."
- **Undo:** The existing Undo system (`Cmd+Z`) already captures `SWITCH_TEMPLATE`, so a dedicated "Undo" button in the dialog is not required, but a "Learn more about what happens to my content" link could be helpful.

#### 4. Additional Polish Opportunities
- **Inheritance Indicators:** Follow the Webflow pattern of using Blue/Neutral color-coding for property labels to show if a value is locally overridden or inherited from the theme.
- **Selection Breadcrumbs:** Implement a breadcrumb bar at the top of the sidebar. This is critical for nested block editing and region-level styling.
- **ATS Check:** Add a simple "ATS Compatibility" badge that warns about multi-column layouts or images, which are common pain points for resume submission.

### Codex
**Impact-ordered visual design findings (with file references):**
1. **Icon system is inconsistent and partially hidden.** `SectionIcons.tsx` defines a consistent 14px stroke icon set, but `.collapsibleIcon` is `display: none`, so icons never render. Meanwhile, `FloatingToolbar` and `InlineToolbar` use unicode glyphs and text labels. Recommendation: unhide `.collapsibleIcon` and standardize all toolbar icons on a single SVG set (Lucide/Phosphor or the existing SectionIcons style). This single change would deliver the largest polish bump for the least effort. (`app/components/editor/SectionIcons.tsx:1-157`, `app/components/editor/editor.module.css:1606-1608`, `app/components/editor/FloatingToolbar.tsx:105-153`, `app/components/editor/InlineToolbar.tsx:206-231`)
2. **No explicit inheritance/override indicators.** The UI only shows “Inherit” text and a clear button, which hides the source of a value. Webflow uses colored dots/labels to indicate inherited vs local vs element-scoped styles, and exposes reset affordances directly on the label. This pattern is proven and translates cleanly to theme vs local overrides in Arete. Recommendation: add a colored indicator next to each label and in collapsed section headers. citeturn1search0
3. **Section density needs “Focus mode.”** Collapsible sections stack up fast and the panel becomes tall, especially for power users. Webflow’s Focus mode collapses all sections except the active one and is explicitly built to reduce this scanning overhead. Recommendation: add a Focus mode toggle at the top of the sidebar that collapses sibling sections on open. citeturn1search2
4. **Typography grouping should mirror established right‑sidebar patterns.** Figma’s text properties are grouped in the Typography section of the right sidebar. Arete splits some of these into mixed heading rows and separate panels, which makes scanning harder. Recommendation: keep a single “Typography” group per target and align the control order to the Figma baseline. citeturn1search1
5. **Palette‑linked values are visually subtle.** `ColorPropRow` shows a tiny text label (`linkedKey`) when a palette var is used, but the input still looks identical to a raw hex value. Recommendation: convert palette‑linked values into a “pill” or chip (e.g., `Primary`) with a chain icon and a one‑click unlink action. (`app/components/editor/ColorPropRow.tsx:25-74`)
6. **Error states are too quiet.** `SpacingInput` only adds a red outline for invalid numbers, and most other inputs have no error treatment at all. Recommendation: add a consistent error affordance (small icon + inline message) and keep it visible until corrected, not only on blur. (`app/components/editor/SpacingInput.tsx:48-74`, `app/components/editor/editor.module.css:1209-1213`)
7. **Empty/first‑use state is missing.** When nothing is selected, the sidebar defaults to Theme controls with no guidance. Recommendation: add a high‑visibility empty state above Theme: “Click any block to edit,” plus quick actions (Insert Block, Switch Template, Show Shortcuts). (`app/components/editor/EditorShell.tsx:200-258`, `app/components/editor/ThemePanel.tsx:59-482`)
8. **Selection context is invisible.** `BlockView` already computes `selectedPath` and selection state, but the sidebar only shows “Block/Region” headers. Recommendation: add a breadcrumb bar in the sidebar header that shows `Region > Block > (child)`, with clickable ancestors for quick navigation. (`app/components/BlockView.tsx:23-31`, `app/components/editor/EditorShell.tsx:200-236`)
9. **Resume‑specific layout cues are absent.** Novoresume exposes a dedicated Layout tool for section order and single vs two‑column layouts, signaling that users expect to manage structure separate from styling. Recommendation: add a “Layout” quick action in the sidebar or top bar that surfaces region order and column mode. citeturn2search2
10. **ATS readiness should be visible.** Enhancv explicitly markets an ATS‑oriented resume checker with a score and checks. Recommendation: add a lightweight ATS indicator (warnings for multi‑column layouts, images, tiny font sizes) near the overflow indicator to align with user expectations. citeturn2search0
11. **Micro‑animations should be subtle and respect reduced‑motion.** Add 120–160ms fades on toolbar appearance and collapsible content transitions, but gate with `@media (prefers-reduced-motion: no-preference)` to avoid accessibility regressions. (`app/components/editor/editor.module.css:811-815`, `app/components/editor/editor.module.css:1486-1529`)

**Assignment-specific findings (icons, style copy/paste, template confirmation):**
1. **Lucide mapping for current toolbars and section icons.** Current icon usage is split across unicode glyphs in `FloatingToolbar.tsx`, styled text in `InlineToolbar.tsx`, and the custom SVG set in `SectionIcons.tsx`. Proposed mapping that preserves intent: FloatingToolbar Move up → `ArrowUp`, Move down → `ArrowDown`, Duplicate → `Copy`, Insert block below → `Plus`, Delete → `Trash2` (`app/components/editor/FloatingToolbar.tsx:105-153`). InlineToolbar Bold → `Bold`, Italic → `Italic`, Underline → `Underline`, Strikethrough → `Strikethrough`, Superscript → `Superscript`, Subscript → `Subscript`, Link → `Link` (`app/components/editor/InlineToolbar.tsx:206-231`). Section icons: Colors → `Droplet`, Typography → `Type`, Box Model → `SquareStack`, Borders → `SquareDashed`, Header → `Heading`, Image → `Image`, Bullets → `List`, Palette → `Palette`, Links → `Link`, Grid → `LayoutGrid`, Page → `File`, Layout → `Columns2`, Box Shadow → `Layers`, Content → `TextAlignStart`, History → `History` (`app/components/editor/SectionIcons.tsx:1-157`). Close buttons and “x” affordances: standardize on `X` to replace `×` in modals and clear buttons for consistency (`app/components/editor/TemplatePicker.tsx:24-49`, `app/components/editor/ShortcutHelp.tsx:39-46`, `app/components/editor/TypographyControls.tsx:50-121`).
2. **Icon size recommendation (16px vs 18px).** The FloatingToolbar buttons are `22x22` and the InlineToolbar buttons are `28x28` (`editor.module.css:944-1010`, `editor.module.css:1569-1618`). Recommendation:
   - Use `size={16}` in FloatingToolbar to avoid crowding inside 22px buttons.
   - Use `size={18}` in InlineToolbar for better legibility at 28px without oversizing.
   - For section headers (currently 14px), use `size={14}` or `size={16}` based on visual weight; 16px reads better but should be tested alongside the chevron and label spacing.
3. **Keep or replace `SectionIcons.tsx`.** Prefer full replacement with Lucide to avoid maintaining two icon systems. If 14px legibility is a concern, set Lucide `size={14}` and `strokeWidth={1.8}` to match the existing stroke weight. Keep `SectionIcons.tsx` only if a bespoke “hand‑drawn” look is desired as a deliberate brand choice.
4. **Bundle size impact of `lucide-react`.** Lucide is tree‑shakable; importing named icons should only include the used glyphs. The delta is small for a handful of icons, but the safest path is to avoid dynamic or namespace imports (which can pull in the full set). Recommendation: verify with a Next bundle analyzer when adding the dependency and keep icon imports explicit.
5. **InlineToolbar look and recognition.** The current “B/I” glyphs are highly recognizable for text formatting. If visual consistency is the priority, switch to Lucide `Bold` and `Italic` to match the rest of the toolbar; if immediate recognition is the priority, keep text glyphs for Bold/Italic and use Lucide for the remaining buttons (underline/strike/super/sub/link) so the toolbar still reads as a single system.
6. **Style copy/paste location and flow.** Best placement is the FloatingToolbar (contextual, already used for block actions), with an optional secondary entry in the BlockStylePanel header for discoverability. Proposed flow: (1) Select block A. (2) Click “Copy Style” (paintbrush icon) or use `Cmd+Shift+C`. (3) Editor enters “armed” mode (cursor change + inline toast “Style copied—select a block to apply”). (4) Click block B (or use arrow keys to select) to auto‑paste, or click “Paste Style” in the FloatingToolbar to confirm. (5) Escape cancels the armed state.
7. **What gets copied.** Start with `block.style` only. Add content‑specific payloads when type matches: if source `content.type === "image"` and target is image, also copy `content.style` (width/height/fit/borderRadius). If source is bullets and target is bullets, optionally copy `content.levels` (marker/indent/gap/font size). Do not change `header.tag`, `content.type`, or the rich text content itself.
8. **Template switch confirmation.** `TemplatePicker.tsx` immediately dispatches `SWITCH_TEMPLATE`, and `EditorContext` remaps regions + dumps orphaned blocks into the first new region. This is destructive‑feeling. Proposed dialog content: Title “Switch template?”, body text “This will rearrange your blocks to fit the new layout. Regions that don’t exist in the new template will be moved into {First Region Name}. Your text won’t be deleted.” Include a mini preview of the target template (reuse `TemplateMiniPreview`) plus a short diff summary “Regions removed: X; Regions added: Y; Orphaned blocks moved: N.” Buttons: `Cancel` (default) and `Switch Template` (destructive‑style primary). Optional line: “You can undo with Cmd+Z.”
