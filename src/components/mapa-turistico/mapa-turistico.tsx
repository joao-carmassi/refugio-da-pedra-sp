'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List, Map as IconeMapa, Search, X } from 'lucide-react';
import {
  Map,
  MapArc,
  MapMarker,
  MapRoute,
  MarkerContent,
  useMap,
} from '@/components/ui/map';
import {
  CATEGORIAS,
  FILTRO_TODOS,
  LOCAIS,
  REFUGIO,
  ZONAS,
  filtrarLocais,
  getLocal,
  getRota,
  getRotaUrl,
  type FiltroId,
  type Local,
  type ZonaId,
} from '@/lib/mapa-turistico';
import { useIsMobile } from '@/hooks/use-media-query';
import { usePresenca } from '@/hooks/use-presenca';
import { cn } from '@/lib/utils';
import {
  ESTILO_BASE,
  LIMITES_REGIAO,
  LOCALE_PT_BR,
  ZOOM_AGRUPAMENTO,
  ZOOM_FOCO,
  ZOOM_INICIAL,
  ZOOM_MAXIMO,
  ZOOM_MINIMO,
} from './base-cartografica';
import Busca from './busca';
import CartaoRapido from './cartao-rapido';
import Controles from './controles';
import Filtros from './filtros';
import FolhaMobile, { FRACOES, type Altura } from './folha-mobile';
import PainelDetalhes from './painel-detalhes';
import PainelLista from './painel-lista';
import PainelRota from './painel-rota';
import Pino from './pino';

type Painel = 'lista' | 'detalhes' | 'rota' | null;

/** Ordem que o mapa recebe do resto da interface. */
type OrdemCamera =
  | { tipo: 'pan'; local: Local; selo: number }
  | { tipo: 'foco'; local: Local; selo: number }
  | { tipo: 'rota'; local: Local; selo: number }
  | null;

/**
 * Traduz o estado da interface em movimento de câmera.
 *
 * Precisa ser um filho do `<Map>` porque a instância do MapLibre só existe
 * dentro dele. O `selo` é o que permite repetir a mesma ordem (clicar duas
 * vezes no mesmo pino) sem que o efeito seja ignorado por dependências iguais.
 */
function Camera({ camera, mobile }: { camera: OrdemCamera; mobile: boolean }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !camera) return;

    const { tipo, local } = camera;

    if (tipo === 'rota') {
      // Enquadra pela caixa do traçado, não pela reta entre os dois pontos: a
      // estrada sai muito fora dela — para a Pedra do Baú ela contorna o maciço
      // inteiro, e metade da rota ficaria fora da tela.
      const rota = getRota(local);
      const pontos: [number, number][] = rota?.linha.length
        ? rota.linha
        : [
            [REFUGIO.lng, REFUGIO.lat],
            [local.lng, local.lat],
          ];
      const lngs = pontos.map(([lng]) => lng);
      const lats = pontos.map(([, lat]) => lat);

      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        {
          // Sobra à esquerda no desktop porque o painel de rota cobre essa
          // faixa; no mobile a sobra vai para baixo, onde fica a folha.
          padding: mobile
            ? { top: 140, bottom: 200, left: 40, right: 40 }
            : { top: 80, bottom: 80, left: 460, right: 80 },
          maxZoom: 15.5,
          duration: 700,
        },
      );
      return;
    }

    map.flyTo({
      center: [local.lng, local.lat],
      zoom: tipo === 'foco' ? ZOOM_FOCO : Math.max(map.getZoom(), 13),
      duration: 700,
      essential: true,
      offset: mobile ? [0, -110] : [180, 0],
    });
  }, [map, isLoaded, camera, mobile]);

  return null;
}

/**
 * Ordem de pintura dos pinos, fixa: o MapLibre reordena os marcadores conforme
 * a latitude, e a ordem do DOM é o que decide quem fica por cima entre pinos
 * empatados. O Refúgio vai por último para nunca cair atrás de ninguém.
 */
