import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Info, ArrowRight } from "lucide-react";

import { listarCampanhasApi } from "../services/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../services/detalhesCampanhaService";

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

import IndicadoresCancelamentos from "../components/analises/IndicadoresCancelamentos";

type ResultadoConsultaCancelamentos = {
  campanhaId: number;
  indicadores: IndicadoresCampanhaApi | null;
  erro: boolean;
};

function Analises() {
  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);
  const [campanhaId, setCampanhaId] = useState<number | null>(null);

  const [resultadoCancelamentos, setResultadoCancelamentos] =
    useState<ResultadoConsultaCancelamentos | null>(null);

  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [erroCampanhas, setErroCampanhas] = useState(false);

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
      } catch (erroConsulta) {
        console.error("Erro ao carregar campanhas:", erroConsulta);

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

    async function carregarCancelamentos() {
      try {
        const dados = await buscarIndicadoresCampanhaApi(id);

        if (ativo) {
          setResultadoCancelamentos({
            campanhaId: id,
            indicadores: dados,
            erro: false,
          });
        }
      } catch (erroConsulta) {
        console.error(
          "Erro ao carregar indicadores de cancelamentos:",
          erroConsulta,
        );

        if (ativo) {
          setResultadoCancelamentos({
            campanhaId: id,
            indicadores: null,
            erro: true,
          });
        }
      }
    }

    void carregarCancelamentos();

    return () => {
      ativo = false;
    };
  }, [campanhaId]);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const resultadoAtual =
    resultadoCancelamentos?.campanhaId === campanhaId
      ? resultadoCancelamentos
      : null;

  const indicadoresCancelamentos = resultadoAtual?.indicadores ?? null;

  const erroCancelamentos = resultadoAtual?.erro ?? false;

  const carregandoCancelamentos =
    campanhaId !== null && resultadoAtual === null;

  function selecionarCampanha(id: number) {
    setCampanhaId(id);
    setResultadoCancelamentos(null);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-xl font-semibold">Títulos e Cancelamentos</h3>

            <p className="mt-1 text-sm text-texto-secundario">
              Indicadores reais de cancelamentos encontrados nos documentos
              importados.
            </p>
          </div>

          <select
            value={campanhaId ?? ""}
            onChange={(evento) =>
              selecionarCampanha(Number(evento.target.value))
            }
            aria-label="Selecionar campanha"
            disabled={
              carregandoCampanhas || erroCampanhas || campanhas.length === 0
            }
            className="w-full rounded-xl border border-borda bg-superficie px-4 py-3 text-sm outline-none focus:border-destaque disabled:bg-superficie-suave disabled:text-texto-suave lg:w-64"
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
        </div>

        {carregandoCampanhas || carregandoCancelamentos ? (
          <div
            role="status"
            aria-busy="true"
            className="rounded-xl border border-borda bg-superficie p-6"
          >
            <p className="text-sm text-texto-secundario">
              Carregando indicadores de cancelamentos...
            </p>
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
        ) : campanhas.length === 0 ? (
          <div className="rounded-xl border border-borda bg-superficie p-6">
            <p className="text-sm text-texto-secundario">
              Nenhuma campanha cadastrada no sistema.
            </p>
          </div>
        ) : erroCancelamentos ? (
          <div
            role="alert"
            className="rounded-xl border border-alerta-suave-forte bg-alerta-suave p-5"
          >
            <p className="text-sm text-alerta">
              Não foi possível carregar os indicadores desta campanha. Verifique
              a conexão com o backend.
            </p>
          </div>
        ) : indicadoresCancelamentos ? (
          <>
            <IndicadoresCancelamentos indicadores={indicadoresCancelamentos} />

            <div className="flex flex-col justify-between gap-3 rounded-xl border border-borda bg-superficie p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">
                  {campanhaSelecionada?.nome}
                </p>

                <p className="mt-1 text-sm text-texto-secundario">
                  Indicadores consultados no backend da ÁRIA.
                </p>
              </div>

              {campanhaSelecionada && (
                <Link
                  to={`/cancelamentos/campanhas/${campanhaSelecionada.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-destaque hover:underline"
                >
                  Ver títulos da campanha
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-borda bg-superficie p-6">
            <p className="text-sm text-texto-secundario">
              Nenhum indicador disponível para esta campanha.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-destaque-suave-forte bg-destaque-suave p-4">
          <Info size={19} className="mt-0.5 shrink-0 text-destaque" />

          <p className="text-sm text-texto-secundario">
            Cancelamentos encontrados não comprovam que a campanha foi
            responsável por eles. Títulos não encontrados nos PDFs também não
            devem ser considerados automaticamente ativos ou não pagos.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Analises;
