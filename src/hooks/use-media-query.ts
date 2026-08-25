'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Lê uma media query com `matchMedia`.
 *
 * A leitura acontece durante a renderização, não em efeito. Corrigir o valor
 * só depois da montagem significa montar a árvore errada antes: com
 * `useIsMobile` o erro é caro, porque um valor inicial `false` quer dizer "é
 * mobile" — o desktop montava o cromo do celular, a barra de busca de ponta a
 * ponta no topo, e a tirava no quadro seguinte. Como a saída dela é animada, o
 * desmonte não era instantâneo: a barra ainda subia por 200 ms na cara de quem
 * acabou de abrir o mapa.
 *
 * `useSyncExternalStore` recebe a mesma função nos dois lugares. No servidor
 * `window` não existe e ela devolve `false`; no cliente ela devolve a verdade
 * desde a primeira renderização, inclusive durante a hidratação. Ler a
 * viewport na hidratação só divergiria do HTML se algo renderizado no servidor
 * dependesse dela — e não depende: quem consome este hook é o mapa, cujo
 * conteúdo só existe depois que a instância do MapLibre nasce, já no cliente.
 */
export function useMediaQuery(query: string): boolean {
  const assinar = useCallback(
    (avisar: () => void) => {
      const lista = window.matchMedia(query);
      lista.addEventListener('change', avisar);

      return () => lista.removeEventListener('change', avisar);
    },
    [query],
  );

  const ler = useCallback(
    () =>
      typeof window === 'undefined' ? false : window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(assinar, ler, ler);
}

/** `md` do Tailwind. Abaixo disso o mapa usa a árvore mobile. */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 768px)');
}
