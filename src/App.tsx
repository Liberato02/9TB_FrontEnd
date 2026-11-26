import { lazy } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";

import { navegacaoCancelamentos } from "./automacoes/cancelamentos/navegacao";
import LayoutAutomacao from "./compartilhado/componentes/LayoutAutomacao";
import Inicio from "./paginas/Inicio";
import PaginaNaoEncontrada from "./paginas/PaginaNaoEncontrada";

const VisaoGeral = lazy(
  () => import("./automacoes/cancelamentos/telas/VisaoGeral"),
);

const Campanhas = lazy(
  () => import("./automacoes/cancelamentos/telas/Campanhas"),
);

const DetalhesCampanha = lazy(
  () => import("./automacoes/cancelamentos/telas/DetalhesCampanha"),
);

const ImportarArquivos = lazy(
  () => import("./automacoes/cancelamentos/telas/ImportarArquivos"),
);

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
        element={<Navigate to="/cancelamentos/visao-geral" replace />}
      />

      <Route
        path="/importar-arquivos"
        element={<Navigate to="/cancelamentos/importar" replace />}
      />

      <Route
        path="/relatorios"
        element={<Navigate to="/cancelamentos/campanhas" replace />}
      />

      <Route element={<LayoutAutomacao navegacao={navegacaoCancelamentos} />}>
        <Route path="/cancelamentos/visao-geral" element={<VisaoGeral />} />

        <Route path="/cancelamentos/campanhas" element={<Campanhas />} />

        <Route
          path="/cancelamentos/campanhas/:id"
          element={<DetalhesCampanha />}
        />

        <Route
          path="/cancelamentos/analises"
          element={<Navigate to="/cancelamentos/visao-geral" replace />}
        />

        <Route path="/cancelamentos/importar" element={<ImportarArquivos />} />

        <Route
          path="/cancelamentos/relatorios"
          element={<Navigate to="/cancelamentos/campanhas" replace />}
        />
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
