import { useEffect, useState } from "react";
import { stations } from "../lib/dom";

/** Índice da estação cujo topo já passou de 45% da altura da tela. */
export function useActiveSector() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY + window.innerHeight * 0.45;
      let index = 0;
      stations().forEach((s, k) => {
        if (s.offsetTop <= y) index = k;
      });
      setActive(index);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return active;
}
