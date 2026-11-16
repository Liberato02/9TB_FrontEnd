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
import {
  calcularIndicadores,
  type IndicadoresAnalises,
} from "../services/indicadorService";

import { campanhas } from "../data/campanhas";
import { detalhesCampanhasMock } from "../data/detalhesCampanhasMock";

import IndicadoresCancelamentos from "../components/analises/IndicadoresCancelamentos";
import GraficoContatos from "../components/charts/GraficoContatos";
import GraficoResultados from "../components/charts/GraficoResultados";

function Analises() {
  const [campanhaId, setCampanhaId] = useState<number>(campanhas[0]?.id ?? 0);

  const [indicadores, setIndicadores] = useState<IndicadoresAnalises | null>(
    null,
  );

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarIndicadores() {
      try {
        const analises = await listarAnalises();
        const resultado = calcularIndicadores(analises);

        if (ativo) {
          setIndicadores(resultado);
          setErro(false);
        }
      } catch (erro) {
        console.error("Erro ao carregar indicadores:", erro);

        if (ativo) {
          setErro(true);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarIndicadores();

    return () => {
      ativo = false;
    };
  }, []);

  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const detalhes = detalhesCampanhasMock[campanhaId];

  const cards = indicadores
    ? [
        {
          titulo: "Análises realizadas",
          valor: indicadores.totalAnalises,
          icone: BarChart3,
          cor: "text-[#3F7DD9]",
        },
        {
          titulo: "Contatos realizados",
          valor: indicadores.contatosRealizados,
          icone: PhoneCall,
          cor: "text-green-600",
        },
        {
          titulo: "Contatos fracassados",
          valor: indicadores.contatosFracassados,
          icone: PhoneOff,
          cor: "text-[#F27D70]",
        },
        {
          titulo: "Interesse imediato",
          valor: indicadores.interesseImediato,
          icone: TrendingUp,
          cor: "text-[#3F7DD9]",
        },
        {
          titulo: "Interesse futuro",
          valor: indicadores.interesseFuturo,
          icone: TrendingUp,
          cor: "text-[#F27D70]",
        },
        {
          titulo: "Atendimentos agendados",
          valor: indicadores.atendimentosAgendados,
          icone: CalendarCheck,
          cor: "text-[#183B70]",
        },
      ]
    : [];

  const resultados = indicadores
    ? [
        {
          titulo: "Sem interesse em pagar",
          valor: indicadores.semInteresse,
        },
        {
          titulo: "Telefones incorretos",
          valor: indicadores.telefonesIncorretos,
        },
        {
          titulo: "Boletos por e-mail",
          valor: indicadores.boletosEmail,
        },
        {
          titulo: "Boletos por WhatsApp",
          valor: indicadores.boletosWhatsApp,
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

      {/* TÍTULOS E CANCELAMENTOS */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <h3 className="text-xl font-semibold">Títulos e Cancelamentos</h3>

            <p className="mt-1 text-sm text-slate-500">
              Indicadores de cancelamentos encontrados nos documentos
              importados.
            </p>
          </div>

          <select
            value={campanhaId}
            onChange={(evento) => setCampanhaId(Number(evento.target.value))}
            aria-label="Selecionar campanha"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3F7DD9] lg:w-64"
          >
            {campanhas.map((campanha) => (
              <option key={campanha.id} value={campanha.id}>
                {campanha.nome}
              </option>
            ))}
          </select>
        </div>

        {detalhes ? (
          <>
            <IndicadoresCancelamentos indicadores={detalhes.indicadores} />

            <div className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">
                  {campanhaSelecionada?.nome}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Dados fictícios para demonstração.
                </p>
              </div>

              <Link
                to={`/campanhas/${campanhaId}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
              >
                Ver títulos da campanha
                <ArrowRight size={17} />
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-6">
            <p className="text-sm text-slate-500">
              Não há indicadores demonstrativos disponíveis para esta campanha.
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

      {/* ANÁLISES DE CONTATOS */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Análises de Contatos</h3>

          <p className="mt-1 text-sm text-slate-500">
            Indicadores demonstrativos de contatos e atendimentos, ainda sem
            integração confirmada com o backend.
          </p>
        </div>

        {carregando && (
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-base text-slate-500">
              Carregando indicadores...
            </p>
          </div>
        )}

        {!carregando && erro && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-base text-red-600">
              Não foi possível carregar os indicadores.
            </p>
          </div>
        )}

        {!carregando && !erro && indicadores && (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              {cards.map((card) => {
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

              <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {resultados.map((resultado) => (
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
                  Classificação dos resultados registrados.
                </p>

                <div className="mt-3 min-w-0">
                  <GraficoResultados
                    interesseImediato={indicadores.interesseImediato}
                    interesseFuturo={indicadores.interesseFuturo}
                    semInteresse={indicadores.semInteresse}
                    telefonesIncorretos={indicadores.telefonesIncorretos}
                  />
                </div>
              </article>

              <article className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
                <h4 className="text-base font-semibold">
                  Distribuição dos contatos
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  Contatos realizados e fracassados.
                </p>

                <div className="mt-3 min-w-0">
                  <GraficoContatos
                    realizados={indicadores.contatosRealizados}
                    fracassados={indicadores.contatosFracassados}
                  />
                </div>
              </article>
            </div>
          </>
        )}
      </section>

      <p className="text-sm text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default Analises;
