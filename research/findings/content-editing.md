# Content Editing Workflows — Research Findings

## Current State
Content editing in Arete is siloed by content type.
- **Data Model:** `Content` is a union type (`text`, `bullets`, `blocks`, `image`).
- **Editing Logic:** `ContentView.tsx` switches rendering based on the type. `EditableRichText.tsx` handles `text` and `header`. `BulletsView.tsx` handles `bullets` with a sophisticated Enter/Tab/Backspace model. `ImageControls.tsx` handles `image` source/alt/style in the sidebar.
- **Switching:** There is NO UI for changing a block's content type once created. You must delete and re-add from the Block Library.
- **Empty States:** Blocks with no content (e.g., empty string in text) are visually difficult to select or interact with unless they have a header.

## Industry Analysis

### Notion
- **What they do well:** The `/` command opens a block menu with quick insert options for text, bullets, and headings, and includes “slash turn” commands for changing block type. citeturn5search1  
- **What they do poorly:** Power features are discoverable only if you already know to type `/` first.
- **Transferable patterns:** A "Type / to choose" affordance for empty blocks, plus a compact content-type picker in the sidebar.

### Google Docs
- **What they do well:** Headings are applied via paragraph styles in the Format menu, which is a familiar model for document editing. citeturn8search1  
- **What they do poorly:** It’s not block-based, so type switching is expressed as formatting, not structural transforms.
- **Transferable patterns:** Keep content type switching anchored to a “text style / type” control rather than a library UI.

### WordPress Gutenberg
- **What they do well:** The block toolbar exposes a **Transform to** menu that converts Paragraph/Heading/List blocks into other compatible types, preserving the content. citeturn7search2turn7search0turn7search4  
- **What they do poorly:** Some transforms can be surprising if the destination block has stricter structure.
- **Transferable patterns:** A scoped "Transform to" that only lists safe conversions (text ⇄ bullets ⇄ heading).

### Canva
- **What they do well:** Contextual panels (e.g., Position tools) focus on the selected element with direct actions like alignment and sizing, reinforcing “selection → specific controls.” citeturn4search0  
- **What they do poorly:** Less of a structured block model, so content-type switching is not explicit.
- **Transferable patterns:** Contextual primary actions in the sidebar (e.g., “Add Item” for lists, “Change Source” for images).

## Recommendations

### Must-Have Changes
1. **Add "Content" section to `BlockStylePanel`:**
   - **Content Type Selector:** A dropdown or toggle group to switch the `Content` type (Text, Bullets, Image).
   - **Conversion Logic:**
     - Text → Bullets: Create a single bullet with the text content.
     - Bullets → Text: Join all bullet items with newlines (or use `RichText` from the first item).
     - Text/Bullets → Image: Replace content with a placeholder image.
2. **"Add Content" for Empty Blocks:**
   - If a block is empty (e.g., initial state), show a small "Content Picker" overlay with icons for "Text", "Bullets", and "Image" directly in the preview.
3. **Sidebar Action Buttons:**
   - For `bullets`, add a permanent "+ Add Item" button in the sidebar.
   - For `image`, add a "Change Image" button that opens a URL input (or eventually a file picker).
4. **Improved Empty State Rendering:**
   - Ensure empty text blocks have a minimum height or a "Type something..." placeholder to keep them clickable.

### Nice-to-Have Improvements
1. **Multi-line Paste into Bullets:** Already exists in `BulletsView.tsx`, but ensure it's robust and handles various line endings.
2. **Contextual Toolbar "Convert" Button:** Add a "Turn into..." button to the `FloatingToolbar`.
3. **Image Placeholder Service:** Use a service like Unsplash or clear placeholders if no URL is provided.

### Things to Avoid
- **Avoid destructive transforms without confirmation:** If switching from a large list of bullets to an image, warn the user.
- **Don't hide sidebar controls based on content type:** Use `CollapsibleSection` to hide/show them, but keep the overall panel structure consistent.

## Agent Findings

### Gemini
- **"Add Content" Visual Affordance:** When a block is empty, the preview should show a subtle "plus" icon or "Select content type..." overlay that disappears on hover or selection. This reduces the "Where do I click?" friction.
- **Style Copy/Paste (Format Painter):** Add "Copy Style" and "Paste Style" buttons to the `FloatingToolbar`. This allows users to quickly unify the look of different sections (e.g., copy heading style from "Experience" to "Education").
- **Content Type Quick-Actions:** In the sidebar's "Content" section, show visual thumbnails for the content types (Text, List, Image) to make switching feel more like a "Template" choice than a technical "Type" change.
- **Auto-Formatting on Paste:** When pasting text into a `bullets` block, the editor should automatically detect if it's a list (e.g., starts with "-", "*", or "1.") and split it into multiple `BulletItem` entries.
- **Quick-Add "Skill Tag":** A resume-specific quick-action for "Add Skill Tag" that creates a pre-styled small block or bullet with a pill background.

