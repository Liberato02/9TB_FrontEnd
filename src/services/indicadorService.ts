
import type { Analise } from "../types/Analise";

export type IndicadoresAnalises = {
  totalAnalises: number;
  contatosRealizados: number;
  contatosFracassados: number;
  interesseImediato: number;
  interesseFuturo: number;
  semInteresse: number;
  telefonesIncorretos: number;
  boletosEmail: number;
  boletosWhatsApp: number;
  atendimentosAgendados: number;
};

export function calcularIndicadores(
  analises: Analise[],
): IndicadoresAnalises {
  return {
    totalAnalises: analises.length,

    contatosRealizados: analises.filter(
      (analise) => analise.tipoContato === "Realizado",
    ).length,

    contatosFracassados: analises.filter(
      (analise) => analise.tipoContato === "Fracassado",
    ).length,

    interesseImediato: analises.filter(
      (analise) =>
        analise.resultadoContato === "Interesse em pagar agora",
    ).length,

    interesseFuturo: analises.filter(
      (analise) =>
        analise.resultadoContato === "Interesse em pagar no futuro",
    ).length,

    semInteresse: analises.filter(
      (analise) =>
        analise.resultadoContato === "Não tem interesse em pagar",
    ).length,

    telefonesIncorretos: analises.filter(
      (analise) =>
        analise.resultadoContato === "Telefone não pertence ao devedor",
    ).length,

    boletosEmail: analises.filter(
      (analise) => analise.canalEnvioBoleto === "Email",
    ).length,

    boletosWhatsApp: analises.filter(
      (analise) => analise.canalEnvioBoleto === "WhatsApp",
    ).length,

    atendimentosAgendados: analises.filter(
      (analise) => analise.atendimentoAgendado,
    ).length,
  };
}
