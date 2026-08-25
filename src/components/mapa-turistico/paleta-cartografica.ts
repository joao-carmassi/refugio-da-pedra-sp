import type { AllPaintProperties, Map as MapaLibre } from 'maplibre-gl';

/**
 * Cores do chão do mapa.
 *
 * A referência é o Google Maps numa região de mata: o terreno inteiro é
 * verde, a estrada é branca com um contorno lilás fino e o rio é o único
 * traço de cor forte. O `liberty` do OpenFreeMap tem as camadas certas para
 * isso — mata, área protegida, curso d'água, hierarquia de via — mas chega
 * pintado em bege de papel, com rodovia amarela.
 *
 * O verde do Google não vem do OpenStreetMap: é vegetação de satélite,
 * proprietária deles. O OSM só tem manchas soltas de mata. Por isso o verde
 * aqui é o `fundo` — o chão já nasce verde e as manchas de mata só o
 * escurecem onde a floresta está de fato mapeada. É o que dá o tapete
 * contínuo em vez de ilhas verdes num vazio bege.
 */
export const PALETA_BASE = {
  /** O chão. É ele que faz o verde contínuo, não as manchas de mata. */
  fundo: '#d9ebd6',
  /** Mata mapeada e área protegida — o Monumento Natural da Pedra do Baú. */
  mata: '#c3e0bd',
  grama: '#cfe6c7',
  /** Mancha urbana: o vilarejo precisa clarear para se separar da mata. */
  urbano: '#f2f1ee',
  agua: '#a5cbe8',
  via: '#ffffff',
  /** O lilás que desenha a estradinha de terra vista de longe. */
  viaContorno: '#cfcbd8',
} as const;

/**
 * Repinta a base cartográfica e cala os POIs que vêm do OpenStreetMap.
 *
 * Casa as camadas por padrão de id em vez de listar as 111 uma a uma: o
 * `liberty` nomeia por família (`landcover_*`, `road_*`, `*_casing`), então
 * uma dúzia de regras cobre o estilo inteiro e continua cobrindo se o
 * OpenFreeMap acrescentar uma variante nova de via.
 *
 * Roda no cliente, sobre o estilo já baixado — não há requisição a mais nem
 * arquivo de estilo próprio para manter.
 */
export function pintarBase(map: MapaLibre) {
  // Não serve `isStyleLoaded()`: ele só passa a valer quando as fontes de
  // tile terminam de carregar, muito depois de as camadas existirem. Como o
  // gancho que chama esta função dispara antes disso, o portão fechava a
  // porta e não abria de novo. O que importa aqui é só ter camada para
  // pintar.
  const estilo = map.getStyle();
  if (!estilo?.layers?.length) return;

  // `setPaintProperty` dispara `styledata`, que é justamente o gancho que
  // chama esta função. Sem esta saída, a primeira pintura se realimentaria.
  const fundo = estilo.layers.find((camada) => camada.type === 'background');
  if (fundo?.paint?.['background-color'] === PALETA_BASE.fundo) return;

  for (const { id, type } of estilo.layers) {
    const pintar = (
      propriedade: keyof AllPaintProperties,
      cor: string | number,
    ) => {
      try {
        map.setPaintProperty(id, propriedade, cor);
      } catch {
        // Camada que não tem essa propriedade de pintura. O estilo é de
        // terceiros e pode mudar; uma camada fora do previsto não pode
        // derrubar a repintura das outras.
      }
    };

    if (/^poi_/.test(id)) {
      // Os pontos de interesse do OpenStreetMap saem de cena.
      //
      // A partir do zoom 15 o `liberty` começa a soltar os POIs dele —
      // pousada, restaurante, mirante, ponto de ônibus — cada um com ícone e
      // rótulo próprios. São dados que ninguém curou: entram todos os que
      // alguém cadastrou no OSM, abertos ou não, com nome errado ou não, e
      // aparecem com o mesmo peso visual dos pinos desta lista. O mapa passa a
      // ter duas camadas de "lugar para ir" competindo, e a que o Refúgio
      // escolheu mostrar vira a minoria na tela.
      //
      // `visibility` em vez de remover a camada: `removeLayer` é destrutivo e
      // o estilo é recarregado por conta própria pelo MapLibre em algumas
      // transições, o que traria os POIs de volta sem aviso. Esconder é
      // idempotente e sobrevive a isso.
      //
      // Só a família `poi_` (ids `poi_r1`, `poi_r7`, `poi_r20`, `poi_transit`,
      // todos sobre a source-layer `poi`). Nome de vilarejo, de estrada e de
      // curso d'água ficam: eles orientam, não disputam.
      try {
        map.setLayoutProperty(id, 'visibility', 'none');
      } catch {
        // Mesmo motivo do `catch` de `pintar`: estilo de terceiros.
      }
      continue;
    }

    if (type === 'background') {
      pintar('background-color', PALETA_BASE.fundo);
    } else if (/^(park|landcover_wood|landuse_cemetery)/.test(id)) {
      // Opacidade cheia: no original a mata é translúcida para deixar o bege
      // aparecer por baixo. Aqui o que está por baixo já é verde, e a
      // translucidez só apagaria a diferença entre mata e terreno.
      pintar('fill-color', PALETA_BASE.mata);
      pintar('fill-opacity', 1);
    } else if (/^(landcover_grass|landuse_pitch|landuse_track|landuse_school)/.test(id)) {
      pintar('fill-color', PALETA_BASE.grama);
      pintar('fill-opacity', 1);
    } else if (/^landuse_residential/.test(id)) {
      pintar('fill-color', PALETA_BASE.urbano);
      pintar('fill-opacity', 1);
    } else if (/rail/.test(id)) {
      // Ferrovia fica como está: não é via de carro e não deve virar branca
      // junto com as estradas.
      continue;
    } else if (/water/.test(id) && type !== 'symbol') {
      pintar(type === 'fill' ? 'fill-color' : 'line-color', PALETA_BASE.agua);
    } else if (/_casing$/.test(id)) {
      pintar('line-color', PALETA_BASE.viaContorno);
    } else if (/^(road|tunnel|bridge)_/.test(id) && type === 'line') {
      // Inclusive rodovia: no Google a estrada só muda de espessura, não de
      // cor. O amarelo do `liberty` brigaria com o verde.
      pintar('line-color', PALETA_BASE.via);
    }
  }
}
