import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight, Info } from "lucide-react";

import GraficoCampanhas from "../components/charts/GraficoCampanhas";
import IndicadoresCancelamentos from "../components/analises/IndicadoresCancelamentos";

import { listarCampanhasApi } from "../services/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../services/detalhesCampanhaService";

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;
}

function Dashboard() {
  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);
  const [campanhaId, setCampanhaId] = useState<number | null>(null);

  const [indicadoresPorCampanha, setIndicadoresPorCampanha] = useState<
    Record<number, IndicadoresCampanhaApi>
  >({});

  const [falhasIndicadores, setFalhasIndicadores] = useState<Set<number>>(
    new Set(),
  );

  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [carregandoIndicadores, setCarregandoIndicadores] = useState(true);
  const [erroCampanhas, setErroCampanhas] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const campanhasApi = await listarCampanhasApi();

        if (!ativo) {
          return;
        }

        setCampanhas(campanhasApi);
        setCampanhaId(campanhasApi[0]?.id ?? null);
        setErroCampanhas(false);
        setCarregandoCampanhas(false);

        const resultados = await Promise.allSettled(
          campanhasApi.map((campanha) =>
            buscarIndicadoresCampanhaApi(campanha.id),
          ),
        );

        if (!ativo) {
          return;
        }

        const indicadores: Record<number, IndicadoresCampanhaApi> = {};
        const falhas = new Set<number>();

        resultados.forEach((resultado, indice) => {
          const campanha = campanhasApi[indice];

          if (resultado.status === "fulfilled") {
            indicadores[campanha.id] = resultado.value;
          } else {
            falhas.add(campanha.id);

            console.error(
              `Erro ao carregar indicadores da campanha ${campanha.id}:`,
              resultado.reason,
            );
          }
        });

        setIndicadoresPorCampanha(indicadores);
        setFalhasIndicadores(falhas);
      } catch (erro) {
        console.error("Erro ao carregar campanhas:", erro);

        if (ativo) {
          setErroCampanhas(true);
        }
      } finally {
        if (ativo) {
          setCarregandoCampanhas(false);
          setCarregandoIndicadores(false);
        }
      }
    }

    void carregarDados();

    return () => {
      ativo = false;
    };
  }, []);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const indicadoresSelecionados =
    campanhaId !== null ? indicadoresPorCampanha[campanhaId] : undefined;

  const falhaIndicadoresSelecionados =
    campanhaId !== null && falhasIndicadores.has(campanhaId);

  function exibirTotalCampanhas(): string {
    if (carregandoCampanhas) {
      return "...";
    }

    if (erroCampanhas) {
      return "—";
    }

    return formatarNumero(campanhas.length);
  }

  function exibirValor(
    campanhaIdConsulta: number,
    campo:
      | "totalTitulos"
      | "titulosCancelados"
      | "naoEncontradosNosPdfs"
      | "percentualCancelados",
  ): string {
    const indicadores = indicadoresPorCampanha[campanhaIdConsulta];

    if (indicadores) {
      const valor = indicadores[campo];

      if (campo === "percentualCancelados") {
        return formatarPercentual(valor);
      }

      return formatarNumero(valor);
    }

    if (falhasIndicadores.has(campanhaIdConsulta)) {
      return "Indisponível";
    }

    if (carregandoIndicadores) {
      return "Carregando...";
    }

    return "—";
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Painel de Inteligência</p>

        <h2 className="mt-1 text-3xl font-semibold">Visão Geral</h2>

        <p className="mt-1 text-base text-slate-500">
          Acompanhe as campanhas cadastradas e os indicadores de cancelamentos
          encontrados nos arquivos importados.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article
          className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5"
          aria-busy={carregandoCampanhas}
        >
          <div className="rounded-xl bg-blue-50 p-3">
            <FolderKanban size={25} className="text-[#3F7DD9]" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Campanhas cadastradas</p>

            <p className="mt-1 text-3xl font-semibold">
              {exibirTotalCampanhas()}
            </p>
          </div>
        </article>

        <article className="rounded-xl border border-slate-100 bg-white p-5 lg:col-span-2">
          <label
            htmlFor="campanha-dashboard"
            className="block text-sm font-semibold"
          >
            Campanha selecionada
          </label>

          <select
            id="campanha-dashboard"
            value={campanhaId ?? ""}
            onChange={(evento) => setCampanhaId(Number(evento.target.value))}
            disabled={
              carregandoCampanhas || erroCampanhas || campanhas.length === 0
            }
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3F7DD9] disabled:bg-slate-50 disabled:text-slate-400"
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

          <p className="mt-2 text-sm text-slate-500">
            Selecione uma campanha para visualizar seus indicadores de
            cancelamentos.
          </p>
        </article>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-semibold">Indicadores da Campanha</h3>

            <p className="mt-1 text-sm text-slate-500">
              {campanhaSelecionada?.nome ?? "Nenhuma campanha selecionada"}
            </p>
          </div>

          {campanhaSelecionada && (
            <Link
              to={`/campanhas/${campanhaSelecionada.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
            >
              Ver detalhes
              <ArrowRight size={17} />
            </Link>
          )}
        </div>

        {carregandoCampanhas || carregandoIndicadores ? (
          indicadoresSelecionados ? (
            <IndicadoresCancelamentos indicadores={indicadoresSelecionados} />
          ) : (
            <div
              role="status"
              className="rounded-xl border border-slate-100 bg-white p-5"
            >
              <p className="text-sm text-slate-500">
                Carregando indicadores de cancelamentos...
              </p>
            </div>
          )
        ) : erroCampanhas ? (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-5"
          >
            <p className="text-sm text-red-700">
              Não foi possível consultar as campanhas. Verifique a conexão com o
              backend.
            </p>
          </div>
        ) : indicadoresSelecionados ? (
          <IndicadoresCancelamentos indicadores={indicadoresSelecionados} />
        ) : falhaIndicadoresSelecionados ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-100 bg-amber-50 p-5"
          >
            <p className="text-sm text-amber-800">
              Não foi possível carregar os indicadores desta campanha. Os demais
              dados disponíveis continuam sendo exibidos.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-sm text-slate-500">
              Nenhum indicador disponível para esta campanha.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Resumo das Campanhas</h3>

            <p className="mt-1 text-sm text-slate-500">
              Comparação dos indicadores reais de títulos e cancelamentos
              encontrados nos PDFs importados.
            </p>
          </div>

          <Link
            to="/campanhas"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
          >
            Todas as campanhas
            <ArrowRight size={17} />
          </Link>
        </div>

        <div
          className="mt-5 overflow-x-auto"
          aria-busy={carregandoCampanhas || carregandoIndicadores}
        >
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">Campanha</th>

                <th className="px-3 py-3 font-medium">Total de títulos</th>

                <th className="px-3 py-3 font-medium">
                  Cancelamentos encontrados
                </th>

                <th className="px-3 py-3 font-medium">
                  Não encontrados nos PDFs
                </th>

                <th className="px-3 py-3 font-medium">Percentual encontrado</th>

                <th className="px-3 py-3 font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregandoCampanhas && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    Carregando campanhas...
                  </td>
                </tr>
              )}

              {!carregandoCampanhas && erroCampanhas && (
                <tr>
                  <td
                    colSpan={6}
                    role="alert"
                    className="px-3 py-8 text-center text-red-600"
                  >
                    Não foi possível consultar as campanhas.
                  </td>
                </tr>
              )}

              {!carregandoCampanhas &&
                !erroCampanhas &&
                campanhas.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 py-8 text-center text-slate-400"
                    >
                      Nenhuma campanha cadastrada.
                    </td>
                  </tr>
                )}

              {!carregandoCampanhas &&
                !erroCampanhas &&
                campanhas.map((campanha) => (
                  <tr
                    key={campanha.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-3 py-4 font-medium">{campanha.nome}</td>

                    <td className="px-3 py-4">
                      {exibirValor(campanha.id, "totalTitulos")}
                    </td>

                    <td className="px-3 py-4">
                      {exibirValor(campanha.id, "titulosCancelados")}
                    </td>

                    <td className="px-3 py-4">
                      {exibirValor(campanha.id, "naoEncontradosNosPdfs")}
                    </td>

                    <td className="px-3 py-4">
                      {exibirValor(campanha.id, "percentualCancelados")}
                    </td>

                    <td className="px-3 py-4">
                      <Link
                        to={`/campanhas/${campanha.id}`}
                        className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-[#3F7DD9] hover:underline"
                      >
                        Detalhes
                        <ArrowRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <h3 className="text-lg font-semibold">
          Evolução das Análises de Contatos
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Visualização histórica demonstrativa. Os dados de contatos ainda não
          possuem integração confirmada com o backend.
        </p>

        <div className="mt-5">
          <GraficoCampanhas />
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <p className="text-sm text-slate-600">
          Os cancelamentos encontrados não comprovam que foram causados pelas
          campanhas. Títulos não encontrados nos PDFs também não devem ser
          considerados automaticamente ativos ou não pagos.
        </p>
      </section>

      <p className="text-sm text-slate-400">
        Campanhas e indicadores de cancelamentos consultados no backend da ÁRIA.
        O gráfico de contatos permanece demonstrativo.
      </p>
    </div>
  );
}

export default Dashboard;
