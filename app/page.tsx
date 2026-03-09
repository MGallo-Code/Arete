import ResumePreview from "./components/ResumePreview";
import { testResume } from "./fixtures";

// Use testResume for feature verification; switch to sampleResume for normal demo

export default function Home() {
  return <ResumePreview resume={testResume} />;
}
