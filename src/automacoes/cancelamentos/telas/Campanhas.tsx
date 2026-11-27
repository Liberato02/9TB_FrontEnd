import { ArrowRight, Search } from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listarCampanhasApi } from "../servicos/campanhaService";
import type { CampanhaApi } from "../tipos/CampanhaApi";

function formatarData(data: string): string {
  const resultado = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);

  if (!resultado) {
    return "Não informada";
  }

  const [, ano, mes, dia] = resultado;

  return `${dia}/${mes}/${ano}`;
}

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function Campanhas() {
  const [pesquisa, setPesquisa] = useState("");

  const [campanhas, setCampanhas] = useState<CampanhaApi[]>([]);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarCampanhas() {
      try {
        const dados = await listarCampanhasApi();

        if (ativo) {
          setCampanhas(dados);
          setErro(false);
        }
      } catch (erroConsulta) {
        console.error("Erro ao carregar campanhas:", erroConsulta);

        if (ativo) {
          setErro(true);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarCampanhas();

    return () => {
      ativo = false;
    };
  }, []);

  const termo = normalizar(pesquisa);

  const campanhasFiltradas = campanhas
    .filter((campanha) => normalizar(campanha.nome).includes(termo))
    .sort((a, b) => b.dataCriacao.localeCompare(a.dataCriacao));

  function descreverLista(): string {
    if (carregando) {
      return "Carregando campanhas...";
    }

    if (erro) {
      return "Total de campanhas indisponível.";
    }

    const total = campanhas.length.toLocaleString("pt-BR");

    if (termo) {
      return `${campanhasFiltradas.length.toLocaleString("pt-BR")} de ${total} campanhas correspondem à pesquisa.`;
    }

    if (campanhas.length === 1) {
      return "1 campanha cadastrada, da mais recente para a mais antiga.";
    }

    return `${total} campanhas cadastradas, da mais recente para a mais antiga.`;
  }

  return (
    <section className="rounded-xl border border-borda bg-superficie p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="font-titulo text-2xl font-bold">Campanhas</h2>

          <p className="mt-1 text-sm text-texto-secundario" aria-live="polite">
            {descreverLista()}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-texto-suave"
          />

          <input
            type="search"
            placeholder="Pesquisar pelo nome"
            aria-label="Pesquisar campanhas pelo nome"
            value={pesquisa}
            onChange={(evento) => setPesquisa(evento.target.value)}
            disabled={carregando || erro}
            className="w-full rounded-lg border border-borda bg-superficie py-2.5 pr-3 pl-10 text-sm outline-none placeholder:text-texto-suave focus:border-destaque disabled:bg-superficie-suave"
          />
        </div>
      </div>

      <div className="mt-5 overflow-x-auto" aria-busy={carregando}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-borda text-texto-secundario">
            <tr>
              <th className="px-3 py-3 font-medium">Campanha</th>

              <th className="px-3 py-3 font-medium">Data de cadastro</th>

              <th className="px-3 py-3 font-medium">Ações</th>
            </tr>
          </thead>

          <tbody>
            {carregando && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-8 text-center text-texto-suave"
                >
                  Carregando campanhas...
                </td>
              </tr>
            )}

            {!carregando && erro && (
              <tr>
                <td
                  colSpan={3}
                  role="alert"
                  className="px-3 py-8 text-center text-erro"
                >
                  Não foi possível carregar as campanhas. Verifique a conexão
                  com o backend.
                </td>
              </tr>
            )}

            {!carregando && !erro && campanhasFiltradas.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-8 text-center text-texto-suave"
                >
                  {termo
                    ? "Nenhuma campanha corresponde à pesquisa."
                    : "Nenhuma campanha cadastrada."}
                </td>
              </tr>
            )}

            {!carregando &&
              !erro &&
              campanhasFiltradas.map((campanha) => (
                <tr
                  key={campanha.id}
                  className="border-b border-borda last:border-0"
                >
                  <td className="px-3 py-4 font-medium">{campanha.nome}</td>

                  <td className="px-3 py-4 tabular-nums">
                    {formatarData(campanha.dataCriacao)}
                  </td>

                  <td className="px-3 py-4">
                    <Link
                      to={`/cancelamentos/campanhas/${campanha.id}`}
                      className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-destaque hover:underline"
                    >
                      Detalhes
                      <ArrowRight size={15} />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default Campanhas;
