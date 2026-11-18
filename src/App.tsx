
import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Sidebar from "./components/layout/Sidebar";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Campanhas = lazy(() => import("./pages/Campanhas"));
const DetalhesCampanha = lazy(() => import("./pages/DetalhesCampanha"));
const Analises = lazy(() => import("./pages/Analises"));
const Relatorios = lazy(() => import("./pages/Relatorios"));
const ImportarArquivos = lazy(() => import("./pages/ImportarArquivos"));
const Recomendacoes = lazy(() => import("./pages/Recomendacoes"));
const PaginaNaoEncontrada = lazy(
  () => import("./pages/PaginaNaoEncontrada"),
);
const Login = lazy(() => import("./pages/Login"));

function LayoutPrincipal() {
  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#183B70] md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Outlet />

        <p className="mt-8 text-xs text-slate-400">
          ÁRIA — Ambiente demonstrativo com dados fictícios.
        </p>
      </main>
    </div>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-live="polite"
          className="flex min-h-screen items-center justify-center bg-[#F6F8FC]"
        >
          <div className="rounded-xl border border-slate-100 bg-white px-8 py-6 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-[#3F7DD9]" />

            <p className="mt-4 text-sm text-slate-500">
              Carregando página...
            </p>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<LayoutPrincipal />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route
            path="/campanhas/:id"
            element={<DetalhesCampanha />}
          />
          <Route path="/analises" element={<Analises />} />
          <Route
            path="/importar-arquivos"
            element={<ImportarArquivos />}
          />
          <Route path="/recomendacoes" element={<Recomendacoes />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
