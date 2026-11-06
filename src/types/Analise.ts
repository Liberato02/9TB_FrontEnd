
export type TipoContato = "Realizado" | "Fracassado";

export type ResultadoContato =
  | "Interesse em pagar agora"
  | "Interesse em pagar no futuro"
  | "Não tem interesse em pagar"
  | "Telefone não pertence ao devedor";

export type CanalEnvioBoleto = "Email" | "WhatsApp";

export type Analise = {
  id: number;
  campanhaId: number;
  dataAnalise: string;

  tipoContato: TipoContato;
  resultadoContato?: ResultadoContato;

  canalEnvioBoleto?: CanalEnvioBoleto;

  atendimentoAgendado: boolean;
  dataAgendamento?: string;
};
