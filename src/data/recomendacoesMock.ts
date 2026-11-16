
import type { Recomendacao } from "../types/Recomendacao";

export const recomendacoesMock: Recomendacao[] = [
  {
    id: 1,
    titulo: "Recomendação demonstrativa 001",
    dataCriacao: "2026-11-16",
    publicoAlvo: "Pessoas jurídicas (CNPJ)",
    periodoSugerido: "Primeira quinzena do mês",
    apresentanteSugerido: "Apresentante fictício A",
    campanhaReferenciaId: 1,
    justificativas: [
      "Exemplo de como a ÁRIA poderá apresentar critérios para selecionar o público de uma campanha.",
      "A recomendação definitiva dependerá da análise de dados históricos e de regras de negócio validadas.",
      "Os cancelamentos encontrados nos PDFs não comprovam que foram causados por campanhas anteriores.",
    ],
    indicadoresUtilizados: [
      {
        descricao: "Total de títulos na campanha de referência",
        valor: "2",
      },
      {
        descricao: "Cancelamentos encontrados nos PDFs",
        valor: "1",
      },
      {
        descricao: "Percentual com cancelamento encontrado",
        valor: "50%",
      },
    ],
    demonstrativa: true,
  },
  {
    id: 2,
    titulo: "Recomendação demonstrativa 002",
    dataCriacao: "2026-11-10",
    publicoAlvo: "Pessoas físicas (CPF)",
    periodoSugerido: "Segunda quinzena do mês",
    apresentanteSugerido: null,
    campanhaReferenciaId: 2,
    justificativas: [
      "Exemplo fictício de uma recomendação voltada a pessoas físicas.",
      "A escolha do público e do período não representa uma conclusão estatística real.",
    ],
    indicadoresUtilizados: [
      {
        descricao: "Total de títulos na campanha de referência",
        valor: "2",
      },
      {
        descricao: "Cancelamentos encontrados nos PDFs",
        valor: "0",
      },
      {
        descricao: "Percentual com cancelamento encontrado",
        valor: "0%",
      },
    ],
    demonstrativa: true,
  },
];
