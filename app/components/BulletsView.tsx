import type { BulletItem, BulletLevel } from "../models";
import RichTextView from "./RichTextView";

interface Props {
  items: BulletItem[];
  levels: BulletLevel[];
}

export default function BulletsView({ items, levels }: Props) {
  return (
    <ul style={{ listStyle: "none" }}>
      {items.map((item, index) => {
        const level = levels[item.level ?? 0] ?? {};
        const { paddingLeft, ...textStyle } = level.style ?? {};

        const marker = level.image ? (
          <img src={level.image} alt="" style={{ display: "inline", height: "1em" }} />
        ) : level.char ? (
          <span aria-hidden>{level.char}</span>
        ) : null;

        return (
          <li key={index} style={{ paddingLeft, display: "flex", gap: "0.4em", ...textStyle }}>
            {marker}
            <RichTextView richText={item.content} />
          </li>
        );
      })}
    </ul>
  );
}
