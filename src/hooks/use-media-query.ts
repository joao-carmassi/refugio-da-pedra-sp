'use client';

import { useEffect, useState } from 'react';

/**
 * Lê uma media query com `matchMedia`.
 *
 * Começa em `false` na primeira renderização — no servidor não existe
 * viewport, e chutar um valor faria o HTML sair diferente do que o cliente
 * monta. O primeiro efeito corrige antes da pintura (`useEffect` roda antes de
 * qualquer interação), então o custo é uma renderização extra, não um flash.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener('change', update);

    return () => list.removeEventListener('change', update);
  }, [query]);

  return matches;
}

/** `md` do Tailwind. Abaixo disso o mapa usa a árvore mobile. */
export function useIsMobile(): boolean {
  return !useMediaQuery('(min-width: 768px)');
}
