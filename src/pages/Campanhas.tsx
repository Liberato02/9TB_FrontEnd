import { CalendarDays, CalendarClock, Search, Eye } from "lucide-react";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listarCampanhasApi } from "../services/campanhaService";
import type { CampanhaApi } from "../types/CampanhaApi";

function formatarData(data: string): string {
  const resultado = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);

  if (!resultado) {
    return "Não informada";
  }

  const [, ano, mes, dia] = resultado;

  return `${dia}/${mes}/${ano}`;
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

  const totalCampanhas = campanhas.length;

  const ultimaDataCriacao = campanhas.reduce(
    (maisRecente, campanha) =>
      campanha.dataCriacao > maisRecente ? campanha.dataCriacao : maisRecente,
    "",
  );

  const campanhasFiltradas = campanhas.filter((campanha) =>
    campanha.nome.toLowerCase().includes(pesquisa.trim().toLowerCase()),
  );

  function exibirTotal(): string {
    if (carregando) {
      return "Carregando...";
    }

    if (erro) {
      return "Indisponível";
    }

    return totalCampanhas.toLocaleString("pt-BR");
  }

  function exibirUltimoCadastro(): string {
    if (carregando) {
      return "Carregando...";
    }

    if (erro) {
      return "Indisponível";
    }

    if (!ultimaDataCriacao) {
      return "Nenhum";
    }

    return formatarData(ultimaDataCriacao);
  }

  return (
    <div>
      <section className="mb-6 rounded-2xl border border-borda bg-superficie p-6">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-texto-suave" />

          <input
            type="text"
            placeholder="Pesquisar campanhas..."
            aria-label="Pesquisar campanhas"
            value={pesquisa}
            onChange={(evento) => setPesquisa(evento.target.value)}
            className="w-full outline-none placeholder:text-texto-suave"
          />
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        aria-busy={carregando}
      >
        <article className="rounded-2xl border border-borda bg-superficie p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-destaque" size={22} />

            <p className="text-sm text-texto-secundario">Campanhas registradas</p>
          </div>

          <h3 className="mt-4 font-titulo text-4xl font-bold">{exibirTotal()}</h3>
        </article>

        <article className="rounded-2xl border border-borda bg-superficie p-6">
          <div className="flex items-center gap-3">
            <CalendarClock className="text-coral-texto" size={22} />

            <p className="text-sm text-texto-secundario">Último cadastro</p>
          </div>

          <h3 className="mt-4 font-titulo text-4xl font-bold">
            {exibirUltimoCadastro()}
          </h3>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-borda bg-superficie p-6">
        <h3 className="text-lg font-semibold">Histórico de campanhas</h3>

        <p className="mt-2 text-sm text-texto-secundario">
          Relação de campanhas cadastradas no banco de dados.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-borda text-texto-secundario">
              <tr>
                <th className="px-4 py-3 font-medium">Campanha</th>

                <th className="px-4 py-3 font-medium">Data de cadastro</th>

                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-10 text-center text-texto-suave"
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
                    className="px-4 py-10 text-center text-erro"
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
                    className="px-4 py-10 text-center text-texto-suave"
                  >
                    {pesquisa.trim()
                      ? "Nenhuma campanha corresponde à pesquisa."
                      : "Nenhuma campanha encontrada."}
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
                    <td className="px-4 py-4 font-medium">{campanha.nome}</td>

                    <td className="px-4 py-4">
                      {formatarData(campanha.dataCriacao)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        to={`/cancelamentos/campanhas/${campanha.id}`}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-destaque-suave px-3 py-2 font-medium text-texto transition-colors hover:bg-destaque-suave-forte"
                      >
                        <Eye size={17} />
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Campanhas;
