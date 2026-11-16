import { FileText, CheckCircle2, FileQuestion, Percent } from "lucide-react";

import type { IndicadoresCampanhaApi } from "../../types/IndicadoresCampanhaApi";

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
      cor: "text-[#183B70]",
    },
    {
      titulo: "Cancelamentos encontrados",
      valor: formatarNumero(indicadores.titulosCancelados),
      icone: CheckCircle2,
      cor: "text-green-600",
    },
    {
      titulo: "Não encontrados nos PDFs",
      valor: formatarNumero(indicadores.naoEncontradosNosPdfs),
      icone: FileQuestion,
      cor: "text-[#F27D70]",
    },
    {
      titulo: "Percentual encontrado",
      valor: `${indicadores.percentualCancelados.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      })}%`,
      icone: Percent,
      cor: "text-[#3F7DD9]",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card) => {
        const Icone = card.icone;

        return (
          <article
            key={card.titulo}
            className="min-w-0 rounded-xl border border-slate-100 bg-white p-4"
          >
            <Icone size={21} className={card.cor} />

            <p className="mt-2 min-h-10 text-sm text-slate-500">
              {card.titulo}
            </p>

            <h3 className="mt-1 text-3xl font-semibold text-[#183B70]">
              {card.valor}
            </h3>
          </article>
        );
      })}
    </section>
  );
}

export default IndicadoresCancelamentos;
