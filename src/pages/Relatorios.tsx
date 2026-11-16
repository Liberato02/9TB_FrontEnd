import { useState } from "react";
import {
  FileBarChart,
  Download,
  FileText,
  FileSpreadsheet,
  Users,
  ChartNoAxesCombined,
  PhoneCall,
  Clock3,
  CheckCircle2,
  FileQuestion,
  Percent,
  Info,
} from "lucide-react";

import { campanhas } from "../data/campanhas";
import { detalhesCampanhasMock } from "../data/detalhesCampanhasMock";

import {
  exportarWord,
  exportarPDF,
  exportarExcel,
} from "../services/relatorioService";

import {
  exportarCancelamentosWord,
  exportarCancelamentosPDF,
  exportarCancelamentosExcel,
} from "../services/relatorioCancelamentosService";

type TipoRelatorio = "cancelamentos" | "contatos";
type FormatoExportacao = "word" | "pdf" | "excel";

function Relatorios() {
  const [campanhaId, setCampanhaId] = useState<number>(campanhas[0]?.id ?? 0);

  const [tipoRelatorio, setTipoRelatorio] =
    useState<TipoRelatorio>("cancelamentos");

  const [exportando, setExportando] = useState<FormatoExportacao | null>(null);

  const [erroExportacao, setErroExportacao] = useState("");

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const detalhes = detalhesCampanhasMock[campanhaId];

  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const formatarPercentual = (valor: number) =>
    `${valor.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })}%`;

  const indicadoresCancelamentos = detalhes
    ? [
        {
          titulo: "Total de títulos",
          valor: formatarNumero(detalhes.indicadores.totalTitulos),
          icone: FileText,
        },
        {
          titulo: "Cancelamentos encontrados",
          valor: formatarNumero(detalhes.indicadores.titulosCancelados),
          icone: CheckCircle2,
        },
        {
          titulo: "Não encontrados nos PDFs",
          valor: formatarNumero(detalhes.indicadores.naoEncontradosNosPdfs),
          icone: FileQuestion,
        },
        {
          titulo: "Percentual encontrado",
          valor: formatarPercentual(detalhes.indicadores.percentualCancelados),
          icone: Percent,
        },
      ]
    : [];

  const indicadoresContatos = campanhaSelecionada
    ? [
        {
          titulo: "Devedores",
          valor: formatarNumero(campanhaSelecionada.devedores),
          icone: Users,
        },
        {
          titulo: "Análises realizadas",
          valor: formatarNumero(campanhaSelecionada.analises),
          icone: ChartNoAxesCombined,
        },
        {
          titulo: "Contatos efetivos",
          valor: formatarNumero(campanhaSelecionada.contatosEfetivos),
          icone: PhoneCall,
        },
        {
          titulo: "Retornos agendados",
          valor: formatarNumero(campanhaSelecionada.retornosAgendados),
          icone: Clock3,
        },
      ]
    : [];

  const indicadoresExibidos =
    tipoRelatorio === "cancelamentos"
      ? indicadoresCancelamentos
      : indicadoresContatos;

  const podeExportar =
    !!campanhaSelecionada && (tipoRelatorio === "contatos" || !!detalhes);

  async function baixarRelatorio(formato: FormatoExportacao) {
    if (!campanhaSelecionada || !podeExportar || exportando) {
      return;
    }

    setErroExportacao("");
    setExportando(formato);

    try {
      if (tipoRelatorio === "cancelamentos") {
        if (!detalhes) return;

        const dados = {
          campanha: campanhaSelecionada,
          indicadores: detalhes.indicadores,
        };

        if (formato === "word") {
          await exportarCancelamentosWord(dados);
        } else if (formato === "pdf") {
          await exportarCancelamentosPDF(dados);
        } else {
          await exportarCancelamentosExcel(dados);
        }
      } else {
        if (formato === "word") {
          await exportarWord(campanhaSelecionada);
        } else if (formato === "pdf") {
          await exportarPDF(campanhaSelecionada);
        } else {
          await exportarExcel(campanhaSelecionada);
        }
      }
    } catch (erro) {
      console.error("Erro ao exportar relatório:", erro);

      setErroExportacao("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
      setExportando(null);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-1 text-3xl font-semibold">Relatórios</h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte indicadores das campanhas e exporte relatórios em Word, PDF e
          Excel.
        </p>
      </header>

      {/* TIPO DE RELATÓRIO */}
      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-lg font-semibold">Tipo de relatório</h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecione as informações que deseja consultar.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setTipoRelatorio("cancelamentos");
              setErroExportacao("");
            }}
            aria-pressed={tipoRelatorio === "cancelamentos"}
            className={`rounded-xl border p-4 text-left transition-colors ${
              tipoRelatorio === "cancelamentos"
                ? "border-[#3F7DD9] bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <FileText size={23} className="text-[#3F7DD9]" />

            <p className="mt-3 font-semibold">Títulos e Cancelamentos</p>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores de títulos associados às campanhas e cancelamentos
              encontrados nos PDFs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setTipoRelatorio("contatos");
              setErroExportacao("");
            }}
            aria-pressed={tipoRelatorio === "contatos"}
            className={`rounded-xl border p-4 text-left transition-colors ${
              tipoRelatorio === "contatos"
                ? "border-[#3F7DD9] bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <PhoneCall size={23} className="text-[#F27D70]" />

            <p className="mt-3 font-semibold">Contatos e Atendimentos</p>

            <p className="mt-1 text-sm text-slate-500">
              Relatórios demonstrativos de contatos, análises e retornos
              agendados.
            </p>
          </button>
        </div>
      </section>

      {/* SELEÇÃO DA CAMPANHA */}
      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <label htmlFor="campanha-relatorio" className="text-lg font-semibold">
          Selecionar campanha
        </label>

        <p className="mt-1 text-sm text-slate-500">
          Escolha a campanha para consultar seus resultados.
        </p>

        <select
          id="campanha-relatorio"
          value={campanhaId}
          onChange={(evento) => {
            setCampanhaId(Number(evento.target.value));
            setErroExportacao("");
          }}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#183B70] outline-none focus:border-[#3F7DD9]"
        >
          {campanhas.length === 0 && (
            <option value={0}>Nenhuma campanha disponível</option>
          )}

          {campanhas.map((campanha) => (
            <option key={campanha.id} value={campanha.id}>
              {campanha.nome}
            </option>
          ))}
        </select>
      </section>

      {/* INDICADORES */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Resultados da campanha</h3>

          <p className="mt-1 text-sm text-slate-500">
            {campanhaSelecionada?.nome ?? "Nenhuma campanha selecionada"}
          </p>
        </div>

        {indicadoresExibidos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {indicadoresExibidos.map((indicador) => {
              const Icone = indicador.icone;

              return (
                <article
                  key={indicador.titulo}
                  className="min-w-0 rounded-xl border border-slate-100 bg-white p-4"
                >
                  <Icone size={21} className="text-[#3F7DD9]" />

                  <p className="mt-2 min-h-10 text-sm text-slate-500">
                    {indicador.titulo}
                  </p>

                  <p className="mt-1 text-3xl font-semibold">
                    {indicador.valor}
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-sm text-slate-500">
              Não existem indicadores disponíveis para a campanha selecionada.
            </p>
          </div>
        )}
      </section>

      {/* EXPORTAÇÃO */}
      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex items-center gap-3">
          <FileBarChart size={23} className="text-[#3F7DD9]" />

          <h3 className="text-lg font-semibold">Exportar relatório</h3>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Baixe o relatório selecionado no formato desejado.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("word")}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-[#183B70] hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={20} />
            <Download size={17} />
            {exportando === "word" ? "Gerando Word..." : "Baixar Word"}
          </button>

          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("pdf")}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileBarChart size={20} />
            <Download size={17} />
            {exportando === "pdf" ? "Gerando PDF..." : "Baixar PDF"}
          </button>

          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("excel")}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-700 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={20} />
            <Download size={17} />
            {exportando === "excel" ? "Gerando Excel..." : "Baixar Excel"}
          </button>
        </div>

        {erroExportacao && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
          >
            {erroExportacao}
          </p>
        )}
      </section>

      {/* INFORMAÇÕES IMPORTANTES */}
      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <div>
          <h3 className="text-sm font-semibold">Sobre os dados apresentados</h3>

          <p className="mt-2 text-sm text-slate-600">
            {tipoRelatorio === "cancelamentos"
              ? "Os cancelamentos encontrados não comprovam que foram causados pela campanha. A ausência de correspondência nos PDFs também não comprova que o título continua ativo ou não foi pago."
              : "Os indicadores de contatos e atendimentos são demonstrativos e não representam, por si só, pagamentos ou valores arrecadados."}
          </p>
        </div>
      </section>

      <p className="text-sm text-slate-400">
        Ambiente demonstrativo — relatórios com dados fictícios.
      </p>
    </div>
  );
}

export default Relatorios;
