import { User } from "lucide-react";

import { usePainelFlutuante } from "../../hooks/usePainelFlutuante";
import AlternarTema from "./AlternarTema";

function MenuUsuario() {
  const { aberto, referencia, alternar } = usePainelFlutuante();

  return (
    <div ref={referencia} className="relative">
      <button
        type="button"
        onClick={alternar}
        aria-label="Menu do usuário"
        aria-expanded={aberto}
        aria-controls="menu-usuario"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca text-white transition-colors hover:bg-marca-forte"
      >
        <User size={18} />
      </button>

      {aberto && (
        <div
          id="menu-usuario"
          className="absolute right-0 top-12 z-20 w-64 rounded-xl border border-borda bg-superficie p-2 text-texto shadow-xl"
        >
          <AlternarTema />
        </div>
      )}
    </div>
  );
}

export default MenuUsuario;
