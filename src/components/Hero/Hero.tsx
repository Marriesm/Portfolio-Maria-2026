import { useEffect, useRef } from "react";
import photo from "../../assets/maria-foto.webp";
import { intro, profile } from "../../data/portfolio";
import { prefersReducedMotion } from "../../lib/dom";
import { buttonClass } from "../Button/button";
import { Station } from "../Station/Station";
import styles from "./Hero.module.css";

const toneClass = { signal: styles.s, pink: styles.p, data: styles.d } as const;
const toneColor = { signal: "var(--signal)", pink: "var(--pink)", data: "var(--data)" } as const;

/** o painel de abertura inclina em 3D e acende uma luz seguindo o mouse */
function usePanelTilt() {
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = anchor.current?.closest<HTMLElement>(`.${styles.introPanel}`);
    if (!panel || prefersReducedMotion()) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = panel.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      panel.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      panel.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      panel.style.setProperty("--ry", `${((x - 0.5) * 5).toFixed(2)}deg`);
      panel.style.setProperty("--rx", `${((0.5 - y) * 4).toFixed(2)}deg`);
    };
    const onLeave = () => {
      panel.style.setProperty("--ry", "0deg");
      panel.style.setProperty("--rx", "0deg");
    };
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);
    return () => {
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return anchor;
}

/** Selo "sistema online" que vai digitando as outras mensagens. */
function useTypedStatus() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let i = 0;
    let typing: number | undefined;
    const cycle = window.setInterval(() => {
      i = (i + 1) % intro.typed.length;
      const message = intro.typed[i] ?? "";
      let k = 0;
      window.clearInterval(typing);
      typing = window.setInterval(() => {
        if (ref.current) ref.current.textContent = message.slice(0, ++k);
        if (k >= message.length) window.clearInterval(typing);
      }, 32);
    }, 3200);
    return () => {
      window.clearInterval(cycle);
      window.clearInterval(typing);
    };
  }, []);

  return ref;
}

interface HeroProps {
  classic: boolean;
  onToggleClassic: () => void;
}

export function Hero({ classic, onToggleClassic }: HeroProps) {
  const typed = useTypedStatus();
  const tilt = usePanelTilt();

  return (
    <Station id="s0" showSector={false} className={styles.intro} panelClassName={styles.introPanel}>
      <span className={styles.spot} aria-hidden="true" />
      <div className={styles.head} ref={tilt}>
        <div className={styles.headText}>
          <div className={styles.introTop}>
            <span className={styles.status}>
              <b />
              <span className={styles.typed} ref={typed}>
                {intro.typed[0]}
              </span>
            </span>
            <span className={styles.nowAt}>
              {profile.nowAtRole} · <strong>{profile.nowAtCompany}</strong>
            </span>
          </div>
          <p className={styles.role}>{profile.role}</p>
          <h1>
            <span className={styles.glitch} data-text={profile.name}>
              {profile.name}
            </span>
          </h1>
        </div>
        <figure className={styles.portrait}>
          <div className={styles.frame}>
            <img src={photo} alt={`Foto de ${profile.name}`} width={480} height={600} />
            <span className={styles.scanline} aria-hidden="true" />
          </div>
          <figcaption>
            <b aria-hidden="true" />
            {profile.portraitCaption}
          </figcaption>
        </figure>
      </div>
      <p className={styles.lead}>
        {intro.leadBefore}
        <strong>{intro.leadStrong}</strong>
        {intro.leadAfter}
      </p>
      <div className={styles.caps}>
        {intro.capabilities.map((c) => (
          <div key={c.title} style={{ "--tone": toneColor[c.tone] } as React.CSSProperties}>
            <i className={toneClass[c.tone]} />
            <b>{c.title}</b>
            <span>{c.text}</span>
          </div>
        ))}
      </div>
      <div className={styles.ctas}>
        <a className={buttonClass("primary")} href="#s2">
          Ver projetos
        </a>
        <a className={buttonClass()} href={profile.resume.href} download={profile.resume.fileName}>
          <span aria-hidden="true">↓</span> Baixar currículo
        </a>
        <button className={buttonClass()} type="button" onClick={onToggleClassic}>
          {classic ? "Modo imersivo" : "Modo recrutador"}
        </button>
        <a className={buttonClass("ghost")} href="#s5">
          Contato
        </a>
      </div>
      <div className={styles.scrollCue}>
        <i />
        {intro.scrollCue}
      </div>
    </Station>
  );
}
