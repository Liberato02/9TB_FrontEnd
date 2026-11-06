import GraficoCampanhas from "../components/charts/GraficoCampanhas";
import { campanhas } from "../data/campanhas";

const totalCampanhas = campanhas.length;

const totalDevedores = campanhas.reduce(
  (total, campanha) => total + campanha.devedores,
  0,
);

const totalAnalises = campanhas.reduce(
  (total, campanha) => total + campanha.analises,
  0,
);

const totalRetornos = campanhas.reduce(
  (total, campanha) => total + campanha.retornosAgendados,
  0,
);

const indicadores = [
  {
    titulo: "Campanhas analisadas",
    valor: totalCampanhas.toLocaleString("pt-BR"),
    cor: "text-[#183B70]",
  },
  {
    titulo: "Devedores incluídos",
    valor: totalDevedores.toLocaleString("pt-BR"),
    cor: "text-[#183B70]",
  },
  {
    titulo: "Análises realizadas",
    valor: totalAnalises.toLocaleString("pt-BR"),
    cor: "text-[#3F7DD9]",
  },
  {
    titulo: "Retornos agendados",
    valor: totalRetornos.toLocaleString("pt-BR"),
    cor: "text-[#F27D70]",
  },
];

function Dashboard() {
  return (
    <>
      <header className="mb-10">
        <p className="text-sm text-slate-500">ÁRIA / Painel de inteligência</p>

        <h2 className="mt-2 text-3xl font-semibold">Visão geral</h2>

        <p className="mt-2 text-sm text-slate-500">
          Acompanhe os indicadores e resultados históricos das campanhas.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map((indicador) => (
          <article
            key={indicador.titulo}
            className="rounded-2xl border border-slate-100 bg-white p-6"
          >
            <p className="text-sm text-slate-500">{indicador.titulo}</p>

            <h3 className={`mt-4 text-3xl font-semibold ${indicador.cor}`}>
              {indicador.valor}
            </h3>
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-8">
        <h3 className="text-lg font-semibold">Evolução das análises</h3>

        <p className="mt-2 text-sm text-slate-500">
          Visualização histórica dos resultados das campanhas.
        </p>

        <div className="mt-6">
          <GraficoCampanhas />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
