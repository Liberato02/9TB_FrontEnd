import { useState } from "react";
import { Moon } from "lucide-react";

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
      aria-pressed={escuro}
      className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-texto-secundario transition-colors hover:bg-superficie-suave hover:text-texto"
    >
      <Moon size={19} className="shrink-0" />

      <span>Tema escuro</span>

      <span
        aria-hidden="true"
        className={`ml-auto flex h-6 w-11 shrink-0 items-center rounded-md p-0.5 transition-colors ${
          escuro ? "bg-marca" : "bg-borda-forte"
        }`}
      >
        <span
          className={`h-5 w-5 rounded bg-white shadow-sm transition-transform ${
            escuro ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}

export default AlternarTema;
