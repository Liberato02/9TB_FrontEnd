import { Suspense, useEffect, useRef } from "react";
import { matchPath, Outlet, useLocation } from "react-router-dom";

import type { NavegacaoAutomacao } from "../tipos/NavegacaoAutomacao";
import AlternarTema from "./AlternarTema";
import BotaoComunicados from "./BotaoComunicados";
import BotaoSair from "./BotaoSair";
import Sidebar from "./Sidebar";

type LayoutAutomacaoProps = {
  navegacao: NavegacaoAutomacao;
};

function LayoutAutomacao({ navegacao }: LayoutAutomacaoProps) {
  const { pathname } = useLocation();
  const painelRef = useRef<HTMLElement>(null);
  const pagina = navegacao.paginas.find((item) =>
    matchPath(item.caminho, pathname),
  );

  useEffect(() => {
    painelRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-noite md:flex md:h-screen md:overflow-hidden">
      <Sidebar navegacao={navegacao} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          data-tema="escuro"
          className="flex items-start justify-between gap-6 px-6 pt-6 pb-5 text-texto md:pr-8 md:pl-4"
        >
          <div key={pathname} className="animacao-entrada min-w-0">
            <h1 className="font-titulo text-4xl font-bold text-white">
              {pagina?.titulo}
            </h1>

            <p className="mt-1 text-sm text-texto-secundario">
              {pagina?.descricao}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <AlternarTema />

            <BotaoComunicados />

            <BotaoSair />
          </div>
        </header>

        <main
          ref={painelRef}
          className="flex-1 rounded-t-2xl bg-fundo p-6 text-texto md:mr-3 md:mb-3 md:overflow-y-auto md:rounded-2xl md:p-10"
        >
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
            <div key={pathname} className="animacao-entrada">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default LayoutAutomacao;