### Claude

#### Deep-Dive Industry Analysis

**Notion:** The gold standard for content type switching via slash commands (e.g., `/bullet`, `/heading`) and “slash turn” options that convert block types while keeping content. Empty blocks show a “Type /” style affordance. citeturn5search1

**Google Docs:** Heading level is applied via paragraph styles in the Format menu; the mental model is “formatting choice” rather than block transform. citeturn8search1

**Confluence:** The editor supports slash commands and markdown-style shortcuts (e.g., `#` for headings, `*` for bullets), reinforcing quick content-type switching without leaving the keyboard. citeturn6search0

**WordPress Gutenberg:** The most explicit transformation system. Each block has a “Transform to” toolbar menu listing compatible types (Paragraph → Heading/List, List → Paragraph, etc.). citeturn7search2turn7search0turn7search4

**Resume Builders (Zety, Resume.io, Enhancv, Kickresume):**
- Section-centric not block-centric. Each section has predefined fields (title/company/date/description), not free-form content.
- Bullet points are the default for descriptions. No explicit "switch to bullets" step.
- "Add" buttons are section-level ("Add Experience Entry"), not content-level.
- Multi-line paste splits into bullets automatically.
- Enhancv's "Improve Text" can restructure pasted content into better bullets.
- Image insertion is minimal; most builders avoid arbitrary images for ATS compatibility.
- Key insight: Arete's Block Library templates already follow the section-centric pattern. The gap is in modifying existing blocks, not creating new ones.

#### Specific Recommendations

1. **Content type selector in BlockStylePanel** (`/Users/michael/Documents/Projects/arete/app/components/editor/BlockStylePanel.tsx`). Add a "Content" collapsible section at the top showing a dropdown/segmented control: Text / Bullets / Image. This requires a new `CHANGE_CONTENT_TYPE` reducer action in `EditorContext` (`/Users/michael/Documents/Projects/arete/app/contexts/EditorContext.tsx`). Conversion logic:
   - Text -> Bullets: split by newlines (or single bullet if no newlines) preserving RichText formatting
   - Bullets -> Text: join bullet contents with newline-separated TextRuns, preserving bold/italic/links
   - Text/Bullets -> Image: set placeholder src, preserve text as alt
   - Image -> Text: use alt text as content
   - Do NOT expose "Blocks" (nested) as a user-selectable option -- it's an internal structural type created only via Block Library templates

2. **Empty block placeholder in ContentView** (`/Users/michael/Documents/Projects/arete/app/components/ContentView.tsx`). When `content.type === 'text'` and `content.value` is empty or `[{ text: '' }]`, render gray placeholder text ("Double-click to edit") with `min-height: 1.5em`. Currently empty text blocks have zero height and are invisible/unclickable -- this is a **critical usability gap**.

3. **"Add Bullet" button in BulletStyleControls** (`/Users/michael/Documents/Projects/arete/app/components/editor/BulletStyleControls.tsx`). Place at the bottom of the controls. Dispatches `UPDATE_BULLET_ITEMS` with a new empty `BulletItem` appended. Gives sidebar-first users an entry point without requiring inline double-click.

4. **Improve paste handling in EditableRichText.** Currently at `/Users/michael/Documents/Projects/arete/app/components/editor/EditableRichText.tsx` line 144-148, ALL formatting is stripped on paste. For resume editing (paste from LinkedIn, Word, other resumes), basic rich text should be preserved. Create a shared `cleanPastedHtml(html: string): string` utility in `/Users/michael/Documents/Projects/arete/app/utils/richTextUtils.ts` that:
   - Parses clipboard HTML
   - Strips non-resume elements (scripts, styles, divs, tables)
   - Preserves `<b>`, `<strong>`, `<i>`, `<em>`, `<a>`, `<br>`
   - Strips inline styles except font-weight, font-style
   - Returns clean HTML for `document.execCommand("insertHTML")`

5. **Content-type indicator in panel header.** Show a small icon/badge in the BlockStylePanel header indicating the content type (text icon, list icon, image icon). Immediate visual feedback about what the selected block contains.

#### Discovered Issues

- **Enter-to-edit does not work for bullet blocks.** `EditorContext` keyboard handler (line 855-868) dispatches `START_EDITING` with `field: "content"`, but `BulletsView` manages its own editing state via `useState(editingItems)` -- it does not respond to `editingBlockId`/`editingField` from the context. `ContentView` only enters editing mode for `type === "text"` (line 19-33). For bullets, editing is triggered exclusively by double-click. **Keyboard-only users cannot enter bullet editing mode at all.** This needs a bridge: when `editingBlockId` matches and `editingField === "content"` and `content.type === "bullets"`, `BulletsView` should auto-enter editing mode and focus the first bullet.

