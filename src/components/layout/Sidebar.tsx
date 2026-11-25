import { useState } from "react";
import {
  BrainCircuit,
  LayoutDashboard,
  History,
  ChartNoAxesCombined,
  FileBarChart,
  Settings,
  FileUp,
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menu = [
  {
    nome: "Visão geral",
    icone: LayoutDashboard,
    caminho: "/",
  },
  {
    nome: "Campanhas históricas",
    icone: History,
    caminho: "/campanhas",
  },
  {
    nome: "Análises",
    icone: ChartNoAxesCombined,
    caminho: "/analises",
  },
  {
    nome: "Importar Arquivos",
    icone: FileUp,
    caminho: "/importar-arquivos",
  },
  {
    nome: "Relatórios",
    icone: FileBarChart,
    caminho: "/relatorios",
  },
];

function Sidebar() {
  const [menuAberto, setMenuAberto] = useState(false);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-6 md:min-h-screen md:w-72 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#183B70]">
            <BrainCircuit className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">ÁRIA</h1>

            <p className="text-xs text-slate-500">Inteligência de Dados</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((atual) => !atual)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="menu-navegacao-aria"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#183B70] transition-colors hover:bg-blue-50 md:hidden"
        >
          {menuAberto ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      <div
        id="menu-navegacao-aria"
        className={`mt-6 md:mt-12 md:block ${menuAberto ? "block" : "hidden"}`}
      >
        <nav aria-label="Navegação principal" className="space-y-2">
          {menu.map((item) => {
            const Icone = item.icone;

            return (
              <NavLink
                key={item.caminho}
                to={item.caminho}
                end={item.caminho === "/"}
                onClick={fecharMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-[#183B70]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-[#183B70]"
                  }`
                }
              >
                <Icone size={19} className="shrink-0" />

                <span>{item.nome}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-12 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3 px-4 text-sm text-slate-500">
            <Settings size={19} className="shrink-0" />

            <span>Configurações</span>

            <span className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-400">
              Em breve
            </span>
          </div>

          <p className="mt-8 px-4 text-xs leading-5 text-slate-400">
            9º Tabelionato de Protesto de São Paulo
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
