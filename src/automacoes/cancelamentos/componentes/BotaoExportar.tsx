import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";

import { usePainelFlutuante } from "../../../compartilhado/hooks/usePainelFlutuante";
import type { CampanhaApi } from "../tipos/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../tipos/IndicadoresCampanhaApi";

type Formato = "word" | "pdf" | "excel";

const opcoes: { formato: Formato; nome: string; icone: LucideIcon }[] = [
  { formato: "word", nome: "Word (.docx)", icone: FileText },
  { formato: "pdf", nome: "PDF", icone: FileText },
  { formato: "excel", nome: "Excel (.xlsx)", icone: FileSpreadsheet },
];

type BotaoExportarProps = {
  campanha: CampanhaApi;
  indicadores: IndicadoresCampanhaApi;
};

function BotaoExportar({ campanha, indicadores }: BotaoExportarProps) {
  const { aberto, referencia, alternar, fechar } = usePainelFlutuante();
  const [exportando, setExportando] = useState<Formato | null>(null);
  const [erro, setErro] = useState("");

  async function exportar(formato: Formato) {
    fechar();
    setErro("");
    setExportando(formato);

    try {
      const servico = await import("../servicos/relatorioCancelamentosService");
      const dados = { campanha, indicadores };

      if (formato === "word") {
        await servico.exportarCancelamentosWord(dados);
      } else if (formato === "pdf") {
        await servico.exportarCancelamentosPDF(dados);
      } else {
        await servico.exportarCancelamentosExcel(dados);
      }
    } catch (erroExportacao) {
      console.error("Erro ao exportar relatório:", erroExportacao);
      setErro("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setExportando(null);
    }
  }

  return (
    <div ref={referencia} className="relative sm:text-right">
      <button
        type="button"
        onClick={alternar}
        disabled={exportando !== null}
        aria-expanded={aberto}
        aria-controls="menu-exportar"
        className="inline-flex items-center gap-2 rounded-lg bg-marca px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-marca-forte disabled:cursor-wait disabled:opacity-70"
      >
        <Download size={17} />

        {exportando ? "Gerando relatório..." : "Exportar"}

        <ChevronDown size={16} />
      </button>

      {aberto && (
        <div
          id="menu-exportar"
          className="absolute left-0 top-12 z-20 w-56 rounded-xl border border-borda bg-superficie p-2 text-left shadow-xl sm:left-auto sm:right-0"
        >
          {opcoes.map((opcao) => {
            const Icone = opcao.icone;

            return (
              <button
                key={opcao.formato}
                type="button"
                onClick={() => void exportar(opcao.formato)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-texto transition-colors hover:bg-superficie-suave"
              >
                <Icone size={17} className="shrink-0 text-texto-secundario" />

                {opcao.nome}
              </button>
            );
          })}
        </div>
      )}

      {erro && (
        <p role="alert" className="mt-2 text-sm text-erro">
          {erro}
        </p>
      )}
    </div>
  );
}

export default BotaoExportar;