- **Empty text blocks are invisible and unclickable.** In `ContentView.tsx` lines 35-47, empty text content renders a `<div>` with zero height. Users cannot see or click the block. The only interaction path is sidebar (if already selected) or keyboard navigation. Critical gap.

- **Paste handling inconsistency between EditableRichText and BulletsView.**
  - `EditableRichText.handlePaste` (line 144-148): strips ALL formatting, pastes plain text.
  - `BulletsView.handlePaste` (line 181-218): strips formatting but splits multi-line text into bullets.
  - Neither preserves rich text from clipboard (bold, italic, links).
  - Recommendation: shared paste cleanup utility that both components use.

- **Image blocks have no preview feedback for broken URLs.** When `content.src` is empty or invalid, `ContentView` renders `<img src="" />` showing the browser's broken image icon. Should show a styled placeholder: "Add image URL in sidebar" with an image placeholder icon.

- **Header vs content editing ambiguity.** When pressing Enter on a selected block with both header and text content, `EditorContext` always starts in content editing mode. No way to start editing the header from keyboard navigation. Suggestion: Enter = edit content, Shift+Enter = edit header, documented in shortcut help.

- **No `CHANGE_CONTENT_TYPE` action in the reducer.** Content type switching requires a new action that takes `blockId` + `newType`, converts existing content with sensible defaults, preserves what can be preserved, and pushes to the undo stack. The reducer already handles `UPDATE_BULLET_ITEMS`, `UPDATE_RICH_TEXT`, and `UPDATE_IMAGE_CONTENT` for within-type updates.

- **Block Library creates new blocks but cannot modify existing ones.** When a user wants to convert a text block to bullets, the Library does not help -- they must delete, re-add, and re-type. Content type switching fills this gap.

- **No way to convert single-block to nested-blocks structure.** Common pattern: start with a simple text block, then realize you need sub-entries. No "wrap in container" or "unwrap" operations exist. Valuable power-user features for future.

- **Bullet editing loses state on race-condition deselection.** If the block gets deselected while editing bullets (e.g., global Escape dispatches `SELECT_BLOCK path: []` before `BulletsView` blur handler fires), the `setTimeout` in `handleBlur` (line 437) mitigates but is fragile.

#### Resume-Specific Insights

- **Default content types should be template-aware.** Experience blocks should default to bullets (that's how accomplishments are formatted). Summary blocks should default to text paragraph. Skills should default to comma-separated text or categorized bullets. Arete's Block Library templates already encode this knowledge (`blockTemplates.ts`), but manual block creation via FloatingToolbar "+" creates a generic text block. Consider: when adding a block adjacent to an Experience section, default to bullets.

- **ATS compatibility warning for images.** Resume builders avoid arbitrary images because ATS parsers cannot read them. Arete should surface a subtle warning when adding image content to a block: "Images may not be parsed by applicant tracking systems." This could be a small info icon + tooltip in the Image section of the sidebar.

- **Multi-line paste into text blocks could auto-suggest bullet conversion.** When pasting 3+ lines of text into a text block, show a small toast: "Convert to bullet list?" This matches the behavior users see in Zety and LinkedIn's resume builder where pasted lists auto-format.

### Codex
- **Content type switching is absent in the reducer:** There is no `CHANGE_CONTENT_TYPE` action in `EditorContext.tsx`, which means the UI has no safe way to convert text ↔ bullets ↔ image without deleting blocks. This is the single biggest workflow gap for resume editing where users often refine structure after drafting.
- **Keyboard-to-edit gap for bullets:** `START_EDITING` only activates `EditableRichText` in `ContentView.tsx`. `BulletsView.tsx` does not respond to `editingBlockId`, so keyboard users cannot enter bullet editing mode without a double-click. This is a major accessibility gap for power users.
- **Empty text blocks are invisible:** When `content.value` is empty, the `<div>` in `ContentView.tsx` has no min-height or placeholder, so it’s hard to click and discover. A “Type / for content” placeholder would align with Notion’s affordance. citeturn5search1
- **Paste behavior is inconsistent:** `EditableRichText` pastes plain text only, while `BulletsView` splits multi-line paste into items but strips formatting. A shared paste-normalization path would improve predictability.
- **Image blocks need inline feedback:** `ContentView.tsx` renders `<img>` directly. If `src` is empty/invalid, the browser shows a broken icon rather than an actionable placeholder like “Add image URL in sidebar.”
