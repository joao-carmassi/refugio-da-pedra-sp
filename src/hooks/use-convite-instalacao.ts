'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ATRASO_FORCADO_MS,
  ATRASO_MS,
  EVENTO_DISPONIVEL,
  SERVICE_WORKER,
  VISITAS_ATE_CONVITE,
  abertoComoApp,
  contarVisita,
  descartarEventoCapturado,
  ehIOS,
  estaSilenciado,
  eventoCapturado,
  foiPedidoPorLink,
  limparParametroDoLink,
  marcarInstalado,
  silenciar,
  type EventoInstalacao,
} from '@/lib/pwa-instalacao';

/**
 * `nativo` = o navegador dá um diálogo de instalação e o botão o dispara.
 * `ios` = não dá, e o convite só pode ensinar o caminho do menu.
 */
export type ModoConvite = 'nativo' | 'ios';

interface Convite {
  /** `null` enquanto o convite não deve estar em cena. */
  modo: ModoConvite | null;
  instalar: () => void;
  dispensar: () => void;
}

/**
 * Ciclo de vida do convite de instalação do PWA do mapa.
 *
 * Faz três coisas, nesta ordem: registra o service worker mínimo que torna a
 * rota instalável, decide se esta visita merece o convite (as regras estão em
 * `pwa-instalacao.ts`) e segura o evento do navegador até o clique no botão.
 *
 * O registro do service worker acontece em toda visita de produção, mesmo
 * quando o convite não vai aparecer — é ele que faz o navegador considerar a
 * rota instalável, e quem está na primeira visita hoje é quem vai receber o
 * convite na próxima. Em desenvolvimento ele não só deixa de ser registrado
 * como é removido; o porquê está no efeito abaixo.
 *
 * A URL pode pedir o convite na hora, com `?instalar=1`; o parâmetro sai
 * assim que a pessoa decide. Ver `PARAMETRO_FORCAR`.
 */
