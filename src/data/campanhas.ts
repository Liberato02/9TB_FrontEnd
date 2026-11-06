
import type { Campanha } from '../types/Campanha'

export const campanhas: Campanha[] = [
  {
    id: 1,
    nome: 'Campanha Janeiro 2026',
    periodo: 'Janeiro/2026',
    devedores: 850,
    analises: 620,
    contatosEfetivos: 285,
    retornosAgendados: 110,
    status: 'Concluída',
  },
  {
    id: 2,
    nome: 'Campanha Fevereiro 2026',
    periodo: 'Fevereiro/2026',
    devedores: 780,
    analises: 590,
    contatosEfetivos: 260,
    retornosAgendados: 95,
    status: 'Concluída',
  },
  {
    id: 3,
    nome: 'Campanha Março 2026',
    periodo: 'Março/2026',
    devedores: 850,
    analises: 616,
    contatosEfetivos: 310,
    retornosAgendados: 109,
    status: 'Em análise',
  },
]
