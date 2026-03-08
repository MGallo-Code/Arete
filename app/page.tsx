import ResumePreview from "./components/ResumePreview";
import { sampleResume } from "./fixtures";

export default function Home() {
  return <ResumePreview resume={sampleResume} />;
}
