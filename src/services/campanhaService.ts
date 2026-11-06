
import { campanhas } from '../data/campanhas'
import type { Campanha } from '../types/Campanha'

export async function listarCampanhas(): Promise<Campanha[]> {
  return campanhas
}

export async function buscarCampanhaPorId(
  id: number
): Promise<Campanha | undefined> {
  return campanhas.find((campanha) => campanha.id === id)
}
