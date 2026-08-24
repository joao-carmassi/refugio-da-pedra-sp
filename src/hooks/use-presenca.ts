'use client';

import { useEffect, useState } from 'react';

/**
 * Mantém um elemento montado enquanto a animação de saída roda.
 *
 * O React desmonta no quadro em que a condição vira `false`, e um elemento
 * desmontado não anima. Este hook atrasa só o desmonte — quem chama continua
 * usando a condição original para escolher entre a animação de entrada e a de
 * saída.
 *
 * @param aberto Condição real de exibição.
 * @param duracao Duração da animação de saída, em milissegundos.
 */
export function usePresenca(aberto: boolean, duracao = 200) {
  const [montado, setMontado] = useState(aberto);

  // A entrada é imediata, então é ajustada durante a renderização: passar por
  // um efeito pintaria um quadro com o elemento ainda fora da árvore.
  if (aberto && !montado) setMontado(true);

  useEffect(() => {
    if (aberto) return;

    const id = window.setTimeout(() => setMontado(false), duracao);
    return () => window.clearTimeout(id);
  }, [aberto, duracao]);

  return montado;
}
