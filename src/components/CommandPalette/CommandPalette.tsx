import { useEffect, useRef, useState } from "react";
import { commands, type Command } from "../../data/portfolio";
import styles from "./CommandPalette.module.css";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRun: (command: Command) => void;
}

/** Ignora acentos e maiúsculas na busca. */
const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function CommandPalette({ open, onOpenChange, onRun }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const items = commands.filter((c) => normalize(c.label).includes(normalize(query)));
  const sel = Math.min(selected, Math.max(0, items.length - 1));

  const run = (index: number) => {
    const command = items[index];
    if (!command) return;
    onOpenChange(false);
    onRun(command);
  };

  // abre limpo e com o foco na busca
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    input.current?.focus();
  }, [open]);

  // Ctrl/⌘+K abre e fecha; com a paleta aberta, setas, Enter e Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") onOpenChange(false);
      else if (e.key === "ArrowDown") {
        setSelected(Math.min(items.length - 1, sel + 1));
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelected(Math.max(0, sel - 1));
        e.preventDefault();
      } else if (e.key === "Enter") run(sel);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className={styles.cmdk} hidden={!open} onClick={(e) => e.target === e.currentTarget && onOpenChange(false)}>
      <div className={styles.box} role="dialog" aria-label="Comandos">
        <label className="sr" htmlFor="cmdIn">
          Buscar comando
        </label>
        <input
          ref={input}
          id="cmdIn"
          placeholder="Para onde vamos? Digite um comando…"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(0);
          }}
        />
        <ul>
          {items.length ? (
            items.map((c, i) => (
              <li key={c.label} className={i === sel ? styles.on : undefined} onClick={() => run(i)}>
                <span>{c.label}</span>
                <small>{c.group}</small>
              </li>
            ))
          ) : (
            <li>
              <span>Nenhum comando. Tente "projetos".</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
