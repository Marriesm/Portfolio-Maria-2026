import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "../../lib/projectMedia";
import styles from "./Lightbox.module.css";

interface LightboxProps {
  images: ProjectImage[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Visualização em tela cheia: setas, Esc, arrastar no celular, foco preso no diálogo. */
export function Lightbox({ images, index, onIndex, onClose }: LightboxProps) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const swipeX = useRef<number | null>(null);
  const many = images.length > 1;
  const image = images[index] ?? images[0];

  const go = (delta: number) => onIndex((index + delta + images.length) % images.length);

  // foco no fechar, rolagem da página travada; ao sair, tudo volta como estava
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      root.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
      else if (e.key === "Tab" && dialog.current) {
        // mantém o Tab dentro do diálogo
        const focusable = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onPointerDown={(e) => (swipeX.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipeX.current === null || !many) return;
        const dx = e.clientX - swipeX.current;
        swipeX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-label="Telas dos projetos">
        <header className={styles.bar}>
          <span className={styles.title}>{image.project}</span>
          {many && (
            <span className={styles.counter} aria-live="polite">
              {pad(index + 1)}/{pad(images.length)}
            </span>
          )}
          <button ref={closeBtn} type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </header>

        <figure className={styles.stage}>
          <img key={image.src} src={image.src} alt={image.alt} />
          <span className={styles.sweep} aria-hidden="true" />
          {image.caption && <figcaption>{image.caption}</figcaption>}
        </figure>

        {many && (
          <>
            <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={() => go(-1)} aria-label="Tela anterior">
              ‹
            </button>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Próxima tela">
              ›
            </button>
            <div className={styles.thumbs}>
              {images.map((img, i) => (
                <button key={img.src} type="button" aria-label={img.alt} aria-current={i === index} onClick={() => onIndex(i)}>
                  <img src={img.src} alt="" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
