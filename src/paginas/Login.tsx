import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

import SimboloAria from "../compartilhado/componentes/SimboloAria";

const texturaDiagonal =
  "repeating-linear-gradient(145deg, transparent 0px, transparent 88px, rgba(255, 255, 255, 0.035) 89px, transparent 91px)";

const pontosCoral =
  "radial-gradient(circle, var(--color-coral) 1.6px, transparent 2px)";

const classeCampo =
  "h-12 w-full rounded-lg border border-transparent bg-white py-3 pl-12 text-sm text-noite outline-none transition-colors duration-200 placeholder:text-slate-500 focus:border-coral focus:ring-2 focus:ring-coral/30";

function Login() {
  const navigate = useNavigate();
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    navigate("/", { replace: true });
  }

  return (
    <div
      data-tema="escuro"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noite px-4 py-12 text-texto"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: texturaDiagonal }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-32 h-80 w-80 rounded-full bg-marca/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-marca/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-5 h-48 w-48 opacity-35 md:top-12 md:right-16"
        style={{ backgroundImage: pontosCoral, backgroundSize: "20px 20px" }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-3 h-40 w-40 opacity-25 md:bottom-12 md:left-16"
        style={{ backgroundImage: pontosCoral, backgroundSize: "20px 20px" }}
      />

      <main className="animacao-entrada relative z-10 w-full max-w-[440px]">
        <section className="rounded-2xl border border-borda-forte bg-superficie/95 px-6 pt-9 pb-9 shadow-2xl shadow-black/40 backdrop-blur-sm sm:px-10">
          <div className="flex justify-center">
            <SimboloAria rotulo="ÁRIA" className="h-24 w-auto" />
          </div>

          <header className="mt-6 text-center">
            <h1 className="font-titulo text-4xl font-bold text-white">
              Acesse sua conta
            </h1>

            <p className="mt-2 text-sm text-texto-secundario">
              Entre com suas credenciais institucionais.
            </p>
          </header>

          <form onSubmit={entrar} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="identificador"
                className="mb-2 block text-sm font-medium text-white"
              >
                E-mail ou nome de usuário
              </label>

              <div className="relative">
                <UserRound
                  size={19}
                  aria-hidden="true"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="identificador"
                  name="identificador"
                  type="text"
                  autoComplete="username"
                  required
                  value={identificador}
                  onChange={(evento) => setIdentificador(evento.target.value)}
                  placeholder="Digite seu e-mail ou usuário"
                  className={`${classeCampo} pr-4`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="senha"
                className="mb-2 block text-sm font-medium text-white"
              >
                Senha
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  aria-hidden="true"
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  placeholder="Digite sua senha"
                  className={`${classeCampo} pr-12`}
                />

                <button
                  type="button"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  onClick={() => setMostrarSenha((atual) => !atual)}
                  className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors duration-200 hover:text-noite"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-coral text-base font-semibold text-noite transition-colors duration-200 hover:bg-coral-forte focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coral"
            >
              Entrar
              <ArrowRight size={19} />
            </button>
          </form>
        </section>

        <footer className="mt-7 text-center text-xs text-texto-secundario">
          9º Tabelionato de Protesto de São Paulo
        </footer>
      </main>
    </div>
  );
}

export default Login;
