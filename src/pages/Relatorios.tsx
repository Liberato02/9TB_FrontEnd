
import { FileBarChart, Download, CalendarDays } from 'lucide-react'

function Relatorios() {
  return (
    <div>
      {/* CABEÇALHO */}
      <header className="mb-8">
        <p className="text-sm text-slate-500">
          ÁRIA / Inteligência de Dados
        </p>

        <h2 className="mt-2 text-3xl font-semibold">
          Relatórios
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte e organize os resultados
          consolidados das campanhas históricas.
        </p>
      </header>

      {/* RESUMO */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <FileBarChart size={24} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">
            Relatórios consolidados
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Visualize indicadores e resultados
            de campanhas anteriores.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <CalendarDays size={24} className="text-[#F27D70]" />

          <h3 className="mt-4 text-lg font-semibold">
            Histórico de resultados
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Acompanhe a evolução dos resultados
            ao longo dos períodos analisados.
          </p>
        </article>
      </section>

      {/* ÁREA DE RELATÓRIOS */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">
              Relatórios disponíveis
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Os relatórios gerados aparecerão nesta área.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-400">
            <Download size={18} />
            Exportação em breve
          </div>
        </div>

        <div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <p className="text-sm text-slate-400">
            Nenhum relatório disponível no ambiente demonstrativo.
          </p>
        </div>
      </section>

      <p className="mt-6 text-xs text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  )
}

export default Relatorios
