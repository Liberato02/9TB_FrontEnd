import { useState } from "react";
import {
  ArrowLeft,
  ChartNoAxesCombined,
  FileBarChart,
  Folder,
  LayoutGrid,
  Menu,
  Upload,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import SimboloAria from "../marca/SimboloAria";

const menu = [
  {
    nome: "Visão geral",
    icone: LayoutGrid,
    caminho: "/cancelamentos/visao-geral",
  },
  {
    nome: "Campanhas",
    icone: Folder,
    caminho: "/cancelamentos/campanhas",
  },
  {
    nome: "Análises",
    icone: ChartNoAxesCombined,
    caminho: "/cancelamentos/analises",
  },
  {
    nome: "Importar arquivos",
    icone: Upload,
    caminho: "/cancelamentos/importar",
  },
  {
    nome: "Relatórios",
    icone: FileBarChart,
    caminho: "/cancelamentos/relatorios",
  },
];

function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <aside
      data-tema="escuro"
      className="w-full bg-noite p-6 text-texto md:sticky md:top-0 md:flex md:h-screen md:w-72 md:shrink-0 md:flex-col"
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={fecharMenu}
          aria-label="ÁRIA, ir para o Início"
          className="flex items-center gap-3 rounded-lg"
        >
          <SimboloAria className="h-9 w-auto" />

          <span className="font-titulo text-2xl font-bold tracking-wide text-white">
            ÁRIA
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setMenuAberto((atual) => !atual)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="menu-navegacao-aria"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-borda-forte bg-superficie-suave text-texto transition-colors hover:bg-destaque-suave md:hidden"
        >
          {menuAberto ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div
        id="menu-navegacao-aria"
        className={`mt-8 md:mt-10 md:flex md:flex-1 md:flex-col ${menuAberto ? "block" : "hidden"}`}
      >
        <Link
          to="/"
          onClick={fecharMenu}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-texto-secundario transition-colors hover:bg-superficie-suave hover:text-texto"
        >
          <ArrowLeft size={17} className="shrink-0" />
          Todas as automações
        </Link>

        <p className="mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-coral-texto">
          Campanhas de cancelamento
        </p>

        <nav aria-label="Campanhas de cancelamento" className="mt-3 space-y-1">
          {menu.map((item) => {
            const Icone = item.icone;

            return (
              <NavLink
                key={item.caminho}
                to={item.caminho}
                onClick={fecharMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-destaque-suave-forte text-white"
                      : "text-texto-secundario hover:bg-superficie-suave hover:text-texto"
                  }`
                }
              >
                <Icone size={19} className="shrink-0" />

                <span>{item.nome}</span>
              </NavLink>
            );
          })}
        </nav>

        <p className="mt-10 px-3 text-xs leading-5 text-texto-suave md:mt-auto">
          9º Tabelionato de Protesto de São Paulo
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
