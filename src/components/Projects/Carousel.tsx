import { useCallback, useEffect, useRef, useState } from "react";
import { projects } from "../../data/portfolio";
import { allProjectImages } from "../../lib/projectMedia";
import { prefersReducedMotion } from "../../lib/dom";
import styles from "./Carousel.module.css";
import { Lightbox } from "./Lightbox";

const pad = (n: number) => String(n).padStart(2, "0");
const GOTO_EVENT = "carousel:goto";

/** rola até o carrossel e mostra a tela pedida (usado pelas prévias dos cartões de projeto) */
export function openInCarousel(index: number) {
  document.getElementById("telas")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent<number>(GOTO_EVENT, { detail: index }));
}
const images = allProjectImages(projects.items);
/** projetos que têm telas, com o índice da primeira delas */
const groups = images.reduce<{ project: string; first: number; count: number }[]>((acc, img, i) => {
  const last = acc[acc.length - 1];
  if (last?.project === img.project) last.count += 1;
  else acc.push({ project: img.project, first: i, count: 1 });
  return acc;
}, []);

/**
 * Telas dos projetos como painéis holográficos: a do centro fica de frente,
 * as vizinhas giram em perspectiva conforme a distância. Arrasta com o dedo
 * (rolagem nativa com encaixe) ou com o mouse; setas e teclado também navegam.
 */
export function Carousel() {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  // cada painel recebe --d: a distância até o centro, em "painéis" (-1.5 a 1.5)
  const layout = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let best = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const slide = child as HTMLElement;
      const offset = slide.offsetLeft + slide.offsetWidth / 2 - center;
      const d = Math.max(-1.5, Math.min(1.5, offset / slide.offsetWidth));
      slide.style.setProperty("--d", d.toFixed(3));
      slide.style.setProperty("--ad", Math.abs(d).toFixed(3));
      if (Math.abs(offset) < best) {
        best = Math.abs(offset);
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    layout();
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [layout]);

  // pedidos de "abrir na tela X" vindos de fora do carrossel
  const goToRef = useRef<(i: number) => void>(() => {});
  useEffect(() => {
    const onGoto = (e: Event) => goToRef.current((e as CustomEvent<number>).detail);
    window.addEventListener(GOTO_EVENT, onGoto);
    return () => window.removeEventListener(GOTO_EVENT, onGoto);
  }, []);

  const goTo = (i: number) => {
    const el = track.current;
    const slide = el?.children[Math.max(0, Math.min(images.length - 1, i))] as HTMLElement | undefined;
    if (!el || !slide) return;
    el.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - el.clientWidth / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  goToRef.current = goTo;

  // arraste com o mouse (no toque, a rolagem nativa já faz isso)
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0 || !track.current) return;
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    const el = track.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      el.classList.add(styles.dragging);
      el.setPointerCapture(e.pointerId);
    }
    if (d.moved) el.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    const d = drag.current;
    const el = track.current;
    if (!d || !el) return;
    if (d.moved) {
      el.classList.remove(styles.dragging);
      goTo(active);
      // o clique que encerra o arraste não deve abrir a tela cheia
      window.setTimeout(() => (drag.current = null), 0);
    } else drag.current = null;
  };

  if (!images.length) {
    // só no `npm run dev`: mostra onde soltar as imagens; some no site publicado
    if (!import.meta.env.DEV) return null;
    return (
      <section id="telas" className={styles.showcase} aria-label="Telas dos projetos">
        <div className={styles.card}>
          <div className={styles.empty}>
            <b>＋ carrossel de telas dos projetos</b>
            <span>
              solte prints em <code>src/assets/projetos/</code> com o nome <code>&lt;projeto&gt;-1.png</code>
            </span>
            <span>{projects.items.map((p) => p.slug).join(" · ")}</span>
          </div>
        </div>
      </section>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <section id="telas" className={styles.showcase} aria-roledescription="carrossel" aria-label="Telas dos projetos">
      <div className={styles.card}>
        <header className={styles.head}>
          <div className={styles.heading}>
            <p className={styles.label}>{projects.galleryLabel}</p>
            <h2 className={styles.title}>{projects.galleryTitle}</h2>
          </div>
          <span className={styles.now} aria-live="polite">
            <b key={current.project}>{current.project}</b>
            <span>
              {pad(active + 1)}/{pad(images.length)}
            </span>
          </span>
          <span className={styles.arrows}>
            <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Tela anterior">
              ‹
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Próxima tela"
            >
              ›
            </button>
          </span>
        </header>

        {groups.length > 1 && (
          <div className={styles.filters} role="group" aria-label="Pular para o projeto">
            {groups.map((g) => (
              <button
                key={g.project}
                type="button"
                aria-pressed={current.project === g.project}
                onClick={() => goTo(g.first)}
              >
                {g.project}
                <span>{g.count}</span>
              </button>
            ))}
          </div>
        )}

        <ul
          ref={track}
          className={styles.track}
          tabIndex={0}
          aria-label="Arraste para o lado ou use as setas do teclado"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              goTo(active + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              goTo(active - 1);
            }
          }}
        >
          {images.map((img, i) => (
            <li
              key={img.src}
              className={`${styles.slide} ${i === active ? styles.on : ""}`}
              aria-roledescription="tela"
              aria-label={`${i + 1} de ${images.length}: ${img.alt}`}
            >
              <button
                type="button"
                className={styles.screen}
                tabIndex={i === active ? 0 : -1}
                aria-label={`Ampliar: ${img.alt}`}
                onClick={() => {
                  if (drag.current?.moved) return;
                  if (i !== active) goTo(i);
                  else setOpen(i);
                }}
              >
                <span className={styles.chrome} aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span className={styles.url}>{img.url}</span>
                </span>
                <span className={styles.viewport}>
                  <img src={img.src} alt="" loading="lazy" decoding="async" draggable={false} />
                  <span className={styles.scan} aria-hidden="true" />
                  <span className={styles.zoom} aria-hidden="true">
                    ⤢ ampliar
                  </span>
                </span>
              </button>
              <div className={styles.plate}>
                <span className={styles.idx}>{pad(i + 1)}</span>
                <div>
                  <b>{img.project}</b>
                  {img.caption && <small>{img.caption}</small>}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className={styles.progress} role="group" aria-label="Ir para a tela">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              aria-label={`Tela ${i + 1}: ${img.alt}`}
              aria-current={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>
      {open !== null && (
        <Lightbox
          images={images}
          index={open}
          onIndex={(i) => {
            setOpen(i);
            goTo(i);
          }}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
