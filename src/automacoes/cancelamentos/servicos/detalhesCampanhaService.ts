
import type { CampanhaApi } from "../tipos/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../tipos/IndicadoresCampanhaApi";
import type { TituloCampanhaApi } from "../tipos/TituloCampanhaApi";

// Classe para identificar erros retornados pela API.
export class ErroConsultaApi extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);

    this.name = "ErroConsultaApi";
    this.status = status;
  }
}

// Função genérica para consultar o backend.
async function consultarApi<T>(caminho: string): Promise<T> {
  const resposta = await fetch(caminho, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!resposta.ok) {
    throw new ErroConsultaApi(
      resposta.status,
      `Erro ao consultar a API. HTTP ${resposta.status}`,
    );
  }

  return (await resposta.json()) as T;
}

// Busca os dados reais de uma campanha.
export async function buscarCampanhaApiPorId(
  id: number,
): Promise<CampanhaApi> {
  return consultarApi<CampanhaApi>(
    `/api/campanhas/${id}`,
  );
}

// Busca os indicadores reais de cancelamentos.
export async function buscarIndicadoresCampanhaApi(
  id: number,
): Promise<IndicadoresCampanhaApi> {
  return consultarApi<IndicadoresCampanhaApi>(
    `/api/campanhas/${id}/indicadores`,
  );
}

// Busca os títulos vinculados à campanha.
export async function listarTitulosCampanhaApi(
  id: number,
): Promise<TituloCampanhaApi[]> {
  return consultarApi<TituloCampanhaApi[]>(
    `/api/campanhas/${id}/titulos`,
  );
}
