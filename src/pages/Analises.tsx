import { useEffect, useState } from "react";
import {
  BarChart3,
  BrainCircuit,
  TrendingUp,
  PhoneCall,
  PhoneOff,
  CalendarCheck,
} from "lucide-react";

import { listarAnalises } from "../services/analiseService";
import {
  calcularIndicadores,
  type IndicadoresAnalises,
} from "../services/indicadorService";

import GraficoContatos from "../components/charts/GraficoContatos";
import GraficoResultados from "../components/charts/GraficoResultados";

function Analises() {
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

  return (
    <div>
      {/* CABEÇALHO */}
      <header className="mb-8">
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Análises</h2>

        <p className="mt-2 text-sm text-slate-500">
          Explore indicadores, tendências e padrões identificados nos resultados
          históricos.
        </p>
      </header>

      {/* CARREGAMENTO */}
      {carregando && (
        <p className="mb-6 text-sm text-slate-500">Carregando indicadores...</p>
      )}

      {/* ERRO */}
      {!carregando && erro && (
        <p className="mb-6 text-sm text-red-500">
          Não foi possível carregar os indicadores.
        </p>
      )}

      {/* INDICADORES */}
      {!carregando && !erro && indicadores && (
        <>
          <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <BarChart3 size={24} className="text-[#3F7DD9]" />

              <p className="mt-3 text-sm text-slate-500">Análises realizadas</p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.totalAnalises)}
              </h3>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <PhoneCall size={24} className="text-green-600" />

              <p className="mt-3 text-sm text-slate-500">Contatos realizados</p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.contatosRealizados)}
              </h3>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <PhoneOff size={24} className="text-[#F27D70]" />

              <p className="mt-3 text-sm text-slate-500">
                Contatos fracassados
              </p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.contatosFracassados)}
              </h3>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <TrendingUp size={24} className="text-[#3F7DD9]" />

              <p className="mt-3 text-sm text-slate-500">
                Interesse em pagar agora
              </p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.interesseImediato)}
              </h3>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <TrendingUp size={24} className="text-[#F27D70]" />

              <p className="mt-3 text-sm text-slate-500">
                Interesse em pagar no futuro
              </p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.interesseFuturo)}
              </h3>
            </article>

            <article className="rounded-2xl border border-slate-100 bg-white p-6">
              <CalendarCheck size={24} className="text-[#183B70]" />

              <p className="mt-3 text-sm text-slate-500">
                Atendimentos agendados
              </p>

              <h3 className="mt-3 text-3xl font-semibold">
                {formatarNumero(indicadores.atendimentosAgendados)}
              </h3>
            </article>
          </section>

          {/* RESULTADOS DETALHADOS */}
          <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="text-lg font-semibold">
              Classificação dos resultados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Distribuição dos resultados registrados nas análises.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Sem interesse em pagar</p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatarNumero(indicadores.semInteresse)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Telefones incorretos</p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatarNumero(indicadores.telefonesIncorretos)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Boletos enviados por e-mail
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatarNumero(indicadores.boletosEmail)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Boletos enviados por WhatsApp
                </p>

                <p className="mt-2 text-2xl font-semibold">
                  {formatarNumero(indicadores.boletosWhatsApp)}
                </p>
              </div>
            </div>
          </section>

          {/* NOVO GRÁFICO DE RESULTADOS */}
          <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-6">
            <h3 className="text-lg font-semibold">
              Distribuição dos resultados
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Comparação entre as classificações registradas nos contatos
              realizados.
            </p>

            <div className="mt-6">
              <GraficoResultados
                interesseImediato={indicadores.interesseImediato}
                interesseFuturo={indicadores.interesseFuturo}
                semInteresse={indicadores.semInteresse}
                telefonesIncorretos={indicadores.telefonesIncorretos}
              />
            </div>
          </section>
        </>
      )}

      {/* ÁREAS DE ANÁLISE */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <BarChart3 size={24} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">Desempenho</h3>

          <p className="mt-2 text-sm text-slate-500">
            Acompanhe indicadores e resultados consolidados das campanhas.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <TrendingUp size={24} className="text-[#F27D70]" />

          <h3 className="mt-4 text-lg font-semibold">Tendências</h3>

          <p className="mt-2 text-sm text-slate-500">
            Identifique mudanças e padrões ao longo do tempo.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <BrainCircuit size={24} className="text-[#183B70]" />

          <h3 className="mt-4 text-lg font-semibold">
            Inteligência Artificial
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Área reservada para análises inteligentes e recomendações futuras.
          </p>
        </article>
      </section>

      {/* PAINEL DE CONTATOS */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">Distribuição dos contatos</h3>

        <p className="mt-2 text-sm text-slate-500">
          Comparação entre contatos realizados e fracassados.
        </p>

        <div className="mt-6">
          {indicadores && !carregando && !erro ? (
            <GraficoContatos
              realizados={indicadores.contatosRealizados}
              fracassados={indicadores.contatosFracassados}
            />
          ) : (
            <p className="text-sm text-slate-400">Gráfico indisponível.</p>
          )}
        </div>
      </section>

      <p className="mt-6 text-xs text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default Analises;
