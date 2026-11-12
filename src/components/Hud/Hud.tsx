import { useEffect, useRef, type RefObject } from "react";
import { sectors } from "../../data/portfolio";
import styles from "./Hud.module.css";

interface HudProps {
  active: number;
  /** preenchido pela cena 3D a cada quadro */
  readoutRef: RefObject<HTMLSpanElement | null>;
}

export function Hud({ active, readoutRef }: HudProps) {
  const progress = useRef<HTMLDivElement>(null);

  // barra de progresso da rolagem, atualizada direto no DOM
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const sector = sectors[active] ?? sectors[0];

  return (
    <>
      <div className={styles.progress} ref={progress} />
      <div className={styles.rail}>
        {sectors.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={i === active ? styles.on : undefined}>
            <span>{s.label}</span>
            <i />
          </a>
        ))}
      </div>
      <div className={styles.readout}>
        <b>
          SETOR {String(active).padStart(2, "0")} · {sector.label.toUpperCase()}
        </b>
        <br />
        <span ref={readoutRef}>z 0.0 · vel 0.0</span>
      </div>
    </>
  );
}
