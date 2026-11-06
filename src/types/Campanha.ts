
export type StatusCampanha = 'Concluída' | 'Em análise'

export type Campanha = {
  id: number
  nome: string
  periodo: string
  devedores: number
  analises: number
  contatosEfetivos: number
  retornosAgendados: number
  status: StatusCampanha
}
