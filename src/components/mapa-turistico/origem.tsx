'use client';

import { createContext, useContext, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ORIGEM_CENTRO,
  ORIGEM_PADRAO,
  ORIGEM_REFUGIO,
  type Origem,
} from '@/lib/mapa-turistico';

/**
 * De onde o mapa mede, decidido uma vez só e distribuído para a árvore.
 *
 * A URL é o interruptor entre dois mapas. Sem parâmetro nenhum, `/mapa/` é o
 * mapa da cidade: mede tudo do Centro de São Bento, não tem o botão "Refúgio"
 * nos controles e serve a quem só quer saber onde ficam as cachoeiras. Com
 * `?refugio=1` ele é o mapa do hóspede, medido da varanda — o que este site
 * fazia desde sempre, agora atrás de um pedido explícito.
 *
 * A leitura acontece aqui, e não em cada componente que precisa da origem: são
 * meia dúzia deles, e um `useSearchParams()` em cada um espalharia o nome do
 * parâmetro por meia dúzia de arquivos, onde ele acabaria escrito diferente em
 * um. Aqui o nome aparece uma vez.
 */
const PARAM = 'refugio';

/**
 * O padrão do contexto é a origem padrão, e isso é de propósito.
 *
 * Componente montado fora do provedor não quebra nem precisa de guarda: ele
 * renderiza o mapa da cidade, que é o que o site é quando ninguém pediu outra
 * coisa. É o que faz o `fallback` do `<Suspense>` de `/mapa-turistico/` ser o
 * próprio conteúdo, e não um esqueleto — ver ali.
 */
const ContextoOrigem = createContext<Origem>(ORIGEM_PADRAO);

/**
 * Lê o parâmetro e publica a origem.
 *
 * `useSearchParams()` obriga o consumidor a estar dentro de um `<Suspense>`
 * numa rota renderizada estaticamente — sem isso o `next build` falha, não o
 * `next dev`. As duas rotas do mapa são estáticas, então as duas embrulham
 * este provedor.
 *
 * A leitura aceita o parâmetro presente com qualquer valor que não seja `0`,
 * e não só `refugio=1`. O link vive em material impresso e em conversa de
 * WhatsApp: quem digitar `?refugio` sem valor está pedindo a mesma coisa, e
 * cair calado no mapa da cidade seria a falha mais difícil de perceber que
 * este parâmetro poderia ter.
 */
export function ProvedorOrigem({ children }: { children: React.ReactNode }) {
  const params = useSearchParams();
  const pedido = params.get(PARAM);

  const origem = useMemo(
    () =>
      pedido !== null && pedido !== '0' ? ORIGEM_REFUGIO : ORIGEM_CENTRO,
    [pedido],
  );

  return (
    <ContextoOrigem.Provider value={origem}>
      {children}
    </ContextoOrigem.Provider>
  );
}

/** A origem ativa. Fora do provedor, o Centro — ver `ContextoOrigem`. */
export function useOrigem(): Origem {
  return useContext(ContextoOrigem);
}
