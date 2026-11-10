import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type GraficoResultadosProps = {
  interesseImediato: number;
  interesseFuturo: number;
  semInteresse: number;
  telefonesIncorretos: number;
};

function GraficoResultados({
  interesseImediato,
  interesseFuturo,
  semInteresse,
  telefonesIncorretos,
}: GraficoResultadosProps) {
  const dados = [
    {
      nome: "Pagar agora",
      quantidade: interesseImediato,
    },
    {
      nome: "Pagar no futuro",
      quantidade: interesseFuturo,
    },
    {
      nome: "Sem interesse",
      quantidade: semInteresse,
    },
    {
      nome: "Telefone incorreto",
      quantidade: telefonesIncorretos,
    },
  ];

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          margin={{ top: 10, right: 10, left: 0, bottom: 35 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="nome"
            angle={-20}
            textAnchor="end"
            interval={0}
            height={75}
            tick={{ fontSize: 11 }}
          />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="quantidade"
            name="Análises"
            fill="#3F7DD9"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default GraficoResultados;
