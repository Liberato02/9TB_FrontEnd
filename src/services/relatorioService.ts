
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  ImageRun,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

import { jsPDF } from "jspdf";
import ExcelJS from "exceljs";

import type { Campanha } from "../types/Campanha";

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function baixarArquivo(conteudo: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function nomeSeguro(campanha: Campanha) {
  return `relatorio-campanha-${campanha.id}`;
}

function percentual(valor: number, total: number) {
  if (total <= 0) return 0;
  return (valor / total) * 100;
}

async function carregarLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();

    imagem.onload = () => resolve(imagem);
    imagem.onerror = () =>
      reject(new Error("Não foi possível carregar a logo."));

    imagem.src = "/logos/logoTabeliao.png";
  });
}

// ==========================================
// EXPORTAÇÃO WORD
// ==========================================

export async function exportarWord(campanha: Campanha) {
  const azul = "183B70";
  const cinza = "64748B";

  const resposta = await fetch("/logos/logoTabeliao.png");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar a logo do 9º.");
  }

  const logo = await resposta.arrayBuffer();

  const texto = (
    conteudo: string,
    negrito = false,
    cor = "222222",
    tamanho = 24
  ) =>
    new TextRun({
      text: conteudo,
      bold: negrito,
      color: cor,
      size: tamanho,
      font: "Arial",
    });

  const secao = (numero: number, titulo: string) =>
    new Paragraph({
      children: [texto(`${numero}. ${titulo}`, true, azul)],
      spacing: { before: 300, after: 160 },
      keepNext: true,
    });

  const linha = (rotulo: string, valor: string) =>
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [texto(rotulo)],
              spacing: { before: 90, after: 90 },
            }),
          ],
          width: {
            size: 65,
            type: WidthType.PERCENTAGE,
          },
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [texto(valor)],
              alignment: AlignmentType.RIGHT,
              spacing: { before: 90, after: 90 },
            }),
          ],
          width: {
            size: 35,
            type: WidthType.PERCENTAGE,
          },
        }),
      ],
    });

  const bordas = {
    top: {
      style: BorderStyle.SINGLE,
      size: 4,
      color: "D5DCE5",
    },
    bottom: {
      style: BorderStyle.SINGLE,
      size: 4,
      color: "D5DCE5",
    },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: {
      style: BorderStyle.SINGLE,
      size: 4,
      color: "E5E7EB",
    },
    insideVertical: { style: BorderStyle.NONE },
  };

  const tabelaResultados = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: bordas,
    rows: [
      linha("Indicador", "Quantidade"),
      linha(
        "Devedores",
        campanha.devedores.toLocaleString("pt-BR")
      ),
      linha(
        "Análises realizadas",
        campanha.analises.toLocaleString("pt-BR")
      ),
      linha(
        "Contatos efetivos",
        campanha.contatosEfetivos.toLocaleString("pt-BR")
      ),
      linha(
        "Retornos agendados",
        campanha.retornosAgendados.toLocaleString("pt-BR")
      ),
    ],
  });

  const documento = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Arial",
            size: 24,
            color: "222222",
          },
          paragraph: {
            spacing: {
              line: 360,
              after: 120,
            },
          },
        },
      },
    },

    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 1701,
              right: 1134,
              bottom: 1134,
              left: 1701,
              header: 708,
              footer: 708,
            },
          },
        },

        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: logo,
                    transformation: {
                      width: 190,
                      height: 65,
                    },
                    type: "png",
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
        },

        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  texto(
                    "9º Tabelionato de Protesto de São Paulo — ÁRIA",
                    false,
                    cinza,
                    18
                  ),
                  texto("    |    Página ", false, cinza, 18),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Arial",
                    size: 18,
                    color: cinza,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },

        children: [
          new Paragraph({
            children: [
              texto(
                "RELATÓRIO DE DESEMPENHO DA CAMPANHA",
                true,
                azul,
                28
              ),
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 600,
              after: 220,
            },
          }),

          new Paragraph({
            children: [texto(campanha.nome)],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          secao(1, "Identificação da campanha"),

          new Paragraph({
            children: [
              texto("Campanha: ", true),
              texto(campanha.nome),
            ],
          }),

          new Paragraph({
            children: [
              texto("Período: ", true),
              texto(campanha.periodo),
            ],
          }),

          new Paragraph({
            children: [
              texto("Situação: ", true),
              texto(campanha.status),
            ],
          }),

          secao(2, "Resultados consolidados"),

          new Paragraph({
            children: [
              texto("Tabela 1 — Indicadores da campanha", true),
            ],
            spacing: { after: 150 },
            keepNext: true,
          }),

          tabelaResultados,

          new Paragraph({
            children: [
              texto(
                "Fonte: ÁRIA — dados demonstrativos.",
                false,
                cinza,
                18
              ),
            ],
            spacing: {
              before: 140,
              after: 220,
            },
          }),

          secao(3, "Análise de desempenho"),

          new Paragraph({
            children: [
              texto(
                `Foram realizadas ${campanha.analises.toLocaleString("pt-BR")} ` +
                  `análises, registrados ${campanha.contatosEfetivos.toLocaleString("pt-BR")} ` +
                  `contatos efetivos e ${campanha.retornosAgendados.toLocaleString("pt-BR")} ` +
                  `retornos agendados.`
              ),
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              line: 360,
              after: 200,
            },
          }),

          new Paragraph({
            children: [
              texto(
                "Os indicadores apresentados não representam, por si só, " +
                  "pagamentos ou valores arrecadados.",
                false,
                cinza,
                22
              ),
            ],
            spacing: { after: 200 },
          }),

          new Paragraph({
            children: [
              texto(
                "Documento demonstrativo — dados fictícios.",
                false,
                cinza,
                18
              ),
            ],
            spacing: { before: 240 },
          }),
        ],
      },
    ],
  });

  const arquivo = await Packer.toBlob(documento);

  baixarArquivo(
    arquivo,
    `${nomeSeguro(campanha)}.docx`
  );
}

