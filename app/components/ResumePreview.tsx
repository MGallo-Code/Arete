import { Properties } from "csstype";
import { sampleResume } from "../sample-resume";

export default function ResumePreview() {
  const redTestStyle: Properties = {
    backgroundColor: "red",
    width: "100%",
    minHeight: "100vh",
    flexGrow: "1",
  };
  return <main style={redTestStyle}>{sampleResume.template.name}</main>;
}
