import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";

import { encontrarPaginaCancelamentos } from "../../automacoes/paginasCancelamentos";
import BotaoComunicados from "./BotaoComunicados";
import MenuUsuario from "./MenuUsuario";
import Sidebar from "./Sidebar";

function LayoutAutomacao() {
  const { pathname } = useLocation();
  const pagina = encontrarPaginaCancelamentos(pathname);

  return (
    <div className="min-h-screen bg-fundo text-texto md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <header className="flex items-start justify-between gap-6 border-b border-borda bg-superficie px-6 py-6 md:px-10">
          <div className="min-w-0">
            <h1 className="font-titulo text-4xl font-bold">{pagina?.titulo}</h1>

            <p className="mt-1 text-sm text-texto-secundario">
              {pagina?.descricao}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <BotaoComunicados />

            <MenuUsuario />
          </div>
        </header>

        <main className="p-6 md:p-10">
          <Suspense
            fallback={
              <div
                role="status"
                aria-live="polite"
                className="flex min-h-[50vh] items-center justify-center"
              >
                <div className="rounded-xl border border-borda bg-superficie px-8 py-6 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-destaque-suave-forte border-t-destaque" />

                  <p className="mt-4 text-sm text-texto-secundario">
                    Carregando página...
                  </p>
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default LayoutAutomacao;
