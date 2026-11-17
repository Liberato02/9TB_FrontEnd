
import { campanhas } from "../data/campanhas";

import type { Campanha } from "../types/Campanha";
import type { CampanhaApi } from "../types/CampanhaApi";

// Funções existentes com dados demonstrativos.
// Mantidas temporariamente para preservar as telas.

export async function listarCampanhas(): Promise<Campanha[]> {
  return campanhas;
}

export async function buscarCampanhaPorId(
  id: number
): Promise<Campanha | undefined> {
  return campanhas.find((campanha) => campanha.id === id);
}

// Nova função: consulta campanhas reais no backend.

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
