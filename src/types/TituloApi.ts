
export type SituacaoTituloApi =
  | "ENCONTRADO_NO_PDF"
  | "NAO_ENCONTRADO_NO_PDF";

export type TituloApi = {
  id: number;
  numeroProtocolo: string;
  dataProtocolo: string;
  apresentante: string;
  valorTitulo: number;
  valorCustas: number;
  encontradoNoPdf: boolean;
  dataCancelamento: string | null;
  situacao: SituacaoTituloApi;
};
