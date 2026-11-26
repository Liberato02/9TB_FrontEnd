import { FileText, CheckCircle2, FileQuestion, Percent } from "lucide-react";

import type { IndicadoresCampanhaApi } from "../tipos/IndicadoresCampanhaApi";

type Props = {
  indicadores: IndicadoresCampanhaApi;
};

function IndicadoresCancelamentos({ indicadores }: Props) {
  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const cards = [
    {
      titulo: "Total de títulos",
      valor: formatarNumero(indicadores.totalTitulos),
      icone: FileText,
      cor: "text-texto",
    },
    {
      titulo: "Cancelamentos encontrados",
      valor: formatarNumero(indicadores.titulosCancelados),
      icone: CheckCircle2,
      cor: "text-sucesso",
    },
    {
      titulo: "Não encontrados nos PDFs",
      valor: formatarNumero(indicadores.naoEncontradosNosPdfs),
      icone: FileQuestion,
      cor: "text-coral-texto",
    },
    {
      titulo: "Percentual encontrado",
      valor: `${indicadores.percentualCancelados.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      })}%`,
      icone: Percent,
      cor: "text-destaque",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card) => {
        const Icone = card.icone;

        return (
          <article
            key={card.titulo}
            className="min-w-0 rounded-xl border border-borda bg-superficie p-4"
          >
            <Icone size={21} className={card.cor} />

            <p className="mt-2 min-h-10 text-sm text-texto-secundario">
              {card.titulo}
            </p>

            <h3 className="mt-1 font-titulo text-4xl font-bold text-texto">
              {card.valor}
            </h3>
          </article>
        );
      })}
    </section>
  );
}

export default IndicadoresCancelamentos;
