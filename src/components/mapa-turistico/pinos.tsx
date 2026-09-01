'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Star } from 'lucide-react';
import { Marker, Popup } from 'maplibre-gl';
import type {
  ExpressionSpecification,
  GeoJSONSource,
  Map as MapaLibre,
  MapGeoJSONFeature,
} from 'maplibre-gl';
import type { FeatureCollection } from 'geojson';
import { useMap } from '@/components/ui/map';
import { CATEGORIAS, LOCAIS, type Local } from '@/lib/mapa-turistico';
import { ZOOM_MAXIMO, ZOOM_MINIMO } from './base-cartografica';
import CartaoRapido from './cartao-rapido';

/**
 * Os pinos do mapa, como uma camada de símbolo do MapLibre.
 *
 * Antes eram trinta e dois marcadores de DOM, um `<div>` por lugar com disco,
 * ícone, cauda e etiqueta em CSS. Funcionava e era caro: o MapLibre reposiciona
 * cada marcador a cada quadro, e trinta e duas subárvores com sombra e borda
 * arredondada, promovidas a camada de compositor em DPR 3, dominavam o custo de
 * aproximar o mapa. Medido num celular emulado com a CPU quatro vezes mais
 * lenta, numa aproximação de zoom 11,5 a 16,5: vinte e sete quadros acima de
 * 33 ms com os marcadores, cinco com esta camada — e dois com pino nenhum na
 * tela, que é o piso. O desenho vira uma chamada só.
 *
 * O que se perdeu: o pino não entra mais crescendo a partir da ponta da cauda.
 * Uma camada de símbolo não tem transição de CSS, e reproduzir o crescer daria
 * uma animação em JavaScript quadro a quadro — de volta ao custo que a mudança
 * veio tirar. Entra e sai por opacidade, e só.
 *
 * O que se ganhou de graça: a escala por zoom era um módulo com duas curvas, um
 * `Set` de elementos e um ouvinte que escrevia `scale` em trinta e duas camadas
 * a cada quadro. Virou uma expressão `icon-size`, avaliada pelo próprio
 * MapLibre.
 *
 * Sobram dois nós de DOM, e só quando fazem falta: a etiqueta do pino
 * selecionado, que é uma pílula com fundo e sombra que `text-field` não sabe
 * desenhar, e o balão de prévia do hover. Um de cada, não trinta e dois.
 */

const FONTE = 'pinos';

/**
 * Exportada porque quem escuta o toque no vazio do mapa precisa saber
 * distinguir o vazio de um pino: sem marcador de DOM, o toque num pino é um
 * clique no canvas como qualquer outro.
 */
export const CAMADA_PINOS = 'pinos';

const CAMADA = CAMADA_PINOS;

/** Diâmetro do disco em cada variante, no zoom de referência da escala. */
const DIAMETRO = {
  comum: 27,
  destaque: 32,
  selecionado: 37,
  refugio: 39,
} as const;

const CAUDA = { largura: 2, altura: 8 };

/** O selo de parceiro, no canto superior direito do disco. */
const SELO = { tamanho: 15, borda: 2, recuoTopo: 4, recuoDireita: 6 };

/**
 * Folga em volta do desenho, igual nos quatro lados e igual em toda variante.
 *
 * A sombra vaza para fora do disco e o selo passa da borda direita; sem folga,
 * o raster cortaria os dois. Ser a mesma em todas as imagens é o que permite um
 * `icon-offset` único devolver a ponta da cauda à coordenada — o MapLibre
 * multiplica esse deslocamento pelo `icon-size`, então ele acompanha a escala
 * sozinho.
 */
const FOLGA = 16;

/**
 * Como o tamanho do pino responde ao zoom.
 *
 * `2 ** ((zoom - referencia) * forca)` é o crescimento do próprio mapa elevado
 * a uma fração. Com `forca: 1` o pino acompanharia o terreno metro a metro e as
 * pontas ficariam impraticáveis — invisível de longe, gigante de perto.
 *
 * São duas curvas, escolhidas por `pointer: coarse` e não por largura de tela,
 * porque a pergunta que importa é sobre o dedo. No ponteiro fino a referência é
 * 12,6, acima do zoom em que o mapa abre, e o piso pode ser baixo porque o
 * ponteiro é preciso. No toque a curva inteira desliza para o fim do zoom: numa
 * tela de 390px quem decide se dois pinos se encavalam não é o zoom, é a
 * largura, então o pino fica no piso do vale inteiro até o centro da cidade e
 * só cresce quando o mapa abre a rua.
 */
