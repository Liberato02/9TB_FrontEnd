import { useEffect, useState } from "react";
import {
  BarChart3,
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
    <div className="space-y-5">
      {/* CABEÇALHO */}
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-1 text-3xl font-semibold text-slate-800">Análises</h2>

        <p className="mt-1 text-base text-slate-500">
          Indicadores e resultados das campanhas.
        </p>
      </header>

      {/* CARREGAMENTO */}
      {carregando && (
        <div className="rounded-xl border border-slate-100 bg-white p-5">
          <p className="text-base text-slate-500">Carregando indicadores...</p>
        </div>
      )}

      {/* ERRO */}
      {!carregando && erro && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-base text-red-600">
            Não foi possível carregar os indicadores.
          </p>
        </div>
      )}

      {/* DASHBOARD */}
      {!carregando && !erro && indicadores && (
        <>
          {/* INDICADORES PRINCIPAIS */}
          <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
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

                  <h3 className="mt-1 text-3xl font-semibold text-slate-800">
                    {formatarNumero(card.valor)}
                  </h3>
                </article>
              );
            })}
          </section>

          {/* CLASSIFICAÇÃO DOS RESULTADOS */}
          <section className="rounded-xl border border-slate-100 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-800">
              Classificação dos resultados
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {resultados.map((resultado) => (
                <div
                  key={resultado.titulo}
                  className="min-w-0 rounded-lg bg-slate-50 p-3"
                >
                  <p className="text-sm text-slate-500">{resultado.titulo}</p>

                  <p className="mt-1 text-2xl font-semibold text-slate-800">
                    {formatarNumero(resultado.valor)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* GRÁFICOS LADO A LADO */}
          <section className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
            {/* GRÁFICO DE RESULTADOS */}
            <article className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-800">
                Distribuição dos resultados
              </h3>

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

            {/* GRÁFICO DE CONTATOS */}
            <article className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-800">
                Distribuição dos contatos
              </h3>

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
          </section>
        </>
      )}

      {/* RODAPÉ */}
      <p className="text-sm text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default Analises;
