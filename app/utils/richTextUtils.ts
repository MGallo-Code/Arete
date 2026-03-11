import type { RichText, TextRun, Style } from "../models";

/** Shallow-compare two optional Style objects */
function stylesEqual(a: Style | undefined, b: Style | undefined): boolean {
  if (a === b) return true;
  if (!a && !b) return true;
  if (!a || !b) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if ((a as Record<string, unknown>)[key] !== (b as Record<string, unknown>)[key]) return false;
  }
  return true;
}

/** Escape HTML special characters */
export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert camelCase CSS key to kebab-case */
export function kebab(key: string): string {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/** Build HTML string from RichText for contentEditable content */
export function richTextToHtml(richText: RichText): string {
  return richText
    .map((run) => {
      const styleStr = run.style
        ? Object.entries(run.style)
            .map(([k, v]) => `${kebab(k)}:${v}`)
            .join(";")
        : "";
      const text = esc(run.text);
      if (run.link) {
        return `<a href="${esc(run.link)}"${styleStr ? ` style="${styleStr}"` : ""}>${text}</a>`;
      }
      if (styleStr) {
        return `<span style="${styleStr}">${text}</span>`;
      }
      return text;
    })
    .join("");
}

/** Parse contentEditable DOM back to RichText */
export function domToRichText(container: HTMLElement): RichText {
  const runs: TextRun[] = [];

  function walk(node: Node, inherited: Style, link?: string) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || "";
      if (!text) return;
      const run: TextRun = { text };
      if (link) run.link = link;
      if (Object.keys(inherited).length > 0) run.style = { ...inherited };
      runs.push(run);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    const style: Style = { ...inherited };
    if (tag === "b" || tag === "strong") style.fontWeight = "bold";
    if (tag === "i" || tag === "em") style.fontStyle = "italic";
    if (tag === "u") style.textDecoration = "underline";
    if (tag === "s" || tag === "strike" || tag === "del") style.textDecoration = "line-through";
    if (tag === "sup") { style.verticalAlign = "super"; style.fontSize = "0.75em"; }
    if (tag === "sub") { style.verticalAlign = "sub"; style.fontSize = "0.75em"; }

    const s = el.style;
    if (s.fontWeight) style.fontWeight = s.fontWeight as string;
    if (s.fontStyle) style.fontStyle = s.fontStyle as string;
    if (s.color) style.color = s.color;
    if (s.fontSize) style.fontSize = s.fontSize;
    if (s.textDecoration) style.textDecoration = s.textDecoration as string;
    if (s.verticalAlign) style.verticalAlign = s.verticalAlign as string;
    if (s.backgroundColor) style.backgroundColor = s.backgroundColor;
    if (s.letterSpacing) style.letterSpacing = s.letterSpacing;

    const href = tag === "a" ? el.getAttribute("href") || undefined : link;

    for (const child of el.childNodes) {
      walk(child, style, href);
    }
  }

  for (const child of container.childNodes) {
    walk(child, {});
  }

  // Merge adjacent runs with identical style+link
  const merged: TextRun[] = [];
  for (const run of runs) {
    const prev = merged[merged.length - 1];
    if (prev && prev.link === run.link && stylesEqual(prev.style, run.style)) {
      prev.text += run.text;
    } else {
      merged.push({ ...run });
    }
  }
  return merged;
}
