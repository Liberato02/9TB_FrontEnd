import { useRef, useState, type ChangeEvent } from "react";
import {
  FileSpreadsheet,
  FileText,
  Upload,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
} from "lucide-react";

import ResultadoImportacao from "../components/importacao/ResultadoImportacao";

import {
  importarTitulosCsv,
  importarCancelamentosPdf,
} from "../services/importacaoService";

import type { ImportacaoCsvApi } from "../types/ImportacaoCsvApi";
import type { ImportacaoPdfApi } from "../types/ImportacaoPdfApi";

type TipoArquivo = "csv" | "pdf";

const exemploCsv: ImportacaoCsvApi = {
  campanhaId: 999,
  campanhaNome: "Campanha 999 (exemplo)",
  titulosNovos: 12,
  titulosExistentes: 3,
  titulosAssociados: 15,
  duplicadosNoCsv: 2,
};

const exemploPdf: ImportacaoPdfApi = {
  totalLidos: 36,
  novos: 30,
  existentes: 6,
};

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function obterMensagemErro(erro: unknown): string {
  if (erro instanceof Error) {
    return erro.message;
  }

  return "Ocorreu um erro inesperado durante a importação.";
}

function ImportarArquivos() {
  const [arquivoCsv, setArquivoCsv] = useState<File | null>(null);
  const [arquivoPdf, setArquivoPdf] = useState<File | null>(null);

  const [erroCsv, setErroCsv] = useState("");
  const [erroPdf, setErroPdf] = useState("");

  const [resultadoCsv, setResultadoCsv] = useState<ImportacaoCsvApi | null>(
    null,
  );

  const [resultadoPdf, setResultadoPdf] = useState<ImportacaoPdfApi | null>(
    null,
  );

  const [enviando, setEnviando] = useState<TipoArquivo | null>(null);

  const [visualizacao, setVisualizacao] = useState<TipoArquivo | null>(null);

  const envioEmAndamento = useRef(false);

  const importacaoEmAndamento = enviando !== null;

  function selecionarArquivo(
    evento: ChangeEvent<HTMLInputElement>,
    tipo: TipoArquivo,
  ) {
    const arquivo = evento.target.files?.[0];

    evento.target.value = "";

    if (!arquivo || envioEmAndamento.current) {
      return;
    }

    const extensao = tipo === "csv" ? ".csv" : ".pdf";

    if (tipo === "csv") {
      setResultadoCsv(null);
      setErroCsv("");
    } else {
      setResultadoPdf(null);
      setErroPdf("");
    }

    if (!arquivo.name.toLowerCase().endsWith(extensao)) {
      const mensagem = `Selecione um arquivo no formato ${extensao}.`;

      if (tipo === "csv") {
        setArquivoCsv(null);
        setErroCsv(mensagem);
      } else {
        setArquivoPdf(null);
        setErroPdf(mensagem);
      }

      return;
    }

    if (arquivo.size === 0) {
      const mensagem = "O arquivo selecionado está vazio.";

      if (tipo === "csv") {
        setArquivoCsv(null);
        setErroCsv(mensagem);
      } else {
        setArquivoPdf(null);
        setErroPdf(mensagem);
      }

      return;
    }

    if (tipo === "csv") {
      setArquivoCsv(arquivo);
    } else {
      setArquivoPdf(arquivo);
    }
  }

  function removerArquivo(tipo: TipoArquivo) {
    if (envioEmAndamento.current) {
      return;
    }

    if (tipo === "csv") {
      setArquivoCsv(null);
      setErroCsv("");
    } else {
      setArquivoPdf(null);
      setErroPdf("");
    }
  }

  async function executarImportacao(tipo: TipoArquivo) {
    if (envioEmAndamento.current) {
      return;
    }

    const arquivo = tipo === "csv" ? arquivoCsv : arquivoPdf;

    if (!arquivo) {
      if (tipo === "csv") {
        setErroCsv("Selecione um arquivo CSV.");
      } else {
        setErroPdf("Selecione um arquivo PDF.");
      }

      return;
    }

    envioEmAndamento.current = true;
    setEnviando(tipo);

    if (tipo === "csv") {
      setErroCsv("");
      setResultadoCsv(null);
    } else {
      setErroPdf("");
      setResultadoPdf(null);
    }

    try {
      if (tipo === "csv") {
        const resultado = await importarTitulosCsv(arquivo);

        setResultadoCsv(resultado);
        setArquivoCsv(null);
      } else {
        const resultado = await importarCancelamentosPdf(arquivo);

        setResultadoPdf(resultado);
        setArquivoPdf(null);
      }
    } catch (erro) {
      const mensagem = obterMensagemErro(erro);

      if (tipo === "csv") {
        setErroCsv(mensagem);
      } else {
        setErroPdf(mensagem);
      }
    } finally {
      envioEmAndamento.current = false;
      setEnviando(null);
    }
  }

  function alternarExemplo(tipo: TipoArquivo) {
    setVisualizacao((atual) => (atual === tipo ? null : tipo));
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-slate-500">ÁRIA / Inteligência de Dados</p>

        <h2 className="mt-2 text-3xl font-semibold">Importação de Arquivos</h2>

        <p className="mt-2 text-sm text-slate-500">
          Importe títulos e cancelamentos para o banco de dados da ÁRIA.
        </p>
      </header>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3">
              <FileSpreadsheet size={25} className="text-[#3F7DD9]" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">Títulos de Campanhas</h3>

              <p className="text-sm text-slate-500">Arquivo CSV</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Selecione um CSV contendo os títulos que serão associados a uma nova
            campanha.
          </p>

          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <label htmlFor="arquivo-csv" className="block text-sm font-medium">
              Selecionar arquivo de títulos
            </label>

            <input
              id="arquivo-csv"
              type="file"
              accept=".csv"
              disabled={importacaoEmAndamento}
              onChange={(evento) => selecionarArquivo(evento, "csv")}
              className="mt-3 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-100 file:px-3 file:py-2 file:font-medium file:text-[#183B70] disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-3 text-xs text-slate-500">
              Formato permitido: CSV (.csv)
            </p>
          </div>

          {erroCsv && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0" />

              <span>{erroCsv}</span>
            </div>
          )}

          {arquivoCsv && (
            <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <CheckCircle2 size={20} className="shrink-0 text-green-700" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-800">
                      Arquivo selecionado
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-700">
                      {arquivoCsv.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatarTamanho(arquivoCsv.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={importacaoEmAndamento}
                  onClick={() => removerArquivo("csv")}
                  aria-label="Remover arquivo CSV"
                  className="rounded-lg p-1 text-slate-500 hover:bg-green-100 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium">Informações da importação</p>

            <p className="mt-2 text-sm text-slate-500">
              O backend exige 11 colunas em uma estrutura específica. Uma
              importação válida cria automaticamente uma nova campanha.
            </p>
          </div>

          <button
            type="button"
            disabled={!arquivoCsv || importacaoEmAndamento}
            onClick={() => void executarImportacao("csv")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3F7DD9] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#183B70] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            <Upload size={18} />

            {enviando === "csv" ? "Importando títulos..." : "Importar títulos"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            O envio registra dados reais no PostgreSQL.
          </p>

          {resultadoCsv && (
            <div className="mt-6 space-y-3" role="status">
              <p className="text-sm font-semibold text-green-700">
                Importação CSV concluída com sucesso.
              </p>

              <ResultadoImportacao tipo="csv" resultado={resultadoCsv} />
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-slate-100 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-orange-50 p-3">
              <FileText size={25} className="text-[#F27D70]" />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                Cancelamentos de Protestos
              </h3>

              <p className="text-sm text-slate-500">Arquivo PDF</p>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Selecione um PDF de cancelamentos para cruzamento com os títulos das
            campanhas.
          </p>

          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <label htmlFor="arquivo-pdf" className="block text-sm font-medium">
              Selecionar arquivo de cancelamentos
            </label>

            <input
              id="arquivo-pdf"
              type="file"
              accept=".pdf"
              disabled={importacaoEmAndamento}
              onChange={(evento) => selecionarArquivo(evento, "pdf")}
              className="mt-3 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-100 file:px-3 file:py-2 file:font-medium file:text-[#183B70] disabled:cursor-not-allowed disabled:opacity-50"
            />

            <p className="mt-3 text-xs text-slate-500">
              Formato permitido: PDF (.pdf)
            </p>
          </div>

          {erroPdf && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0" />

              <span>{erroPdf}</span>
            </div>
          )}

          {arquivoPdf && (
            <div className="mt-4 rounded-xl border border-green-100 bg-green-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <CheckCircle2 size={20} className="shrink-0 text-green-700" />

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-green-800">
                      Arquivo selecionado
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-700">
                      {arquivoPdf.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatarTamanho(arquivoPdf.size)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={importacaoEmAndamento}
                  onClick={() => removerArquivo("pdf")}
                  aria-label="Remover arquivo PDF"
                  className="rounded-lg p-1 text-slate-500 hover:bg-green-100 disabled:opacity-50"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium">Informações da importação</p>

            <p className="mt-2 text-sm text-slate-500">
              O backend identifica cancelamentos nos documentos PDF suportados e
              evita registrar duplicidades.
            </p>
          </div>

          <button
            type="button"
            disabled={!arquivoPdf || importacaoEmAndamento}
            onClick={() => void executarImportacao("pdf")}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#F27D70] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D96A5E] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            <Upload size={18} />

            {enviando === "pdf"
              ? "Importando cancelamentos..."
              : "Importar cancelamentos"}
          </button>

          <p className="mt-3 text-center text-xs text-slate-400">
            O envio registra dados reais no PostgreSQL.
          </p>

          {resultadoPdf && (
            <div className="mt-6 space-y-3" role="status">
              <p className="text-sm font-semibold text-green-700">
                Importação PDF concluída com sucesso.
              </p>

              <ResultadoImportacao tipo="pdf" resultado={resultadoPdf} />
            </div>
          )}
        </article>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h3 className="text-lg font-semibold">
          Pré-visualização dos resultados
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Exemplos demonstrativos para conhecer os indicadores exibidos após uma
          importação.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => alternarExemplo("csv")}
            aria-pressed={visualizacao === "csv"}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-[#183B70] hover:bg-blue-100"
          >
            <Eye size={18} />

            {visualizacao === "csv"
              ? "Ocultar exemplo CSV"
              : "Exemplo de resultado CSV"}
          </button>

          <button
            type="button"
            onClick={() => alternarExemplo("pdf")}
            aria-pressed={visualizacao === "pdf"}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-3 text-sm font-medium text-[#183B70] hover:bg-orange-100"
          >
            <Eye size={18} />

            {visualizacao === "pdf"
              ? "Ocultar exemplo PDF"
              : "Exemplo de resultado PDF"}
          </button>
        </div>

        {visualizacao && (
          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Demonstração com dados fictícios
              </p>

              <p className="mt-1 text-sm text-amber-800">
                Este resultado é apenas um exemplo visual. Nenhum arquivo foi
                processado ou enviado ao servidor.
              </p>
            </div>

            {visualizacao === "csv" ? (
              <ResultadoImportacao tipo="csv" resultado={exemploCsv} />
            ) : (
              <ResultadoImportacao tipo="pdf" resultado={exemploPdf} />
            )}
          </div>
        )}
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-[#3F7DD9]" />

        <div>
          <h3 className="text-sm font-semibold">
            Sobre o cruzamento dos dados
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            A ÁRIA identifica correspondências utilizando o número e a data do
            protocolo. Um cancelamento encontrado não comprova que foi causado
            pela campanha. A ausência de correspondência também não confirma que
            o título continua ativo.
          </p>
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Integração de importações com o backend da ÁRIA. Utilize arquivos de
        teste controlados durante a validação.
      </p>
    </div>
  );
}

export default ImportarArquivos;
