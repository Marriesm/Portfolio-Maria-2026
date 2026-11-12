import { footer } from "../../data/portfolio";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <span>{footer.left}</span>
      <span>{footer.right}</span>
    </footer>
  );
}