const PINOS_ORDENADOS = [...LOCAIS].sort(
  (a, b) => Number(!!a.refugio) - Number(!!b.refugio),
);

/**
 * Entrada e saída dos painéis da coluna da esquerda. Sempre pelo mesmo lado:
 * eles ocupam o mesmo encaixe e se revezam ali, então deslizar cada um por uma
 * borda diferente faria a troca parecer três telas em vez de uma só.
 */
const ANIMA_ENTRA = 'animate-in fade-in slide-in-from-left-6 duration-300 ease-out';
const ANIMA_SAI =
  'animate-out fade-out slide-out-to-left-6 fill-mode-forwards pointer-events-none duration-200 ease-in';

/**
 * Entrada e saída do que é ancorado nas bordas do mobile: cada um volta pela
 * borda de onde veio. O cartão do lugar e a folha saem por baixo, a busca e os
 * filtros por cima — sumir no lugar não diz para onde a coisa foi, e no toque
 * essa pista é o que liga o que se tocou ao que apareceu.
 */
const ANIMA_BAIXO_ENTRA =
  'animate-in fade-in slide-in-from-bottom-4 duration-300 ease-out';
const ANIMA_BAIXO_SAI =
  'animate-out fade-out slide-out-to-bottom-4 fill-mode-forwards pointer-events-none duration-200 ease-in';
const ANIMA_TOPO_ENTRA =
  'animate-in fade-in slide-in-from-top-4 duration-300 ease-out';
const ANIMA_TOPO_SAI =
  'animate-out fade-out slide-out-to-top-4 fill-mode-forwards pointer-events-none duration-200 ease-in';

/** A busca do mobile cobre a tela inteira: só o fade, sem deslizar nada. */
const ANIMA_TELA_ENTRA = 'animate-in fade-in duration-200 ease-out';
const ANIMA_TELA_SAI =
  'animate-out fade-out fill-mode-forwards pointer-events-none duration-200 ease-in';

/**
 * Onde encostar o que flutua no mobile.
 *
 * A folha não fecha mais, então "encostado no rodapé" passou a querer dizer
 * "logo acima da folha, onde quer que ela esteja parada". A conta sai da mesma
 * tabela de paradas que a folha usa, e não de uma classe com o número escrito
 * à mão, para que mexer numa parada mova junto tudo que se apoia nela.
 *
 * A parada mais alta não conta: com a folha quase inteira aberta não sobra
 * mapa para operar, e a pilha subiria para fora do quadro. Ali ela fica atrás
 * da folha, que é onde estava antes de existir faixa de repouso.
 */
const acimaDaFolha = (altura: Altura) =>
  `calc(${FRACOES[altura === 'alta' ? 'media' : altura] * 100}% + 0.5rem)`;

/**
 * Recolhe a folha ao toque no mapa.
 *
 * Sem isto ela só sairia da frente por arrasto, e quem toca o mapa está
 * pedindo justamente o mapa. Arrastar o mapa vale como o mesmo pedido. Os
 * pinos são nós de DOM fora do canvas, então tocar num deles não passa por
 * aqui — abrir um lugar continua abrindo um lugar.
 */
function ToqueNoMapa({ onToque }: { onToque: () => void }) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    map.on('click', onToque);
    map.on('dragstart', onToque);

    return () => {
      map.off('click', onToque);
      map.off('dragstart', onToque);
    };
  }, [map, isLoaded, onToque]);

  return null;
}

/**
 * Painel para onde a interface volta quando nada está sendo lido.
 *
 * No desktop sobra tela à esquerda do mapa, e deixar essa coluna vazia
 * escondia a lista atrás de um botão que a pessoa precisava descobrir antes de
 * saber que existia lista. Ela fica aberta desde o começo e sai de cena sozinha
 * quando algo mais específico ocupa o lugar — a ficha de um ponto, a rota.
 *
 * No mobile continua fechado: lá a coluna não existe, a lista mora na folha
 * inferior e abri-la de saída cobriria metade do mapa.
 */
