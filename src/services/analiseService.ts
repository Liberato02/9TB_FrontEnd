
import { analises } from "../data/analises";
import type { Analise } from "../types/Analise";

export async function listarAnalises(): Promise<Analise[]> {
  return analises;
}

export async function buscarAnalisePorId(
  id: number,
): Promise<Analise | undefined> {
  return analises.find((analise) => analise.id === id);
}

export async function listarAnalisesPorCampanha(
  campanhaId: number,
): Promise<Analise[]> {
  return analises.filter(
    (analise) => analise.campanhaId === campanhaId,
  );
}
