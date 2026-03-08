import { sampleResume } from "../sample-resume";

export default function ResumePreview() {
  console.log(sampleResume);
  return <>{sampleResume.template.name}</>;
}
