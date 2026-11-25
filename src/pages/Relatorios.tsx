import { useEffect, useState } from "react";
import {
  FileBarChart,
  Download,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  FileQuestion,
  Percent,
  Info,
} from "lucide-react";

import { listarCampanhasApi } from "../services/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../services/detalhesCampanhaService";

import {
  exportarCancelamentosWord,
  exportarCancelamentosPDF,
  exportarCancelamentosExcel,
} from "../services/relatorioCancelamentosService";

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

type FormatoExportacao = "word" | "pdf" | "excel";

type ResultadoConsultaIndicadores = {
  campanhaId: number;
  indicadores: IndicadoresCampanhaApi | null;
  erro: boolean;
};

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;
}

function Relatorios() {
  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);
  const [campanhaId, setCampanhaId] = useState<number | null>(null);

  const [resultadoIndicadores, setResultadoIndicadores] =
    useState<ResultadoConsultaIndicadores | null>(null);

  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [erroCampanhas, setErroCampanhas] = useState(false);

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

        setCampanhas(dados);
        setCampanhaId(dados[0]?.id ?? null);
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
    if (campanhaId === null) {
      return;
    }

    const id = campanhaId;
    let ativo = true;

    async function carregarIndicadores() {
      try {
        const dados = await buscarIndicadoresCampanhaApi(id);

        if (ativo) {
          setResultadoIndicadores({
            campanhaId: id,
            indicadores: dados,
            erro: false,
          });
        }
      } catch (erro) {
        console.error("Erro ao consultar indicadores:", erro);

        if (ativo) {
          setResultadoIndicadores({
            campanhaId: id,
            indicadores: null,
            erro: true,
          });
        }
      }
    }

    void carregarIndicadores();

    return () => {
      ativo = false;
    };
  }, [campanhaId]);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const resultadoAtual =
    resultadoIndicadores?.campanhaId === campanhaId
      ? resultadoIndicadores
      : null;

  const indicadores = resultadoAtual?.indicadores ?? null;
  const erroIndicadores = resultadoAtual?.erro ?? false;

  const carregandoIndicadores = campanhaId !== null && resultadoAtual === null;

  const indicadoresValidos =
    indicadores !== null && indicadores.campanhaId === campanhaId
      ? indicadores
      : null;

  const carregandoDados = carregandoCampanhas || carregandoIndicadores;

  const podeExportar =
    !!campanhaSelecionada &&
    !!indicadoresValidos &&
    !carregandoDados &&
    !erroCampanhas &&
    !erroIndicadores;

  const cards = indicadoresValidos
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

  function selecionarCampanha(id: number) {
    setCampanhaId(id);
    setResultadoIndicadores(null);
    setErroExportacao("");
  }

  async function baixarRelatorio(formato: FormatoExportacao) {
    if (!podeExportar || exportando !== null) {
      return;
    }

    if (!campanhaSelecionada || !indicadoresValidos) {
      return;
    }

    setErroExportacao("");
    setExportando(formato);

    const dados = {
      campanha: campanhaSelecionada,
      indicadores: indicadoresValidos,
    };

    try {
      if (formato === "word") {
        await exportarCancelamentosWord(dados);
      } else if (formato === "pdf") {
        await exportarCancelamentosPDF(dados);
      } else {
        await exportarCancelamentosExcel(dados);
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
        <p className="text-sm text-texto-secundario">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-1 font-titulo text-4xl font-bold">Relatórios</h2>

        <p className="mt-2 text-sm text-texto-secundario">
          Exporte os indicadores de títulos e cancelamentos de uma campanha em
          Word, PDF ou Excel.
        </p>
      </header>

      <section className="rounded-xl border border-borda bg-superficie p-5">
        <label htmlFor="campanha-relatorio" className="text-lg font-semibold">
          Selecionar campanha
        </label>

        <p className="mt-1 text-sm text-texto-secundario">
          Escolha uma das campanhas cadastradas.
        </p>

        <select
          id="campanha-relatorio"
          value={campanhaId ?? ""}
          onChange={(evento) => selecionarCampanha(Number(evento.target.value))}
          disabled={
            exportando !== null ||
            carregandoCampanhas ||
            erroCampanhas ||
            campanhas.length === 0
          }
          className="mt-4 w-full rounded-xl border border-borda bg-superficie p-3 text-sm text-texto outline-none focus:border-destaque disabled:bg-superficie-suave disabled:text-texto-suave"
        >
          {campanhas.length === 0 && (
            <option value="">
              {carregandoCampanhas
                ? "Carregando campanhas..."
                : "Nenhuma campanha disponível"}
            </option>
          )}

          {campanhas.map((campanha) => (
            <option key={campanha.id} value={campanha.id}>
              {campanha.nome}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Resultados da campanha</h3>

          <p className="mt-1 text-sm text-texto-secundario">
            {campanhaSelecionada?.nome ?? "Nenhuma campanha selecionada"}
          </p>
        </div>

        {carregandoDados ? (
          <div
            role="status"
            aria-busy="true"
            className="rounded-xl border border-borda bg-superficie p-5"
          >
            <p className="text-sm text-texto-secundario">Carregando indicadores...</p>
          </div>
        ) : erroCampanhas ? (
          <div
            role="alert"
            className="rounded-xl border border-erro-suave-forte bg-erro-suave p-5"
          >
            <p className="text-sm text-erro">
              Não foi possível consultar as campanhas. Verifique a conexão com o
              backend.
            </p>
          </div>
        ) : erroIndicadores ? (
          <div
            role="alert"
            className="rounded-xl border border-alerta-suave-forte bg-alerta-suave p-5"
          >
            <p className="text-sm text-alerta">
              Não foi possível consultar os indicadores da campanha selecionada.
            </p>
          </div>
        ) : cards.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {cards.map((card) => {
              const Icone = card.icone;

              return (
                <article
                  key={card.titulo}
                  className="min-w-0 rounded-xl border border-borda bg-superficie p-4"
                >
                  <Icone size={21} className="text-destaque" />

                  <p className="mt-2 min-h-10 text-sm text-texto-secundario">
                    {card.titulo}
                  </p>

                  <p className="mt-1 font-titulo text-4xl font-bold">{card.valor}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-borda bg-superficie p-5">
            <p className="text-sm text-texto-secundario">
              Não existem indicadores disponíveis para a campanha selecionada.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-borda bg-superficie p-5">
        <div className="flex items-center gap-3">
          <FileBarChart size={23} className="text-destaque" />

          <h3 className="text-lg font-semibold">Exportar relatório</h3>
        </div>

        <p className="mt-2 text-sm text-texto-secundario">
          Exporte os indicadores da campanha selecionada.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("word")}
            className="flex items-center justify-center gap-2 rounded-xl bg-destaque-suave p-4 text-sm font-semibold text-texto hover:bg-destaque-suave-forte disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={20} />
            <Download size={17} />
            {exportando === "word" ? "Gerando Word..." : "Baixar Word"}
          </button>

          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("pdf")}
            className="flex items-center justify-center gap-2 rounded-xl bg-erro-suave p-4 text-sm font-semibold text-erro hover:bg-erro-suave-forte disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileBarChart size={20} />
            <Download size={17} />
            {exportando === "pdf" ? "Gerando PDF..." : "Baixar PDF"}
          </button>

          <button
            type="button"
            disabled={!podeExportar || exportando !== null}
            onClick={() => void baixarRelatorio("excel")}
            className="flex items-center justify-center gap-2 rounded-xl bg-sucesso-suave p-4 text-sm font-semibold text-sucesso hover:bg-sucesso-suave-forte disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={20} />
            <Download size={17} />
            {exportando === "excel" ? "Gerando Excel..." : "Baixar Excel"}
          </button>
        </div>

        {erroExportacao && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-erro-suave p-3 text-sm text-erro"
          >
            {erroExportacao}
          </p>
        )}
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-destaque-suave-forte bg-destaque-suave p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-destaque" />

        <div>
          <h3 className="text-sm font-semibold">Sobre os dados apresentados</h3>

          <p className="mt-2 text-sm text-texto-secundario">
            Os cancelamentos encontrados não comprovam que foram causados pela
            campanha. A ausência de correspondência nos PDFs também não comprova
            que o título continua ativo ou não foi pago.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Relatorios;
