'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { List, Map as IconeMapa, Search, X } from 'lucide-react';
import { Map, MapArc, MapMarker, MarkerContent, useMap } from '@/components/ui/map';
import {
  CATEGORIAS,
  FILTRO_TODOS,
  REFUGIO,
  ZONAS,
  filtrarLocais,
  getLocal,
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
import FolhaMobile, { type Altura } from './folha-mobile';
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
      map.fitBounds(
        [
          [
            Math.min(REFUGIO.lng, local.lng),
            Math.min(REFUGIO.lat, local.lat),
          ],
          [
            Math.max(REFUGIO.lng, local.lng),
            Math.max(REFUGIO.lat, local.lat),
          ],
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
 * Pinos do mapa.
 *
 * Acompanha o zoom para decidir entre pinos individuais e agrupamentos por
 * zona: de longe, 20 pinos sobrepostos viram uma mancha ilegível; o
 * agrupamento mostra quantos lugares existem em cada trecho do vale e leva
 * para lá com um clique. O Refúgio nunca é agrupado — é a origem de tudo.
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

      {locais
        .filter((local) => !agrupado || local.refugio)
        // O Refúgio por último para ficar por cima na ordem do DOM, já que o
        // MapLibre reordena os marcadores conforme a latitude.
        .sort((a, b) => Number(!!a.refugio) - Number(!!b.refugio))
        .map((local) => (
          <Pino
            key={local.id}
            local={local}
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
  const [painel, setPainel] = useState<Painel>(null);
  const [folha, setFolha] = useState<Altura>('fechada');
  const [hover, setHover] = useState<string | null>(null);
  const [camera, setCamera] = useState<OrdemCamera>(null);

  const selo = useRef(0);
  const local = selecionado ? (getLocal(selecionado) ?? null) : null;

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
    setPainel(null);
    setFolha('fechada');
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
    if (mobile) setFolha('fechada');
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

  function fecharPainel() {
    setPainel(null);
    if (mobile) setFolha('fechada');
  }

  function trocarFiltro(novo: FiltroId) {
    setFiltro(novo);
    setSelecionado(null);
    setPainel(novo === FILTRO_TODOS || mobile ? null : 'lista');
    if (mobile && novo !== FILTRO_TODOS) setFolha('media');
  }

  // A busca e os filtros continuam de pé com a ficha aberta: ter de fechar o
  // que se está lendo só para procurar outro lugar era um passo a mais sem
  // motivo. A exceção é a rota, que ocupa o alto da própria coluna.
  const mostraTopo = !mobile && painel !== 'rota';
  // O dropdown de resultados desce por cima da lista. Enquanto ele estiver na
  // tela a lista sai de cena; ao fechar a busca ela volta, com animação.
  const buscaSugerindo =
    buscaAberta && termo.trim().length > 0 && resultados.length > 0;
  const mostraDetalhes = painel === 'detalhes' && !!local;
  // A ficha do desktop desmonta só depois que a animação de saída termina.
  // O mobile fica de fora: lá ela é o conteúdo da folha, que já anima sozinha.
  const detalhesPresente = usePresenca(mostraDetalhes && !mobile);

  const mostraLista = !mobile && painel === 'lista' && !buscaSugerindo;
  // Mesma ideia para a lista, com uma ressalva: ela e a ficha dividem o mesmo
  // encaixe na coluna da esquerda. Deixar as duas montadas durante a troca faz
  // uma aparecer através da outra no meio do fade, então quem entra manda.
  const listaPresente = usePresenca(mostraLista) && !detalhesPresente;
  const mostraRota = !mobile && painel === 'rota' && !!local;
  const mostraFab = !mobile && !painel;

  const mostraCartaoMobile =
    mobile && !!local && painel !== 'detalhes' && folha === 'fechada';
  const mostraCromoMobile =
    mobile && folha !== 'alta' && painel !== 'detalhes' && !buscaAberta;

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

        <Pinos
          locais={locais}
          selecionado={selecionado}
          hover={hover}
          onSelect={(id) => selecionar(id)}
          onHover={setHover}
        />

        {mostraRota && local && (
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
        )}

        {/* ------------------------------------------------------ desktop */}
        {mostraTopo && (
          <div className='absolute top-5 left-5 z-30 w-101'>
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

        {listaPresente && (
          <div
            style={{
              background: 'var(--map-surface)',
              borderColor: 'var(--map-line)',
              boxShadow: 'var(--map-shadow-panel)',
            }}
            className={cn(
              'absolute top-33 bottom-5 left-5 z-20 flex w-101 flex-col overflow-hidden rounded-2xl border',
              mostraLista
                ? 'animate-in fade-in slide-in-from-left-6 duration-300 ease-out'
                : 'animate-out fade-out slide-out-to-left-6 fill-mode-forwards pointer-events-none duration-200 ease-in',
            )}
          >
            <PainelLista
              titulo={titulo}
              locais={locais}
              selecionado={selecionado}
              onSelect={(id) => selecionar(id)}
              onHover={setHover}
              onFechar={fecharPainel}
              className='min-h-0 flex-1'
            />
          </div>
        )}

        {detalhesPresente && local && (
          <PainelDetalhes
            local={local}
            onVoltar={fecharPainel}
            onRota={abrirRota}
            // Mesmo encaixe da lista, logo abaixo da busca: a ficha substitui a
            // lista na coluna da esquerda em vez de cobrir a tela inteira.
            className={cn(
              'absolute top-33 bottom-5 left-5 z-40 w-101',
              mostraDetalhes
                ? 'animate-in fade-in slide-in-from-left-6 duration-300 ease-out'
                : 'animate-out fade-out slide-out-to-left-6 fill-mode-forwards pointer-events-none duration-200 ease-in',
            )}
          />
        )}

        {mostraRota && local && (
          <PainelRota
            local={local}
            onVoltar={() => setPainel('detalhes')}
            className='absolute top-5 left-5 z-40 w-101'
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
        {mostraCromoMobile && (
          <div className='absolute inset-x-0 top-0 z-30 flex flex-col gap-2 px-3 pt-3'>
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

        {mobile && buscaAberta && (
          <div
            style={{ background: 'var(--map-surface)' }}
            className='absolute inset-0 z-50 flex flex-col'
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

        {mostraCartaoMobile && local && (
          <div className='absolute inset-x-2.5 bottom-3 z-40'>
            <CartaoRapido
              local={local}
              variante='mobile'
              onDetalhes={abrirDetalhes}
              onRota={abrirRota}
              onFechar={() => setSelecionado(null)}
            />
          </div>
        )}

        {mobile && (
          <Controles
            variante='mobile'
            className={cn(
              'absolute right-3 z-30 transition-[bottom] duration-300',
              folha !== 'fechada'
                ? 'bottom-[calc(50%+3.5rem)]'
                : mostraCartaoMobile
                  ? 'bottom-56'
                  : 'bottom-24',
            )}
          />
        )}

        {mobile && !buscaAberta && painel !== 'detalhes' && (
          <button
            type='button'
            onClick={() => {
              setSelecionado(null);
              setPainel(null);
              setFolha(folha === 'fechada' ? 'media' : 'fechada');
            }}
            style={{
              background: 'var(--map-ink)',
              color: 'var(--map-sand)',
              boxShadow: 'var(--map-shadow-panel)',
            }}
            className={cn(
              'absolute left-1/2 z-40 flex h-10.5 -translate-x-1/2 items-center gap-2 rounded-full px-4.5 text-sm font-bold transition-[bottom] duration-300',
              folha !== 'fechada'
                ? 'bottom-[calc(50%+0.875rem)]'
                : mostraCartaoMobile
                  ? 'bottom-52'
                  : 'bottom-7',
            )}
          >
            {folha === 'fechada' ? (
              <List aria-hidden='true' className='size-4.5' />
            ) : (
              <IconeMapa aria-hidden='true' className='size-4.5' />
            )}
            {folha === 'fechada' ? 'Lista' : 'Mapa'}
          </button>
        )}

        {mobile && (folha !== 'fechada' || painel === 'detalhes') && (
          <FolhaMobile
            altura={painel === 'detalhes' ? 'alta' : folha}
            onAltura={setFolha}
            rotulo={painel === 'detalhes' ? 'Detalhes do local' : titulo}
          >
            {painel === 'detalhes' && local ? (
              <PainelDetalhes
                local={local}
                onVoltar={fecharPainel}
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
