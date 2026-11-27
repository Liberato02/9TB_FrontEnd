import { FileCheck2, Folder, LayoutGrid, Upload } from "lucide-react";

import type { NavegacaoAutomacao } from "../../compartilhado/tipos/NavegacaoAutomacao";

export const navegacaoCancelamentos: NavegacaoAutomacao = {
  nome: "Campanhas de cancelamento",
  icone: FileCheck2,
  menu: [
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
      nome: "Importar arquivos",
      icone: Upload,
      caminho: "/cancelamentos/importar",
    },
  ],
  paginas: [
    {
      caminho: "/cancelamentos/visao-geral",
      titulo: "Visão geral",
      descricao:
        "Campanhas cadastradas e cancelamentos encontrados nos arquivos importados.",
    },
    {
      caminho: "/cancelamentos/campanhas",
      titulo: "Campanhas",
      descricao: "Campanhas registradas na ÁRIA, com pesquisa por nome.",
    },
    {
      caminho: "/cancelamentos/campanhas/:id",
      titulo: "Campanhas",
      descricao:
        "Títulos da campanha e cancelamentos encontrados nos documentos importados.",
    },
    {
      caminho: "/cancelamentos/importar",
      titulo: "Importar arquivos",
      descricao:
        "Importe o CSV de títulos de uma campanha e o PDF de cancelamentos.",
    },
  ],
};
