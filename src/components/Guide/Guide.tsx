import { useCallback, useEffect, useRef, useState } from "react";
import mariAvatar from "../../assets/mari.webp";
import { byteLines, guideLines } from "../../data/portfolio";
import { Dog } from "./Dog";
import styles from "./Guide.module.css";

interface GuideProps {
  /** setor atual: muda a fala e o lado da tela */
  active: number;
  hidden: boolean;
  onHide: () => void;
}

/** Mari.exe (avatar anime) e o Byte, o cachorrinho, comentando cada setor. */
export function Guide({ active, hidden, onHide }: GuideProps) {
  const [text, setText] = useState("");
  const [popKey, setPopKey] = useState(0);
  const [quiet, setQuiet] = useState(false);
  const alt = useRef(0);
  const quietTimer = useRef<number | undefined>(undefined);

  const speak = useCallback((line: string) => {
    setText(line);
    setQuiet(false);
    setPopKey((k) => k + 1);
    window.clearTimeout(quietTimer.current);
    // no celular o balão some sozinho para não cobrir o conteúdo
    if (window.innerWidth < 820) quietTimer.current = window.setTimeout(() => setQuiet(true), 5000);
  }, []);

  useEffect(() => {
    alt.current = 0;
    speak(guideLines[active]?.[0] ?? "");
  }, [active, speak]);

  useEffect(() => () => window.clearTimeout(quietTimer.current), []);

  // no celular o guia fica quase transparente enquanto a página rola, para não cobrir botões
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let idle: number | undefined;
    const onScroll = () => {
      if (window.innerWidth >= 820) return;
      setScrolling(true);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setScrolling(false), 1200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  const lines = guideLines[active] ?? guideLines[0];
  const nextLine = () => {
    alt.current = (alt.current + 1) % lines.length;
    speak(lines[alt.current]);
  };
  const byteSays = () => speak(byteLines[Math.floor(Math.random() * byteLines.length)]);

  return (
    <div
      className={`${styles.guide} ${active % 2 === 0 ? styles.right : ""} ${scrolling ? styles.scrolling : ""}`}
      aria-live="polite"
      hidden={hidden}
    >
      <img
        className={styles.mari}
        src={mariAvatar}
        alt="Avatar em estilo anime de Maria Eduarda com notebook"
        onClick={nextLine}
      />
      <Dog className={styles.byte} tailClassName={styles.tail} onClick={byteSays} />
      <div key={popKey} className={`${styles.bubble} ${styles.pop} ${quiet ? styles.quiet : ""}`}>
        <b>Maria Eduarda</b>
        <span>{text}</span>
        <button className={styles.x} type="button" aria-label="Esconder avatar" onClick={onHide}>
          ✕
        </button>
      </div>
    </div>
  );
}
