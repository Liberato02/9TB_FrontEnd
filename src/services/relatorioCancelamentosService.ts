
import {
  AlignmentType,
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

import type { CampanhaApi } from "../types/CampanhaApi";
import type { IndicadoresCampanhaApi } from "../types/IndicadoresCampanhaApi";

type CampanhaRelatorio = Pick<CampanhaApi, "id" | "nome">;

export type DadosRelatorioCancelamentos = {
  campanha: CampanhaRelatorio;
  indicadores: IndicadoresCampanhaApi;
};

const aviso =
  "Cancelamentos encontrados nos PDFs não comprovam que foram causados " +
  "pela campanha. Títulos não encontrados também não devem ser " +
  "considerados automaticamente ativos ou não pagos.";

function formatarNumero(valor: number) {
  return valor.toLocaleString("pt-BR");
}

function formatarPercentual(valor: number) {
  return `${valor.toLocaleString("pt-BR", {
    maximumFractionDigits: 2,
  })}%`;
}

function nomeArquivo(campanha: CampanhaRelatorio) {
  return `relatorio-cancelamentos-campanha-${campanha.id}`;
}

function baixarArquivo(conteudo: Blob, nome: string) {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");

  link.href = url;
  link.download = nome;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function linhasIndicadores(indicadores: IndicadoresCampanhaApi) {
  return [
    ["Total de títulos", formatarNumero(indicadores.totalTitulos)],
    [
      "Cancelamentos encontrados",
      formatarNumero(indicadores.titulosCancelados),
    ],
    [
      "Não encontrados nos PDFs",
      formatarNumero(indicadores.naoEncontradosNosPdfs),
    ],
    [
      "Percentual encontrado",
      formatarPercentual(indicadores.percentualCancelados),
    ],
  ];
}

export async function exportarCancelamentosWord({
  campanha,
  indicadores,
}: DadosRelatorioCancelamentos) {
  const resposta = await fetch("/logos/logoTabeliao.png");

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar a logo.");
  }

  const logo = await resposta.arrayBuffer();

  const criarTexto = (valor: string, negrito = false) =>
    new TextRun({
      text: valor,
      bold: negrito,
      font: "Arial",
      size: 24,
    });

  const criarLinha = (rotulo: string, valor: string) =>
    new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              children: [criarTexto(rotulo)],
            }),
          ],
        }),
        new TableCell({
          children: [
            new Paragraph({
              children: [criarTexto(valor)],
              alignment: AlignmentType.RIGHT,
            }),
          ],
        }),
      ],
    });

  const tabela = new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      criarLinha("Indicador", "Quantidade"),
      ...linhasIndicadores(indicadores).map(([rotulo, valor]) =>
        criarLinha(rotulo, valor),
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
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "9º Tabelionato de Protesto de São Paulo — ÁRIA | Página ",
                    size: 18,
                    font: "Arial",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 600,
              after: 300,
            },
            children: [
              new TextRun({
                text: "RELATÓRIO DE TÍTULOS E CANCELAMENTOS",
                bold: true,
                color: "183B70",
                size: 28,
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [criarTexto(campanha.nome)],
          }),
          new Paragraph({
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: "1. Indicadores da campanha",
                bold: true,
                color: "183B70",
                font: "Arial",
                size: 24,
              }),
            ],
          }),
          tabela,
          new Paragraph({
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: "2. Considerações sobre os resultados",
                bold: true,
                color: "183B70",
                font: "Arial",
                size: 24,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [criarTexto(aviso)],
          }),
          new Paragraph({
            spacing: { before: 250 },
            children: [
              new TextRun({
                text: "Fonte: ÁRIA — indicadores de títulos e cancelamentos.",
                color: "64748B",
                size: 18,
                font: "Arial",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const arquivo = await Packer.toBlob(documento);

  baixarArquivo(
    arquivo,
    `${nomeArquivo(campanha)}.docx`,
  );
}

export async function exportarCancelamentosPDF({
  campanha,
  indicadores,
}: DadosRelatorioCancelamentos) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const largura = pdf.internal.pageSize.getWidth();
  const esquerda = 30;
  const direita = 20;
  const larguraUtil = largura - esquerda - direita;

  let y = 30;

  const textoSeguro = (valor: string) =>
    valor
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "-");

  try {
    const imagem = new Image();

    await new Promise<void>((resolve, reject) => {
      imagem.onload = () => resolve();
      imagem.onerror = () => reject();
      imagem.src = "/logos/logoTabeliao.png";
    });

    const larguraLogo = 82;
    const alturaLogo =
      larguraLogo * (imagem.height / imagem.width);

    pdf.addImage(
      imagem,
      "PNG",
      esquerda,
      y,
      larguraLogo,
      alturaLogo,
    );

    y += alturaLogo + 12;
  } catch {
    pdf.setFont("times", "bold");
    pdf.text(
      "9o Tabelionato de Protesto de Sao Paulo",
      esquerda,
      y,
    );
    y += 14;
  }

  pdf.setDrawColor(24, 59, 112);
  pdf.line(esquerda, y, largura - direita, y);
  y += 20;

  pdf.setFont("times", "bold");
  pdf.setFontSize(14);

  pdf.text(
    "RELATORIO DE TITULOS E CANCELAMENTOS",
    largura / 2,
    y,
    { align: "center" },
  );

  y += 14;

  pdf.setFont("times", "normal");
  pdf.setFontSize(12);

  const linhasNome = pdf.splitTextToSize(
    textoSeguro(campanha.nome),
    larguraUtil,
  ) as string[];

  for (const linha of linhasNome) {
    pdf.text(linha, largura / 2, y, {
      align: "center",
    });
    y += 7;
  }

  y += 12;

  pdf.setFont("times", "bold");
  pdf.setTextColor(24, 59, 112);
  pdf.text("1. Indicadores da campanha", esquerda, y);
  y += 12;

  for (const [rotulo, valor] of linhasIndicadores(indicadores)) {
    pdf.setFont("times", "normal");
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(11);

    pdf.text(textoSeguro(rotulo), esquerda, y);

    pdf.text(
      textoSeguro(valor),
      largura - direita,
      y,
      { align: "right" },
    );

    y += 8;

    pdf.setDrawColor(220, 225, 230);
    pdf.line(esquerda, y, largura - direita, y);
    y += 7;
  }

  y += 10;

  pdf.setFont("times", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(24, 59, 112);

  pdf.text(
    "2. Consideracoes sobre os resultados",
    esquerda,
    y,
  );

  y += 12;

  pdf.setFont("times", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(30, 30, 30);

  const linhasAviso = pdf.splitTextToSize(
    textoSeguro(aviso),
    larguraUtil,
  ) as string[];

  for (const linha of linhasAviso) {
    pdf.text(linha, esquerda, y);
    y += 7;
  }

  pdf.setFontSize(9);
  pdf.setTextColor(100, 110, 120);

  pdf.text(
    "9o Tabelionato de Protesto de Sao Paulo - ARIA",
    esquerda,
    284,
  );

  pdf.text(
    "Pagina 1 de 1",
    largura - direita,
    284,
    { align: "right" },
  );

  pdf.save(`${nomeArquivo(campanha)}.pdf`);
}


export async function exportarCancelamentosExcel({
  campanha,
  indicadores,
}: DadosRelatorioCancelamentos) {
  const workbook = new ExcelJS.Workbook();
  const planilha = workbook.addWorksheet("Campanhas");

  planilha.columns = [
    { header: "CAMPANHA", key: "campanha", width: 32 },
    { header: "TOTAL DE TÍTULOS", key: "total", width: 22 },
    { header: "CANCELAMENTOS ENCONTRADOS", key: "encontrados", width: 32 },
    { header: "NÃO ENCONTRADOS NOS PDFS", key: "naoEncontrados", width: 32 },
    { header: "PERCENTUAL ENCONTRADO", key: "percentual", width: 27 },
  ];

  planilha.addRow({
    campanha: campanha.nome,
    total: indicadores.totalTitulos,
    encontrados: indicadores.titulosCancelados,
    naoEncontrados: indicadores.naoEncontradosNosPdfs,
    percentual: indicadores.percentualCancelados / 100,
  });

  planilha.getColumn("percentual").numFmt = "0.00%";

  // Identificação da origem dos indicadores
  planilha.addRow([]);
  planilha.mergeCells("A4:E4");

  const fonte = planilha.getCell("A4");
  fonte.value =
    "Fonte: ÁRIA — indicadores de títulos e cancelamentos.";
  fonte.font = {
    bold: true,
    color: { argb: "FF183B70" },
  };

  // Aviso interpretativo
  planilha.mergeCells("A6:E6");

  const celulaAviso = planilha.getCell("A6");

  celulaAviso.value = aviso;

  celulaAviso.alignment = {
    vertical: "middle",
    horizontal: "left",
    wrapText: true,
  };

  celulaAviso.font = {
    size: 11,
    color: { argb: "FF92400E" },
  };

  celulaAviso.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFF7ED" },
  };

  planilha.getRow(6).height = 45;

  const buffer = await workbook.xlsx.writeBuffer();

  const arquivo = new Blob([buffer as BlobPart], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  baixarArquivo(
    arquivo,
    `${nomeArquivo(campanha)}.xlsx`,
  );
}

