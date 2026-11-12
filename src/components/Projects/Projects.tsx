import type { CSSProperties, PointerEvent } from "react";
import { projects, type Project } from "../../data/portfolio";
import { allProjectImages, projectImages } from "../../lib/projectMedia";
import { Station } from "../Station/Station";
import { Tags } from "../Tags/Tags";
import { Carousel, openInCarousel } from "./Carousel";
import styles from "./Projects.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const toneColor = { signal: "var(--signal)", pink: "var(--pink)", data: "var(--data)" } as const;
const bySlug = new Map(projects.items.map((p, i) => [p.slug, { project: p, index: i }]));
const allImages = allProjectImages(projects.items);
const hasScreens = allImages.length > 0 || import.meta.env.DEV;

/** posição da primeira tela de cada projeto no carrossel */
const firstScreen = (project: Project) => allImages.findIndex((img) => img.project === project.title);

/** projetos com mais conteúdo ocupam a largura toda da grade */
const isWide = (project: Project) => Boolean(project.highlights || project.farolCriteria);

/** a luz do cartão segue o cursor */
const spotlight = (e: PointerEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
};

export function Projects() {
  return (
    <>
      <Station id="s2" panelClassName={styles.panel}>
        <h2>{projects.title}</h2>
        <p>{projects.text}</p>
        {hasScreens && (
          <a className={styles.toScreens} href="#telas">
            ▸ Ver as telas dos projetos
          </a>
        )}
        <section className={styles.platform} aria-label="Mapa da plataforma de operação">
          <p className={styles.platformLabel}>
            <span className={styles.core} aria-hidden="true">◆</span> {projects.platform.label}
          </p>
          <div className={styles.areasMap}>
            {projects.platform.areas.map((a) => (
              <div key={a.area} className={styles.areaCol} style={{ "--tone": toneColor[a.tone] } as CSSProperties}>
                <b>{a.area}</b>
                <ul>
                  {a.modules.map((slug) => {
                    const hit = bySlug.get(slug);
                    if (!hit) return null;
                    return (
                      <li key={slug}>
                        <a href={`#proj-${slug}`}>
                          <span>{pad(hit.index + 1)}</span> {hit.project.kind}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <div className={styles.grid}>
          {projects.items.map((project, i) => {
            const shots = projectImages(project);
            const cover = shots[0];
            return (
              <article
                key={project.title}
                id={`proj-${project.slug}`}
                className={`${styles.proj} ${isWide(project) ? styles.wide : ""} ${cover ? styles.hasCover : ""}`}
                onPointerMove={spotlight}
              >
                <span className={styles.num} aria-hidden="true">
                  {pad(i + 1)}
                </span>

                {cover && (
                  <button
                    type="button"
                    className={styles.cover}
                    onClick={() => openInCarousel(firstScreen(project))}
                    aria-label={`Ver as ${shots.length} telas de ${project.title} no carrossel`}
                  >
                    <img src={cover.src} alt="" loading="lazy" decoding="async" />
                    <span className={styles.coverLabel}>
                      ▸ ver {shots.length > 1 ? `${shots.length} telas` : "tela"}
                    </span>
                  </button>
                )}

                <div className={styles.body}>
                  <div className={styles.meta}>
                    <span>{project.meta}</span>
                    <b>{project.kind}</b>
                  </div>
                  <h3 className={styles.title}>{project.title}</h3>
                  {project.stats && (
                    <div className={styles.projStats}>
                      {project.stats.map((stat) => (
                        <span key={stat.label}>
                          <b>{stat.value}</b> {stat.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <p>{project.description}</p>
                  {project.highlights && <Tags items={project.highlights} itemClassName={styles.tag} />}
                  {(project.repos || project.live) && (
                    <div className={styles.repos}>
                      {project.live && (
                        <a href={project.live} target="_blank" rel="noopener" className={styles.live}>
                          <span aria-hidden="true">●</span> ver no ar <span aria-hidden="true">↗</span>
                        </a>
                      )}
                      {project.repos?.map((r) => (
                        <a key={r.href} href={r.href} target="_blank" rel="noopener">
                          <span aria-hidden="true">⌥</span> {r.label} <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {project.farolCriteria && (
                    <div className={styles.ttv} aria-label="Critérios do farol">
                      <div className={styles.farol}>
                        <span>
                          <b className={styles.r}>●</b> Crítico
                        </span>
                        <span>
                          <b className={styles.a}>●</b> Atenção
                        </span>
                        <span>
                          <b className={styles.g}>●</b> Saudável
                        </span>
                      </div>
                      <Tags items={project.farolCriteria} itemClassName={styles.tag} />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Station>
      <Carousel />
    </>
  );
}
