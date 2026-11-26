import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import LayoutAutomacao from "./components/layout/LayoutAutomacao";
import Inicio from "./pages/Inicio";
import PaginaNaoEncontrada from "./pages/PaginaNaoEncontrada";

const Dashboard = lazy(() => import("./pages/Dashboard"));

const Campanhas = lazy(() => import("./pages/Campanhas"));

const DetalhesCampanha = lazy(() => import("./pages/DetalhesCampanha"));

const Analises = lazy(() => import("./pages/Analises"));

const Relatorios = lazy(() => import("./pages/Relatorios"));

const ImportarArquivos = lazy(() => import("./pages/ImportarArquivos"));

function RedirecionarDetalheCampanha() {
  const { id } = useParams();

  return <Navigate to={`/cancelamentos/campanhas/${id}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />

      <Route
        path="/cancelamentos"
        element={<Navigate to="/cancelamentos/visao-geral" replace />}
      />

      <Route
        path="/campanhas"
        element={<Navigate to="/cancelamentos/campanhas" replace />}
      />

      <Route path="/campanhas/:id" element={<RedirecionarDetalheCampanha />} />

      <Route
        path="/analises"
        element={<Navigate to="/cancelamentos/analises" replace />}
      />

      <Route
        path="/importar-arquivos"
        element={<Navigate to="/cancelamentos/importar" replace />}
      />

      <Route
        path="/relatorios"
        element={<Navigate to="/cancelamentos/relatorios" replace />}
      />

      <Route element={<LayoutAutomacao />}>
        <Route path="/cancelamentos/visao-geral" element={<Dashboard />} />

        <Route path="/cancelamentos/campanhas" element={<Campanhas />} />

        <Route
          path="/cancelamentos/campanhas/:id"
          element={<DetalhesCampanha />}
        />

        <Route path="/cancelamentos/analises" element={<Analises />} />

        <Route path="/cancelamentos/importar" element={<ImportarArquivos />} />

        <Route path="/cancelamentos/relatorios" element={<Relatorios />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-screen bg-fundo p-6 text-texto">
            <PaginaNaoEncontrada />
          </div>
        }
      />
    </Routes>
  );
}

export default App;
