type Ponto = {
  x: number;
  y: number;
  raio: number;
  coral: boolean;
  opacidade: number;
};

function gerarPontos(quantidade: number): Ponto[] {
  let semente = 9;

  function aleatorio() {
    semente = (semente * 16807) % 2147483647;
    return (semente - 1) / 2147483646;
  }

  return Array.from({ length: quantidade }, () => ({
    x: aleatorio() * 100,
    y: aleatorio() * 100,
    raio: 0.6 + aleatorio() * 0.9,
    coral: aleatorio() < 0.25,
    opacidade: 0.25 + aleatorio() * 0.45,
  }));
}

const pontos = gerarPontos(70);

function FundoEstrelado() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(14,53,157,0.45),transparent_62%),radial-gradient(ellipse_at_0%_100%,rgba(14,53,157,0.25),transparent_55%)]" />

      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_1px,transparent_1px_140px)]" />

      <svg className="absolute inset-0 h-full w-full">
        {pontos.map((ponto, indice) => (
          <circle
            key={indice}
            cx={`${ponto.x}%`}
            cy={`${ponto.y}%`}
            r={ponto.raio}
            fill={ponto.coral ? "#FF606A" : "#FFFFFF"}
            opacity={ponto.opacidade}
          />
        ))}
      </svg>
    </div>
  );
}

export default FundoEstrelado;
