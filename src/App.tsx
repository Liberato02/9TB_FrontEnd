import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const Campanhas = lazy(() => import("./pages/Campanhas"));

const DetalhesCampanha = lazy(() => import("./pages/DetalhesCampanha"));

const Analises = lazy(() => import("./pages/Analises"));

const Relatorios = lazy(() => import("./pages/Relatorios"));

const ImportarArquivos = lazy(() => import("./pages/ImportarArquivos"));

const PaginaNaoEncontrada = lazy(() => import("./pages/PaginaNaoEncontrada"));

function App() {
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
          <Routes>
            <Route path="/" element={<Dashboard />} />

            <Route path="/campanhas" element={<Campanhas />} />

            <Route path="/campanhas/:id" element={<DetalhesCampanha />} />

            <Route path="/analises" element={<Analises />} />

            <Route path="/importar-arquivos" element={<ImportarArquivos />} />

            <Route path="/relatorios" element={<Relatorios />} />

            <Route path="*" element={<PaginaNaoEncontrada />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
