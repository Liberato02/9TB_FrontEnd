import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

import { automacoes } from "../automacoes/catalogo";
import BotaoComunicados from "../compartilhado/componentes/BotaoComunicados";
import SimboloAria from "../compartilhado/componentes/SimboloAria";

function numeroDaTela(indice: number) {
  return String(indice + 1).padStart(2, "0");
}

function Inicio() {
  return (
    <div
      data-tema="escuro"
      className="h-screen snap-y snap-mandatory overflow-y-auto bg-noite text-texto"
    >
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-6 py-6 md:px-12 xl:px-16">
        <div className="flex items-center gap-3">
          <SimboloAria className="h-11 w-auto" />

          <span className="font-titulo text-3xl font-bold tracking-wide text-white">
            ÁRIA
          </span>
        </div>

        <div className="flex items-center gap-5">
          <span className="hidden text-sm text-texto-secundario sm:block">
            9º Tabelionato de Protesto de São Paulo
          </span>

          <BotaoComunicados />
        </div>
      </header>

      <main>
        <h1 className="sr-only">Automações da ÁRIA</h1>

        {automacoes.map((automacao, indice) => {
          const Ilustracao = automacao.ilustracao;
          const idTitulo = `automacao-${automacao.id}`;

          return (
            <section
              key={automacao.id}
              aria-labelledby={idTitulo}
              className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden px-6 pt-28 pb-20 md:px-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-marca/45 blur-3xl"
              />

              <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
                <p className="font-titulo text-xl font-semibold tabular-nums text-coral-texto">
                  {numeroDaTela(indice)}
                </p>

                <Ilustracao className="mt-4 h-[36vh] max-h-96 w-auto max-w-full" />

                <h2
                  id={idTitulo}
                  className="mt-8 font-titulo text-5xl font-bold leading-tight text-white xl:text-6xl"
                >
                  {automacao.nome}
                </h2>

                <p className="mt-3 max-w-2xl text-lg leading-7 text-texto-secundario">
                  {automacao.descricao}
                </p>

                <nav
                  aria-label={`Atalhos de ${automacao.nome}`}
                  className="mt-8 flex flex-wrap justify-center gap-3"
                >
                  <Link
                    to={automacao.caminho}
                    className="inline-flex items-center gap-2 rounded-lg bg-coral px-6 py-3 text-sm font-semibold text-noite transition-colors hover:bg-coral-forte"
                  >
                    Abrir
                    <ArrowRight size={17} />
                  </Link>

                  {automacao.atalhos.map((atalho) => {
                    const IconeAtalho = atalho.icone;

                    return (
                      <Link
                        key={atalho.caminho}
                        to={atalho.caminho}
                        className="inline-flex items-center gap-2 rounded-lg border border-borda-forte bg-superficie-suave/60 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-destaque-suave"
                      >
                        <IconeAtalho
                          size={17}
                          className="shrink-0 text-texto-secundario"
                        />
                        {atalho.nome}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {indice === 0 && (
                <p className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-xs text-texto-secundario">
                  Role para ver mais
                  <ChevronDown size={18} />
                </p>
              )}
            </section>
          );
        })}

        <section
          aria-labelledby="proximas-automacoes"
          className="relative flex min-h-screen snap-start items-center justify-center overflow-hidden px-6 pt-28 pb-20 md:px-12"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral/25 blur-3xl"
          />

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
            <p className="font-titulo text-xl font-semibold tabular-nums text-coral-texto">
              {numeroDaTela(automacoes.length)}
            </p>

            <div
              aria-hidden="true"
              className="mt-4 h-[30vh] max-h-80 w-[24vh] max-w-60 rounded-2xl border-2 border-dashed border-borda-forte"
            />

            <h2
              id="proximas-automacoes"
              className="mt-8 font-titulo text-5xl font-bold leading-tight text-white xl:text-6xl"
            >
              Próximas automações
            </h2>

            <p className="mt-3 max-w-2xl text-lg leading-7 text-texto-secundario">
              Novas automações aparecem aqui conforme forem criadas.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Inicio;
