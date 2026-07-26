'use client';

import { useEffect, useState } from 'react';

/**
 * Id da sentinela que a dobra fotográfica publica no fim de si mesma.
 *
 * Existe como constante compartilhada — e não como um id solto digitado nos
 * dois lados — para que a dobra e a barra de reserva não possam divergir sem
 * o compilador perceber. As duas ficam em componentes irmãos, sem estado em
 * comum, então o DOM é o único ponto de encontro possível.
 */
export const FIM_DA_DOBRA_ID = 'fim-da-dobra';

/**
 * `true` depois que a sentinela sai da tela — ou seja, quando o leitor já
 * passou da dobra.
 *
 * IntersectionObserver, nunca listener de `scroll`: o observer não roda no
 * thread principal a cada quadro. Começa em `false`, então na primeira pintura
 * (e sem JS) a barra fixa não aparece por cima da fotografia de abertura.
 */
export function useAfterFold(id: string = FIM_DA_DOBRA_ID): boolean {
  const [passou, setPassou] = useState(false);

  useEffect(() => {
    const alvo = document.getElementById(id);
    if (!alvo) return;

    const observer = new IntersectionObserver(([entrada]) =>
      setPassou(!entrada.isIntersecting),
    );
    observer.observe(alvo);
    return () => observer.disconnect();
  }, [id]);

  return passou;
}
