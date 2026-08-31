import type { Metadata } from 'next';

/**
 * Identidade de app do mapa: manifest, ícones e nome de atalho.
 *
 * O site instala como dois PWAs distintos — a pousada e o mapa —, e as duas
 * rotas do mapa (`/mapa/`, a ferramenta, e `/mapa-turistico/`, a porta de
 * entrada dela) precisam declarar exatamente a mesma identidade: quem instala
 * a partir de qualquer uma das duas tem que receber o mesmo app, com o mesmo
 * ícone e o mesmo `start_url`. Duas cópias do mesmo bloco de metadata
 * divergiriam na primeira edição, então ele mora aqui e é espalhado nos dois
 * `generateMetadata`.
 *
 * Por que não a convenção de arquivo do Next (`app/mapa/icon.png`,
 * `app/mapa/apple-icon.png`, `app/manifest.json`): ela é por segmento, e
 * `/mapa-turistico/` é um segmento irmão, não filho de `/mapa/`. Usá-la
 * obrigaria a duplicar os binários nas duas pastas. Os arquivos ficam em
 * `public/` com prefixo `mapa-` e são apontados explicitamente.
 *
 * O `icon0.svg` que veio do gerador de ícones ficou de fora, pelo mesmo
 * motivo que o da pousada: 762 KB de SVG rasterizado (1254×1254) para um
 * favicon que nenhum navegador vai preferir aos PNG/ICO abaixo.
 */
export const METADATA_APP_MAPA = {
  /**
   * Sobrescreve o `/manifest.webmanifest` do layout raiz. `manifest` é campo
   * de metadata, e o segmento filho substitui o do pai — por isso as rotas da
   * pousada seguem com o manifest dela sem precisar de nada.
   */
  manifest: '/mapa.webmanifest',
  /**
   * O iOS ignora o manifest inteiro: sem este título o atalho na tela de
   * início herdaria o `<title>` da rota, com o sufixo da pousada junto.
   */
  appleWebApp: {
    title: 'Mapa SBS',
  },
  /**
   * Mesmos formatos e tamanhos que o layout raiz emite para a pousada (ICO
   * 48×48 para o legado, PNG 96×96 para o resto, 180×180 para o iOS), só que
   * com a arte do mapa.
   */
  icons: {
    icon: [
      { url: '/mapa-favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/mapa-icon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/mapa-apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
} satisfies Metadata;
