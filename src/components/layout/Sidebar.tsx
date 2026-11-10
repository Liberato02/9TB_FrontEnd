import {
  BrainCircuit,
  LayoutDashboard,
  History,
  ChartNoAxesCombined,
  FileBarChart,
  Settings,
  FileUp,
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
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-6 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
      {/* IDENTIDADE DA ÁRIA */}
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#183B70]">
          <BrainCircuit className="h-7 w-7 text-white" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">ÁRIA</h1>
          <p className="text-xs text-slate-500">Inteligência de Dados</p>
        </div>
      </div>

      {/* NAVEGAÇÃO */}
      <nav className="space-y-2">
        {menu.map((item) => {
          const Icone = item.icone;

          return (
            <NavLink
              key={item.caminho}
              to={item.caminho}
              end={item.caminho === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-[#183B70]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#183B70]"
                }`
              }
            >
              <Icone size={19} />
              <span>{item.nome}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* RODAPÉ */}
      <div className="mt-12 border-t border-slate-100 pt-6">
        <div className="flex items-center gap-3 px-4 text-sm text-slate-500">
          <Settings size={19} />
          <span>Configurações</span>
        </div>

        <p className="mt-8 px-4 text-xs text-slate-400">
          9º Tabelionato de Protesto de São Paulo
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
