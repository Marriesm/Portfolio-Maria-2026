/** localStorage que nunca quebra (modo privado, armazenamento bloqueado etc.). */
export const store = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // sem armazenamento: a escolha vale só para esta visita
    }
  },
};

/** Valor atual de uma variável CSS no :root (já com paleta/modo aplicados). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** As seções da viagem, na ordem da página. */
export const stations = () => Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
