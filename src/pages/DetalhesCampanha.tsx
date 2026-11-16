import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  SearchX,
  Percent,
  Search,
} from "lucide-react";

import { campanhas } from "../data/campanhas";
import { detalhesCampanhasMock } from "../data/detalhesCampanhasMock";

function DetalhesCampanha() {
  const { id } = useParams<{ id: string }>();

  const [pesquisa, setPesquisa] = useState("");
  const [filtroSituacao, setFiltroSituacao] = useState("todas");

  const campanhaId = Number(id);

  const campanha = campanhas.find((item) => item.id === campanhaId);

  const detalhes = detalhesCampanhasMock[campanhaId];

  const formatarNumero = (valor: number) => valor.toLocaleString("pt-BR");

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatarData = (data: string | null) => {
    if (!data) return "—";

    const [ano, mes, dia] = data.split("-");

    if (!ano || !mes || !dia) return data;

    return `${dia}/${mes}/${ano}`;
  };

  if (!campanha || !detalhes) {
    return (
      <div className="space-y-5">
        <Link
          to="/campanhas"
          className="inline-flex items-center gap-2 text-sm text-[#3F7DD9]"
        >
          <ArrowLeft size={18} />
          Voltar para campanhas
        </Link>

        <div className="rounded-xl border border-slate-100 bg-white p-8 text-center">
          <SearchX size={36} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-xl font-semibold">
            Campanha não encontrada
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Não encontramos dados demonstrativos para esta campanha.
          </p>
        </div>
      </div>
    );
  }

  const { indicadores, titulos } = detalhes;

  const titulosFiltrados = titulos.filter((titulo) => {
    const termo = pesquisa.trim().toLowerCase();

    const correspondePesquisa =
      titulo.numeroProtocolo.toLowerCase().includes(termo) ||
      titulo.apresentante.toLowerCase().includes(termo);

    const correspondeSituacao =
      filtroSituacao === "todas" || titulo.situacao === filtroSituacao;

    return correspondePesquisa && correspondeSituacao;
  });

  const cards = [
    {
      titulo: "Total de títulos",
      valor: formatarNumero(indicadores.totalTitulos),
      icone: FileText,
      cor: "text-[#183B70]",
    },
    {
      titulo: "Cancelamentos encontrados",
      valor: formatarNumero(indicadores.titulosCancelados),
      icone: CheckCircle2,
      cor: "text-green-600",
    },
    {
      titulo: "Não encontrados nos PDFs",
      valor: formatarNumero(indicadores.naoEncontradosNosPdfs),
      icone: SearchX,
      cor: "text-[#F27D70]",
    },
    {
      titulo: "Percentual encontrado",
      valor: `${indicadores.percentualCancelados.toLocaleString("pt-BR", {
        maximumFractionDigits: 2,
      })}%`,
      icone: Percent,
      cor: "text-[#3F7DD9]",
    },
  ];

  return (
    <div className="space-y-6">
      <header>
        <Link
          to="/campanhas"
          className="inline-flex items-center gap-2 text-sm text-[#3F7DD9] hover:underline"
        >
          <ArrowLeft size={18} />
          Voltar para campanhas
        </Link>

        <p className="mt-4 text-sm text-slate-500">
          ÁRIA / Campanhas / Detalhes
        </p>

        <h2 className="mt-1 text-3xl font-semibold">{campanha.nome}</h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte os títulos vinculados à campanha e os cancelamentos
          encontrados nos documentos importados.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icone = card.icone;

          return (
            <article
              key={card.titulo}
              className="rounded-xl border border-slate-100 bg-white p-5"
            >
              <Icone size={22} className={card.cor} />

              <p className="mt-3 text-sm text-slate-500">{card.titulo}</p>

              <h3 className="mt-2 text-3xl font-semibold">{card.valor}</h3>
            </article>
          );
        })}
      </section>

      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div>
          <h3 className="text-lg font-semibold">Títulos da campanha</h3>

          <p className="mt-1 text-sm text-slate-500">
            Consulte protocolos, valores, apresentantes e situações dos títulos.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              value={pesquisa}
              onChange={(evento) => setPesquisa(evento.target.value)}
              placeholder="Pesquisar protocolo ou apresentante..."
              aria-label="Pesquisar títulos"
              className="w-full min-w-0 bg-transparent text-sm outline-none"
            />
          </div>

          <select
            value={filtroSituacao}
            onChange={(evento) => setFiltroSituacao(evento.target.value)}
            aria-label="Filtrar situação dos títulos"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="todas">Todas as situações</option>
            <option value="ENCONTRADO_NO_PDF">Cancelamento encontrado</option>
            <option value="NAO_ENCONTRADO_NO_PDF">
              Não encontrado nos PDFs
            </option>
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3 font-medium">Protocolo</th>
                <th className="px-3 py-3 font-medium">Data do protocolo</th>
                <th className="px-3 py-3 font-medium">Apresentante</th>
                <th className="px-3 py-3 font-medium">Valor do título</th>
                <th className="px-3 py-3 font-medium">Custas</th>
                <th className="px-3 py-3 font-medium">Situação</th>
                <th className="px-3 py-3 font-medium">Data do cancelamento</th>
              </tr>
            </thead>

            <tbody>
              {titulosFiltrados.map((titulo) => (
                <tr
                  key={titulo.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="whitespace-nowrap px-3 py-4 font-medium">
                    {titulo.numeroProtocolo}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4">
                    {formatarData(titulo.dataProtocolo)}
                  </td>

                  <td className="px-3 py-4">{titulo.apresentante}</td>

                  <td className="whitespace-nowrap px-3 py-4">
                    {formatarMoeda(titulo.valorTitulo)}
                  </td>

                  <td className="whitespace-nowrap px-3 py-4">
                    {formatarMoeda(titulo.valorCustas)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-xs font-medium ${
                        titulo.situacao === "ENCONTRADO_NO_PDF"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {titulo.situacao === "ENCONTRADO_NO_PDF"
                        ? "Cancelamento encontrado"
                        : "Não encontrado nos PDFs"}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-4">
                    {formatarData(titulo.dataCancelamento)}
                  </td>
                </tr>
              ))}

              {titulosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Nenhum título encontrado para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Exibindo {titulosFiltrados.length} de {titulos.length} títulos.
        </p>
      </section>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Importante:</strong> os cancelamentos encontrados não
          comprovam que a campanha foi responsável por eles. Títulos não
          encontrados nos PDFs também não devem ser considerados automaticamente
          ativos ou não pagos.
        </p>
      </div>

      <p className="text-xs text-slate-400">
        Ambiente demonstrativo — dados fictícios.
      </p>
    </div>
  );
}

export default DetalhesCampanha;
