import { Link } from "react-router-dom";
import { House, SearchX } from "lucide-react";

function PaginaNaoEncontrada() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border border-slate-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <SearchX size={32} className="text-[#3F7DD9]" />
        </div>

        <p className="mt-6 text-6xl font-bold text-[#183B70]">404</p>

        <h1 className="mt-4 text-2xl font-semibold">Página não encontrada</h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          O endereço informado não corresponde a nenhuma página disponível na
          ÁRIA. Verifique o endereço ou retorne ao Dashboard.
        </p>

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#183B70] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3F7DD9]"
        >
          <House size={18} />
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PaginaNaoEncontrada;