const ESCALA = {
  ponteiroFino: { referencia: 12.6, forca: 0.45, piso: 0.55, teto: 1.15 },
  ponteiroGrosso: {
    referencia: ZOOM_MAXIMO - 1,
    forca: 0.3,
    piso: 0.75,
    teto: 1.15,
  },
} as const;

type Curva = (typeof ESCALA)[keyof typeof ESCALA];

function escalaDoZoom(zoom: number, curva: Curva) {
  const bruta = 2 ** ((zoom - curva.referencia) * curva.forca);

  return Math.min(curva.teto, Math.max(curva.piso, bruta));
}

/** Quanto o pino sob o ponteiro cresce. Era `scale-115` no CSS. */
const DESTAQUE = 1.15;

/** Duração do esmaecer de quem entra e sai do filtro, em milissegundos. */
const ESMAECER = 300;

/**
 * A curva do zoom como expressão de `icon-size`.
 *
 * Duas restrições do MapLibre moldam o formato. A primeira: `zoom` só vale como
 * entrada de um `interpolate` ou `step` no topo da expressão — multiplicar o
 * `interpolate` por fora, que era o jeito óbvio de somar o realce do hover, é
 * recusado na validação da camada. O realce desce então para a saída de cada
 * parada, que pode ser orientada a dado à vontade.
 *
 * A segunda: `interpolate` com `exponential` não é a mesma conta que a nossa —
 * ele interpola a posição dentro do intervalo, não o valor. Reescrever a curva
 * na gramática dele daria dois lugares para o mesmo número envelhecer, então a
 * função é amostrada de meio em meio nível de zoom e `escalaDoZoom` continua
 * sendo a única fonte. Entre paradas tão próximas, a reta erra menos de meio
 * por cento.
 */
function tamanhoDoIcone(curva: Curva): ExpressionSpecification {
  const paradas: unknown[] = [];

  for (let zoom = ZOOM_MINIMO; zoom <= ZOOM_MAXIMO + 0.001; zoom += 0.5) {
    paradas.push(Number(zoom.toFixed(2)), [
      '*',
      escalaDoZoom(zoom, curva),
      ['case', ['get', 'destacado'], DESTAQUE, 1],
    ]);
  }

  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    ...paradas,
  ] as unknown as ExpressionSpecification;
}

const TOQUE =
  typeof window === 'undefined' ? null : window.matchMedia('(pointer: coarse)');

function assinarToque(aoMudar: () => void) {
  TOQUE?.addEventListener('change', aoMudar);

  return () => TOQUE?.removeEventListener('change', aoMudar);
}

/**
 * `true` quando o ponteiro é grosso — dedo, e não mouse.
 *
 * Decide a curva da escala e se a prévia de hover chega a existir: no toque não
 * há `mousemove`, e montar o cartão que ninguém vai ver é trabalho jogado fora.
 * `useSyncExternalStore` porque o valor vive fora do React e pode mudar sozinho
 * — quem encaixa o aparelho num teclado ganha ponteiro no meio da sessão.
 */
function useToque() {
  return useSyncExternalStore(
    assinarToque,
    () => TOQUE?.matches ?? false,
    () => false,
  );
}

/* ------------------------------------------------------------------ desenho */

/**
 * Lê a paleta do CSS em vez de repeti-la aqui.
 *
 * O disco é desenhado fora do CSS, e um raster não entende `var(--map-sand)`.
 * Ler o valor computado uma vez, na montagem, é o que mantém `globals.css` como
 * o único lugar onde essas cores existem.
 *
 * A leitura é a partir do container do mapa, e não de `documentElement`: as
 * variáveis do mapa moram no escopo `[data-mapa-tema]`, que é o `<main>` da
 * página. Lidas da raiz elas voltam vazias — e a primeira versão disto tinha
 * valores de reserva iguais aos do CSS, então voltava tudo vazio e ninguém
 * percebia, porque a reserva acertava a cor por coincidência. Sem reserva: se
 * o escopo mudar de lugar, o pino sai sem cor e o erro aparece.
 */
