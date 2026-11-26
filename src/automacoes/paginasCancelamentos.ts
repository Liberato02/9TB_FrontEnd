import { matchPath } from "react-router-dom";

type PaginaCancelamentos = {
  caminho: string;
  titulo: string;
  descricao: string;
};

const paginas: PaginaCancelamentos[] = [
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
    caminho: "/cancelamentos/analises",
    titulo: "Análises",
    descricao: "Indicadores de títulos e cancelamentos por campanha.",
  },
  {
    caminho: "/cancelamentos/importar",
    titulo: "Importar arquivos",
    descricao:
      "Importe o CSV de títulos de uma campanha e o PDF de cancelamentos.",
  },
  {
    caminho: "/cancelamentos/relatorios",
    titulo: "Relatórios",
    descricao:
      "Exporte os indicadores de títulos e cancelamentos de uma campanha em Word, PDF ou Excel.",
  },
];

export function encontrarPaginaCancelamentos(endereco: string) {
  return paginas.find((pagina) => matchPath(pagina.caminho, endereco));
}
