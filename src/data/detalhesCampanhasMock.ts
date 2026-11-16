
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";
import type { TituloApi } from "../types/TituloApi";

type DetalhesCampanhaMock = {
  indicadores: IndicadoresCampanhaApi;
  titulos: TituloApi[];
};

export const detalhesCampanhasMock: Record<
  number,
  DetalhesCampanhaMock
> = {
  1: {
    indicadores: {
      campanhaId: 1,
      totalTitulos: 2,
      titulosCancelados: 1,
      naoEncontradosNosPdfs: 1,
      percentualCancelados: 50,
    },
    titulos: [
      {
        id: 101,
        numeroProtocolo: "0652",
        dataProtocolo: "2026-01-03",
        apresentante: "Apresentante fictício A",
        valorTitulo: 546.73,
        valorCustas: 150.5,
        encontradoNoPdf: true,
        dataCancelamento: "2026-01-20",
        situacao: "ENCONTRADO_NO_PDF",
      },
      {
        id: 102,
        numeroProtocolo: "0789",
        dataProtocolo: "2026-01-04",
        apresentante: "Apresentante fictício B",
        valorTitulo: 1200,
        valorCustas: 180,
        encontradoNoPdf: false,
        dataCancelamento: null,
        situacao: "NAO_ENCONTRADO_NO_PDF",
      },
    ],
  },

  2: {
    indicadores: {
      campanhaId: 2,
      totalTitulos: 2,
      titulosCancelados: 0,
      naoEncontradosNosPdfs: 2,
      percentualCancelados: 0,
    },
    titulos: [
      {
        id: 201,
        numeroProtocolo: "1234",
        dataProtocolo: "2026-02-10",
        apresentante: "Apresentante fictício A",
        valorTitulo: 890,
        valorCustas: 120,
        encontradoNoPdf: false,
        dataCancelamento: null,
        situacao: "NAO_ENCONTRADO_NO_PDF",
      },
      {
        id: 202,
        numeroProtocolo: "1456",
        dataProtocolo: "2026-02-12",
        apresentante: "Apresentante fictício C",
        valorTitulo: 2300,
        valorCustas: 250,
        encontradoNoPdf: false,
        dataCancelamento: null,
        situacao: "NAO_ENCONTRADO_NO_PDF",
      },
    ],
  },

  3: {
    indicadores: {
      campanhaId: 3,
      totalTitulos: 2,
      titulosCancelados: 2,
      naoEncontradosNosPdfs: 0,
      percentualCancelados: 100,
    },
    titulos: [
      {
        id: 301,
        numeroProtocolo: "2567",
        dataProtocolo: "2026-03-01",
        apresentante: "Apresentante fictício B",
        valorTitulo: 1750,
        valorCustas: 190,
        encontradoNoPdf: true,
        dataCancelamento: "2026-03-15",
        situacao: "ENCONTRADO_NO_PDF",
      },
      {
        id: 302,
        numeroProtocolo: "2890",
        dataProtocolo: "2026-03-03",
        apresentante: "Apresentante fictício C",
        valorTitulo: 680,
        valorCustas: 95,
        encontradoNoPdf: true,
        dataCancelamento: "2026-03-18",
        situacao: "ENCONTRADO_NO_PDF",
      },
    ],
  },
};
