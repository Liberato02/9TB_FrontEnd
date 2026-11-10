import { useState } from "react";

import {
  FileBarChart,
  Download,
  CalendarDays,
  FileText,
  FileSpreadsheet,
  Users,
  ChartNoAxesCombined,
  PhoneCall,
  Clock3,
} from "lucide-react";

import { campanhas } from "../data/campanhas";

import {
  exportarWord,
  exportarPDF,
  exportarExcel,
} from "../services/relatorioService";

function Relatorios() {
  const [campanhaId, setCampanhaId] = useState<number>(campanhas[0]?.id ?? 0);

  const campanhaSelecionada = campanhas.find(
    (campanha) => campanha.id === campanhaId,
  );

  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  return (
    <div>
      {/* CABEÇALHO */}
      <header className="mb-8">
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Relatórios</h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte os resultados das campanhas e exporte relatórios em Word, PDF
          e Excel.
        </p>
      </header>

      {/* RESUMO */}
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <FileBarChart size={24} className="text-[#3F7DD9]" />

          <h3 className="mt-4 text-lg font-semibold">
            Relatórios por campanha
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Consulte os indicadores da campanha selecionada.
          </p>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <CalendarDays size={24} className="text-[#F27D70]" />

          <h3 className="mt-4 text-lg font-semibold">
            Histórico de resultados
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Visualize os resultados históricos registrados na ÁRIA.
          </p>
        </article>
      </section>

      {/* SELEÇÃO DA CAMPANHA */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">Selecionar campanha</h3>

        <p className="mt-2 text-sm text-slate-500">
          Escolha a campanha que deseja consultar.
        </p>

        <select
          value={campanhaId}
          onChange={(evento) => setCampanhaId(Number(evento.target.value))}
          className="mt-5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-[#183B70] outline-none focus:border-[#3F7DD9]"
        >
          {campanhas.map((campanha) => (
            <option key={campanha.id} value={campanha.id}>
              {campanha.nome}
            </option>
          ))}
        </select>
      </section>

      {/* INDICADORES DA CAMPANHA */}
      {campanhaSelecionada && (
        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
          <div>
            <h3 className="text-lg font-semibold">Resultados da campanha</h3>

            <p className="mt-2 text-sm text-slate-500">
              {campanhaSelecionada.nome}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Período: {campanhaSelecionada.periodo}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Status: {campanhaSelecionada.status}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* DEVEDORES */}
            <article className="rounded-xl bg-slate-50 p-5">
              <Users size={22} className="text-[#3F7DD9]" />

              <p className="mt-3 text-sm text-slate-500">Devedores</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatarNumero(campanhaSelecionada.devedores)}
              </p>
            </article>

            {/* ANÁLISES */}
            <article className="rounded-xl bg-slate-50 p-5">
              <ChartNoAxesCombined size={22} className="text-[#3F7DD9]" />

              <p className="mt-3 text-sm text-slate-500">Análises realizadas</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatarNumero(campanhaSelecionada.analises)}
              </p>
            </article>

            {/* CONTATOS */}
            <article className="rounded-xl bg-slate-50 p-5">
              <PhoneCall size={22} className="text-[#3F7DD9]" />

              <p className="mt-3 text-sm text-slate-500">Contatos efetivos</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatarNumero(campanhaSelecionada.contatosEfetivos)}
              </p>
            </article>

            {/* RETORNOS */}
            <article className="rounded-xl bg-slate-50 p-5">
              <Clock3 size={22} className="text-[#F27D70]" />

              <p className="mt-3 text-sm text-slate-500">Retornos agendados</p>

              <p className="mt-2 text-2xl font-semibold">
                {formatarNumero(campanhaSelecionada.retornosAgendados)}
              </p>
            </article>
          </div>
        </section>
      )}

      {/* EXPORTAÇÃO DOS RELATÓRIOS */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">Exportar relatório</h3>

        <p className="mt-2 text-sm text-slate-500">
          Baixe os resultados da campanha selecionada no formato desejado.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* WORD */}
          <button
            type="button"
            disabled={!campanhaSelecionada}
            onClick={() => {
              if (campanhaSelecionada) {
                void exportarWord(campanhaSelecionada);
              }
            }}
            className="flex items-center justify-center gap-3 rounded-xl bg-blue-50 p-4 text-sm font-medium text-[#183B70] transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileText size={20} />
            <Download size={16} />
            Baixar Word
          </button>

          {/* PDF */}
          <button
            type="button"
            disabled={!campanhaSelecionada}
            onClick={() => {
              if (campanhaSelecionada) {
                exportarPDF(campanhaSelecionada);
              }
            }}
            className="flex items-center justify-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileBarChart size={20} />
            <Download size={16} />
            Baixar PDF
          </button>

          {/* EXCEL */}
          <button
            type="button"
            disabled={!campanhaSelecionada}
            onClick={() => {
              if (campanhaSelecionada) {
                exportarExcel(campanhaSelecionada);
              }
            }}
            className="flex items-center justify-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileSpreadsheet size={20} />
            <Download size={16} />
            Baixar Excel
          </button>
        </div>
      </section>

      {/* RODAPÉ */}
      <p className="mt-6 text-xs text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default Relatorios;
