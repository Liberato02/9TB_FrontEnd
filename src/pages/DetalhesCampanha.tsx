import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  SearchX,
  Percent,
  Search,
} from "lucide-react";

import {
  buscarCampanhaApiPorId,
  buscarIndicadoresCampanhaApi,
  listarTitulosCampanhaApi,
  ErroConsultaApi,
} from "../services/detalhesCampanhaService";

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";
import type { TituloCampanhaApi } from "../types/TituloCampanhaApi";

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function formatarMoeda(valor: number | null): string {
  if (valor === null) {
    return "—";
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string | null): string {
  if (!data) {
    return "—";
  }

  const dataSemHorario = data.split("T")[0];
  const [ano, mes, dia] = dataSemHorario.split("-");

  if (!ano || !mes || !dia) {
    return data;
  }

  return `${dia}/${mes}/${ano}`;
}

function DetalhesCampanha() {
  const { id } = useParams<{ id: string }>();

  const campanhaId = Number(id);

  const [campanha, setCampanha] = useState<CampanhaApi | null>(null);

  const [indicadores, setIndicadores] = useState<IndicadoresCampanhaApi | null>(
    null,
  );

  const [titulos, setTitulos] = useState<TituloCampanhaApi[]>([]);

  const [pesquisa, setPesquisa] = useState("");

  const [filtroSituacao, setFiltroSituacao] = useState("todas");

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState<"nao-encontrada" | "falha" | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarDetalhes() {
      setCarregando(true);
      setErro(null);

      setCampanha(null);
      setIndicadores(null);
      setTitulos([]);

      if (!Number.isInteger(campanhaId) || campanhaId <= 0) {
        setErro("nao-encontrada");
        setCarregando(false);
        return;
      }

      try {
        const [dadosCampanha, dadosIndicadores, dadosTitulos] =
          await Promise.all([
            buscarCampanhaApiPorId(campanhaId),
            buscarIndicadoresCampanhaApi(campanhaId),
            listarTitulosCampanhaApi(campanhaId),
          ]);

        if (!ativo) {
          return;
        }

        setCampanha(dadosCampanha);
        setIndicadores(dadosIndicadores);
        setTitulos(dadosTitulos);
        setErro(null);
      } catch (erroConsulta) {
        console.error("Erro ao carregar detalhes da campanha:", erroConsulta);

        if (!ativo) {
          return;
        }

        if (
          erroConsulta instanceof ErroConsultaApi &&
          erroConsulta.status === 404
        ) {
          setErro("nao-encontrada");
        } else {
          setErro("falha");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarDetalhes();

    return () => {
      ativo = false;
    };
  }, [campanhaId]);

  const voltarCampanhas = (
    <Link
      to="/campanhas"
      className="inline-flex items-center gap-2 text-sm text-[#3F7DD9] hover:underline"
    >
      <ArrowLeft size={18} />
      Voltar para campanhas
    </Link>
  );

  if (carregando) {
    return (
      <div className="space-y-5">
        {voltarCampanhas}

        <section
          className="rounded-xl border border-slate-100 bg-white p-8 text-center"
          aria-busy="true"
        >
          <p className="text-sm text-slate-500">
            Carregando os dados da campanha...
          </p>
        </section>
      </div>
    );
  }

  if (erro || !campanha || !indicadores) {
    const naoEncontrada = erro === "nao-encontrada";

    return (
      <div className="space-y-5">
        {voltarCampanhas}

        <section
          className="rounded-xl border border-slate-100 bg-white p-8 text-center"
          role={naoEncontrada ? undefined : "alert"}
        >
          <SearchX size={36} className="mx-auto text-slate-400" />

          <h2 className="mt-4 text-xl font-semibold">
            {naoEncontrada
              ? "Campanha não encontrada"
              : "Não foi possível carregar a campanha"}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {naoEncontrada
              ? "Não encontramos esta campanha no sistema."
              : "Verifique a conexão com o backend e tente novamente."}
          </p>
        </section>
      </div>
    );
  }

  const termoPesquisa = pesquisa.trim().toLowerCase();

  const titulosFiltrados = titulos.filter((titulo) => {
    const correspondePesquisa =
      titulo.numeroProtocolo.toLowerCase().includes(termoPesquisa) ||
      titulo.apresentante.toLowerCase().includes(termoPesquisa);

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
      {/* CABEÇALHO */}
      <header>
        {voltarCampanhas}

        <p className="mt-4 text-sm text-slate-500">
          ÁRIA / Campanhas / Detalhes
        </p>

        <h2 className="mt-1 text-3xl font-semibold">{campanha.nome}</h2>

        <p className="mt-2 text-sm text-slate-500">
          Data de cadastro: {formatarData(campanha.dataCriacao)}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Consulte os títulos vinculados à campanha e os cancelamentos
          encontrados nos documentos importados.
        </p>
      </header>

      {/* INDICADORES REAIS */}
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

      {/* TÍTULOS REAIS */}
      <section className="rounded-xl border border-slate-100 bg-white p-5">
        <div>
          <h3 className="text-lg font-semibold">Títulos da campanha</h3>

          <p className="mt-1 text-sm text-slate-500">
            Consulte protocolos, valores, apresentantes e situações dos títulos.
          </p>
        </div>

        {/* FILTROS */}
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

        {/* TABELA */}
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
                  key={titulo.tituloId}
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
                    {titulos.length === 0
                      ? "Nenhum título vinculado a esta campanha."
                      : "Nenhum título encontrado para os filtros selecionados."}
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

      {/* AVISO IMPORTANTE */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm text-slate-600">
          <strong>Importante:</strong> os cancelamentos encontrados não
          comprovam que a campanha foi responsável por eles. Títulos não
          encontrados nos PDFs também não devem ser considerados automaticamente
          ativos ou não pagos.
        </p>
      </div>

      <p className="text-xs text-slate-400">
        Dados consultados no backend da ÁRIA.
      </p>
    </div>
  );
}

export default DetalhesCampanha;
