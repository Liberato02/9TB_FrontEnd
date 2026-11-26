import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

function LayoutAutomacao() {
  return (
    <div className="min-h-screen bg-fundo text-texto md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
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
  );
}

export default LayoutAutomacao;
