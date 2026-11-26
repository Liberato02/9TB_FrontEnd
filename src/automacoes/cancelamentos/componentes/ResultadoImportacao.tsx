import { CheckCircle2, FileSpreadsheet, FileText } from "lucide-react";

import type { ImportacaoCsvApi } from "../tipos/ImportacaoCsvApi";
import type { ImportacaoPdfApi } from "../tipos/ImportacaoPdfApi";

type ResultadoImportacaoProps =
  | {
      tipo: "csv";
      resultado: ImportacaoCsvApi;
    }
  | {
      tipo: "pdf";
      resultado: ImportacaoPdfApi;
    };

function ResultadoImportacao(props: ResultadoImportacaoProps) {
  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const isCsv = props.tipo === "csv";

  const itens = isCsv
    ? [
        {
          titulo: "Títulos novos",
          valor: props.resultado.titulosNovos,
        },
        {
          titulo: "Títulos existentes",
          valor: props.resultado.titulosExistentes,
        },
        {
          titulo: "Títulos associados",
          valor: props.resultado.titulosAssociados,
        },
        {
          titulo: "Duplicados no CSV",
          valor: props.resultado.duplicadosNoCsv,
        },
      ]
    : [
        {
          titulo: "Registros lidos",
          valor: props.resultado.totalLidos,
        },
        {
          titulo: "Cancelamentos novos",
          valor: props.resultado.novos,
        },
        {
          titulo: "Cancelamentos existentes",
          valor: props.resultado.existentes,
        },
      ];

  return (
    <section className="rounded-xl border border-sucesso-suave-forte bg-superficie p-5">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={24} className="text-sucesso" />

        <div>
          <h3 className="text-lg font-semibold">Resultado da importação</h3>

          <p className="text-sm text-texto-secundario">
            {isCsv
              ? "Resumo da importação de títulos"
              : "Resumo da importação de cancelamentos"}
          </p>
        </div>
      </div>

      {isCsv && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-destaque-suave p-4">
          <FileSpreadsheet size={22} className="text-destaque" />

          <div>
            <p className="text-sm text-texto-secundario">Campanha criada</p>

            <p className="font-semibold">{props.resultado.campanhaNome}</p>

            <p className="text-xs text-texto-secundario">
              ID: {props.resultado.campanhaId}
            </p>
          </div>
        </div>
      )}

      {!isCsv && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-coral-suave p-4">
          <FileText size={22} className="text-coral-texto" />

          <p className="text-sm text-texto-secundario">
            Registros de cancelamentos processados
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {itens.map((item) => (
          <div key={item.titulo} className="rounded-lg bg-superficie-suave p-4">
            <p className="text-sm text-texto-secundario">{item.titulo}</p>

            <p className="mt-2 font-titulo text-3xl font-bold text-texto">
              {formatarNumero(item.valor)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResultadoImportacao;
