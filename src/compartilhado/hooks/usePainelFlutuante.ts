import { useEffect, useRef, useState } from "react";

export function usePainelFlutuante() {
  const [aberto, setAberto] = useState(false);
  const referencia = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    function aoClicarFora(evento: MouseEvent) {
      if (
        referencia.current &&
        !referencia.current.contains(evento.target as Node)
      ) {
        setAberto(false);
      }
    }

    function aoApertarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") {
        setAberto(false);
      }
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoApertarTecla);

    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoApertarTecla);
    };
  }, [aberto]);

  return {
    aberto,
    referencia,
    alternar: () => setAberto((atual) => !atual),
    fechar: () => setAberto(false),
  };
}
