import { useState } from "react";
import { Moon, Sun } from "lucide-react";

type Tema = "claro" | "escuro";

function lerTemaAtual(): Tema {
  return document.documentElement.dataset.tema === "escuro"
    ? "escuro"
    : "claro";
}

function AlternarTema() {
  const [tema, setTema] = useState<Tema>(lerTemaAtual);

  const escuro = tema === "escuro";

  function alternar() {
    const proximo: Tema = escuro ? "claro" : "escuro";

    document.documentElement.dataset.tema = proximo;

    try {
      localStorage.setItem("aria-tema", proximo);
    } catch (erro) {
      console.warn("Não foi possível salvar a preferência de tema.", erro);
    }

    setTema(proximo);
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={escuro ? "Usar tema claro" : "Usar tema escuro"}
      title={escuro ? "Usar tema claro" : "Usar tema escuro"}
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-borda-forte bg-superficie-suave text-texto transition-colors hover:bg-destaque-suave"
    >
      {escuro ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default AlternarTema;
