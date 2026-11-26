import { Link } from "react-router-dom";
import { House, SearchX } from "lucide-react";

function PaginaNaoEncontrada() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border border-borda bg-superficie p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destaque-suave">
          <SearchX size={32} className="text-destaque" />
        </div>

        <p className="mt-6 font-titulo text-7xl font-bold text-texto">404</p>

        <h1 className="mt-4 text-2xl font-semibold">Página não encontrada</h1>

        <p className="mt-3 text-sm leading-6 text-texto-secundario">
          O endereço informado não corresponde a nenhuma página disponível na
          ÁRIA. Verifique o endereço ou volte ao Início.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-marca px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-marca-forte"
        >
          <House size={18} />
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
}

export default PaginaNaoEncontrada;
