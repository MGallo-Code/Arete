import BlockView from "./components/BlockView";
import {
  sampleTheme,
  sampleTextBlock,
  sampleBlocksBlock,
  sampleBulletsBlock,
  sampleImageBlock,
} from "./fixtures";

export default function Home() {
  return (
    <>
      <BlockView block={sampleTextBlock} theme={sampleTheme} />
      <BlockView block={sampleBlocksBlock} theme={sampleTheme} />
      <BlockView block={sampleBulletsBlock} theme={sampleTheme} />
      <BlockView block={sampleImageBlock} theme={sampleTheme} />
    </>
  );
}
