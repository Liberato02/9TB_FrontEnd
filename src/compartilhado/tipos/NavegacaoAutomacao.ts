import type { LucideIcon } from "lucide-react";

export type ItemMenuAutomacao = {
  nome: string;
  icone: LucideIcon;
  caminho: string;
};

export type PaginaAutomacao = {
  caminho: string;
  titulo: string;
  descricao: string;
};

export type NavegacaoAutomacao = {
  nome: string;
  menu: ItemMenuAutomacao[];
  paginas: PaginaAutomacao[];
};
