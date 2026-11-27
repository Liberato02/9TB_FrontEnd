import { createContext, useContext } from "react";

import type { UsuarioConectado } from "../servicos/autenticacaoService";

export interface Sessao {
  usuario: UsuarioConectado | null;
  carregando: boolean;
  sessaoEncerrada: boolean;
  entrar: (identificador: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
}

export const ContextoSessao = createContext<Sessao | null>(null);

export function useSessao(): Sessao {
  const sessao = useContext(ContextoSessao);

  if (!sessao) {
    throw new Error("useSessao precisa estar dentro de ProvedorSessao.");
  }

  return sessao;
}
