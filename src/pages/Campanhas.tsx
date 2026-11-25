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
      <header className="mb-8">
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Campanhas históricas</h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte as campanhas registradas no sistema. Os dados desta listagem
          são obtidos do backend da ÁRIA.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-3">
          <Search size={20} className="text-slate-400" />

          <input
            type="text"
            placeholder="Pesquisar campanhas..."
            aria-label="Pesquisar campanhas"
            value={pesquisa}
            onChange={(evento) => setPesquisa(evento.target.value)}
            className="w-full outline-none placeholder:text-slate-400"
          />
        </div>
      </section>

      <section
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        aria-busy={carregando}
      >
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#3F7DD9]" size={22} />

            <p className="text-sm text-slate-500">Campanhas registradas</p>
          </div>

          <h3 className="mt-4 text-3xl font-semibold">{exibirTotal()}</h3>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <CalendarClock className="text-[#F27D70]" size={22} />

            <p className="text-sm text-slate-500">Último cadastro</p>
          </div>

          <h3 className="mt-4 text-3xl font-semibold">
            {exibirUltimoCadastro()}
          </h3>
        </article>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">Histórico de campanhas</h3>

        <p className="mt-2 text-sm text-slate-500">
          Relação de campanhas cadastradas no banco de dados.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
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
                    className="px-4 py-10 text-center text-slate-400"
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
                    className="px-4 py-10 text-center text-red-500"
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
                    className="px-4 py-10 text-center text-slate-400"
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
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-4 font-medium">{campanha.nome}</td>

                    <td className="px-4 py-4">
                      {formatarData(campanha.dataCriacao)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        to={`/campanhas/${campanha.id}`}
                        className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-50 px-3 py-2 font-medium text-[#183B70] transition-colors hover:bg-blue-100"
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
