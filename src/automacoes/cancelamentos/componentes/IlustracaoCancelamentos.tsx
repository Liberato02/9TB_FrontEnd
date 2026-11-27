type IlustracaoCancelamentosProps = {
  className?: string;
};

const linhas = [
  { marcada: true, largura: 120 },
  { marcada: true, largura: 96 },
  { marcada: false, largura: 132 },
  { marcada: true, largura: 104 },
  { marcada: false, largura: 84 },
  { marcada: false, largura: 116 },
];

function IlustracaoCancelamentos({ className }: IlustracaoCancelamentosProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="60 20 380 340"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="110"
        y="64"
        width="200"
        height="262"
        rx="14"
        transform="rotate(-9 210 195)"
        strokeWidth="2"
        className="fill-superficie-suave stroke-borda-forte"
      />

      <rect
        x="180"
        y="52"
        width="200"
        height="262"
        rx="14"
        transform="rotate(6 280 183)"
        strokeWidth="2"
        className="fill-superficie-suave stroke-borda-forte"
      />

      <rect
        x="140"
        y="40"
        width="214"
        height="284"
        rx="16"
        strokeWidth="2"
        className="fill-superficie stroke-borda-forte"
      />

      <rect
        x="164"
        y="66"
        width="92"
        height="12"
        rx="6"
        className="fill-marca"
      />

      {linhas.map((linha, indice) => {
        const y = 104 + indice * 34;

        return (
          <g key={y}>
            {linha.marcada ? (
              <>
                <rect
                  x="164"
                  y={y}
                  width="18"
                  height="18"
                  rx="5"
                  className="fill-coral"
                />
                <path
                  d={`M168 ${y + 9.5} l3.5 3.5 l7 -7.5`}
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-noite"
                />
              </>
            ) : (
              <rect
                x="165"
                y={y + 1}
                width="16"
                height="16"
                rx="4.5"
                fill="none"
                strokeWidth="2"
                className="stroke-borda-forte"
              />
            )}

            <rect
              x="194"
              y={y + 4}
              width={indice === 2 ? 128 : linha.largura}
              height="10"
              rx="5"
              className={
                linha.marcada ? "fill-texto-suave" : "fill-borda-forte"
              }
            />
          </g>
        );
      })}

      <circle cx="352" cy="292" r="50" className="fill-coral" />

      <circle
        cx="352"
        cy="292"
        r="39"
        fill="none"
        strokeWidth="2"
        strokeDasharray="5 6"
        className="stroke-noite opacity-40"
      />

      <path
        d="M333 292 l13 13 l25 -27"
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-noite"
      />
    </svg>
  );
}

export default IlustracaoCancelamentos;
