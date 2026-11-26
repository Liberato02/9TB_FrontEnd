import type { CampanhaApi } from "../tipos/CampanhaApi";

export async function listarCampanhasApi(): Promise<CampanhaApi[]> {
  const resposta = await fetch("/api/campanhas", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!resposta.ok) {
    throw new Error(
      `Erro ao consultar campanhas. HTTP ${resposta.status}`
    );
  }

  const dados: CampanhaApi[] = await resposta.json();

  return dados;
}