function paleta(no: HTMLElement) {
  const estilo = getComputedStyle(no);
  const ler = (nome: string) => estilo.getPropertyValue(nome).trim();

  return {
    areia: ler('--map-sand'),
    superficie: ler('--map-surface'),
    pedra: ler('--map-stone'),
    verde: ler('--map-green-deep'),
    sombra: ler('--map-shadow-pin'),
    sombraForte: ler('--map-shadow-pin-active'),
  };
}

/**
 * Traduz um `box-shadow` do CSS para os parâmetros de `feDropShadow`.
 *
 * O CSS diz `0 4px 12px rgb(27 36 32 / 0.22)`, em que 12px é o raio de
 * borrão; o SVG pede desvio-padrão, que é metade dele. Se a leitura falhar, a
 * sombra sai sem deslocamento em vez de derrubar o pino inteiro.
 */
function sombraSvg(valor: string) {
  const partes = valor.match(
    /^(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+([\d.]+)(?:px)?\s+(.+)$/,
  );

  if (!partes) return { dx: 0, dy: 3, desvio: 4, cor: 'rgb(0 0 0 / 0.25)' };

  return {
    dx: Number(partes[1]),
    dy: Number(partes[2]),
    desvio: Number(partes[3]) / 2,
    cor: partes[4],
  };
}

/**
 * A marcação SVG de cada ícone do Lucide, uma vez.
 *
 * O `lucide-react` guarda os traços do ícone dentro do componente e não os
 * expõe, então o jeito de chegar neles é renderizar de fato. Um `createRoot`
 * fora do documento desenha todos os ícones de uma vez e devolve o `outerHTML`
 * de cada `<svg>`; o `viewBox` de 24 que eles trazem é o que deixa a marcação
 * escalar depois, dentro do disco de qualquer variante.
 *
 * É assíncrono de propósito: ler no mesmo quadro exigiria `flushSync`, que o
 * React reclama quando chamado de dentro de um efeito.
 */
async function marcacaoDosIcones(): Promise<Record<string, string>> {
  const alvo = document.createElement('div');
  const raiz = createRoot(alvo);

  raiz.render(
    <>
      {Object.entries(CATEGORIAS).map(([id, categoria]) => (
        <span key={id} data-icone={id}>
          <categoria.icone strokeWidth={2.25} />
        </span>
      ))}
      <span data-icone='selo'>
        <Star fill='currentColor' />
      </span>
    </>,
  );

  await new Promise((pronto) =>
    requestAnimationFrame(() => requestAnimationFrame(pronto)),
  );

  const marcacao: Record<string, string> = {};

  for (const no of alvo.querySelectorAll<HTMLElement>('[data-icone]')) {
    const svg = no.querySelector('svg');
    if (svg && no.dataset.icone) marcacao[no.dataset.icone] = svg.outerHTML;
  }

  raiz.unmount();

  return marcacao;
}

/**
 * Encaixa a marcação de um ícone numa caixa, na cor pedida.
 *
 * O `width` e o `height` que já vêm no ícone precisam sair antes de os novos
 * entrarem: atributo repetido no mesmo elemento é XML malformado, e um SVG
 * malformado não falha em pedaço — a imagem inteira não carrega, sem erro de
 * sintaxe em lugar nenhum. Foi assim que a primeira versão desta camada não
 * desenhou um pino sequer.
 */
function encaixar(svg: string, x: number, y: number, lado: number, cor: string) {
  return svg.replace(/currentColor/g, cor).replace(/^<svg[^>]*>/, (abertura) =>
    abertura
      .replace(/\s(?:width|height)="[^"]*"/g, '')
      .replace(
        /^<svg/,
        `<svg x="${x}" y="${y}" width="${lado}" height="${lado}"`,
      ),
  );
}

interface Desenho {
  diametro: number;
  borda: number;
  corBorda: string;
  fundo: string;
  glifo: string;
  selo: boolean;
  acesa: boolean;
}

/** O pino inteiro como um SVG: sombra, cauda, disco, ícone e selo. */
function pinoSvg(d: Desenho, cores: ReturnType<typeof paleta>, selo: string) {
  const largura = d.diametro + FOLGA * 2;
  const altura = d.diametro + CAUDA.altura + FOLGA * 2;
  const centro = largura / 2;
  const topoDisco = FOLGA;
  const s = sombraSvg(d.acesa ? cores.sombraForte : cores.sombra);
  const lado = d.diametro * 0.52;

  // centro do selo, em coordenadas da imagem
  const seloX = FOLGA + d.diametro + SELO.recuoDireita - SELO.tamanho / 2;
  const seloY = FOLGA - SELO.recuoTopo + SELO.tamanho / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
<defs><filter id="s" x="-60%" y="-60%" width="220%" height="220%">
<feDropShadow dx="${s.dx}" dy="${s.dy}" stdDeviation="${s.desvio}" flood-color="${s.cor}"/>
</filter></defs>
<g filter="url(#s)">
<rect x="${centro - CAUDA.largura / 2}" y="${topoDisco + d.diametro - 1}" width="${CAUDA.largura}" height="${CAUDA.altura + 1}" fill="${d.fundo}"/>
<circle cx="${centro}" cy="${topoDisco + d.diametro / 2}" r="${d.diametro / 2 - d.borda / 2}" fill="${d.fundo}" stroke="${d.corBorda}" stroke-width="${d.borda}"/>
</g>
${encaixar(d.glifo, centro - lado / 2, topoDisco + d.diametro / 2 - lado / 2, lado, cores.areia)}
${
  d.selo
    ? `<circle cx="${seloX}" cy="${seloY}" r="${SELO.tamanho / 2 - SELO.borda / 2}" fill="${cores.pedra}" stroke="${cores.superficie}" stroke-width="${SELO.borda}"/>
${encaixar(selo, seloX - 5, seloY - 5, 10, cores.superficie)}`
    : ''
}</svg>`;
}

/** Rasteriza um SVG na densidade da tela. */
function rasterizar(svg: string, dpr: number): Promise<ImageData> {
  return new Promise((pronto, falhou) => {
    const imagem = new Image();

    imagem.onload = () => {
      const tela = document.createElement('canvas');
      tela.width = Math.ceil(imagem.width * dpr);
      tela.height = Math.ceil(imagem.height * dpr);

      const pincel = tela.getContext('2d');
      if (!pincel) return falhou(new Error('sem contexto 2d'));

      pincel.drawImage(imagem, 0, 0, tela.width, tela.height);
      pronto(pincel.getImageData(0, 0, tela.width, tela.height));
    };

    imagem.onerror = () => falhou(new Error('svg não rasterizou'));
    imagem.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/** Nome da imagem de um lugar em cada estado. */
function nomeDaImagem(local: Local, selecionado: boolean) {
  if (local.refugio) return 'pino:refugio';

  const variante = selecionado
    ? local.destaque
      ? 'selecionado-destaque'
      : 'selecionado'
    : local.destaque
      ? 'destaque'
      : 'comum';

  return `pino:${local.cat}:${variante}`;
}

/**
 * Registra uma imagem por variante que o cadastro de fato usa.
 *
 * São quatro estados por categoria mais o Refúgio — na prática pouco mais de
 * duas dezenas de rasters minúsculos, feitos uma vez na abertura. Gerar só o
 * que o cadastro tem evita desenhar categorias sem nenhum lugar.
 */
async function registrarImagens(map: MapaLibre, dpr: number) {
  const cores = paleta(map.getContainer());
  const icones = await marcacaoDosIcones();
  const selo = icones.selo ?? '';

  const desenhoDe = (local: Local, selecionado: boolean): Desenho => {
    const destaque = Boolean(local.destaque);
    const refugio = Boolean(local.refugio);
    const diametro = refugio
      ? DIAMETRO.refugio
      : selecionado
        ? DIAMETRO.selecionado
        : destaque
          ? DIAMETRO.destaque
          : DIAMETRO.comum;

    return {
      diametro,
      borda: refugio || selecionado ? 3 : destaque ? 2.5 : 2,
      corBorda: refugio || destaque ? cores.pedra : cores.superficie,
      fundo: refugio ? cores.verde : CATEGORIAS[local.cat].cor,
      glifo:
        icones[refugio ? 'hospedagem' : local.cat] ?? icones.turismo ?? '',
      selo: destaque,
      acesa: selecionado || refugio,
    };
  };

  const pendentes = new Map<string, Desenho>();

  for (const local of LOCAIS) {
    for (const selecionado of [false, true]) {
      const nome = nomeDaImagem(local, selecionado);
      if (!pendentes.has(nome)) pendentes.set(nome, desenhoDe(local, selecionado));
    }
  }

  await Promise.all(
    [...pendentes].map(async ([nome, desenho]) => {
      const dados = await rasterizar(pinoSvg(desenho, cores, selo), dpr);

      if (map.hasImage(nome)) map.removeImage(nome);
      map.addImage(nome, dados, { pixelRatio: dpr });
    }),
  );
}

/* ------------------------------------------------------------------- camada */

/**
 * Ordem de pintura, fixa: o MapLibre desenha primeiro quem tem `symbol-sort-key`
 * menor, então o maior vai por último para nunca cair atrás de ninguém. É a
 * mesma ordem que o `z-index` dos marcadores tinha.
 */
function ordemDe(local: Local, selecionado: boolean) {
  if (local.refugio) return 3;
  if (selecionado) return 2;
  if (local.destaque) return 1;

  return 0;
}

function colecao(
  selecionado: string | null,
  destacado: string | null,
): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: LOCAIS.map((local) => {
      const escolhido = selecionado === local.id;

      return {
        type: 'Feature' as const,
        id: local.id,
        properties: {
          id: local.id,
          imagem: nomeDaImagem(local, escolhido),
          ordem: ordemDe(local, escolhido),
          destacado: destacado === local.id && !escolhido,
        },
        geometry: { type: 'Point' as const, coordinates: [local.lng, local.lat] },
      };
    }),
  };
}

/* ------------------------------------------------------------------ etiqueta */

/**
 * A etiqueta do pino selecionado, o único marcador de DOM que sobrou.
 *
 * Podia ser `text-field` na própria camada, e não é: a etiqueta é uma pílula
 * com fundo, borda e sombra, e o SVG de rótulo do MapLibre só sabe desenhar
 * texto com halo. Um marcador por vez custa o que trinta e dois custavam
 * divididos por trinta e dois.
 *
 * `anchor: 'top'` com dois pixels de folga porque a ponta da cauda está sobre a
 * coordenada — a etiqueta nasce logo abaixo dela, e não muda de lugar quando o
 * pino encolhe.
 */
function Etiqueta({ local }: { local: Local }) {
  const { map } = useMap();
  const no = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    if (!map) return;

    const marcador = new Marker({ element: no, anchor: 'top', offset: [0, 2] })
      .setLngLat([local.lng, local.lat])
      .addTo(map);

    return () => {
      marcador.remove();
    };
  }, [map, no, local.lng, local.lat]);

  return createPortal(
    <span
      style={{
        background: 'var(--map-surface)',
        borderColor: 'var(--map-line)',
        color: 'var(--map-ink)',
        boxShadow: 'var(--map-shadow-pin)',
      }}
      className='rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap'
    >
      {local.nome}
    </span>,
    no,
  );
}

/* --------------------------------------------------------------------- pinos */

interface Props {
  /** Quem passou pelo filtro. Quem ficou de fora sai por opacidade. */
  locais: Local[];
  selecionado: string | null;
  hover: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function Pinos({ locais, selecionado, hover, onSelect, onHover }: Props) {
  const { map, isLoaded } = useMap();
  const toque = useToque();
  const [pronta, setPronta] = useState(false);

  const visiveis = useMemo(
    () => new Set(locais.map((item) => item.id)),
    [locais],
  );

  const escolhido = useMemo(
    () => LOCAIS.find((local) => local.id === selecionado) ?? null,
    [selecionado],
  );

  /*
   * Os manipuladores são registrados uma vez e leem o estado por referência: um
   * ouvinte por render faria o `map.on`/`map.off` a cada movimento do ponteiro,
   * que é justamente o que se quer evitar.
   */
  const opacidades = useRef(new Map<string, number>());
  const atual = useRef({ visiveis, onSelect, onHover, toque });

  useEffect(() => {
    atual.current = { visiveis, onSelect, onHover, toque };
  });

  const balao = useMemo(() => document.createElement('div'), []);

  // ---- imagens, fonte e camada ----
  useEffect(() => {
    if (!map || !isLoaded) return;

    let vivo = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    void registrarImagens(map, dpr).then(() => {
      if (!vivo || map.getLayer(CAMADA)) return;

      map.addSource(FONTE, {
        type: 'geojson',
        data: colecao(null, null),
        promoteId: 'id',
      });

      map.addLayer({
        id: CAMADA,
        type: 'symbol',
        source: FONTE,
        layout: {
          'icon-image': ['get', 'imagem'],
          'icon-anchor': 'bottom',
          /*
           * A folga do raster fica abaixo da ponta da cauda; este deslocamento
           * a desconta. O MapLibre multiplica o valor pelo `icon-size`, então
           * ele encolhe junto com o pino e a ponta nunca sai da coordenada.
           */
          'icon-offset': [0, FOLGA],
          /*
           * Sem colisão, como os marcadores de DOM: todo lugar do filtro aparece,
           * sempre. Ligar a colisão deixaria o mapa mais rápido ainda e limparia
           * o amontoado sozinho, ao preço de esconder pontos — é decisão de
           * produto, não de desempenho, e hoje a resposta é mostrar todos.
           */
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
          'symbol-sort-key': ['get', 'ordem'],
          'icon-size': tamanhoDoIcone(
            atual.current.toque ? ESCALA.ponteiroGrosso : ESCALA.ponteiroFino,
          ),
        },
        paint: {
          /*
           * A opacidade vem inteira do estado da feição, e quem a move é o
           * efeito de esmaecer, quadro a quadro.
           *
           * A primeira versão era declarativa — um `case` sobre estado booleano
           * mais a transição de pintura — e não animava: com a transição
           * esticada para três segundos, o pino já estava invisível 80 ms
           * depois do clique no filtro. Transição de pintura vale para mudança
           * da propriedade, não para mudança de estado da feição.
           */
          'icon-opacity': ['number', ['feature-state', 'opacidade'], 1],
        },
      });

      setPronta(true);
    });

    return () => {
      vivo = false;

      if (map.getLayer(CAMADA)) map.removeLayer(CAMADA);
      if (map.getSource(FONTE)) map.removeSource(FONTE);

      setPronta(false);
    };
  }, [map, isLoaded]);

  // ---- a curva da escala segue o ponteiro ----
  useEffect(() => {
    if (!map || !pronta || !map.getLayer(CAMADA)) return;

    map.setLayoutProperty(
      CAMADA,
      'icon-size',
      tamanhoDoIcone(toque ? ESCALA.ponteiroGrosso : ESCALA.ponteiroFino),
    );
  }, [map, pronta, toque]);

  // ---- seleção e hover redesenham a fonte; filtro mexe só no estado ----
  useEffect(() => {
    if (!map || !pronta) return;

    const fonte = map.getSource(FONTE) as GeoJSONSource | undefined;
    fonte?.setData(colecao(selecionado, hover));
  }, [map, pronta, selecionado, hover]);

  /*
   * O esmaecer de quem entra e sai do filtro.
   *
   * É o que sobrou da animação dos marcadores: eles entravam e saíam crescendo,
   * por transição de CSS, e uma camada de símbolo não tem isso. O crescer foi
   * trocado pelo esmaecer, e o esmaecer é escrito à mão porque o declarativo
   * não funciona — ver o comentário em `icon-opacity`.
   *
   * Custa uma rajada de trezentos milissegundos quando o filtro muda, e nada no
   * resto do tempo. Não é por quadro do zoom, que era o problema de origem.
   */
  useEffect(() => {
    if (!map || !pronta) return;

    const inicio = performance.now();
    const partida = new Map(
      LOCAIS.map((local) => [local.id, opacidades.current.get(local.id) ?? 1]),
    );

    let pedido = 0;

    const passo = (agora: number) => {
      const t = Math.min(1, (agora - inicio) / ESMAECER);
      // A mesma curva do `ease-out` que os marcadores usavam.
      const suave = 1 - (1 - t) ** 3;

      for (const local of LOCAIS) {
        const de = partida.get(local.id) ?? 1;
        const para = visiveis.has(local.id) ? 1 : 0;
        const valor = de + (para - de) * suave;

        if (opacidades.current.get(local.id) === valor) continue;

        opacidades.current.set(local.id, valor);
        map.setFeatureState(
          { source: FONTE, id: local.id },
          { opacidade: valor },
        );
      }

      if (t < 1) pedido = requestAnimationFrame(passo);
    };

    pedido = requestAnimationFrame(passo);

    return () => cancelAnimationFrame(pedido);
  }, [map, pronta, visiveis]);

  // ---- ponteiro ----
  const doTopo = useCallback((feicoes: MapGeoJSONFeature[]) => {
    const vivas = feicoes.filter((f) =>
      atual.current.visiveis.has(String(f.properties?.id)),
    );

    return vivas.sort(
      (a, b) => Number(b.properties?.ordem) - Number(a.properties?.ordem),
    )[0];
  }, []);

  useEffect(() => {
    if (!map || !pronta) return;

    const tela = map.getCanvas();

    const mover = (evento: { features?: MapGeoJSONFeature[] }) => {
      const alvo = doTopo(evento.features ?? []);

      tela.style.cursor = alvo ? 'pointer' : '';
      atual.current.onHover(alvo ? String(alvo.properties?.id) : null);
    };

    const sair = () => {
      tela.style.cursor = '';
      atual.current.onHover(null);
    };

    const clicar = (evento: { features?: MapGeoJSONFeature[] }) => {
      const alvo = doTopo(evento.features ?? []);
      if (alvo) atual.current.onSelect(String(alvo.properties?.id));
    };

    map.on('mousemove', CAMADA, mover);
    map.on('mouseleave', CAMADA, sair);
    map.on('click', CAMADA, clicar);

    return () => {
      map.off('mousemove', CAMADA, mover);
      map.off('mouseleave', CAMADA, sair);
      map.off('click', CAMADA, clicar);
      tela.style.cursor = '';
    };
  }, [map, pronta, doTopo]);

  /*
   * A prévia do lugar, no ponteiro fino e só nele: no toque não existe hover, e
   * o mobile recebe a mesma prévia pelo cartão inferior. Um balão para o mapa
   * inteiro — antes era um por pino, trinta e dois cartões montados num
   * contêiner solto para que no máximo um aparecesse.
   */
  const local = useMemo(
    () => LOCAIS.find((item) => item.id === hover) ?? null,
    [hover],
  );

  const previa = !toque && local && visiveis.has(local.id) ? local : null;

  useEffect(() => {
    if (!map || !previa) return;

    const curva = ESCALA.ponteiroFino;
    const diametro = previa.refugio
      ? DIAMETRO.refugio
      : previa.destaque
        ? DIAMETRO.destaque
        : DIAMETRO.comum;

    const balaoLibre = new Popup({
      closeButton: false,
      closeOnClick: false,
      // Acima da ponta da cauda, que é onde a coordenada está: a altura do pino
      // no zoom atual, mais a mesma folga de doze pixels de antes.
      offset:
        (diametro + CAUDA.altura) * escalaDoZoom(map.getZoom(), curva) + 12,
      maxWidth: 'none',
    })
      .setDOMContent(balao)
      .setLngLat([previa.lng, previa.lat])
      .addTo(map);

    return () => {
      balaoLibre.remove();
    };
  }, [map, previa, balao]);

  return (
    <>
      {escolhido && <Etiqueta local={escolhido} />}
      {previa &&
        createPortal(
          <div className='pointer-events-none w-88 text-[color:var(--map-ink)]'>
            <CartaoRapido local={previa} variante='desktop' acoes={false} />
          </div>,
          balao,
        )}
    </>
  );
}

export default Pinos;
