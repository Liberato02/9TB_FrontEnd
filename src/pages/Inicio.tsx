import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";

import { automacoes } from "../automacoes/catalogo";
import BotaoComunicados from "../components/layout/BotaoComunicados";
import FundoEstrelado from "../components/layout/FundoEstrelado";
import MenuUsuario from "../components/layout/MenuUsuario";
import SimboloAria from "../components/marca/SimboloAria";

function saudacaoPeloHorario(data: Date) {
  const hora = data.getHours();

  if (hora >= 5 && hora < 12) {
    return "Bom dia.";
  }

  if (hora >= 12 && hora < 18) {
    return "Boa tarde.";
  }

  return "Boa noite.";
}

function formatarData(data: Date) {
  const texto = data.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function Inicio() {
  const [agora, setAgora] = useState(() => new Date());

  useEffect(() => {
    const intervalo = window.setInterval(() => setAgora(new Date()), 60000);

    return () => window.clearInterval(intervalo);
  }, []);

  const disponiveis =
    automacoes.length === 1
      ? "1 disponível para você"
      : `${automacoes.length} disponíveis para você`;

  return (
    <div
      data-tema="escuro"
      className="relative flex min-h-screen flex-col overflow-hidden bg-noite text-texto"
    >
      <FundoEstrelado />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 xl:px-16">
        <div className="flex items-center gap-3">
          <SimboloAria className="h-9 w-auto" />

          <span className="font-titulo text-2xl font-bold tracking-wide text-white">
            ÁRIA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <BotaoComunicados />

          <MenuUsuario />
        </div>
      </header>

      <main className="relative z-10 grid flex-1 items-center gap-12 px-6 py-10 md:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:px-16">
        <section>
          <p className="text-sm font-medium text-coral-texto">
            9º Tabelionato de Protesto de São Paulo
          </p>

          <h1 className="mt-5 font-titulo text-7xl font-bold leading-none text-white md:text-8xl xl:text-9xl">
            {saudacaoPeloHorario(agora)}
          </h1>

          <p className="mt-6 text-lg text-texto-secundario">
            Escolha uma automação para começar.
          </p>

          <p className="mt-6 flex items-center gap-2 text-sm text-texto-secundario">
            <CalendarDays size={16} className="shrink-0" />

            {formatarData(agora)}
          </p>
        </section>

        <section
          aria-labelledby="titulo-automacoes"
          className="w-full max-w-4xl lg:justify-self-end"
        >
          <div className="flex items-end justify-between gap-4">
            <h2
              id="titulo-automacoes"
              className="font-titulo text-3xl font-semibold text-white"
            >
              Automações
            </h2>

            <p className="text-sm text-texto-secundario">{disponiveis}</p>
          </div>

          <div className="mt-4 space-y-4">
            {automacoes.map((automacao) => {
              const Icone = automacao.icone;

              return (
                <article
                  key={automacao.id}
                  className="rounded-2xl border border-borda-forte bg-[linear-gradient(135deg,rgba(26,53,112,0.75),rgba(12,26,46,0.85))] p-8 shadow-2xl shadow-black/30"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-coral text-noite">
                      <Icone size={26} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-titulo text-4xl font-bold leading-tight text-white">
                        {automacao.nome}
                      </h3>

                      <p className="mt-2 max-w-xl text-base leading-6 text-texto-secundario">
                        {automacao.descricao}
                      </p>
                    </div>

                    <Link
                      to={automacao.caminho}
                      className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-coral px-5 py-3 text-sm font-semibold text-noite transition-colors hover:bg-coral-forte"
                    >
                      Abrir
                      <ArrowRight size={17} />
                    </Link>
                  </div>

                  <nav
                    aria-label={`Atalhos de ${automacao.nome}`}
                    className="mt-8 grid gap-3 border-t border-borda-forte pt-6 sm:grid-cols-3"
                  >
                    {automacao.atalhos.map((atalho) => {
                      const IconeAtalho = atalho.icone;

                      return (
                        <Link
                          key={atalho.caminho}
                          to={atalho.caminho}
                          className="group flex items-center gap-3 rounded-lg border border-borda-forte bg-superficie-suave/60 px-4 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-destaque-suave"
                        >
                          <IconeAtalho
                            size={18}
                            className="shrink-0 text-texto-secundario"
                          />

                          <span>{atalho.nome}</span>

                          <ArrowRight
                            size={17}
                            className="ml-auto shrink-0 text-texto-secundario transition-transform group-hover:translate-x-0.5"
                          />
                        </Link>
                      );
                    })}
                  </nav>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-6 py-6 text-xs text-texto-suave md:px-12 xl:px-16">
        9º Tabelionato de Protesto de São Paulo
      </footer>
    </div>
  );
}

export default Inicio;
