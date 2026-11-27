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
  eventoSessaoEncerrada,
  sair as sairApi,
  type UsuarioConectado,
} from "../servicos/autenticacaoService";
import { ContextoSessao } from "./contextoSessao";

function ProvedorSessao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioConectado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [sessaoEncerrada, setSessaoEncerrada] = useState(false);

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

  useEffect(() => {
    function aoEncerrar() {
      setSessaoEncerrada(true);
      setUsuario(null);
    }

    window.addEventListener(eventoSessaoEncerrada, aoEncerrar);

    return () => window.removeEventListener(eventoSessaoEncerrada, aoEncerrar);
  }, []);

  const entrar = useCallback(async (identificador: string, senha: string) => {
    setUsuario(await entrarApi(identificador, senha));
    setSessaoEncerrada(false);
  }, []);

  const sair = useCallback(async () => {
    try {
      await sairApi();
    } finally {
      setSessaoEncerrada(false);
      setUsuario(null);
    }
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, sessaoEncerrada, entrar, sair }),
    [usuario, carregando, sessaoEncerrada, entrar, sair],
  );

  return <ContextoSessao value={valor}>{children}</ContextoSessao>;
}

export default ProvedorSessao;
