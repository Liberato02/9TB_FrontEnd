import { CalendarDays, Search, BarChart3, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listarCampanhas } from "../services/campanhaService";
import type { Campanha } from "../types/Campanha";

function Campanhas() {
  const [pesquisa, setPesquisa] = useState("");
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregarCampanhas() {
      try {
        const dados = await listarCampanhas();

        if (ativo) {
          setCampanhas(dados);
          setErro(false);
        }
      } catch (erro) {
        console.error("Erro ao carregar campanhas:", erro);

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

  const totalAnalises = campanhas.reduce(
    (total, campanha) => total + campanha.analises,
    0,
  );

  function exibirIndicador(valor: number): string {
    if (carregando) {
      return "Carregando...";
    }

    if (erro) {
      return "—";
    }

    return valor.toLocaleString("pt-BR");
  }

  const campanhasFiltradas = campanhas.filter((campanha) =>
    campanha.nome.toLowerCase().includes(pesquisa.toLowerCase()),
  );

  return (
    <div>
      {/* CABEÇALHO */}
      <header className="mb-8">
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Campanhas históricas</h2>

        <p className="mt-2 text-sm text-slate-500">
          Consulte o histórico e acompanhe os resultados das campanhas
          analisadas.
        </p>
      </header>

      {/* PESQUISA */}
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

      {/* INDICADORES */}
      <section
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
        aria-busy={carregando}
      >
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-[#3F7DD9]" size={22} />

            <p className="text-sm text-slate-500">Campanhas registradas</p>
          </div>

          <h3 className="mt-4 text-3xl font-semibold">
            {exibirIndicador(totalCampanhas)}
          </h3>
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-[#F27D70]" size={22} />

            <p className="text-sm text-slate-500">Análises realizadas</p>
          </div>

          <h3 className="mt-4 text-3xl font-semibold">
            {exibirIndicador(totalAnalises)}
          </h3>
        </article>
      </section>

      {/* HISTÓRICO */}
      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">Histórico de campanhas</h3>

        <p className="mt-2 text-sm text-slate-500">
          Consulte os indicadores e abra os detalhes de cada campanha
          registrada.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Campanha</th>
                <th className="px-4 py-3 font-medium">Período</th>
                <th className="px-4 py-3 font-medium">Devedores</th>
                <th className="px-4 py-3 font-medium">Análises</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>

            <tbody>
              {carregando && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Carregando campanhas...
                  </td>
                </tr>
              )}

              {!carregando && erro && (
                <tr>
                  <td
                    colSpan={6}
                    role="alert"
                    className="px-4 py-10 text-center text-red-500"
                  >
                    Não foi possível carregar as campanhas.
                  </td>
                </tr>
              )}

              {!carregando && !erro && campanhasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
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

                    <td className="px-4 py-4">{campanha.periodo}</td>

                    <td className="px-4 py-4">
                      {campanha.devedores.toLocaleString("pt-BR")}
                    </td>

                    <td className="px-4 py-4">
                      {campanha.analises.toLocaleString("pt-BR")}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          campanha.status === "Concluída"
                            ? "bg-green-50 text-green-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {campanha.status}
                      </span>
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

      <p className="mt-6 text-xs text-slate-400">
        Dados demonstrativos — ambiente de desenvolvimento.
      </p>
    </div>
  );
}

export default Campanhas;
