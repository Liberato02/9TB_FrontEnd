import { Bell, BellOff } from "lucide-react";

import { usePainelFlutuante } from "../hooks/usePainelFlutuante";

function BotaoComunicados() {
  const { aberto, referencia, alternar } = usePainelFlutuante();

  return (
    <div ref={referencia} className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-label="Comunicados"
        aria-expanded={aberto}
        aria-controls="painel-comunicados"
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-borda-forte bg-superficie-suave text-texto transition-colors hover:bg-destaque-suave"
      >
        <Bell size={18} />
      </button>

      {aberto && (
        <div
          id="painel-comunicados"
          className="absolute right-0 top-12 z-20 w-80 rounded-xl border border-borda bg-superficie p-4 text-texto shadow-xl"
        >
          <p className="font-titulo text-xl font-semibold">Comunicados</p>

          <div className="mt-4 flex flex-col items-center rounded-lg bg-superficie-suave px-4 py-6 text-center">
            <BellOff size={22} className="text-texto-suave" />

            <p className="mt-3 text-sm font-medium">Nenhum comunicado</p>

            <p className="mt-1 text-xs leading-5 text-texto-secundario">
              Os avisos do tabelionato aparecerão aqui.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default BotaoComunicados;
