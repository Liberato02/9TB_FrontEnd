import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { FileCheck2, Folder, LayoutGrid, Upload } from "lucide-react";

import IlustracaoCancelamentos from "./cancelamentos/componentes/IlustracaoCancelamentos";

export type AtalhoAutomacao = {
  nome: string;
  caminho: string;
  icone: LucideIcon;
};

export type Automacao = {
  id: string;
  nome: string;
  descricao: string;
  icone: LucideIcon;
  ilustracao: ComponentType<{ className?: string }>;
  caminho: string;
  atalhos: AtalhoAutomacao[];
};

export const automacoes: Automacao[] = [
  {
    id: "cancelamentos",
    nome: "Campanhas de cancelamento",
    descricao:
      "Organiza os títulos de cada campanha, cruza com os cancelamentos importados dos PDFs e gera os relatórios.",
    icone: FileCheck2,
    ilustracao: IlustracaoCancelamentos,
    caminho: "/cancelamentos/visao-geral",
    atalhos: [
      {
        nome: "Visão geral",
        caminho: "/cancelamentos/visao-geral",
        icone: LayoutGrid,
      },
      {
        nome: "Campanhas",
        caminho: "/cancelamentos/campanhas",
        icone: Folder,
      },
      {
        nome: "Importar arquivos",
        caminho: "/cancelamentos/importar",
        icone: Upload,
      },
    ],
  },
];
