import type { ReactNode } from "react";
import { sectors, type SectorId } from "../../data/portfolio";
import styles from "./Station.module.css";

interface StationProps {
  id: SectorId;
  /** painel encostado à direita (a cena fica à esquerda) */
  right?: boolean;
  /** mostra o rótulo "Setor 0X · Nome" no topo do painel */
  showSector?: boolean;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
}

/** Uma parada da viagem: seção alta com um painel de vidro. */
export function Station({ id, right, showSector = true, className = "", panelClassName = "", children }: StationProps) {
  const index = sectors.findIndex((s) => s.id === id);
  const sector = sectors[index];

  return (
    <section id={id} data-station className={`${styles.station} ${right ? styles.right : ""} ${className}`}>
      <div className={`${styles.panel} ${panelClassName}`}>
        {showSector && sector && (
          <div className={styles.sector}>
            Setor {String(index).padStart(2, "0")} · {sector.label}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
