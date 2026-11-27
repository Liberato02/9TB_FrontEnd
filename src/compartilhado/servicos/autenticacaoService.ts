export type NivelAcesso =
  "SUPERADMINISTRADOR" | "ADMINISTRADOR" | "FUNCIONARIO";

export interface UsuarioConectado {
  id: number;
  nome: string;
  email: string | null;
  nomeUsuario: string | null;
  nivelAcesso: NivelAcesso;
}

export class ErroCredenciais extends Error {
  constructor() {
    super("Usuário ou senha incorretos.");
    this.name = "ErroCredenciais";
  }
}

const nomeCookieCsrf = "XSRF-TOKEN=";

export const eventoSessaoEncerrada = "aria:sessao-encerrada";

export function conferirSessao(resposta: Response): void {
  if (resposta.status === 401) {
    window.dispatchEvent(new Event(eventoSessaoEncerrada));
  }
}

function lerTokenCsrf(): string | null {
  const item = document.cookie
    .split("; ")
    .find((parte) => parte.startsWith(nomeCookieCsrf));

  return item ? decodeURIComponent(item.slice(nomeCookieCsrf.length)) : null;
}

export function cabecalhoCsrf(): Record<string, string> {
  const token = lerTokenCsrf();

  return token ? { "X-XSRF-TOKEN": token } : {};
}

export async function buscarUsuarioConectado(): Promise<UsuarioConectado | null> {
  const resposta = await fetch("/api/auth/eu", {
    headers: { Accept: "application/json" },
  });

  if (resposta.status === 401) {
    return null;
  }

  if (!resposta.ok) {
    throw new Error(`Erro ao consultar a sessão. HTTP ${resposta.status}`);
  }

  return (await resposta.json()) as UsuarioConectado;
}

export async function entrar(
  identificador: string,
  senha: string,
): Promise<UsuarioConectado> {
  if (!lerTokenCsrf()) {
    await buscarUsuarioConectado();
  }

  const resposta = await fetch("/api/auth/entrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...cabecalhoCsrf(),
    },
    body: new URLSearchParams({ identificador, senha }),
  });

  if (resposta.status === 401) {
    throw new ErroCredenciais();
  }

  if (!resposta.ok) {
    throw new Error(`Erro ao entrar. HTTP ${resposta.status}`);
  }

  const usuario = await buscarUsuarioConectado();

  if (!usuario) {
    throw new ErroCredenciais();
  }

  return usuario;
}

export async function sair(): Promise<void> {
  await fetch("/api/auth/sair", {
    method: "POST",
    headers: cabecalhoCsrf(),
  });
}
