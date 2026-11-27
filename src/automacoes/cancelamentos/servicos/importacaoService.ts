import { cabecalhoCsrf } from "../../../compartilhado/servicos/autenticacaoService";

import type { ImportacaoCsvApi } from "../tipos/ImportacaoCsvApi";
import type { ImportacaoPdfApi } from "../tipos/ImportacaoPdfApi";

// Erro HTTP retornado pelo backend.
export class ErroImportacaoApi extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);

    this.name = "ErroImportacaoApi";
    this.status = status;
  }
}

// Obtém a mensagem retornada pelo backend,
// seja em JSON ou em texto simples.
async function obterMensagemErro(
  resposta: Response,
): Promise<string> {
  const mensagemPadrao =
    `Não foi possível importar o arquivo. HTTP ${resposta.status}`;

  if (resposta.status === 401) {
    return "Acesso não autorizado. Verifique a autenticação da API.";
  }

  if (resposta.status === 413) {
    return "O arquivo excede o tamanho permitido pelo servidor.";
  }

  const conteudo = await resposta.text();

  if (!conteudo.trim()) {
    return mensagemPadrao;
  }

  const tipoConteudo =
    resposta.headers.get("content-type") ?? "";

  if (tipoConteudo.includes("json")) {
    try {
      const dados: unknown = JSON.parse(conteudo);

      if (dados !== null && typeof dados === "object") {
        if ("erro" in dados && typeof dados.erro === "string") {
          return dados.erro;
        }

        if (
          "message" in dados &&
          typeof dados.message === "string"
        ) {
          return dados.message;
        }
      }
    } catch {
      return mensagemPadrao;
    }
  }

  if (tipoConteudo.includes("text/plain")) {
    return conteudo.trim();
  }

  return mensagemPadrao;
}

// Envia um arquivo utilizando multipart/form-data.
async function enviarArquivo<T>(
  endpoint: string,
  arquivo: File,
): Promise<T> {
  const formulario = new FormData();

  formulario.append("arquivo", arquivo, arquivo.name);

  let resposta: Response;

  try {
    resposta = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...cabecalhoCsrf(),
      },
      body: formulario,
    });
  } catch {
    throw new Error(
      "Não foi possível conectar ao backend da ÁRIA.",
    );
  }

  if (!resposta.ok) {
    const mensagem = await obterMensagemErro(resposta);

    throw new ErroImportacaoApi(
      resposta.status,
      mensagem,
    );
  }

  return (await resposta.json()) as T;
}

// Importa títulos CSV e cria uma campanha.
export async function importarTitulosCsv(
  arquivo: File,
): Promise<ImportacaoCsvApi> {
  return enviarArquivo<ImportacaoCsvApi>(
    "/api/importacoes/csv",
    arquivo,
  );
}

// Importa cancelamentos de um arquivo PDF.
export async function importarCancelamentosPdf(
  arquivo: File,
): Promise<ImportacaoPdfApi> {
  return enviarArquivo<ImportacaoPdfApi>(
    "/api/importacoes/cancelamentos",
    arquivo,
  );
}
