import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";

import IndicadoresCancelamentos from "../componentes/IndicadoresCancelamentos";

import { listarCampanhasApi } from "../servicos/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../servicos/detalhesCampanhaService";

import type { CampanhaApi } from "../tipos/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../tipos/IndicadoresCampanhaApi";

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number): string {
  return `${valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;
}

function formatarData(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Não informado";
  }

  return data.toLocaleDateString("pt-BR", {
    timeZone: valor.length === 10 ? "UTC" : undefined,
  });
}

function encontrarMaisRecente(
  campanhas: CampanhaApi[],
): CampanhaApi | undefined {
  return campanhas.reduce<CampanhaApi | undefined>(
    (recente, campanha) =>
      !recente ||
      Date.parse(campanha.dataCriacao) > Date.parse(recente.dataCriacao)
        ? campanha
        : recente,
    undefined,
  );
}

function VisaoGeral() {
  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);
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

  const campanhaRecente = encontrarMaisRecente(campanhas);

  const indicadoresRecente = campanhaRecente
    ? indicadoresPorCampanha[campanhaRecente.id]
    : undefined;

  const falhaIndicadoresRecente =
    campanhaRecente !== undefined && falhasIndicadores.has(campanhaRecente.id);

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

    return "Sem dados";
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-texto-secundario">
              Campanha mais recente
            </p>

            <h2 className="mt-1 font-titulo text-3xl font-bold">
              {campanhaRecente?.nome ??
                (carregandoCampanhas
                  ? "Carregando campanhas..."
                  : "Nenhuma campanha cadastrada")}
            </h2>

            {campanhaRecente && (
              <p className="mt-1 text-sm text-texto-secundario">
                Criada em {formatarData(campanhaRecente.dataCriacao)}
              </p>
            )}
          </div>

          {campanhaRecente && (
            <Link
              to={`/cancelamentos/campanhas/${campanhaRecente.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-destaque hover:underline"
            >
              Ver detalhes
              <ArrowRight size={17} />
            </Link>
          )}
        </div>

        {carregandoCampanhas || carregandoIndicadores ? (
          indicadoresRecente ? (
            <IndicadoresCancelamentos indicadores={indicadoresRecente} />
          ) : (
            <div
              role="status"
              className="rounded-xl border border-borda bg-superficie p-5"
            >
              <p className="text-sm text-texto-secundario">
                Carregando indicadores de cancelamentos...
              </p>
            </div>
          )
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
        ) : indicadoresRecente ? (
          <IndicadoresCancelamentos indicadores={indicadoresRecente} />
        ) : falhaIndicadoresRecente ? (
          <div
            role="alert"
            className="rounded-xl border border-alerta-suave-forte bg-alerta-suave p-5"
          >
            <p className="text-sm text-alerta">
              Não foi possível carregar os indicadores desta campanha. Os demais
              dados disponíveis continuam sendo exibidos.
            </p>
          </div>
        ) : campanhaRecente ? (
          <div className="rounded-xl border border-borda bg-superficie p-5">
            <p className="text-sm text-texto-secundario">
              Nenhum indicador disponível para esta campanha.
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-xl border border-borda bg-superficie p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Resumo das Campanhas</h3>

            <p className="mt-1 text-sm text-texto-secundario">
              Comparação dos indicadores reais de títulos e cancelamentos
              encontrados nos PDFs importados.
            </p>
          </div>

          <Link
            to="/cancelamentos/campanhas"
            className="inline-flex items-center gap-2 text-sm font-medium text-destaque hover:underline"
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
            <thead className="border-b border-borda text-texto-secundario">
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
                    className="px-3 py-8 text-center text-texto-suave"
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
                    className="px-3 py-8 text-center text-erro"
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
                      className="px-3 py-8 text-center text-texto-suave"
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
                    className="border-b border-borda last:border-0"
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
                        to={`/cancelamentos/campanhas/${campanha.id}`}
                        className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-destaque hover:underline"
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

      <section className="flex items-start gap-3 rounded-xl border border-destaque-suave-forte bg-destaque-suave p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-destaque" />

        <p className="text-sm text-texto-secundario">
          Os cancelamentos encontrados não comprovam que foram causados pelas
          campanhas. Títulos não encontrados nos PDFs também não devem ser
          considerados automaticamente ativos ou não pagos.
        </p>
      </section>
    </div>
  );
}

export default VisaoGeral;
