import { palettes, profile, type Palette } from "../../data/portfolio";
import styles from "./Nav.module.css";

interface NavProps {
  palette: Palette;
  classic: boolean;
  onPalette: (p: Palette) => void;
  onToggleClassic: () => void;
  onOpenCommands: () => void;
}

export function Nav({ palette, classic, onPalette, onToggleClassic, onOpenCommands }: NavProps) {
  return (
    <nav className={styles.top}>
      <a className={styles.mark} href="#s0">
        <i />
        <b style={{ fontWeight: 700 }}>
          {profile.markFirst}
          <span>{profile.markSecond}</span>
        </b>
      </a>
      <div className={styles.palette} role="group" aria-label="Paleta neon">
        {palettes.map((p) => (
          <button
            key={p.label}
            type="button"
            style={{ "--c": p.color } as React.CSSProperties}
            aria-pressed={palette === p.value}
            aria-label={p.label}
            onClick={() => onPalette(p.value)}
          />
        ))}
      </div>
      <button className={styles.navbtn} type="button" aria-pressed={classic} title="Versão limpa, sem 3D" onClick={onToggleClassic}>
        <span>👁</span>
        <span className={styles.lbl}>Modo recrutador</span>
      </button>
      <button className={styles.navbtn} type="button" aria-label="Abrir comandos" onClick={onOpenCommands}>
        <span>⌘</span>
        <kbd>Ctrl K</kbd>
      </button>
    </nav>
  );
}
