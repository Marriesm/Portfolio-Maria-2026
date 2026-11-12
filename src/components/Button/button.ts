import styles from "./Button.module.css";

type Variant = "default" | "primary" | "ghost";

/** Classes do botão chanfrado, para usar em <a> ou <button>. */
export function buttonClass(variant: Variant = "default") {
  return variant === "default" ? styles.btn : `${styles.btn} ${styles[variant]}`;
}
