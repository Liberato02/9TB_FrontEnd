import { useState } from "react";
import {
  ArrowLeft,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import type { NavegacaoAutomacao } from "../tipos/NavegacaoAutomacao";
import SimboloAria from "./SimboloAria";

type SidebarProps = {
  navegacao: NavegacaoAutomacao;
};

const chaveRecolhido = "aria-menu-recolhido";

function lerRecolhido() {
  try {
    return window.localStorage.getItem(chaveRecolhido) === "sim";
  } catch {
    return false;
  }
}

function Sidebar({ navegacao }: SidebarProps) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [recolhido, setRecolhido] = useState(lerRecolhido);
  const IconeAutomacao = navegacao.icone;
  const sumirTexto = `transition-opacity duration-200 ${recolhido ? "md:opacity-0" : ""}`;

  function fecharMenu() {
    setMenuAberto(false);
  }

  function alternarRecolhido() {
    const novo = !recolhido;

    setRecolhido(novo);

    try {
      window.localStorage.setItem(chaveRecolhido, novo ? "sim" : "nao");
    } catch {
      return;
    }
  }

  return (
    <aside
      data-tema="escuro"
      className={`w-full bg-noite px-4 py-6 text-texto md:flex md:h-screen md:shrink-0 md:flex-col md:overflow-hidden md:transition-[width] md:duration-300 md:ease-in-out ${recolhido ? "md:w-[76px]" : "md:w-72"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={fecharMenu}
          aria-label="ÁRIA, ir para o Início"
          title={recolhido ? "Ir para o Início" : undefined}
          className="flex items-center gap-3 rounded-lg px-1"
        >
          <SimboloAria className="h-9 w-auto shrink-0" />

          <span
            className={`font-titulo text-3xl font-bold tracking-wide text-white whitespace-nowrap ${sumirTexto}`}
          >
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
          title={recolhido ? "Todas as automações" : undefined}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-texto-secundario transition-colors duration-200 hover:bg-superficie-suave hover:text-texto"
        >
          <ArrowLeft size={17} className="shrink-0" />

          <span className={`whitespace-nowrap ${sumirTexto}`}>
            Todas as automações
          </span>
        </Link>

        <div
          className="mt-8 flex items-center gap-3 px-1.5"
          title={recolhido ? navegacao.nome : undefined}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-coral text-noite">
            <IconeAutomacao size={17} />
          </div>

          <h2
            className={`font-titulo text-2xl font-semibold w-48 shrink-0 leading-tight text-white ${sumirTexto}`}
          >
            {navegacao.nome}
          </h2>
        </div>

        <nav aria-label={navegacao.nome} className="mt-4 space-y-1">
          {navegacao.menu.map((item) => {
            const Icone = item.icone;

            return (
              <NavLink
                key={item.caminho}
                to={item.caminho}
                onClick={fecharMenu}
                title={recolhido ? item.nome : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-destaque-suave-forte text-white"
                      : "text-texto-secundario hover:bg-superficie-suave hover:text-texto"
                  }`
                }
              >
                <Icone size={19} className="shrink-0" />

                <span className={`whitespace-nowrap ${sumirTexto}`}>
                  {item.nome}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <p
          className={`mt-10 w-56 px-3 text-xs leading-5 text-texto-suave md:mt-auto ${sumirTexto}`}
        >
          9º Tabelionato de Protesto de São Paulo
        </p>

        <button
          type="button"
          onClick={alternarRecolhido}
          aria-label={
            recolhido ? "Abrir menu lateral" : "Recolher menu lateral"
          }
          title={recolhido ? "Abrir menu lateral" : undefined}
          className="mt-4 hidden items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-texto-secundario transition-colors duration-200 hover:bg-superficie-suave hover:text-texto md:flex"
        >
          {recolhido ? (
            <PanelLeftOpen size={19} className="shrink-0" />
          ) : (
            <PanelLeftClose size={19} className="shrink-0" />
          )}

          <span className={`whitespace-nowrap ${sumirTexto}`}>
            Recolher menu
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
