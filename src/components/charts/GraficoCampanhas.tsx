import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { campanhas } from "../../data/campanhas";

function GraficoCampanhas() {
  const dadosGrafico = campanhas.map((campanha) => ({
    nome: campanha.periodo,
    analises: campanha.analises,
    contatos: campanha.contatosEfetivos,
  }));

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dadosGrafico}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="nome" />

          <YAxis />

          <Tooltip />

          <Legend />

          <Bar
            dataKey="analises"
            name="Análises realizadas"
            fill="#3F7DD9"
            radius={[6, 6, 0, 0]}
          />

          <Bar
            dataKey="contatos"
            name="Contatos efetivos"
            fill="#F27D70"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoCampanhas;
