
export type SituacaoTituloCampanhaApi =
  | "ENCONTRADO_NO_PDF"
  | "NAO_ENCONTRADO_NO_PDF";

export type TituloCampanhaApi = {
  tituloId: number;
  numeroProtocolo: string;
  dataProtocolo: string;
  apresentante: string;
  valorTitulo: number | null;
  valorCustas: number | null;
  encontradoNoPdf: boolean;
  dataCancelamento: string | null;
  situacao: SituacaoTituloCampanhaApi;
};
