import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

function LogoAria() {
  return (
    <svg
      width="132"
      height="132"
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Símbolo da ÁRIA"
    >
      <path
        d="M48 121L82 41C84 36 90 36 92 41L126 121"
        stroke="white"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M66 98H109"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <ellipse
        cx="85"
        cy="83"
        rx="68"
        ry="24"
        transform="rotate(-27 85 83)"
        stroke="#F27D70"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="285 160"
      />
      <path
        d="M130 19L134 29L144 33L134 37L130 47L126 37L116 33L126 29L130 19Z"
        fill="#F27D70"
      />
    </svg>
  );
}

function Login() {
  const [identificador, setIdentificador] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState("");

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    setMensagem(
      "Esta é uma prévia visual. A autenticação da ÁRIA ainda não está disponível.",
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071B36] px-4 py-12 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(145deg, transparent 0px, transparent 88px, rgba(255,255,255,0.035) 89px, transparent 91px)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-[#264C7C]/25 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[#183B70]/40 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-8 h-48 w-48 opacity-35 md:right-16 md:top-12"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F27D70 1.6px, transparent 2px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-3 h-40 w-40 opacity-25 md:bottom-12 md:left-16"
        style={{
          backgroundImage:
            "radial-gradient(circle, #F27D70 1.6px, transparent 2px)",
          backgroundSize: "20px 20px",
        }}
      />

      <main className="relative z-10 w-full max-w-[450px]">
        <section className="rounded-[28px] border border-white/15 bg-[#10294B]/95 px-6 pb-9 pt-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:px-10">
          <div className="flex justify-center">
            <LogoAria />
          </div>

          <header className="mt-1 text-center">
            <h1 className="text-[26px] font-semibold tracking-tight">
              Acesse sua conta
            </h1>

            <p className="mt-2 text-sm text-[#B8C8DC]">
              Entre com suas credenciais institucionais.
            </p>
          </header>

          <form onSubmit={entrar} className="mt-9 space-y-5">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#60758D]"
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
                  className="h-13 w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-4 text-sm text-[#183B70] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27D70] focus:ring-2 focus:ring-[#F27D70]/25"
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#60758D]"
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
                  className="h-13 w-full rounded-xl border border-transparent bg-white py-3 pl-12 pr-12 text-sm text-[#183B70] outline-none transition-colors placeholder:text-slate-400 focus:border-[#F27D70] focus:ring-2 focus:ring-[#F27D70]/25"
                />

                <button
                  type="button"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={mostrarSenha}
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#60758D] hover:text-[#183B70]"
                >
                  {mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  setMensagem(
                    "A recuperação de senha estará disponível quando a autenticação for implementada.",
                  )
                }
                className="text-sm font-medium text-[#F6A198] transition-colors hover:text-white hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              className="flex h-13 w-full items-center justify-center gap-3 rounded-xl bg-[#F27D70] text-base font-semibold text-white shadow-[0_6px_20px_rgba(242,125,112,0.2)] transition-colors hover:bg-[#E46C60] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F27D70]"
            >
              Entrar
              <ArrowRight size={20} />
            </button>

            {mensagem && (
              <p
                role="status"
                className="rounded-xl border border-white/15 bg-white/10 p-3 text-center text-sm leading-6 text-white"
              >
                {mensagem}
              </p>
            )}
          </form>
        </section>

        <footer className="mt-7 text-center text-xs text-[#A2B4CC]">
          9º Tabelionato de Protesto de São Paulo
        </footer>
      </main>
    </div>
  );
}

export default Login;