export function useConviteInstalacao(): Convite {
  const [modo, setModo] = useState<ModoConvite | null>(null);
  const [evento, setEvento] = useState<EventoInstalacao | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    /*
     * Em desenvolvimento o service worker não entra — e o que já estiver
     * instalado é desfeito.
     *
     * O argumento que sustenta o cache dele ("tudo que é cache primeiro tem
     * endereço imutável, porque os chunks do Next levam hash de conteúdo no
     * nome") só vale no build de produção. O `next dev` serve os mesmos
     * `/_next/static/` sem hash: `chunks/app/mapa/page.js` e
     * `css/app/layout.css` continuam com o mesmo endereço a cada alteração.
     * Como o `fetch` do worker responde essa faixa com cache primeiro, a
     * primeira visita congela o bundle e o CSS daquele minuto, e a partir dali
     * nenhuma edição aparece na tela — o HTML chega novo, o JavaScript e o
     * estilo chegam velhos. O sintoma não parece cache: parece que o código
     * não foi salvo, e um `<Image>` cujas classes de tamanho ainda não existem
     * no CSS guardado abre no tamanho natural do arquivo.
     *
     * `unregister` sozinho não basta: ele solta o controle das próximas
     * navegações, mas deixa a casca no disco, e uma reinstalação futura
     * voltaria a servir de lá. A casca vai junto.
     *
     * Só a casca. O pacote da base (`mapa-base-*`) fica onde está: ele não tem
     * nada a ver com bundle velho — tem endereço com snapshot no caminho, pesa
     * megabytes e foi baixado por decisão de quem usa. Apagá-lo de passagem,
     * para resolver um problema que é do JavaScript, cobraria o download de
     * novo a cada recarga de quem estivesse justamente testando o modo
     * offline.
     */
    if (process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker
        .getRegistrations()
        .then((registros) =>
          Promise.all(
            registros
              .filter((r) => r.active?.scriptURL.endsWith(SERVICE_WORKER.url))
              .map((r) => r.unregister()),
          ),
        )
        .then(() => caches?.keys())
        .then((nomes) =>
          Promise.all(
            (nomes ?? [])
              .filter((nome) => nome.startsWith('mapa-casca'))
              .map((nome) => caches.delete(nome)),
          ),
        )
        .catch(() => {
          // Navegador sem `caches` ou sem permissão: nada a limpar.
        });

      return;
    }

    /*
     * Depois do `load`: registrar durante o carregamento faz o download do
     * service worker disputar banda com os tiles e o bundle do mapa, que é o
     * que a pessoa está esperando ver. Ele não tem pressa — só precisa estar
     * ativo antes da próxima visita.
     */
    const registrar = () => {
      void navigator.serviceWorker
        .register(SERVICE_WORKER.url, { scope: SERVICE_WORKER.scope })
        .then((registro) =>
          /*
           * `register` numa instalação que já existe devolve a de sempre sem
           * ir à rede — quem procura versão nova do script é o `update`. O
           * navegador também o faz sozinho a cada navegação, mas com um teto
           * de 24 h de cache HTTP no meio; pedir explicitamente encurta para
           * esta visita o intervalo entre publicar uma correção no worker e
           * ela valer. O worker novo assume na hora, sem esperar a aba fechar,
           * porque ele chama `skipWaiting` e `clients.claim`.
           */
          registro.update(),
        )
        .catch(() => {
          // Sem service worker não há convite nativo, e nada mais quebra.
        });
    };

    if (document.readyState === 'complete') {
      registrar();
      return;
    }

    window.addEventListener('load', registrar, { once: true });
    return () => window.removeEventListener('load', registrar);
  }, []);

  useEffect(() => {
    // Já é app: não há o que oferecer, nem pedido por link.
    if (abertoComoApp()) return;

    /*
     * O link `?instalar=1` pula a espera pela segunda visita e o silêncio de
     * uma recusa anterior — quem clicou nele já pediu. A visita continua sendo
     * contada: o link é um atalho para o convite, não uma exceção à contagem.
     */
    const forcado = foiPedidoPorLink();
    const visitas = contarVisita();

    if (!forcado) {
      if (visitas === null || visitas < VISITAS_ATE_CONVITE) return;
      if (estaSilenciado()) return;
    }

    let cronometro: number | undefined;

    const agendar = (proximo: ModoConvite) => {
      cronometro = window.setTimeout(
        () => setModo(proximo),
        forcado ? ATRASO_FORCADO_MS : ATRASO_MS,
      );
    };

    /*
     * `appinstalled` chega quando a instalação foi concluída — inclusive
     * quando ela partiu do menu do navegador, sem passar por este convite.
     */
    const instalado = () => {
      marcarInstalado();
      limparParametroDoLink();
      setEvento(null);
      setModo(null);
    };
    window.addEventListener('appinstalled', instalado);

    const capturar = () => {
      const capturado = eventoCapturado();
      if (!capturado) return;

      setEvento(capturado);
      agendar('nativo');
    };

    if (ehIOS()) {
      agendar('ios');
    } else if (eventoCapturado()) {
      capturar();
    } else {
      /*
       * O evento ainda não chegou. Ele pode nunca chegar — o navegador não
       * dispara se a rota não for instalável, se o app já estiver instalado ou
       * se ele já tiver sido recusado há pouco — e nesse caso o convite
       * simplesmente não aparece, que é o comportamento certo: um botão
       * "instalar" que não instala é pior que nenhum.
       */
      window.addEventListener(EVENTO_DISPONIVEL, capturar);
    }

    return () => {
      window.clearTimeout(cronometro);
      window.removeEventListener('appinstalled', instalado);
      window.removeEventListener(EVENTO_DISPONIVEL, capturar);
    };
  }, []);

  const instalar = useCallback(() => {
    if (!evento) return;

    /*
     * O cartão sai antes do diálogo do navegador: os dois na tela ao mesmo
     * tempo seriam duas perguntas sobrepostas sobre a mesma coisa.
     */
    setModo(null);
    setEvento(null);
    descartarEventoCapturado();

    /*
     * A escolha já foi feita: o parâmetro sai da URL agora, e não depois do
     * diálogo do navegador, que pode ficar aberto por um bom tempo — ou nem
     * ser respondido.
     */
    limparParametroDoLink();

    void (async () => {
      try {
        await evento.prompt();
        const { outcome } = await evento.userChoice;

        /*
         * Recusar o diálogo do navegador silencia o convite pelo mesmo prazo
         * que recusar o cartão. O Chrome também para de disparar o evento por
         * um tempo depois de um "não", então insistir aqui só produziria um
         * cartão com botão morto.
         */
        if (outcome === 'accepted') marcarInstalado();
        else silenciar();
      } catch {
        silenciar();
      }
    })();
  }, [evento]);

  const dispensar = useCallback(() => {
    setModo(null);
    silenciar();
    limparParametroDoLink();
  }, []);

  return { modo, instalar, dispensar };
}
