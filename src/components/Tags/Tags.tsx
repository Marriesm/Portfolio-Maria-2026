import type { CSSProperties } from "react";
import styles from "./Tags.module.css";

interface TagsProps {
  items: readonly string[];
  /** classe extra em cada tag (ex.: para acender em cascata no hover do projeto) */
  itemClassName?: string;
}

export function Tags({ items, itemClassName }: TagsProps) {
  return (
    <div className={styles.tags}>
      {items.map((item, i) => (
        <span key={item} className={itemClassName} style={{ "--i": i } as CSSProperties}>
          {item}
        </span>
      ))}
    </div>
  );
}
