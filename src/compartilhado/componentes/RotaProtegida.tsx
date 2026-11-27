import { Navigate, Outlet } from "react-router-dom";

import { useSessao } from "../sessao/contextoSessao";

function RotaProtegida() {
  const { usuario, carregando } = useSessao();

  if (carregando) {
    return <div className="min-h-screen bg-noite" />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RotaProtegida;
