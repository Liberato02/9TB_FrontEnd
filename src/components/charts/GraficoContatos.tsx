import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type GraficoContatosProps = {
  realizados: number;
  fracassados: number;
};

function GraficoContatos({ realizados, fracassados }: GraficoContatosProps) {
  const dados = [
    {
      nome: "Realizados",
      quantidade: realizados,
      cor: "#3F7DD9",
    },
    {
      nome: "Fracassados",
      quantidade: fracassados,
      cor: "#F27D70",
    },
  ];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis dataKey="nome" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar dataKey="quantidade" name="Contatos" radius={[8, 8, 0, 0]}>
            {dados.map((item) => (
              <Cell key={item.nome} fill={item.cor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoContatos;
