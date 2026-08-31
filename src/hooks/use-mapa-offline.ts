'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  baixar,
  espacoSuficiente,
  estado as lerEstado,
  remover as apagar,
  type EstadoOffline,
  type Situacao,
} from '@/lib/mapa-offline';

/**
 * Ciclo de vida do pacote offline do mapa. As regras estão em
 * `@/lib/mapa-offline` — aqui mora só o que é React.
 */
export interface MapaOffline {
  estado: EstadoOffline | null;
  /** Quanto do pacote já está guardado, de 0 a 1. */
  guardado: number;
  /** De 0 a 1 enquanto baixa; `null` quando não está baixando. */
  progresso: number | null;
  erro: 'espaco' | 'rede' | null;
  baixar: () => void;
  cancelar: () => void;
  remover: () => void;
}

export function useMapaOffline(): MapaOffline {
  /*
   * `null` até a primeira leitura, e não `'ausente'`: o estado sai de um cache
   * que só existe no cliente, então o servidor não tem como adivinhá-lo. Chutar
   * "ausente" no HTML faria o botão piscar "Baixar" por um quadro na cara de
   * quem já baixou — e quebraria a hidratação de brinde.
   */
  const [situacao, setSituacao] = useState<Situacao | null>(null);
  const [progresso, setProgresso] = useState<number | null>(null);
  const [erro, setErro] = useState<'espaco' | 'rede' | null>(null);
  const abortar = useRef<AbortController | null>(null);

  const conferir = useCallback(() => {
    void lerEstado().then(setSituacao);
  }, []);

  useEffect(() => {
    conferir();

    // O cache pode ter mudado noutra aba do mesmo mapa — ou ter sido despejado
    // pelo navegador enquanto esta ficava em segundo plano.
    const aoVoltar = () => {
      if (document.visibilityState === 'visible') conferir();
    };

    document.addEventListener('visibilitychange', aoVoltar);
    return () => document.removeEventListener('visibilitychange', aoVoltar);
  }, [conferir]);

  useEffect(() => () => abortar.current?.abort(), []);

  const comecar = useCallback(() => {
    setErro(null);

    void (async () => {
      if ((await espacoSuficiente()) === false) {
        setErro('espaco');
        return;
      }

      const controle = new AbortController();
      abortar.current = controle;
      setProgresso(0);

      try {
        await baixar(
          ({ feitos, total }) => setProgresso(feitos / total),
          controle.signal,
        );
      } catch (falha) {
        // Cancelar é decisão de quem clicou, não avaria: o estado volta para
        // "parcial" sozinho e o botão passa a oferecer continuar.
        if ((falha as Error)?.name !== 'AbortError') {
          setErro(
            (falha as Error)?.name === 'QuotaExceededError' ? 'espaco' : 'rede',
          );
        }
      } finally {
        abortar.current = null;
        setProgresso(null);
        conferir();
      }
    })();
  }, [conferir]);

  const cancelar = useCallback(() => abortar.current?.abort(), []);

  const remover = useCallback(() => {
    void apagar().then(conferir);
  }, [conferir]);

  return {
    estado: situacao?.estado ?? null,
    guardado: situacao?.fracao ?? 0,
    progresso,
    erro,
    baixar: comecar,
    cancelar,
    remover,
  };
}
