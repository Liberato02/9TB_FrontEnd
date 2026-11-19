import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  PhoneCall,
  PhoneOff,
  CalendarCheck,
  Info,
  ArrowRight,
} from "lucide-react";

import { listarAnalises } from "../services/analiseService";
import { listarCampanhasApi } from "../services/campanhaService";
import { buscarIndicadoresCampanhaApi } from "../services/detalhesCampanhaService";

import {
  calcularIndicadores,
  type IndicadoresAnalises,
} from "../services/indicadorService";

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

import IndicadoresCancelamentos from "../components/analises/IndicadoresCancelamentos";
import GraficoContatos from "../components/charts/GraficoContatos";
import GraficoResultados from "../components/charts/GraficoResultados";

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function Analises() {
  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);
  const [campanhaId, setCampanhaId] = useState<number | null>(null);

  const [indicadoresCancelamentos, setIndicadoresCancelamentos] =
    useState<IndicadoresCampanhaApi | null>(null);

  const [carregandoCampanhas, setCarregandoCampanhas] = useState(true);
  const [carregandoCancelamentos, setCarregandoCancelamentos] = useState(false);

  const [erroCampanhas, setErroCampanhas] = useState(false);
  const [erroCancelamentos, setErroCancelamentos] = useState(false);

  const [indicadoresContatos, setIndicadoresContatos] =
    useState<IndicadoresAnalises | null>(null);

  const [carregandoContatos, setCarregandoContatos] = useState(true);
  const [erroContatos, setErroContatos] = useState(false);

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
    let ativo = true;

    setIndicadoresCancelamentos(null);
    setErroCancelamentos(false);

    if (campanhaId === null) {
      setCarregandoCancelamentos(false);
      return;
    }

    setCarregandoCancelamentos(true);

    async function carregarCancelamentos() {
      try {
        const dados = await buscarIndicadoresCampanhaApi(campanhaId as number);

        if (ativo) {
          setIndicadoresCancelamentos(dados);
          setErroCancelamentos(false);
        }
      } catch (erroConsulta) {
        console.error(
          "Erro ao carregar indicadores de cancelamentos:",
          erroConsulta,
        );

        if (ativo) {
          setIndicadoresCancelamentos(null);
          setErroCancelamentos(true);
        }
      } finally {
        if (ativo) {
          setCarregandoCancelamentos(false);
        }
      }
    }

    void carregarCancelamentos();

    return () => {
      ativo = false;
    };
  }, [campanhaId]);

  useEffect(() => {
    let ativo = true;

    async function carregarContatos() {
      try {
        const analises = await listarAnalises();
        const resultado = calcularIndicadores(analises);

        if (ativo) {
          setIndicadoresContatos(resultado);
          setErroContatos(false);
        }
      } catch (erroConsulta) {
        console.error(
          "Erro ao carregar indicadores demonstrativos:",
          erroConsulta,
        );

        if (ativo) {
          setErroContatos(true);
        }
      } finally {
        if (ativo) {
          setCarregandoContatos(false);
        }
      }
    }

    void carregarContatos();

    return () => {
      ativo = false;
    };
  }, []);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const cardsContatos = indicadoresContatos
    ? [
        {
          titulo: "Análises realizadas",
          valor: indicadoresContatos.totalAnalises,
          icone: BarChart3,
          cor: "text-[#3F7DD9]",
        },
        {
          titulo: "Contatos realizados",
          valor: indicadoresContatos.contatosRealizados,
          icone: PhoneCall,
          cor: "text-green-600",
        },
        {
          titulo: "Contatos fracassados",
          valor: indicadoresContatos.contatosFracassados,
          icone: PhoneOff,
          cor: "text-[#F27D70]",
        },
        {
          titulo: "Interesse imediato",
          valor: indicadoresContatos.interesseImediato,
          icone: TrendingUp,
          cor: "text-[#3F7DD9]",
        },
        {
          titulo: "Interesse futuro",
          valor: indicadoresContatos.interesseFuturo,
          icone: TrendingUp,
          cor: "text-[#F27D70]",
        },
        {
          titulo: "Atendimentos agendados",
          valor: indicadoresContatos.atendimentosAgendados,
          icone: CalendarCheck,
          cor: "text-[#183B70]",
        },
      ]
    : [];

  const resultadosContatos = indicadoresContatos
    ? [
        {
          titulo: "Sem interesse em pagar",
          valor: indicadoresContatos.semInteresse,
        },
        {
          titulo: "Telefones incorretos",
          valor: indicadoresContatos.telefonesIncorretos,
        },
        {
          titulo: "Boletos por e-mail",
          valor: indicadoresContatos.boletosEmail,
        },
        {
          titulo: "Boletos por WhatsApp",
          valor: indicadoresContatos.boletosWhatsApp,
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-1 text-3xl font-semibold text-slate-800">Análises</h2>

        <p className="mt-1 text-base text-slate-500">
          Indicadores de títulos, cancelamentos e contatos.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-xl font-semibold">Títulos e Cancelamentos</h3>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores reais de cancelamentos encontrados nos documentos
              importados.
            </p>
          </div>

          <select
            value={campanhaId ?? ""}
            onChange={(evento) => setCampanhaId(Number(evento.target.value))}
            aria-label="Selecionar campanha"
            disabled={
              carregandoCampanhas || erroCampanhas || campanhas.length === 0
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3F7DD9] disabled:bg-slate-50 disabled:text-slate-400 lg:w-64"
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
            className="rounded-xl border border-slate-100 bg-white p-6"
          >
            <p className="text-sm text-slate-500">
              Carregando indicadores de cancelamentos...
            </p>
          </div>
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
        ) : campanhas.length === 0 ? (
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <p className="text-sm text-slate-500">
              Nenhuma campanha cadastrada no sistema.
            </p>
          </div>
        ) : erroCancelamentos ? (
          <div
            role="alert"
            className="rounded-xl border border-amber-100 bg-amber-50 p-5"
          >
            <p className="text-sm text-amber-800">
              Não foi possível carregar os indicadores desta campanha. Verifique
              a conexão com o backend.
            </p>
          </div>
        ) : indicadoresCancelamentos ? (
          <>
            <IndicadoresCancelamentos indicadores={indicadoresCancelamentos} />

            <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">
                  {campanhaSelecionada?.nome}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Indicadores consultados no backend da ÁRIA.
                </p>
              </div>

              {campanhaSelecionada && (
                <Link
                  to={`/campanhas/${campanhaSelecionada.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
                >
                  Ver títulos da campanha
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <p className="text-sm text-slate-500">
              Nenhum indicador disponível para esta campanha.
            </p>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <Info size={19} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

          <p className="text-sm text-slate-600">
            Cancelamentos encontrados não comprovam que a campanha foi
            responsável por eles. Títulos não encontrados nos PDFs também não
            devem ser considerados automaticamente ativos ou não pagos.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Análises de Contatos</h3>

          <p className="mt-1 text-sm text-slate-500">
            Indicadores demonstrativos de contatos e atendimentos, ainda sem
            integração com o backend.
          </p>
        </div>

        {carregandoContatos && (
          <div
            role="status"
            className="rounded-xl border border-slate-100 bg-white p-5"
          >
            <p className="text-base text-slate-500">
              Carregando indicadores demonstrativos...
            </p>
          </div>
        )}

        {!carregandoContatos && erroContatos && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <p className="text-base text-red-600">
              Não foi possível carregar os indicadores demonstrativos.
            </p>
          </div>
        )}

        {!carregandoContatos && !erroContatos && indicadoresContatos && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {cardsContatos.map((card) => {
                const Icone = card.icone;

                return (
                  <article
                    key={card.titulo}
                    className="min-w-0 rounded-xl border border-slate-100 bg-white p-4"
                  >
                    <Icone size={21} className={card.cor} />

                    <p className="mt-2 min-h-11 text-sm leading-5 text-slate-500">
                      {card.titulo}
                    </p>

                    <h4 className="mt-1 text-3xl font-semibold text-slate-800">
                      {formatarNumero(card.valor)}
                    </h4>
                  </article>
                );
              })}
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4">
              <h4 className="text-base font-semibold">
                Classificação dos resultados
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Dados demonstrativos de contatos.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {resultadosContatos.map((resultado) => (
                  <div
                    key={resultado.titulo}
                    className="min-w-0 rounded-lg bg-slate-50 p-3"
                  >
                    <p className="text-sm text-slate-500">{resultado.titulo}</p>

                    <p className="mt-1 text-2xl font-semibold">
                      {formatarNumero(resultado.valor)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
              <article className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
                <h4 className="text-base font-semibold">
                  Distribuição dos resultados
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Classificação demonstrativa dos resultados.
                </p>

                <div className="mt-3 min-w-0">
                  <GraficoResultados
                    interesseImediato={indicadoresContatos.interesseImediato}
                    interesseFuturo={indicadoresContatos.interesseFuturo}
                    semInteresse={indicadoresContatos.semInteresse}
                    telefonesIncorretos={
                      indicadoresContatos.telefonesIncorretos
                    }
                  />
                </div>
              </article>

              <article className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
                <h4 className="text-base font-semibold">
                  Distribuição dos contatos
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Contatos demonstrativos realizados e fracassados.
                </p>

                <div className="mt-3 min-w-0">
                  <GraficoContatos
                    realizados={indicadoresContatos.contatosRealizados}
                    fracassados={indicadoresContatos.contatosFracassados}
                  />
                </div>
              </article>
            </div>
          </>
        )}
      </section>

      <p className="text-sm text-slate-400">
        Títulos e cancelamentos consultados no backend da ÁRIA. Indicadores e
        gráficos de contatos permanecem demonstrativos.
      </p>
    </div>
  );
}

export default Analises;
