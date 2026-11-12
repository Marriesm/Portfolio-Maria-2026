interface DogProps {
  className?: string;
  tailClassName?: string;
  onClick?: () => void;
}

/** Byte, o cachorrinho dev: orelhas caídas, coleira lilás com plaquinha verde e rabo abanando. */
export function Dog({ className, tailClassName, onClick }: DogProps) {
  return (
    <svg viewBox="0 0 160 150" className={className} role="img" aria-label="Byte, cachorrinho" onClick={onClick}>
      {/* rabo */}
      <g className={tailClassName}>
        <path d="M118 112c14-4 22-18 20-32" fill="none" stroke="#c98d5a" strokeWidth="10" strokeLinecap="round" />
      </g>
      {/* corpo */}
      <ellipse cx="88" cy="118" rx="38" ry="26" fill="#e3ad78" />
      <ellipse cx="88" cy="126" rx="22" ry="16" fill="#f6dcc0" />
      {/* patas */}
      <ellipse cx="68" cy="140" rx="11" ry="7" fill="#f6dcc0" />
      <ellipse cx="106" cy="140" rx="11" ry="7" fill="#f6dcc0" />
      {/* orelhas */}
      <path d="M44 38c-14 4-20 30-10 44 6 8 16 2 18-8l4-30z" fill="#9b6338" />
      <path d="M116 38c14 4 20 30 10 44-6 8-16 2-18-8l-4-30z" fill="#9b6338" />
      {/* cabeça */}
      <ellipse cx="80" cy="58" rx="38" ry="35" fill="#e3ad78" />
      <ellipse cx="80" cy="74" rx="22" ry="16" fill="#f6dcc0" />
      <ellipse cx="62" cy="38" rx="10" ry="8" fill="#c98d5a" opacity="0.6" />
      {/* olhos */}
      <circle cx="64" cy="54" r="6.5" fill="#1c1232" />
      <circle cx="96" cy="54" r="6.5" fill="#1c1232" />
      <circle cx="66" cy="51.5" r="2.2" fill="#fff" />
      <circle cx="98" cy="51.5" r="2.2" fill="#fff" />
      {/* bochechas */}
      <ellipse cx="54" cy="68" rx="6" ry="3.5" fill="#f5a8e0" opacity="0.8" />
      <ellipse cx="106" cy="68" rx="6" ry="3.5" fill="#f5a8e0" opacity="0.8" />
      {/* focinho e língua */}
      <ellipse cx="80" cy="66" rx="7" ry="5" fill="#1c1232" />
      <path d="M80 71v5M72 76c4 4 12 4 16 0" fill="none" stroke="#1c1232" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M76 78h8v6a4 4 0 0 1-8 0z" fill="#f07ab8" />
      {/* coleira */}
      <path d="M52 90c18 10 38 10 56 0" fill="none" stroke="#b794ff" strokeWidth="7" strokeLinecap="round" />
      <circle cx="80" cy="99" r="6" fill="#3ee89a" />
      <text x="80" y="101.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="#130d22" fontFamily="monospace">
        {"</>"}
      </text>
    </svg>
  );
}
