import ResumePreview from "./components/ResumePreview";
import RichTextView from "./components/RichTextView";
import { sampleRichText } from "./fixtures";

export default function Home() {
  return <RichTextView richText={sampleRichText} />;
}
