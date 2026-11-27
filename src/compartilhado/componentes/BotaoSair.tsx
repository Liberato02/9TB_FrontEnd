import { useState } from "react";
import { LogOut } from "lucide-react";

import { useSessao } from "../sessao/contextoSessao";

function BotaoSair() {
  const { sair } = useSessao();
  const [saindo, setSaindo] = useState(false);

  async function aoClicar() {
    setSaindo(true);

    try {
      await sair();
    } finally {
      setSaindo(false);
    }
  }

  return (
    <button
      type="button"
      onClick={aoClicar}
      disabled={saindo}
      aria-label="Sair"
      title="Sair"
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-borda-forte bg-superficie-suave text-texto transition-colors hover:bg-destaque-suave disabled:opacity-60"
    >
      <LogOut size={18} />
    </button>
  );
}

export default BotaoSair;
