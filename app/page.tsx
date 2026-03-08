import BlockView from "./components/BlockView";
import {
  sampleTextBlock,
  sampleBlocksBlock,
  sampleBulletsBlock,
  sampleImageBlock,
} from "./fixtures";

export default function Home() {
  return (
    <>
      <BlockView block={sampleTextBlock} />
      <BlockView block={sampleBlocksBlock} />
      <BlockView block={sampleBulletsBlock} />
      <BlockView block={sampleImageBlock} />
    </>
  );
}
