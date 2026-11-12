import type { CSSProperties, PointerEvent } from "react";
import { skills } from "../../data/portfolio";
import { Station } from "../Station/Station";
import { Tags } from "../Tags/Tags";
import styles from "./Skills.module.css";

const toneColor = { signal: "var(--signal)", pink: "var(--pink)", data: "var(--data)" } as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** a luz do card segue o cursor */
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

export function Skills() {
  const total = skills.areas.reduce((n, a) => n + a.tags.length, 0);

  return (
    <Station id="s1" right panelClassName={styles.panel}>
      <h2>{skills.title}</h2>
      <p>{skills.text}</p>
      <p className={styles.summary}>
        <b>{skills.areas.length}</b> áreas · <b>{total}</b> tecnologias e práticas
      </p>
      <div className={styles.areas}>
        {skills.areas.map((area) => (
          <article
            key={area.title}
            className={`${styles.area} ${area.wide ? styles.wide : ""} ${area.featured ? styles.featured : ""}`}
            style={{ "--tone": toneColor[area.tone] } as CSSProperties}
            onPointerMove={spotlight}
          >
            <header className={styles.top}>
              <span className={styles.k}>{area.code}</span>
              <span className={styles.count}>{pad(area.tags.length)}</span>
            </header>
            <h3>
              {area.featured && <span className={styles.spark} aria-hidden="true">✦ </span>}
              {area.title}
            </h3>
            {area.note && <p className={styles.note}>{area.note}</p>}
            <Tags items={area.tags} itemClassName={styles.tag} />
          </article>
        ))}
      </div>
    </Station>
  );
}
