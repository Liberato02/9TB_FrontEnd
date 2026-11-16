import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BrainCircuit,
  CalendarDays,
  Users,
  Building2,
  ChartNoAxesCombined,
  History,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { recomendacoesMock } from "../data/recomendacoesMock";

function Recomendacoes() {
  const [recomendacaoId, setRecomendacaoId] = useState<number | null>(
    recomendacoesMock[0]?.id ?? null,
  );

  const recomendacao = recomendacoesMock.find(
    (item) => item.id === recomendacaoId,
  );

  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split("-");

    if (!ano || !mes || !dia) return data;

    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-1 text-3xl font-semibold">Recomendações da ÁRIA</h2>

        <p className="mt-2 text-base text-slate-500">
          Consulte sugestões de campanhas, critérios utilizados e justificativas
          para apoiar a tomada de decisão.
        </p>
      </header>

      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <div>
          <h3 className="text-sm font-semibold">Ambiente demonstrativo</h3>

          <p className="mt-1 text-sm text-slate-600">
            As recomendações exibidas são exemplos fictícios. A ÁRIA ainda não
            está calculando recomendações reais. Esta interface será conectada
            às funcionalidades correspondentes quando estiverem disponíveis.
          </p>
        </div>
      </section>

      {recomendacao ? (
        <>
          <section className="rounded-xl border border-slate-100 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 p-3">
                  <BrainCircuit size={25} className="text-[#3F7DD9]" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">
                    {recomendacao.titulo}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Exemplo criado em {formatarData(recomendacao.dataCriacao)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <Info size={17} />
                {recomendacao.demonstrativa
                  ? "Recomendação fictícia"
                  : "Recomendação"}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <article className="rounded-xl bg-slate-50 p-4">
                <Users size={22} className="text-[#3F7DD9]" />

                <p className="mt-3 text-sm text-slate-500">
                  Público recomendado
                </p>

                <p className="mt-2 text-base font-semibold">
                  {recomendacao.publicoAlvo}
                </p>
              </article>

              <article className="rounded-xl bg-slate-50 p-4">
                <CalendarDays size={22} className="text-[#3F7DD9]" />

                <p className="mt-3 text-sm text-slate-500">Período sugerido</p>

                <p className="mt-2 text-base font-semibold">
                  {recomendacao.periodoSugerido}
                </p>
              </article>

              <article className="rounded-xl bg-slate-50 p-4">
                <Building2 size={22} className="text-[#3F7DD9]" />

                <p className="mt-3 text-sm text-slate-500">
                  Apresentante sugerido
                </p>

                <p className="mt-2 text-base font-semibold">
                  {recomendacao.apresentanteSugerido ?? "Não especificado"}
                </p>
              </article>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium">Campanha de referência</p>

                <p className="mt-1 text-sm text-slate-500">
                  {recomendacao.campanhaReferenciaId
                    ? `Campanha ID ${recomendacao.campanhaReferenciaId}`
                    : "Nenhuma campanha vinculada"}
                </p>
              </div>

              {recomendacao.campanhaReferenciaId !== null && (
                <Link
                  to={`/campanhas/${recomendacao.campanhaReferenciaId}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
                >
                  Ver campanha
                  <ArrowRight size={17} />
                </Link>
              )}
            </div>
          </section>

          <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
            <article className="rounded-xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <ChartNoAxesCombined size={22} className="text-[#3F7DD9]" />

                <h3 className="text-lg font-semibold">
                  Indicadores de referência
                </h3>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Valores demonstrativos associados à campanha de referência.
              </p>

              <div className="mt-4 space-y-3">
                {recomendacao.indicadoresUtilizados.map((indicador) => (
                  <div
                    key={indicador.descricao}
                    className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4"
                  >
                    <p className="text-sm text-slate-600">
                      {indicador.descricao}
                    </p>

                    <p className="shrink-0 text-lg font-semibold">
                      {indicador.valor}
                    </p>
                  </div>
                ))}

                {recomendacao.indicadoresUtilizados.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Nenhum indicador disponível.
                  </p>
                )}
              </div>
            </article>

            <article className="rounded-xl border border-slate-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <BrainCircuit size={22} className="text-[#183B70]" />

                <h3 className="text-lg font-semibold">Justificativas</h3>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Exemplos de explicações que poderão acompanhar uma recomendação.
              </p>

              <div className="mt-4 space-y-3">
                {recomendacao.justificativas.map((justificativa, indice) => (
                  <div
                    key={indice}
                    className="flex items-start gap-3 rounded-lg bg-slate-50 p-4"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-[#183B70]">
                      {indice + 1}
                    </span>

                    <p className="text-sm leading-6 text-slate-600">
                      {justificativa}
                    </p>
                  </div>
                ))}

                {recomendacao.justificativas.length === 0 && (
                  <p className="text-sm text-slate-500">
                    Nenhuma justificativa disponível.
                  </p>
                )}
              </div>
            </article>
          </section>
        </>
      ) : (
        <section className="rounded-xl border border-slate-100 bg-white p-8 text-center">
          <BrainCircuit size={36} className="mx-auto text-slate-400" />

          <h3 className="mt-4 text-lg font-semibold">
            Nenhuma recomendação disponível
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            As recomendações aparecerão aqui quando estiverem disponíveis.
          </p>
        </section>
      )}

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <History size={23} className="text-[#3F7DD9]" />

            <div>
              <h3 className="text-lg font-semibold">
                Histórico de Recomendações
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Exemplos de recomendações anteriores.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            {recomendacoesMock.length} registros demonstrativos
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {recomendacoesMock.map((item) => {
            const selecionada = item.id === recomendacaoId;

            return (
              <article
                key={item.id}
                className={`flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center ${
                  selecionada
                    ? "border-blue-200 bg-blue-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <h4 className="font-semibold">{item.titulo}</h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {formatarData(item.dataCriacao)}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    {item.publicoAlvo} · {item.periodoSugerido}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setRecomendacaoId(item.id)}
                  aria-pressed={selecionada}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                    selecionada
                      ? "bg-blue-100 text-[#183B70]"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {selecionada ? "Visualizando" : "Ver detalhes"}

                  {!selecionada && <ArrowRight size={16} />}
                </button>
              </article>
            );
          })}

          {recomendacoesMock.length === 0 && (
            <p className="rounded-lg bg-slate-50 p-5 text-center text-sm text-slate-500">
              Nenhuma recomendação registrada.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex items-center gap-3">
          <Sparkles size={23} className="text-[#3F7DD9]" />

          <h3 className="text-lg font-semibold">Nova recomendação</h3>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Futuramente, a ÁRIA poderá apresentar novas recomendações baseadas nos
          dados disponíveis e em critérios validados.
        </p>

        <button
          type="button"
          disabled
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-500"
        >
          <BrainCircuit size={18} />
          Gerar nova recomendação
        </button>

        <p className="mt-2 text-xs text-slate-400">
          Funcionalidade ainda não disponível.
        </p>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <p className="text-sm text-slate-600">
          A ÁRIA será um sistema de apoio à decisão. Ela poderá sugerir
          campanhas, mas não as executará automaticamente. Cancelamentos
          encontrados nos PDFs não comprovam resultados causados pelas
          campanhas.
        </p>
      </section>

      <p className="text-sm text-slate-400">
        Ambiente demonstrativo — recomendações fictícias.
      </p>
    </div>
  );
}

export default Recomendacoes;
