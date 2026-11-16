import { CheckCircle2, FileSpreadsheet, FileText } from "lucide-react";

import type { ImportacaoCsvApi } from "../../types/ImportacaoCsvApi";
import type { ImportacaoPdfApi } from "../../types/ImportacaoPdfApi";

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
    <section className="rounded-xl border border-green-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <CheckCircle2 size={24} className="text-green-600" />

        <div>
          <h3 className="text-lg font-semibold">Resultado da importação</h3>

          <p className="text-sm text-slate-500">
            {isCsv
              ? "Resumo da importação de títulos"
              : "Resumo da importação de cancelamentos"}
          </p>
        </div>
      </div>

      {isCsv && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 p-4">
          <FileSpreadsheet size={22} className="text-[#3F7DD9]" />

          <div>
            <p className="text-sm text-slate-500">Campanha criada</p>

            <p className="font-semibold">{props.resultado.campanhaNome}</p>

            <p className="text-xs text-slate-500">
              ID: {props.resultado.campanhaId}
            </p>
          </div>
        </div>
      )}

      {!isCsv && (
        <div className="mt-5 flex items-center gap-3 rounded-lg bg-orange-50 p-4">
          <FileText size={22} className="text-[#F27D70]" />

          <p className="text-sm text-slate-600">
            Registros de cancelamentos processados
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {itens.map((item) => (
          <div key={item.titulo} className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{item.titulo}</p>

            <p className="mt-2 text-2xl font-semibold text-[#183B70]">
              {formatarNumero(item.valor)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResultadoImportacao;
