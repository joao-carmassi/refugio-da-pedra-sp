import type {
  LngLatBoundsLike,
  Map as MapaLibre,
  StyleSpecification,
} from 'maplibre-gl';
import { LOCAIS, REFUGIO } from '@/lib/mapa-turistico';
import estiloJson from '@/data/base-estilo.json';
import regiaoJson from '@/data/regiao.json';
import { FRACOES } from './folha-mobile';

/**
 * Base cartográfica do mapa turístico.
 *
 * O mapcn vem apontado para os basemaps da CARTO, que exigem licença
 * Enterprise para uso comercial — este site é comercial. O OpenFreeMap serve
 * os mesmos dados do OpenStreetMap em estilo vetorial, sem chave e sem limite
 * de requisições, então é ele que fica.
 *
 * O `liberty` e não o `positron`: o mapa é de uma região de mata, e o
 * `positron` é minimalista a ponto de não desenhar mata nem área protegida —
 * o vale inteiro sairia vazio. O `liberty` traz a mancha do Monumento Natural
 * da Pedra do Baú, os cursos d'água e a hierarquia de estrada que separa a
 * rodovia da estradinha de terra.
 *
 * Ele chega bege de papel, com rodovia amarela; quem dá a cor final é
 * `pintarBase`, em `paleta-cartografica.ts`.
 *
 * O estilo é nosso, e não do OpenFreeMap: `scripts/gerar-base.mjs` baixa a
 * região inteira na build e a congela em `public/mapa-base/<snapshot>/`, pelo
 * mesmo motivo que `gerar-rotas.mjs` congela as rotas — a resposta é a mesma
 * para todo visitante e não muda entre deploys. De quebra, tira o último
 * domínio externo do mapa: `connect-src 'self'`, em `next.config.ts`.
 *
 * O `snapshot` no caminho dos tiles é a leva de dados do OpenFreeMap. Ele torna
 * o pacote imutável por endereço: gerar de novo publica uma pasta nova em vez de
 * puxar o chão de quem já baixou a anterior.
 */

/**
 * O estilo, com o sprite completado.
 *
 * Tiles e glifos o MapLibre resolve a partir da raiz sem reclamar. O sprite,
 * não: ele faz um `new URL(valor)` sem base, que exige esquema e host — e host
 * é justamente o que não se sabe na build, quando o mesmo arquivo vai servir o
 * localhost e o domínio de produção. Completar aqui é o que o próprio erro do
 * MapLibre sugere, e custa uma linha.
 *
 * É função, e não constante, por causa da renderização no servidor, onde
 * `location` não existe: uma constante seria avaliada já na importação e
 * derrubaria o build. A guarda dentro dela é pelo mesmo motivo — o componente do
 * mapa é renderizado uma vez no servidor antes de hidratar, e o valor devolvido
 * ali não chega a ser usado, porque o MapLibre só roda no navegador.
 */
export function getEstiloBase(): StyleSpecification {
  const estilo = estiloJson as unknown as StyleSpecification;

  if (typeof location === 'undefined') return estilo;

  return {
    ...estilo,
    sprite: new URL(estiloJson.sprite, location.origin).toString(),
  };
}

/**
 * Enquadramento inicial: o Refúgio um pouco abaixo do centro óptico, para
 * abrir espaço à barra de busca no topo. O zoom é menor no mobile porque a
 * tela é mais estreita e o vale inteiro não cabe.
 */
export const ZOOM_INICIAL = { desktop: 12.6, mobile: 12 } as const;

/** Zoom a partir do qual um local isolado é apresentado sem contexto demais. */
export const ZOOM_FOCO = 15;

export const ZOOM_MINIMO = regiaoJson.zoomMinimo;
export const ZOOM_MAXIMO = regiaoJson.zoomMaximo;

/**
 * Cerca da região. Impede que o usuário arraste para fora de São Bento do
 * Sapucaí e fique olhando para um mapa vazio sem entender o que aconteceu.
 *
 * Vem de `regiao.json`, e não escrita aqui, porque o gerador da base precisa da
 * mesma caixa para saber quais tiles baixar — ver o comentário lá.
 */
export const LIMITES_REGIAO = regiaoJson.limites as LngLatBoundsLike;

/**
 * Textos da camada de gestos cooperativos do MapLibre. A página tem conteúdo
 * abaixo do mapa, então a roda do mouse precisa continuar rolando a página —
 * o zoom pede Ctrl (ou dois dedos no toque).
 */
export const LOCALE_PT_BR = {
  'AttributionControl.ToggleAttribution': 'Alternar créditos do mapa',
  'AttributionControl.MapFeedback': 'Enviar correção do mapa',
  'CooperativeGesturesHandler.WindowsHelpText':
    'Use Ctrl + rolagem para dar zoom no mapa',
  'CooperativeGesturesHandler.MacHelpText':
    'Use ⌘ + rolagem para dar zoom no mapa',
  'CooperativeGesturesHandler.MobileHelpText':
    'Use dois dedos para mover o mapa',
};

/**
 * A caixa que contém tudo que o mapa tem para mostrar.
 *
 * Calculada dos próprios pontos, e não escrita à mão: acrescentar um lugar no
 * JSON tem de bastar para ele caber na abertura. O Refúgio entra na conta
 * porque ele é o centro da história, não um ponto a mais que pode ficar de
 * fora se todos os outros estiverem para um lado só.
 */
export const CAIXA_LOCAIS: [[number, number], [number, number]] = (() => {
  const lngs = [REFUGIO.lng, ...LOCAIS.map((local) => local.lng)];
  const lats = [REFUGIO.lat, ...LOCAIS.map((local) => local.lat)];

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
})();

/**
 * Enquadra todos os pontos de uma vez.
 *
 * O recuo não é enfeite: o mapa ocupa a tela inteira, mas a parte dele que se
 * vê é menor do que isso — no desktop a coluna dos painéis come a esquerda, no
 * celular a folha come o pé. Enquadrar pela tela toda jogaria metade dos
 * pontos embaixo do que está por cima.
 *
 * O recuo do celular vem da altura real do mapa em vez de um número fixo
 * porque a folha em repouso é uma fração da tela, e telas de celular variam
 * demais para um valor em pixels servir para todas.
 */
export function enquadrarTudo(
  map: MapaLibre,
  mobile: boolean,
  duracao: number,
) {
  const altura = map.getContainer().clientHeight;

  map.fitBounds(CAIXA_LOCAIS, {
    padding: mobile
      ? {
          top: 88,
          bottom: Math.round(altura * FRACOES.minima) + 24,
          left: 28,
          right: 28,
        }
      : { top: 72, bottom: 72, left: 460, right: 72 },
    // Sem teto, dois pontos vizinhos poderiam abrir o mapa colado no chão.
    // A abertura precisa parecer a região, não um quarteirão dela.
    maxZoom: ZOOM_INICIAL.desktop,
    duration: duracao,
  });
}
