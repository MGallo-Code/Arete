import type { RichText } from "../models";

interface Props {
  richText: RichText;
}

export default function RichTextView({ richText }: Props) {
  return richText.map((run, index) => {
    return run.link ? (
      <a key={index} href={run.link} style={run.style}>
        {run.text}
      </a>
    ) : (
      <span key={index} style={run.style}>
        {run.text}
      </span>
    );
  });
}
