import { experience } from "../../data/portfolio";
import { Station } from "../Station/Station";
import styles from "./Journey.module.css";

/** Experiência profissional, da mais recente para a mais antiga. */
export function Journey() {
  return (
    <Station id="s3" right>
      <h2>{experience.title}</h2>
      <ol className={styles.xp}>
        {experience.items.map((job) => (
          <li key={job.when}>
            <div className={styles.when}>{job.when}</div>
            <div>
              <h3>{job.role}</h3>
              <div className={styles.org}>{job.org}</div>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Station>
  );
}
