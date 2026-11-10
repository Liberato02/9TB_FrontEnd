import {
  BrainCircuit,
  CalendarDays,
  Users,
  ChartNoAxesCombined,
  Info,
} from "lucide-react";

function Recomendacoes() {
  return (
    <div>
      {/* CABEÇALHO */}
      <header className="mb-8">
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Recomendações da ÁRIA</h2>

        <p className="mt-2 text-sm text-slate-500">
          Recomendações estratégicas para apoiar a escolha das próximas
          campanhas.
        </p>
      </header>

      {/* STATUS */}
      <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <div className="flex items-start gap-3">
          <Info className="mt-1 shrink-0 text-[#3F7DD9]" />

          <div>
            <h3 className="font-semibold">Funcionalidade em desenvolvimento</h3>

            <p className="mt-2 text-sm text-slate-600">
              As recomendações estarão disponíveis após a integração dos dados
              de títulos gerados e pagos.
            </p>
          </div>
        </div>
      </section>

      {/* ESTRUTURA DAS RECOMENDAÇÕES */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <Users size={26} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">Público recomendado</h3>

          <p className="mt-2 text-sm text-slate-500">
            Identificação do perfil CPF ou CNPJ com maior potencial de
            pagamento.
          </p>

          <p className="mt-5 text-sm font-medium text-slate-400">
            Aguardando dados
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <CalendarDays size={26} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">Período recomendado</h3>

          <p className="mt-2 text-sm text-slate-500">
            Identificação das datas com melhores resultados históricos de
            pagamento.
          </p>

          <p className="mt-5 text-sm font-medium text-slate-400">
            Aguardando dados
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <ChartNoAxesCombined size={26} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">
            Justificativa da recomendação
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Indicadores e comparações que fundamentam a sugestão da ÁRIA.
          </p>

          <p className="mt-5 text-sm font-medium text-slate-400">
            Aguardando dados
          </p>
        </article>
      </section>

      {/* RECOMENDAÇÃO FINAL */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <BrainCircuit size={26} className="text-[#183B70]" />

          <h3 className="text-lg font-semibold">
            Próxima campanha recomendada
          </h3>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          A ÁRIA apresentará aqui uma sugestão de campanha, incluindo
          público-alvo, período recomendado e justificativa baseada nos
          resultados históricos.
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">
            Nenhuma recomendação disponível no momento.
          </p>
        </div>
      </section>

      <p className="mt-6 text-xs text-slate-400">
        Ambiente demonstrativo — recomendações ainda não disponíveis.
      </p>
    </div>
  );
}

export default Recomendacoes;