// ==========================================
// EXPORTAÇÃO PDF
// ==========================================

export async function exportarPDF(campanha: Campanha) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const largura = pdf.internal.pageSize.getWidth();
  const altura = pdf.internal.pageSize.getHeight();

  const esquerda = 30;
  const direita = 20;
  const superior = 30;
  const inferior = 20;

  const larguraUtil = largura - esquerda - direita;
  const limiteConteudo = altura - inferior - 12;

  const azul = [24, 59, 112] as const;
  const cinza = [90, 98, 110] as const;

  let y = superior;

  function textoPDF(texto: string) {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "-");
  }

  function novaPaginaSeNecessario(espaco: number) {
    if (y + espaco > limiteConteudo) {
      pdf.addPage();
      y = superior;
    }
  }

  function paragrafo(texto: string) {
    pdf.setFont("times", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(30, 30, 30);

    const linhas = pdf.splitTextToSize(
      textoPDF(texto),
      larguraUtil
    ) as string[];

    for (const linha of linhas) {
      novaPaginaSeNecessario(8);
      pdf.text(linha, esquerda, y);
      y += 8;
    }

    y += 6;
  }

  function tituloSecao(numero: number, titulo: string) {
    novaPaginaSeNecessario(22);

    pdf.setFont("times", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...azul);

    pdf.text(
      textoPDF(`${numero}. ${titulo}`),
      esquerda,
      y
    );

    y += 12;
  }

  function linhaTabela(
    coluna1: string,
    coluna2: string,
    cabecalho = false
  ) {
    novaPaginaSeNecessario(12);

    const larguraColuna1 = larguraUtil * 0.68;

    pdf.setDrawColor(190, 195, 202);
    pdf.setLineWidth(0.2);

    pdf.line(
      esquerda,
      y + 4,
      esquerda + larguraUtil,
      y + 4
    );

    pdf.setFont(
      "times",
      cabecalho ? "bold" : "normal"
    );

    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);

    pdf.text(
      textoPDF(coluna1),
      esquerda + 2,
      y
    );

    pdf.text(
      textoPDF(coluna2),
      esquerda + larguraColuna1 + 2,
      y
    );

    y += 11;
  }

  // LOGO

  try {
    const logo = await carregarLogo();

    const larguraLogo = 82;
    const alturaLogo =
      larguraLogo * (logo.height / logo.width);

    pdf.addImage(
      logo,
      "PNG",
      esquerda,
      y,
      larguraLogo,
      alturaLogo
    );

    y += alturaLogo + 12;
  } catch (erro) {
    console.error("Erro ao carregar logo:", erro);

    pdf.setFont("times", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...azul);

    pdf.text(
      "9o Tabelionato de Protesto de Sao Paulo",
      esquerda,
      y
    );

    y += 14;
  }

  pdf.setDrawColor(...azul);
  pdf.setLineWidth(0.45);
  pdf.line(esquerda, y, largura - direita, y);

  y += 19;

  // TÍTULO

  pdf.setFont("times", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);

  pdf.text(
    "RELATORIO DE DESEMPENHO DA CAMPANHA",
    largura / 2,
    y,
    { align: "center" }
  );

  y += 12;

  pdf.setFont("times", "normal");
  pdf.setFontSize(12);

  const linhasNome = pdf.splitTextToSize(
    textoPDF(campanha.nome),
    larguraUtil
  ) as string[];

  for (const linha of linhasNome) {
    novaPaginaSeNecessario(8);

    pdf.text(
      linha,
      largura / 2,
      y,
      { align: "center" }
    );

    y += 8;
  }

  y += 13;

  // IDENTIFICAÇÃO

  tituloSecao(1, "Identificação da campanha");

  linhaTabela("Campanha", campanha.nome);
  linhaTabela("Período", campanha.periodo);
  linhaTabela("Situação", campanha.status);

  y += 13;

  // RESULTADOS

  tituloSecao(2, "Resultados consolidados");

  novaPaginaSeNecessario(65);

  pdf.setFont("times", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);

  pdf.text(
    "Tabela 1 - Indicadores da campanha",
    esquerda,
    y
  );

  y += 12;

  linhaTabela("Indicador", "Quantidade", true);

  linhaTabela(
    "Devedores",
    campanha.devedores.toLocaleString("pt-BR")
  );

  linhaTabela(
    "Análises realizadas",
    campanha.analises.toLocaleString("pt-BR")
  );

  linhaTabela(
    "Contatos efetivos",
    campanha.contatosEfetivos.toLocaleString("pt-BR")
  );

  linhaTabela(
    "Retornos agendados",
    campanha.retornosAgendados.toLocaleString("pt-BR")
  );

  y += 4;

  pdf.setFont("times", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(...cinza);

  pdf.text(
    "Fonte: ÁRIA - dados demonstrativos.",
    esquerda,
    y
  );

  y += 18;

  // DESEMPENHO

  tituloSecao(3, "Análise de desempenho");

  novaPaginaSeNecessario(95);

  pdf.setFont("times", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);

  pdf.text(
    "Figura 1 - Indicadores em relação aos devedores",
    esquerda,
    y
  );

  y += 13;

  const indicadores = [
    {
      nome: "Análises realizadas",
      valor: campanha.analises,
    },
    {
      nome: "Contatos efetivos",
      valor: campanha.contatosEfetivos,
    },
    {
      nome: "Retornos agendados",
      valor: campanha.retornosAgendados,
    },
  ];

  const larguraGrafico = larguraUtil - 35;

  for (const indicador of indicadores) {
    novaPaginaSeNecessario(21);

    const taxa = percentual(
      indicador.valor,
      campanha.devedores
    );

    const larguraBarra =
      (Math.min(taxa, 100) / 100) * larguraGrafico;

    pdf.setFont("times", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(30, 30, 30);

    pdf.text(
      textoPDF(indicador.nome),
      esquerda,
      y
    );

    y += 6;

    pdf.setFillColor(232, 235, 240);
    pdf.rect(
      esquerda,
      y,
      larguraGrafico,
      5,
      "F"
    );

    pdf.setFillColor(...azul);
    pdf.rect(
      esquerda,
      y,
      larguraBarra,
      5,
      "F"
    );

    pdf.text(
      `${taxa.toFixed(1).replace(".", ",")}%`,
      esquerda + larguraGrafico + 5,
      y + 4
    );

    y += 19;
  }

  y += 9;

  // RESUMO

  tituloSecao(4, "Resumo da campanha");

  paragrafo(
    `A campanha registrou ${campanha.analises.toLocaleString("pt-BR")} ` +
      `análises realizadas, ${campanha.contatosEfetivos.toLocaleString("pt-BR")} ` +
      `contatos efetivos e ${campanha.retornosAgendados.toLocaleString("pt-BR")} ` +
      `retornos agendados.`
  );

  paragrafo(
    "Os indicadores apresentados não representam, por si só, " +
      "pagamentos ou valores arrecadados."
  );

  // RODAPÉ

  const totalPaginas = pdf.getNumberOfPages();

  for (
    let pagina = 1;
    pagina <= totalPaginas;
    pagina++
  ) {
    pdf.setPage(pagina);

    pdf.setDrawColor(190, 195, 202);
    pdf.setLineWidth(0.2);

    pdf.line(
      esquerda,
      altura - 20,
      largura - direita,
      altura - 20
    );

    pdf.setFont("times", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(...cinza);

    pdf.text(
      "9o Tabelionato de Protesto de Sao Paulo - ARIA",
      esquerda,
      altura - 13
    );

    pdf.text(
      `Pagina ${pagina} de ${totalPaginas}`,
      largura - direita,
      altura - 13,
      { align: "right" }
    );
  }

  pdf.save(`${nomeSeguro(campanha)}.pdf`);
}

// ==========================================
// EXPORTAÇÃO EXCEL - PLANILHA SIMPLES
// ==========================================

export async function exportarExcel(campanha: Campanha) {
  const workbook = new ExcelJS.Workbook();

  // Uma única aba, sem cores ou formatação especial
  const planilha = workbook.addWorksheet("Campanhas");

  // Colunas como em uma planilha CSV
  planilha.columns = [
    {
      header: "CAMPANHA",
      key: "nome",
      width: 32,
    },
    {
      header: "PERÍODO",
      key: "periodo",
      width: 20,
    },
    {
      header: "SITUAÇÃO",
      key: "status",
      width: 18,
    },
    {
      header: "DEVEDORES",
      key: "devedores",
      width: 16,
    },
    {
      header: "ANÁLISES",
      key: "analises",
      width: 16,
    },
    {
      header: "CONTATOS EFETIVOS",
      key: "contatos",
      width: 22,
    },
    {
      header: "RETORNOS AGENDADOS",
      key: "retornos",
      width: 24,
    },
  ];

  // Dados da campanha selecionada
  planilha.addRow({
    nome: campanha.nome,
    periodo: campanha.periodo,
    status: campanha.status,
    devedores: campanha.devedores,
    analises: campanha.analises,
    contatos: campanha.contatosEfetivos,
    retornos: campanha.retornosAgendados,
  });

  // Geração do arquivo
  const buffer = await workbook.xlsx.writeBuffer();

  const arquivo = new Blob([buffer as BlobPart], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  baixarArquivo(
    arquivo,
    `${nomeSeguro(campanha)}.xlsx`
  );
}
