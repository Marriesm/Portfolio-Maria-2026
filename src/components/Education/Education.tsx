import { education } from "../../data/portfolio";
import { Station } from "../Station/Station";
import styles from "./Education.module.css";

export function Education() {
  const { degree, courses, languages, softSkills } = education;
  const percent = (degree.semester / degree.totalSemesters) * 100;

  return (
    <Station id="s4">
      <h2>{education.title}</h2>
      <div className={styles.edu}>
        <div className={styles.eduTop}>
          <div>
            <h3>{degree.title}</h3>
            <div className={styles.org}>{degree.org}</div>
          </div>
          <div className={styles.when}>{degree.when}</div>
        </div>
        <div className={styles.eduBar}>
          <i style={{ width: `${percent}%` }} />
        </div>
        <small>
          {degree.semester}º de {degree.totalSemesters} semestres · conclusão prevista em {degree.conclusion}
        </small>
      </div>

      <p className={styles.subhead}>Cursos complementares</p>
      <ul className={styles.coursesList}>
        {courses.map((c) => (
          <li key={c.name} className={styles.course}>
            {c.name}
            <span>{c.detail}</span>
          </li>
        ))}
      </ul>

      <p className={styles.subhead}>Idiomas</p>
      <ul className={styles.coursesList}>
        {languages.map((c) => (
          <li key={c.name} className={styles.course}>
            {c.name}
            <span>{c.detail}</span>
          </li>
        ))}
      </ul>

      <p className={styles.subhead}>Soft skills</p>
      <ul className={styles.soft}>
        {softSkills.map((s) => (
          <li key={s.title}>
            <b>{s.title}</b>
            <span>{s.text}</span>
          </li>
        ))}
      </ul>
    </Station>
  );
}
