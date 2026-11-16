import { useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, ArrowRight, Info } from "lucide-react";

import GraficoCampanhas from "../components/charts/GraficoCampanhas";
import IndicadoresCancelamentos from "../components/analises/IndicadoresCancelamentos";

import { campanhas } from "../data/campanhas";
import { detalhesCampanhasMock } from "../data/detalhesCampanhasMock";

function Dashboard() {
  const [campanhaId, setCampanhaId] = useState<number>(campanhas[0]?.id ?? 0);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const detalhes = detalhesCampanhasMock[campanhaId];

  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const formatarPercentual = (valor: number) =>
    `${valor.toLocaleString("pt-BR", {
      maximumFractionDigits: 2,
    })}%`;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Painel de Inteligência</p>

        <h2 className="mt-1 text-3xl font-semibold">Visão Geral</h2>

        <p className="mt-1 text-base text-slate-500">
          Acompanhe os indicadores de campanhas, títulos e cancelamentos
          encontrados.
        </p>
      </header>

      {/* RESUMO E SELEÇÃO DA CAMPANHA */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-5">
          <div className="rounded-xl bg-blue-50 p-3">
            <FolderKanban size={25} className="text-[#3F7DD9]" />
          </div>

          <div>
            <p className="text-sm text-slate-500">Campanhas cadastradas</p>

            <p className="mt-1 text-3xl font-semibold">
              {formatarNumero(campanhas.length)}
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
            value={campanhaId}
            onChange={(evento) => setCampanhaId(Number(evento.target.value))}
            className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#3F7DD9]"
          >
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

      {/* INDICADORES DE CANCELAMENTOS */}
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
              to={`/campanhas/${campanhaId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3F7DD9] hover:underline"
            >
              Ver detalhes
              <ArrowRight size={17} />
            </Link>
          )}
        </div>

        {detalhes ? (
          <IndicadoresCancelamentos indicadores={detalhes.indicadores} />
        ) : (
          <div className="rounded-xl border border-slate-100 bg-white p-5">
            <p className="text-sm text-slate-500">
              Nenhum indicador disponível para esta campanha.
            </p>
          </div>
        )}
      </section>

      {/* RESUMO DAS CAMPANHAS */}
      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Resumo das Campanhas</h3>

            <p className="mt-1 text-sm text-slate-500">
              Comparação dos indicadores demonstrativos de títulos e
              cancelamentos.
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

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">Campanha</th>

                <th className="px-3 py-3 font-medium">Total de títulos</th>

                <th className="px-3 py-3 font-medium">
                  Cancelamentos encontrados
                </th>

                <th className="px-3 py-3 font-medium">Não encontrados</th>

                <th className="px-3 py-3 font-medium">Percentual</th>

                <th className="px-3 py-3 font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {campanhas.map((campanha) => {
                const dados = detalhesCampanhasMock[campanha.id];

                return (
                  <tr
                    key={campanha.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="whitespace-nowrap px-3 py-4 font-medium">
                      {campanha.nome}
                    </td>

                    <td className="px-3 py-4">
                      {dados
                        ? formatarNumero(dados.indicadores.totalTitulos)
                        : "—"}
                    </td>

                    <td className="px-3 py-4">
                      {dados
                        ? formatarNumero(dados.indicadores.titulosCancelados)
                        : "—"}
                    </td>

                    <td className="px-3 py-4">
                      {dados
                        ? formatarNumero(
                            dados.indicadores.naoEncontradosNosPdfs,
                          )
                        : "—"}
                    </td>

                    <td className="px-3 py-4">
                      {dados
                        ? formatarPercentual(
                            dados.indicadores.percentualCancelados,
                          )
                        : "—"}
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
                );
              })}

              {campanhas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-8 text-center text-slate-400"
                  >
                    Nenhuma campanha disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* GRÁFICO EXISTENTE */}
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

      {/* AVISO */}
      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <p className="text-sm text-slate-600">
          Os cancelamentos encontrados não comprovam que foram causados pelas
          campanhas. Títulos não encontrados nos PDFs também não devem ser
          considerados automaticamente ativos ou não pagos.
        </p>
      </section>

      <p className="text-sm text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default Dashboard;
