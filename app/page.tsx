import ResumePreview from "./components/ResumePreview";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ResumePreview />
      </main>
    </div>
  );
}
