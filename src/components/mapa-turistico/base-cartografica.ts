import type { LngLatBoundsLike } from 'maplibre-gl';

/**
 * Base cartográfica do mapa turístico.
 *
 * O mapcn vem apontado para os basemaps da CARTO, que exigem licença
 * Enterprise para uso comercial — este site é comercial. O OpenFreeMap serve
 * os mesmos dados do OpenStreetMap em estilo vetorial, sem chave e sem limite
 * de requisições, então é ele que fica.
 *
 * O `positron` chega cinza-neutro. O bege da identidade ("areia serra",
 * #F1EFE6) é obtido por filtro sobre o canvas, em `globals.css`
 * (`[data-mapa-canvas] .maplibregl-canvas`) — mais barato e menos frágil do
 * que reescrever as ~120 camadas de paint do estilo vetorial em runtime.
 */
export const ESTILO_BASE = 'https://tiles.openfreemap.org/styles/positron';

/**
 * Enquadramento inicial: o Refúgio um pouco abaixo do centro óptico, para
 * abrir espaço à barra de busca no topo. O zoom é menor no mobile porque a
 * tela é mais estreita e o vale inteiro não cabe.
 */
export const ZOOM_INICIAL = { desktop: 12.6, mobile: 12 } as const;

/** Zoom a partir do qual um local isolado é apresentado sem contexto demais. */
export const ZOOM_FOCO = 15;

/** Abaixo disso os pinos viram agrupamentos por zona. */
export const ZOOM_AGRUPAMENTO = 11.6;

export const ZOOM_MINIMO = 10.5;
export const ZOOM_MAXIMO = 17;

/**
 * Cerca da região. Impede que o usuário arraste para fora de São Bento do
 * Sapucaí e fique olhando para um mapa vazio sem entender o que aconteceu.
 */
export const LIMITES_REGIAO: LngLatBoundsLike = [
  [-45.92, -22.85],
  [-45.5, -22.5],
];

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
