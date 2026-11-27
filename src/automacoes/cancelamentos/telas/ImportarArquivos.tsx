import { useRef, useState, type DragEvent, type ReactNode } from "react";
import {
  FileSpreadsheet,
  FileText,
  Upload,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import ResultadoImportacao from "../componentes/ResultadoImportacao";

import {
  importarTitulosCsv,
  importarCancelamentosPdf,
} from "../servicos/importacaoService";

import type { ImportacaoCsvApi } from "../tipos/ImportacaoCsvApi";
import type { ImportacaoPdfApi } from "../tipos/ImportacaoPdfApi";

type TipoArquivo = "csv" | "pdf";

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

type AreaImportacaoProps = {
  tipo: TipoArquivo;
  titulo: string;
  descricao: string;
  observacao: string;
  icone: ReactNode;
  arquivo: File | null;
  erro: string;
  enviando: boolean;
  bloqueado: boolean;
  textoBotao: string;
  textoEnviando: string;
  classeBotao: string;
  resultado: ReactNode;
  aoSelecionar: (arquivo: File | undefined) => void;
  aoRemover: () => void;
  aoImportar: () => void;
};

function AreaImportacao({
  tipo,
  titulo,
  descricao,
  observacao,
  icone,
  arquivo,
  erro,
  enviando,
  bloqueado,
  textoBotao,
  textoEnviando,
  classeBotao,
  resultado,
  aoSelecionar,
  aoRemover,
  aoImportar,
}: AreaImportacaoProps) {
  const [arrastando, setArrastando] = useState(false);

  const extensao = tipo === "csv" ? ".csv" : ".pdf";
  const formato = tipo.toUpperCase();

  function soltar(evento: DragEvent<HTMLLabelElement>) {
    evento.preventDefault();
    setArrastando(false);

    if (!bloqueado) {
      aoSelecionar(evento.dataTransfer.files[0]);
    }
  }

  return (
    <article className="flex flex-col rounded-xl border border-borda bg-superficie p-5">
      <div className="flex items-center gap-3">
        {icone}

        <div>
          <h3 className="font-titulo text-2xl font-bold">{titulo}</h3>

          <p className="text-sm text-texto-secundario">{descricao}</p>
        </div>
      </div>

      <label
        htmlFor={`arquivo-${tipo}`}
        onDragOver={(evento) => {
          evento.preventDefault();

          if (!bloqueado) {
            setArrastando(true);
          }
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={soltar}
        className={`mt-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-10 text-center transition-colors ${
          bloqueado
            ? "cursor-not-allowed border-borda bg-superficie-suave opacity-60"
            : arrastando
              ? "cursor-copy border-destaque bg-destaque-suave"
              : "cursor-pointer border-borda-forte bg-superficie-suave hover:border-destaque"
        }`}
      >
        <Upload size={28} className="text-texto-secundario" />

        <span className="mt-3 text-sm font-medium">
          Arraste o arquivo {formato} até aqui ou{" "}
          <span className="text-destaque underline">clique para escolher</span>
        </span>

        <span className="mt-1 text-xs text-texto-secundario">
          Somente arquivos {extensao}
        </span>

        <input
          id={`arquivo-${tipo}`}
          type="file"
          accept={extensao}
          disabled={bloqueado}
          onChange={(evento) => {
            aoSelecionar(evento.target.files?.[0]);
            evento.target.value = "";
          }}
          className="sr-only"
        />
      </label>

      {erro && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg bg-erro-suave p-3 text-sm text-erro"
        >
          <AlertCircle size={18} className="shrink-0" />

          <span>{erro}</span>
        </div>
      )}

      {arquivo && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg border border-sucesso-suave-forte bg-sucesso-suave p-3">
          <div className="flex min-w-0 items-start gap-2">
            <CheckCircle2 size={20} className="shrink-0 text-sucesso" />

            <div className="min-w-0">
              <p className="text-sm font-medium break-all text-texto">
                {arquivo.name}
              </p>

              <p className="mt-0.5 text-xs text-texto-secundario">
                {formatarTamanho(arquivo.size)}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={bloqueado}
            onClick={aoRemover}
            aria-label={`Remover arquivo ${formato}`}
            className="rounded-lg p-1 text-texto-secundario hover:bg-sucesso-suave-forte disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <p className="mt-4 text-sm text-texto-secundario">{observacao}</p>

      <button
        type="button"
        disabled={!arquivo || bloqueado}
        onClick={aoImportar}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:bg-borda disabled:text-texto-suave ${classeBotao}`}
      >
        <Upload size={18} />

        {enviando ? textoEnviando : textoBotao}
      </button>

      {resultado}
    </article>
  );
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

  const envioEmAndamento = useRef(false);

  const importacaoEmAndamento = enviando !== null;

  function selecionarArquivo(arquivo: File | undefined, tipo: TipoArquivo) {
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

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <AreaImportacao
          tipo="csv"
          titulo="Títulos da campanha"
          descricao="Arquivo CSV"
          observacao="O arquivo precisa ter as 11 colunas no formato esperado. Cada importação válida cria uma nova campanha."
          icone={
            <div className="rounded-xl bg-destaque-suave p-3">
              <FileSpreadsheet size={25} className="text-destaque" />
            </div>
          }
          arquivo={arquivoCsv}
          erro={erroCsv}
          enviando={enviando === "csv"}
          bloqueado={importacaoEmAndamento}
          textoBotao="Importar títulos"
          textoEnviando="Importando títulos..."
          classeBotao="bg-marca text-white hover:bg-marca-forte"
          resultado={
            resultadoCsv && (
              <div className="mt-6 space-y-3" role="status">
                <p className="text-sm font-semibold text-sucesso">
                  Importação do CSV concluída.
                </p>

                <ResultadoImportacao tipo="csv" resultado={resultadoCsv} />
              </div>
            )
          }
          aoSelecionar={(arquivo) => selecionarArquivo(arquivo, "csv")}
          aoRemover={() => removerArquivo("csv")}
          aoImportar={() => void executarImportacao("csv")}
        />

        <AreaImportacao
          tipo="pdf"
          titulo="Cancelamentos de protestos"
          descricao="Arquivo PDF"
          observacao="Os cancelamentos do PDF são cruzados com os títulos das campanhas. Cancelamentos já registrados não são duplicados."
          icone={
            <div className="rounded-xl bg-coral-suave p-3">
              <FileText size={25} className="text-coral-texto" />
            </div>
          }
          arquivo={arquivoPdf}
          erro={erroPdf}
          enviando={enviando === "pdf"}
          bloqueado={importacaoEmAndamento}
          textoBotao="Importar cancelamentos"
          textoEnviando="Importando cancelamentos..."
          classeBotao="bg-coral text-noite hover:bg-coral-forte"
          resultado={
            resultadoPdf && (
              <div className="mt-6 space-y-3" role="status">
                <p className="text-sm font-semibold text-sucesso">
                  Importação do PDF concluída.
                </p>

                <ResultadoImportacao tipo="pdf" resultado={resultadoPdf} />
              </div>
            )
          }
          aoSelecionar={(arquivo) => selecionarArquivo(arquivo, "pdf")}
          aoRemover={() => removerArquivo("pdf")}
          aoImportar={() => void executarImportacao("pdf")}
        />
      </section>

      <section className="flex items-start gap-3 rounded-xl border border-destaque-suave-forte bg-destaque-suave p-4">
        <Info size={20} className="mt-0.5 shrink-0 text-destaque" />

        <p className="text-sm text-texto-secundario">
          A ÁRIA cruza os dados pelo número e pela data do protocolo. Um
          cancelamento encontrado não comprova que foi causado pela campanha, e
          a ausência de correspondência não confirma que o título continua
          ativo.
        </p>
      </section>
    </div>
  );
}

export default ImportarArquivos;
