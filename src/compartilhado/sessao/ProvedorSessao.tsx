import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  buscarUsuarioConectado,
  entrar as entrarApi,
  sair as sairApi,
  type UsuarioConectado,
} from "../servicos/autenticacaoService";
import { ContextoSessao } from "./contextoSessao";

function ProvedorSessao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioConectado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;

    buscarUsuarioConectado()
      .catch(() => null)
      .then((resultado) => {
        if (ativo) {
          setUsuario(resultado);
          setCarregando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (identificador: string, senha: string) => {
    setUsuario(await entrarApi(identificador, senha));
  }, []);

  const sair = useCallback(async () => {
    try {
      await sairApi();
    } finally {
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair }),
    [usuario, carregando, entrar, sair],
  );

  return <ContextoSessao value={valor}>{children}</ContextoSessao>;
}

export default ProvedorSessao;
