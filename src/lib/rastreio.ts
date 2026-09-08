/*
  Ponte única para o Umami. Existe para que nenhum componente precise saber
  qual é a ferramenta de medição — e para que a ausência dela seja um no-op
  silencioso em vez de um erro no meio de um clique. O `?.` é o ponto central:
  em desenvolvimento sem `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, ou no navegador de
  quem bloqueia scripts, `rastrear` simplesmente não faz nada. Um clique em
  "Como chegar" nunca pode falhar porque o analytics não carregou.

  Só medimos intenção: traçar rota, chamar o parceiro no WhatsApp e entrar na
  página que ele paga. Clique em pino e abertura de ficha ficam de fora de
  propósito — são exploração do mapa, não sinal de que alguém vai ao lugar, e
  encheriam o relatório do parceiro com número que não vende nada.

  Contagem de acesso também não passa por aqui: o script é montado com
  `data-auto-track='false'` em `src/app/layout.tsx`, então nenhuma página do
  site reporta visita. O que o servidor recebe é esta lista de eventos e mais
  nada.
*/
declare global {
  interface Window {
    umami?: {
      track: (evento: string, dados?: Record<string, unknown>) => void;
    };
  }
}

/*
  União fechada de propósito: um typo em `rastrear('rota-mpa', ...)` vira erro
  de compilação em vez de um evento fantasma que só apareceria semanas depois,
  na hora de montar o relatório — quando o dado perdido já não volta.
*/
export type EventoRastreado =
  | 'rota-mapa'
  | 'whatsapp-mapa'
  | 'vitrine-entrada'
  | 'rota-vitrine'
  | 'whatsapp-vitrine';

interface DadosEvento {
  /** `id` do local no cadastro (`src/data/mapa-turistico.json`). */
  ponto: string;
  /*
    Qual dobra da página do parceiro converteu. Só faz sentido nos eventos
    `-vitrine`, e é o que diz se quem chama no WhatsApp veio do cardápio ou da
    primeira tela — ou seja, o que refazer quando a página não converte.
  */
  secao?: string;
}

export const rastrear = (evento: EventoRastreado, dados: DadosEvento) => {
  if (typeof window === 'undefined') return;

  window.umami?.track(evento, { ...dados });
};
