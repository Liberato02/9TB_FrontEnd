
export type Recomendacao = {
  id: number;
  titulo: string;
  dataCriacao: string;
  publicoAlvo: string;
  periodoSugerido: string;
  apresentanteSugerido: string | null;
  campanhaReferenciaId: number | null;
  justificativas: string[];
  indicadoresUtilizados: {
    descricao: string;
    valor: string;
  }[];
  demonstrativa: boolean;
};
