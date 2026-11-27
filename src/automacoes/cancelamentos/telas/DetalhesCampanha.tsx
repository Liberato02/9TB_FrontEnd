import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, Info, Search, SearchX } from "lucide-react";

import BotaoExportar from "../componentes/BotaoExportar";
import IndicadoresCancelamentos from "../componentes/IndicadoresCancelamentos";
import {
  buscarCampanhaApiPorId,
  buscarIndicadoresCampanhaApi,
  listarTitulosCampanhaApi,
  ErroConsultaApi,
} from "../servicos/detalhesCampanhaService";

import type { CampanhaApi } from "../tipos/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../tipos/IndicadoresCampanhaApi";
import type {
  SituacaoTituloCampanhaApi,
  TituloCampanhaApi,
} from "../tipos/TituloCampanhaApi";

type FiltroSituacao = "todas" | SituacaoTituloCampanhaApi;

const filtros: { valor: FiltroSituacao; nome: string }[] = [
  { valor: "todas", nome: "Todos" },
  { valor: "ENCONTRADO_NO_PDF", nome: "Cancelamento encontrado" },
  { valor: "NAO_ENCONTRADO_NO_PDF", nome: "Não encontrado nos PDFs" },
];

function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatarMoeda(valor: number | null): string {
  if (valor === null) {
    return "Não informado";
  }

  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(data: string | null): string {
  if (!data) {
    return "Não consta";
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

  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacao>("todas");

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
      to="/cancelamentos/campanhas"
      className="inline-flex items-center gap-2 text-sm text-destaque hover:underline"
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
          className="rounded-xl border border-borda bg-superficie p-8 text-center"
          aria-busy="true"
        >
          <p className="text-sm text-texto-secundario">
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
          className="rounded-xl border border-borda bg-superficie p-8 text-center"
          role={naoEncontrada ? undefined : "alert"}
        >
          <SearchX size={36} className="mx-auto text-texto-suave" />

          <h2 className="mt-4 text-xl font-semibold">
            {naoEncontrada
              ? "Campanha não encontrada"
              : "Não foi possível carregar a campanha"}
          </h2>

          <p className="mt-2 text-sm text-texto-secundario">
            {naoEncontrada
              ? "Não encontramos esta campanha no sistema."
              : "Verifique a conexão com o backend e tente novamente."}
          </p>
        </section>
      </div>
    );
  }

  const termo = normalizar(pesquisa);

  const titulosPesquisados = titulos.filter(
    (titulo) =>
      normalizar(titulo.numeroProtocolo).includes(termo) ||
      normalizar(titulo.apresentante).includes(termo),
  );

  const titulosFiltrados = titulosPesquisados.filter(
    (titulo) =>
      filtroSituacao === "todas" || titulo.situacao === filtroSituacao,
  );

  function contarFiltro(valor: FiltroSituacao): number {
    return valor === "todas"
      ? titulosPesquisados.length
      : titulosPesquisados.filter((titulo) => titulo.situacao === valor).length;
  }

  return (
    <div className="space-y-6">
      <header>
        {voltarCampanhas}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-titulo text-3xl font-bold">{campanha.nome}</h2>

            <p className="mt-1 text-sm text-texto-secundario">
              Criada em {formatarData(campanha.dataCriacao)}
            </p>
          </div>

          <BotaoExportar campanha={campanha} indicadores={indicadores} />
        </div>
      </header>

      <IndicadoresCancelamentos indicadores={indicadores} />

      <section className="rounded-xl border border-borda bg-superficie p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h3 className="font-titulo text-2xl font-bold">Títulos</h3>

            <p
              className="mt-1 text-sm text-texto-secundario"
              aria-live="polite"
            >
              Exibindo {formatarNumero(titulosFiltrados.length)} de{" "}
              {formatarNumero(titulos.length)} títulos.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-texto-suave"
            />

            <input
              type="search"
              value={pesquisa}
              onChange={(evento) => setPesquisa(evento.target.value)}
              placeholder="Pesquisar protocolo ou apresentante"
              aria-label="Pesquisar títulos por protocolo ou apresentante"
              className="w-full rounded-lg border border-borda bg-superficie py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-texto-suave focus:border-destaque"
            />
          </div>
        </div>

        <div
          className="mt-4 flex flex-wrap gap-2"
          role="group"
          aria-label="Filtrar pela situação"
        >
          {filtros.map((filtro) => {
            const ativo = filtroSituacao === filtro.valor;

            return (
              <button
                key={filtro.valor}
                type="button"
                onClick={() => setFiltroSituacao(filtro.valor)}
                aria-pressed={ativo}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  ativo
                    ? "border-marca bg-marca text-white"
                    : "border-borda bg-superficie text-texto-secundario hover:bg-superficie-suave"
                }`}
              >
                {filtro.nome}
                <span className="tabular-nums">
                  {formatarNumero(contarFiltro(filtro.valor))}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-borda text-texto-secundario">
              <tr>
                <th className="px-3 py-3 font-medium">Protocolo</th>

                <th className="px-3 py-3 font-medium">Data do protocolo</th>

                <th className="px-3 py-3 font-medium">Apresentante</th>

                <th className="px-3 py-3 text-right font-medium">
                  Valor do título
                </th>

                <th className="px-3 py-3 text-right font-medium">Custas</th>

                <th className="px-3 py-3 font-medium">Situação</th>

                <th className="px-3 py-3 font-medium">Data do cancelamento</th>
              </tr>
            </thead>

            <tbody>
              {titulosFiltrados.map((titulo) => (
                <tr
                  key={titulo.tituloId}
                  className="border-b border-borda last:border-0"
                >
                  <td className="px-3 py-4 font-medium whitespace-nowrap tabular-nums">
                    {titulo.numeroProtocolo}
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap tabular-nums">
                    {formatarData(titulo.dataProtocolo)}
                  </td>

                  <td className="px-3 py-4">{titulo.apresentante}</td>

                  <td className="px-3 py-4 text-right whitespace-nowrap tabular-nums">
                    {formatarMoeda(titulo.valorTitulo)}
                  </td>

                  <td className="px-3 py-4 text-right whitespace-nowrap tabular-nums">
                    {formatarMoeda(titulo.valorCustas)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-block rounded-lg px-3 py-1 text-xs font-medium whitespace-nowrap ${
                        titulo.situacao === "ENCONTRADO_NO_PDF"
                          ? "bg-sucesso-suave text-sucesso"
                          : "bg-superficie-suave text-texto-secundario"
                      }`}
                    >
                      {titulo.situacao === "ENCONTRADO_NO_PDF"
                        ? "Cancelamento encontrado"
                        : "Não encontrado nos PDFs"}
                    </span>
                  </td>

                  <td className="px-3 py-4 whitespace-nowrap tabular-nums">
                    {formatarData(titulo.dataCancelamento)}
                  </td>
                </tr>
              ))}

              {titulosFiltrados.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-texto-suave"
                  >
                    {titulos.length === 0
                      ? "Nenhum título vinculado a esta campanha."
                      : "Nenhum título corresponde à pesquisa e ao filtro."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-destaque-suave-forte bg-destaque-suave p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-destaque" />

        <p className="text-sm text-texto-secundario">
          Os cancelamentos encontrados não comprovam que foram causados pela
          campanha. Títulos não encontrados nos PDFs também não devem ser
          considerados automaticamente ativos ou não pagos.
        </p>
      </section>
    </div>
  );
}

export default DetalhesCampanha;