function repouso(mobile: boolean): Painel {
  return mobile ? null : 'lista';
}

/**
 * Pinos do mapa.
 *
 * Acompanha o zoom para decidir entre pinos individuais e agrupamentos por
 * zona: de longe, 20 pinos sobrepostos viram uma mancha ilegível; o
 * agrupamento mostra quantos lugares existem em cada trecho do vale e leva
 * para lá com um clique. O Refúgio nunca é agrupado — é a origem de tudo.
 *
 * Todos os pinos ficam montados o tempo todo, e é a opacidade que decide quem
 * está em cena. Montar e desmontar conforme o filtro os fazia piscar de uma
 * letra digitada para a outra: um marcador desmontado não tem como animar a
 * própria saída. São poucas dezenas de nós — o custo de manter os de fora vale
 * a transição.
 */
function Pinos({
  locais,
  selecionado,
  hover,
  onSelect,
  onHover,
}: {
  locais: Local[];
  selecionado: string | null;
  hover: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}) {
  const { map, isLoaded } = useMap();
  const [zoom, setZoom] = useState(() => map?.getZoom() ?? ZOOM_INICIAL.desktop);

  useEffect(() => {
    if (!map || !isLoaded) return;

    const atualiza = () => setZoom(map.getZoom());
    atualiza();
    map.on('zoom', atualiza);

    return () => {
      map.off('zoom', atualiza);
    };
  }, [map, isLoaded]);

  const agrupado = zoom <= ZOOM_AGRUPAMENTO;

  // Quem está em cena agora: passou pelo filtro e não foi recolhido para dentro
  // de um agrupamento. O resto continua montado, só que transparente.
  const visiveis = useMemo(() => {
    const ids = new Set<string>();

    for (const item of locais) {
      if (!agrupado || item.refugio) ids.add(item.id);
    }

    return ids;
  }, [locais, agrupado]);

  const grupos = useMemo(() => {
    if (!agrupado) return [];

    // `Map` aqui seria o componente do mapcn, não a estrutura do JS — daí o
    // agrupamento num objeto simples.
    const porZona: Partial<Record<ZonaId, Local[]>> = {};
    for (const item of locais) {
      if (item.refugio) continue;
      porZona[item.zona] = [...(porZona[item.zona] ?? []), item];
    }

    return Object.entries(porZona).map(([zona, itens]) => ({
      zona: zona as ZonaId,
      total: itens.length,
      lng: itens.reduce((soma, i) => soma + i.lng, 0) / itens.length,
      lat: itens.reduce((soma, i) => soma + i.lat, 0) / itens.length,
    }));
  }, [agrupado, locais]);

  return (
    <>
      {grupos.map((grupo) => (
        <MapMarker
          key={grupo.zona}
          longitude={grupo.lng}
          latitude={grupo.lat}
          onClick={() =>
            map?.flyTo({
              center: [grupo.lng, grupo.lat],
              zoom: 13.4,
              duration: 700,
              essential: true,
            })
          }
        >
          <MarkerContent>
            <span
              style={{
                width: 40 + Math.min(grupo.total, 12) * 1.6,
                height: 40 + Math.min(grupo.total, 12) * 1.6,
                background: 'var(--map-surface)',
                borderColor: 'var(--map-stone)',
                color: 'var(--map-ink)',
                boxShadow: 'var(--map-shadow-control)',
              }}
              className='grid cursor-pointer place-items-center rounded-full border-[3px] leading-none'
            >
              <span className='text-[15px] font-bold'>{grupo.total}</span>
              <span
                style={{ color: 'var(--map-meta)' }}
                className='text-[8px] tracking-wide uppercase'
              >
                {ZONAS[grupo.zona]}
              </span>
            </span>
          </MarkerContent>
        </MapMarker>
      ))}

      {PINOS_ORDENADOS.map((local) => (
        <Pino
          key={local.id}
          local={local}
          visivel={visiveis.has(local.id)}
          selecionado={selecionado === local.id}
          destacado={hover === local.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </>
  );
}

/**
 * Mapa turístico de São Bento do Sapucaí.
 *
 * Uma tela só, com quatro camadas: a base cartográfica, os pinos, os controles
 * flutuantes e um painel por vez (lista, detalhes ou rota). O desktop
 * distribui essas camadas em torno do mapa; o mobile empilha em uma folha
 * inferior. As duas árvores são separadas de propósito — tentar reaproveitar a
 * mesma marcação nas duas obrigaria a esconder metade dela com CSS, e o mapa
 * ficaria com o dobro de nós para o navegador manter.
 */
function MapaTuristico() {
  const mobile = useIsMobile();

  const [filtro, setFiltro] = useState<FiltroId>(FILTRO_TODOS);
  const [termo, setTermo] = useState('');
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [painel, setPainel] = useState<Painel>(repouso(mobile));
  const [folha, setFolha] = useState<Altura>('minima');
  const [hover, setHover] = useState<string | null>(null);
  const [camera, setCamera] = useState<OrdemCamera>(null);

  const selo = useRef(0);
  const local = selecionado ? (getLocal(selecionado) ?? null) : null;
  const tracado = local ? getRota(local) : null;

  /**
   * Eco do último lugar aberto.
   *
   * Fechar o cartão zera `selecionado` no mesmo quadro em que ele começa a
   * descer, e um cartão sem lugar não tem o que desenhar enquanto sai. Este eco
   * segura o conteúdo até a animação terminar; ele nunca é lido por quem já tem
   * `local` na mão.
   */
  const [ultimoLocal, setUltimoLocal] = useState<Local | null>(null);

  if (local && local !== ultimoLocal) setUltimoLocal(local);

  const locais = useMemo(
    () => filtrarLocais(filtro, termo),
    [filtro, termo],
  );
  const resultados = useMemo(
    () => filtrarLocais(FILTRO_TODOS, termo, { incluirRefugio: false }),
    [termo],
  );

  const titulo =
    termo.trim().length > 0
      ? `Resultados para “${termo.trim()}”`
      : filtro === FILTRO_TODOS
        ? 'O que fazer por perto'
        : CATEGORIAS[filtro].label;

  // Trocar de viewport no meio do caminho deixaria a folha aberta sem folha
  // (ou o painel aberto sem painel). Cada troca volta ao estado neutro —
  // ajustado durante a renderização, e não em efeito, para não pintar um
  // quadro com o painel do layout que acabou de sair de cena.
  const [eraMobile, setEraMobile] = useState(mobile);

  if (mobile !== eraMobile) {
    setEraMobile(mobile);
    setPainel(repouso(mobile));
    setFolha('minima');
    setBuscaAberta(false);
  }

  function mover(tipo: 'pan' | 'foco' | 'rota', alvo: Local) {
    selo.current += 1;
    setCamera({ tipo, local: alvo, selo: selo.current });
  }

  function selecionar(id: string, { daBusca = false } = {}) {
    const alvo = getLocal(id);
    if (!alvo) return;

    setSelecionado(id);
    setBuscaAberta(false);
    setHover(null);
    // No desktop o clique já é o pedido da ficha. A prévia do lugar mora no
    // hover do pino, e um cartão intermediário depois do clique só somaria um
    // passo entre escolher o lugar e ler sobre ele. No toque não há hover, e é
    // o cartão inferior que faz esse papel — por isso ali o clique não abre
    // nada por cima do mapa.
    setPainel(mobile ? null : 'detalhes');
    if (mobile) setFolha('minima');
    mover(daBusca ? 'foco' : 'pan', alvo);
  }

  function abrirDetalhes() {
    if (!local) return;
    setPainel('detalhes');
    setBuscaAberta(false);
    if (mobile) setFolha('alta');
  }

  function abrirRota() {
    if (!local) return;

    // No celular a pessoa está prestes a dirigir: abrir o app de navegação que
    // ela já usa vale mais do que um painel com o resumo do trajeto. O painel
    // de rota existe só no desktop, onde ninguém está no volante.
    if (mobile) {
      window.open(getRotaUrl(local), '_blank', 'noopener,noreferrer');
      return;
    }

    setPainel('rota');
    setBuscaAberta(false);
    mover('rota', local);
  }

  /** Fecha a ficha (ou a rota) e devolve a coluna ao estado de repouso. */
  function fecharFicha() {
    setPainel(repouso(mobile));
    if (mobile) setFolha('minima');
  }

  /**
   * O X da lista. Único caminho para a coluna vazia no desktop: quem quer o
   * mapa inteiro fecha a lista, e o botão do rodapé traz ela de volta.
   */
  function fecharLista() {
    setPainel(null);
  }

  function trocarFiltro(novo: FiltroId) {
    setFiltro(novo);
    setSelecionado(null);
    // Filtrar é pedido de lista, mesmo com a ficha aberta: a pessoa acabou de
    // dizer que quer ver outro conjunto de lugares.
    setPainel(repouso(mobile));
    if (mobile && novo !== FILTRO_TODOS) setFolha('media');
  }

  // A busca e os filtros continuam de pé com qualquer painel aberto — inclusive
  // o de rota: ter de fechar o que se está lendo só para procurar outro lugar
  // era um passo a mais sem motivo.
  const mostraTopo = !mobile;
  // O dropdown de resultados desce por cima da lista. Enquanto ele estiver na
  // tela a lista sai de cena; ao fechar a busca ela volta, com animação.
  const buscaSugerindo =
    buscaAberta && termo.trim().length > 0 && resultados.length > 0;

  const mostraLista = !mobile && painel === 'lista' && !buscaSugerindo;
  const mostraDetalhes = painel === 'detalhes' && !!local;
  const mostraRota = !mobile && painel === 'rota' && !!local;

  // Os painéis do desktop desmontam só depois que a animação de saída termina.
  // A ficha do mobile fica de fora: lá ela é o conteúdo da folha, que já anima
  // sozinha.
  const listaPresente = usePresenca(mostraLista);
  const detalhesPresente = usePresenca(mostraDetalhes && !mobile);
  const rotaPresente = usePresenca(mostraRota);

  // Os três dividem o mesmo encaixe na coluna da esquerda. Deixar dois montados
  // durante a troca faz um aparecer através do outro no meio do fade, então
  // quem entra manda: o que está saindo desmonta na hora se já há outro
  // entrando no lugar dele.
  const trocando = mostraLista || mostraDetalhes || mostraRota;
  const naColuna = (presente: boolean, entrando: boolean) =>
    presente && (entrando || !trocando);

  // Agora é o caminho de volta, não o de ida: a lista já nasce aberta, então o
  // botão só reaparece para quem a fechou de propósito.
  const mostraFab = !mobile && !painel;

  const mostraCartaoMobile =
    mobile && !!local && painel !== 'detalhes' && folha === 'minima';
  const mostraCromoMobile =
    mobile && folha !== 'alta' && painel !== 'detalhes' && !buscaAberta;
  const mostraBuscaMobile = mobile && buscaAberta;

  // Mesma regra do desktop, aplicada às bordas: desmontar no quadro em que a
  // condição vira falsa faz tudo sumir sem sair de cena.
  const cartaoPresente = usePresenca(mostraCartaoMobile);
  const cromoPresente = usePresenca(mostraCromoMobile);
  const buscaPresente = usePresenca(mostraBuscaMobile);

  /**
   * A ficha do mobile fica no lugar até a folha terminar de descer.
   *
   * Voltar da ficha zera `painel` e baixa a folha no mesmo quadro; trocar o
   * conteúdo ali mostraria a lista se encolhendo, que é uma cena que ninguém
   * pediu. A troca acontece depois, com a folha já parada na faixa de repouso.
   */
  const folhaFicha = painel === 'detalhes' && !!local;
  const fichaPresente = usePresenca(folhaFicha, 300);
  const folhaAltura: Altura = folhaFicha ? 'alta' : folha;

  /**
   * Toque no mapa recolhe o que estiver na frente. Precisa ser estável entre
   * renderizações: é ela que decide se o efeito que assina os eventos do
   * MapLibre se desfaz e refaz a cada quadro.
   */
  const recolherFolha = useCallback(() => {
    setPainel((atual) => (atual === 'detalhes' ? null : atual));
    setFolha('minima');
  }, []);

  return (
    <div
      data-mapa
      data-mapa-canvas
      style={{ background: 'var(--map-sand)' }}
      className='relative isolate size-full overflow-hidden'
    >
      <Map
        theme='light'
        styles={{ light: ESTILO_BASE, dark: ESTILO_BASE }}
        center={[REFUGIO.lng, REFUGIO.lat]}
        zoom={mobile ? ZOOM_INICIAL.mobile : ZOOM_INICIAL.desktop}
        minZoom={ZOOM_MINIMO}
        maxZoom={ZOOM_MAXIMO}
        maxBounds={LIMITES_REGIAO}
        // Sem `cooperativeGestures`: não há página rolando atrás do mapa para
        // proteger, e exigir Ctrl+scroll para dar zoom seria só atrito.
        locale={LOCALE_PT_BR}
        dragRotate={false}
        pitchWithRotate={false}
      >
        <Camera camera={camera} mobile={mobile} />

        {mobile && <ToqueNoMapa onToque={recolherFolha} />}

        <Pinos
          locais={locais}
          selecionado={selecionado}
          hover={hover}
          onSelect={(id) => selecionar(id)}
          onHover={setHover}
        />

        {/* O traçado de verdade, gravado em `rotas.json`. O arco continua como
            reserva para o lugar que ainda não tem rota calculada: ele não é o
            caminho, mas mostra a direção, e é o mesmo caso em que o painel diz
            "em linha reta". */}
        {mostraRota && local && (
          tracado ? (
            <MapRoute
              coordinates={tracado.linha}
              color='#2f6b4f'
              width={4}
              opacity={0.9}
              interactive={false}
            />
          ) : (
            <MapArc
              data={[
                {
                  id: local.id,
                  from: [REFUGIO.lng, REFUGIO.lat],
                  to: [local.lng, local.lat],
                },
              ]}
              curvature={0.22}
              paint={{
                'line-color': '#2f6b4f',
                'line-width': 4,
                'line-opacity': 0.9,
              }}
            />
          )
        )}

        {/* ------------------------------------------------------ desktop */}
        {/* Este bloco é a âncora do balão de resultados da busca, que se
            posiciona pelo rodapé dele para nascer abaixo das pílulas. Fica
            acima dos painéis: o balão cai justamente sobre o encaixe deles, e
            atrás de um painel ele não seria lido. */}
        {mostraTopo && (
          <div className='absolute top-5 left-5 z-50 w-101'>
            <Busca
              termo={termo}
              onTermo={setTermo}
              resultados={resultados}
              aberto={buscaAberta}
              onAbrir={() => setBuscaAberta(true)}
              onFechar={() => setBuscaAberta(false)}
              onEscolher={(id) => selecionar(id, { daBusca: true })}
            />
            <Filtros
              ativo={filtro}
              onChange={trocarFiltro}
              className='-mx-3 -mt-0.5 w-[calc(100vw-1rem)] max-w-244'
            />
          </div>
        )}

        {naColuna(listaPresente, mostraLista) && (
          <div
            style={{
              background: 'var(--map-surface)',
              borderColor: 'var(--map-line)',
              boxShadow: 'var(--map-shadow-panel)',
            }}
            className={cn(
              'absolute top-33 bottom-5 left-5 z-20 flex w-101 flex-col overflow-hidden rounded-2xl border',
              mostraLista ? ANIMA_ENTRA : ANIMA_SAI,
            )}
          >
            <PainelLista
              titulo={titulo}
              locais={locais}
              selecionado={selecionado}
              onSelect={(id) => selecionar(id)}
              onHover={setHover}
              onFechar={fecharLista}
              className='min-h-0 flex-1'
            />
          </div>
        )}

        {naColuna(detalhesPresente, mostraDetalhes) && local && (
          <PainelDetalhes
            local={local}
            onVoltar={fecharFicha}
            onRota={abrirRota}
            // Mesmo encaixe da lista, logo abaixo da busca: a ficha substitui a
            // lista na coluna da esquerda em vez de cobrir a tela inteira.
            className={cn(
              'absolute top-33 bottom-5 left-5 z-40 w-101',
              mostraDetalhes ? ANIMA_ENTRA : ANIMA_SAI,
            )}
          />
        )}

        {naColuna(rotaPresente, mostraRota) && local && (
          <PainelRota
            local={local}
            onVoltar={() => setPainel('detalhes')}
            // Mesmo encaixe dos outros dois, e não o alto da coluna: ali ele
            // empurrava a busca para fora da tela. A altura é a do conteúdo —
            // o painel é curto e esticá-lo até embaixo só deixaria vazio.
            className={cn(
              'absolute top-33 left-5 z-40 w-101',
              mostraRota ? ANIMA_ENTRA : ANIMA_SAI,
            )}
          />
        )}

        {mostraFab && (
          <button
            type='button'
            onClick={() => setPainel('lista')}
            style={{
              background: 'var(--map-surface)',
              borderColor: 'var(--map-line)',
              color: 'var(--map-ink)',
              boxShadow: 'var(--map-shadow-panel)',
            }}
            className='absolute bottom-6 left-1/2 z-30 flex h-11 -translate-x-1/2 items-center gap-2 rounded-full border px-5 text-sm font-bold'
          >
            <List
              aria-hidden='true'
              className='size-4.5'
              style={{ color: 'var(--map-green)' }}
            />
            O que fazer por perto
            <span style={{ color: 'var(--map-meta)' }} className='font-medium'>
              {locais.length}
            </span>
          </button>
        )}

        {!mobile && (
          <Controles variante='desktop' className='absolute right-5 bottom-6 z-30' />
        )}

        {/* ------------------------------------------------------- mobile */}
        {cromoPresente && (
          <div
            className={cn(
              'absolute inset-x-0 top-0 z-30 flex flex-col gap-2 px-3 pt-3',
              mostraCromoMobile ? ANIMA_TOPO_ENTRA : ANIMA_TOPO_SAI,
            )}
          >
            <button
              type='button'
              onClick={() => setBuscaAberta(true)}
              style={{
                background: 'var(--map-surface)',
                borderColor: 'var(--map-line)',
                color: 'var(--map-meta)',
                boxShadow: 'var(--map-shadow-control)',
              }}
              className='flex h-12 items-center gap-2.5 rounded-full border px-3.5 text-[15px]'
            >
              <Search
                aria-hidden='true'
                className='size-5 shrink-0'
                style={{ color: 'var(--map-green)' }}
              />
              <span className='flex-1 text-left'>
                Buscar lugares em São Bento...
              </span>
              <span
                aria-hidden='true'
                style={{
                  background: 'var(--map-green)',
                  color: 'var(--map-sand)',
                }}
                className='grid size-6.5 shrink-0 place-items-center rounded-[7px] text-[10px] font-bold'
              >
                RP
              </span>
            </button>

            <Filtros ativo={filtro} onChange={trocarFiltro} className='-m-3' />
          </div>
        )}

        {buscaPresente && (
          <div
            style={{ background: 'var(--map-surface)' }}
            className={cn(
              'absolute inset-0 z-50 flex flex-col',
              mostraBuscaMobile ? ANIMA_TELA_ENTRA : ANIMA_TELA_SAI,
            )}
          >
            <div className='flex items-start gap-2 p-3'>
              <button
                type='button'
                onClick={() => setBuscaAberta(false)}
                aria-label='Fechar busca'
                style={{ color: 'var(--map-ink)' }}
                className='mt-2 grid size-9 shrink-0 place-items-center rounded-full'
              >
                <X className='size-5' />
              </button>
              <div className='min-w-0 flex-1'>
                <Busca
                  variante='mobile'
                  autoFocus
                  termo={termo}
                  onTermo={setTermo}
                  resultados={resultados}
                  aberto
                  onAbrir={() => setBuscaAberta(true)}
                  onFechar={() => setBuscaAberta(false)}
                  onEscolher={(id) => selecionar(id, { daBusca: true })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Uma pilha só, empilhada de baixo para cima logo acima da folha.
            Cada peça posicionada por conta própria precisaria saber a altura
            das outras — e a do cartão muda com o nome do lugar, então o número
            escrito à mão erra justamente na tela curta, onde sobrepor dói. */}
        {mobile && (
          <div
            style={{ bottom: acimaDaFolha(folhaAltura) }}
            className='pointer-events-none absolute inset-x-2.5 z-40 flex flex-col gap-3 transition-[bottom] duration-300'
          >
            <Controles variante='mobile' className='self-end' />

            {cartaoPresente && ultimoLocal && (
              <div
                className={cn(
                  'pointer-events-auto',
                  mostraCartaoMobile ? ANIMA_BAIXO_ENTRA : ANIMA_BAIXO_SAI,
                )}
              >
                <CartaoRapido
                  local={ultimoLocal}
                  variante='mobile'
                  onDetalhes={abrirDetalhes}
                  onRota={abrirRota}
                  onFechar={() => setSelecionado(null)}
                />
              </div>
            )}

            {!buscaAberta && painel !== 'detalhes' && (
              <button
                type='button'
                onClick={() => {
                  setSelecionado(null);
                  setPainel(null);
                  setFolha(folha === 'minima' ? 'media' : 'minima');
                }}
                style={{
                  background: 'var(--map-ink)',
                  color: 'var(--map-sand)',
                  boxShadow: 'var(--map-shadow-panel)',
                }}
                className='pointer-events-auto flex h-10.5 items-center gap-2 self-center rounded-full px-4.5 text-sm font-bold'
              >
                {folha === 'minima' ? (
                  <List aria-hidden='true' className='size-4.5' />
                ) : (
                  <IconeMapa aria-hidden='true' className='size-4.5' />
                )}
                {folha === 'minima' ? 'Lista' : 'Mapa'}
              </button>
            )}
          </div>
        )}

        {mobile && (
          <FolhaMobile
            altura={folhaAltura}
            onAltura={setFolha}
            rotulo={fichaPresente ? 'Detalhes do local' : titulo}
          >
            {fichaPresente && ultimoLocal ? (
              <PainelDetalhes
                local={ultimoLocal}
                onVoltar={fecharFicha}
                onRota={abrirRota}
                moldura={false}
                className='min-h-0 flex-1'
              />
            ) : (
              <PainelLista
                titulo={titulo}
                locais={locais}
                selecionado={selecionado}
                onSelect={(id) => selecionar(id)}
                compacto
                className='min-h-0 flex-1'
              />
            )}
          </FolhaMobile>
        )}
      </Map>
    </div>
  );
}

export default MapaTuristico;
