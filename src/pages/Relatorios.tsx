import { useEffect, useState } from "react";
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

import { campanhas as campanhasDemonstrativas } from "../data/campanhas";

import { listarCampanhasApi } from "../services/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../services/detalhesCampanhaService";

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

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

type TipoRelatorio = "cancelamentos" | "contatos";
type FormatoExportacao = "word" | "pdf" | "excel";

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;
}

function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] =
    useState<TipoRelatorio>("cancelamentos");

  const [campanhasReais, setCampanhasReais] = useState<CampanhaApi[]>([]);
  const [campanhaRealId, setCampanhaRealId] = useState<number | null>(null);

  const [campanhaDemoId, setCampanhaDemoId] = useState<number | null>(
    campanhasDemonstrativas[0]?.id ?? null,
  );

  const [indicadoresReais, setIndicadoresReais] =
    useState<IndicadoresCampanhaApi | null>(null);

  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [carregandoIndicadores, setCarregandoIndicadores] = useState(false);

  const [erroCampanhas, setErroCampanhas] = useState(false);
  const [erroIndicadores, setErroIndicadores] = useState(false);

  const [exportando, setExportando] = useState<FormatoExportacao | null>(null);

  const [erroExportacao, setErroExportacao] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarCampanhas() {
      try {
        const dados = await listarCampanhasApi();

        if (!ativo) {
          return;
        }

        setCampanhasReais(dados);
        setCampanhaRealId(dados[0]?.id ?? null);
        setErroCampanhas(false);
      } catch (erro) {
        console.error("Erro ao consultar campanhas:", erro);

        if (ativo) {
          setErroCampanhas(true);
        }
      } finally {
        if (ativo) {
          setCarregandoCampanhas(false);
        }
      }
    }

    void carregarCampanhas();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    setIndicadoresReais(null);
    setErroIndicadores(false);

    if (campanhaRealId === null) {
      setCarregandoIndicadores(false);
      return;
    }

    setCarregandoIndicadores(true);

    async function carregarIndicadores() {
      try {
        const dados = await buscarIndicadoresCampanhaApi(
          campanhaRealId as number,
        );

        if (ativo) {
          setIndicadoresReais(dados);
          setErroIndicadores(false);
        }
      } catch (erro) {
        console.error("Erro ao consultar indicadores:", erro);

        if (ativo) {
          setIndicadoresReais(null);
          setErroIndicadores(true);
        }
      } finally {
        if (ativo) {
          setCarregandoIndicadores(false);
        }
      }
    }

    void carregarIndicadores();

    return () => {
      ativo = false;
    };
  }, [campanhaRealId]);

  const campanhaRealSelecionada = campanhasReais.find(
    (campanha) => campanha.id === campanhaRealId,
  );

  const campanhaDemoSelecionada = campanhasDemonstrativas.find(
    (campanha) => campanha.id === campanhaDemoId,
  );

  const indicadoresValidos =
    indicadoresReais !== null && indicadoresReais.campanhaId === campanhaRealId
      ? indicadoresReais
      : null;

  const relatorioReal = tipoRelatorio === "cancelamentos";

  const campanhaSelecionada = relatorioReal
    ? campanhaRealSelecionada
    : campanhaDemoSelecionada;

  const carregandoDadosReais = carregandoCampanhas || carregandoIndicadores;

  const podeExportar = relatorioReal
    ? !!campanhaRealSelecionada &&
      !!indicadoresValidos &&
      !carregandoDadosReais &&
      !erroCampanhas &&
      !erroIndicadores
    : !!campanhaDemoSelecionada;

  const indicadoresCancelamentos = indicadoresValidos
    ? [
        {
          titulo: "Total de títulos",
          valor: formatarNumero(indicadoresValidos.totalTitulos),
          icone: FileText,
        },
        {
          titulo: "Cancelamentos encontrados",
          valor: formatarNumero(indicadoresValidos.titulosCancelados),
          icone: CheckCircle2,
        },
        {
          titulo: "Não encontrados nos PDFs",
          valor: formatarNumero(indicadoresValidos.naoEncontradosNosPdfs),
          icone: FileQuestion,
        },
        {
          titulo: "Percentual encontrado",
          valor: formatarPercentual(indicadoresValidos.percentualCancelados),
          icone: Percent,
        },
      ]
    : [];

  const indicadoresContatos = campanhaDemoSelecionada
    ? [
        {
          titulo: "Devedores",
          valor: formatarNumero(campanhaDemoSelecionada.devedores),
          icone: Users,
        },
        {
          titulo: "Análises realizadas",
          valor: formatarNumero(campanhaDemoSelecionada.analises),
          icone: ChartNoAxesCombined,
        },
        {
          titulo: "Contatos efetivos",
          valor: formatarNumero(campanhaDemoSelecionada.contatosEfetivos),
          icone: PhoneCall,
        },
        {
          titulo: "Retornos agendados",
          valor: formatarNumero(campanhaDemoSelecionada.retornosAgendados),
          icone: Clock3,
        },
      ]
    : [];

  const indicadoresExibidos = relatorioReal
    ? indicadoresCancelamentos
    : indicadoresContatos;

  function selecionarTipo(tipo: TipoRelatorio) {
    if (exportando !== null) {
      return;
    }

    setTipoRelatorio(tipo);
    setErroExportacao("");
  }

  async function baixarRelatorio(formato: FormatoExportacao) {
    if (!podeExportar || exportando !== null) {
      return;
    }

    setErroExportacao("");
    setExportando(formato);

    try {
      if (relatorioReal) {
        if (!campanhaRealSelecionada || !indicadoresValidos) {
          return;
        }

        const dados = {
          campanha: campanhaRealSelecionada,
          indicadores: indicadoresValidos,
        };

        if (formato === "word") {
          await exportarCancelamentosWord(dados);
        } else if (formato === "pdf") {
          await exportarCancelamentosPDF(dados);
        } else {
          await exportarCancelamentosExcel(dados);
        }
      } else {
        if (!campanhaDemoSelecionada) {
          return;
        }

        if (formato === "word") {
          await exportarWord(campanhaDemoSelecionada);
        } else if (formato === "pdf") {
          await exportarPDF(campanhaDemoSelecionada);
        } else {
          await exportarExcel(campanhaDemoSelecionada);
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

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-lg font-semibold">Tipo de relatório</h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecione as informações que deseja consultar.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <button
            type="button"
            disabled={exportando !== null}
            onClick={() => selecionarTipo("cancelamentos")}
            aria-pressed={relatorioReal}
            className={`rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed ${
              relatorioReal
                ? "border-[#3F7DD9] bg-blue-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            }`}
          >
            <FileText size={23} className="text-[#3F7DD9]" />

            <p className="mt-3 font-semibold">Títulos e Cancelamentos</p>

            <p className="mt-1 text-sm text-slate-500">
              Dados reais das campanhas e cancelamentos encontrados nos PDFs
              importados.
            </p>
          </button>

          <button
            type="button"
            disabled={exportando !== null}
            onClick={() => selecionarTipo("contatos")}
            aria-pressed={!relatorioReal}
            className={`rounded-xl border p-4 text-left transition-colors disabled:cursor-not-allowed ${
              !relatorioReal
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

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <label htmlFor="campanha-relatorio" className="text-lg font-semibold">
          Selecionar campanha
        </label>

        <p className="mt-1 text-sm text-slate-500">
          {relatorioReal
            ? "Escolha uma campanha cadastrada no backend da ÁRIA."
            : "Escolha uma campanha demonstrativa de contatos."}
        </p>

        <select
          id="campanha-relatorio"
          value={
            relatorioReal ? (campanhaRealId ?? "") : (campanhaDemoId ?? "")
          }
          onChange={(evento) => {
            const id = Number(evento.target.value);

            if (relatorioReal) {
              setCampanhaRealId(id);
            } else {
              setCampanhaDemoId(id);
            }

            setErroExportacao("");
          }}
          disabled={
            exportando !== null ||
            (relatorioReal && (carregandoCampanhas || erroCampanhas)) ||
            (relatorioReal
              ? campanhasReais.length === 0
              : campanhasDemonstrativas.length === 0)
          }
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#183B70] outline-none focus:border-[#3F7DD9] disabled:bg-slate-50 disabled:text-slate-400"
        >
          {relatorioReal ? (
            <>
              {campanhasReais.length === 0 && (
                <option value="">
                  {carregandoCampanhas
                    ? "Carregando campanhas..."
                    : "Nenhuma campanha disponível"}
                </option>
              )}

              {campanhasReais.map((campanha) => (
                <option key={campanha.id} value={campanha.id}>
                  {campanha.nome}
                </option>
              ))}
            </>
          ) : (
            <>
              {campanhasDemonstrativas.length === 0 && (
                <option value="">
                  Nenhuma campanha demonstrativa disponível
                </option>
              )}

              {campanhasDemonstrativas.map((campanha) => (
                <option key={campanha.id} value={campanha.id}>
                  {campanha.nome}
                </option>
              ))}
            </>
          )}
        </select>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Resultados da campanha</h3>

          <p className="mt-1 text-sm text-slate-500">
            {campanhaSelecionada?.nome ?? "Nenhuma campanha selecionada"}
          </p>
        </div>

        {relatorioReal && carregandoDadosReais ? (
          <div
            role="status"
            aria-busy="true"
            className="rounded-xl border border-slate-100 bg-white p-5"
          >
            <p className="text-sm text-slate-500">
              Carregando indicadores reais...
            </p>
          </div>
        ) : relatorioReal && erroCampanhas ? (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-5"
          >
            <p className="text-sm text-red-700">
              Não foi possível consultar as campanhas. Verifique a conexão com o
              backend.
            </p>
          </div>
        ) : relatorioReal && erroIndicadores ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-100 bg-amber-50 p-5"
          >
            <p className="text-sm text-amber-800">
              Não foi possível consultar os indicadores da campanha selecionada.
            </p>
          </div>
        ) : indicadoresExibidos.length > 0 ? (
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

        {!relatorioReal && (
          <p className="text-sm text-amber-700">
            Estes indicadores são fictícios e servem apenas para demonstração.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex items-center gap-3">
          <FileBarChart size={23} className="text-[#3F7DD9]" />

          <h3 className="text-lg font-semibold">Exportar relatório</h3>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {relatorioReal
            ? "Exporte os indicadores reais da campanha selecionada."
            : "Exporte um relatório demonstrativo de contatos."}
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

      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <div>
          <h3 className="text-sm font-semibold">Sobre os dados apresentados</h3>

          <p className="mt-2 text-sm text-slate-600">
            {relatorioReal
              ? "Os cancelamentos encontrados não comprovam que foram causados pela campanha. A ausência de correspondência nos PDFs também não comprova que o título continua ativo ou não foi pago."
              : "Os relatórios de contatos e atendimentos utilizam dados fictícios. Seus indicadores não representam pagamentos ou valores efetivamente arrecadados."}
          </p>
        </div>
      </section>

      <p className="text-sm text-slate-400">
        {relatorioReal
          ? "Indicadores consultados no backend da ÁRIA."
          : "Ambiente demonstrativo — relatórios com dados fictícios."}
      </p>
    </div>
  );
}

export default Relatorios;
