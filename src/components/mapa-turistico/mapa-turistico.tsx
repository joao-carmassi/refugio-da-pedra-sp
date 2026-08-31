'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { List } from 'lucide-react';
import { Map, MapArc, MapRoute, useMap } from '@/components/ui/map';
import {
  CATEGORIAS,
  FILTRO_TODOS,
  LOCAIS,
  filtrarLocais,
  getLocal,
  getRota,
  getRotaUrl,
  type FiltroId,
  type Local,
  type Origem,
} from '@/lib/mapa-turistico';
import { useIsMobile } from '@/hooks/use-media-query';
import { usePresenca } from '@/hooks/use-presenca';
import { cn } from '@/lib/utils';
import {
  ESTILO_BASE,
  LIMITES_REGIAO,
  LOCALE_PT_BR,
  enquadrarTudo,
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
import { useOrigem } from './origem';
import PainelDetalhes from './painel-detalhes';
import PainelLista from './painel-lista';
import PainelRota from './painel-rota';
import { pintarBase } from './paleta-cartografica';
import Pino from './pino';

type Painel = 'lista' | 'detalhes' | 'rota' | null;

/** Ordem que o mapa recebe do resto da interface. */
type OrdemCamera =
  | { tipo: 'pan'; local: Local; selo: number }
  | { tipo: 'foco'; local: Local; selo: number }
  | { tipo: 'rota'; local: Local; selo: number }
  | null;

/**
 * Mantém o canvas do MapLibre do tamanho do contêiner.
 *
 * O MapLibre já observa o contêiner, mas descarta a primeira entrega do
 * ResizeObserver — a observação inicial. Nesta rota a altura útil muda logo
 * depois da montagem: `--header-height` é publicada pelo cabeçalho, e numa
 * navegação client-side ela ainda vale o valor da página anterior quando o
 * mapa nasce. Essa mudança cai justamente na entrega descartada, e o canvas
 * ficava com a altura antiga — mapa cortado embaixo até um F5.
 */
function Redimensiona() {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const observador = new ResizeObserver(() => map.resize());
    observador.observe(map.getContainer());
    return () => observador.disconnect();
  }, [map]);

  return null;
}

/**
 * Aplica a paleta do mapa sobre o estilo do OpenFreeMap assim que ele chega.
 *
 * Precisa de um efeito porque a repintura depende do estilo já baixado — as
 * camadas só existem depois disso. Ouve dois eventos porque nenhum dos dois
 * sozinho cobre os dois caminhos: `styledata` pega o estilo que chega depois
 * da montagem, `load` garante uma última chamada quando o mapa termina de
 * abrir. `pintarBase` sai sozinha quando já pintou, então chamar de novo não
 * custa nada.
 */
function Repintura() {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const pintar = () => pintarBase(map);

    pintar();
    map.on('styledata', pintar);
    map.on('load', pintar);
    return () => {
      map.off('styledata', pintar);
      map.off('load', pintar);
    };
  }, [map]);

  return null;
}

/**
 * Abre o mapa com todos os pontos à vista.
 *
 * Precisa acontecer aqui, e não em `center`/`zoom` do `<Map>`, porque o
 * enquadramento depende do tamanho do contêiner, que só existe depois que ele
 * é montado. Sem animação: no primeiro quadro não há de onde vir.
 *
 * Uma vez só. Reenquadrar a cada mudança desfaria o que a pessoa explorou —
 * voltar à abertura é gesto dela, no botão de ver todos os pontos.
 */
function Abertura({ mobile }: { mobile: boolean }) {
  const { map, isLoaded } = useMap();
  const feito = useRef(false);

  useEffect(() => {
    if (!map || !isLoaded || feito.current) return;

    feito.current = true;
    enquadrarTudo(map, mobile, 0);
  }, [map, isLoaded, mobile]);

  return null;
}

/**
 * Traduz o estado da interface em movimento de câmera.
 *
 * Precisa ser um filho do `<Map>` porque a instância do MapLibre só existe
 * dentro dele. O `selo` é o que permite repetir a mesma ordem (clicar duas
 * vezes no mesmo pino) sem que o efeito seja ignorado por dependências iguais.
 */
function Camera({
  camera,
  mobile,
  origem,
}: {
  camera: OrdemCamera;
  mobile: boolean;
  origem: Origem;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded || !camera) return;

    const { tipo, local } = camera;

    if (tipo === 'rota') {
      // Enquadra pela caixa do traçado, não pela reta entre os dois pontos: a
      // estrada sai muito fora dela — para a Pedra do Baú ela contorna o maciço
      // inteiro, e metade da rota ficaria fora da tela.
      const rota = getRota(local, origem);
      const pontos: [number, number][] = [
        [origem.lng, origem.lat],
        // O pino continua no cume, e a rota já não vai até ele — ela termina
        // na portaria, onde o carro para. Sem este ponto na caixa, enquadrar a
        // rota deixava o próprio destino fora da tela.
        [local.lng, local.lat],
        ...(rota?.linha ?? []),
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
  }, [map, isLoaded, camera, mobile, origem]);

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
 * Entrada e saída do que é ancorado no topo do mobile: a busca e os filtros
 * voltam pela borda de onde vieram. Sumir no lugar não diz para onde a coisa
 * foi, e no toque essa pista é o que liga o que se tocou ao que apareceu. O
 * cartão do lugar não está aqui porque ele não desmonta: encolhe (ver a pilha
 * do mobile), que é o que deixa os controles descerem junto.
 */
const ANIMA_TOPO_ENTRA =
  'animate-in fade-in slide-in-from-top-4 duration-300 ease-out';
const ANIMA_TOPO_SAI =
  'animate-out fade-out slide-out-to-top-4 fill-mode-forwards pointer-events-none duration-200 ease-in';

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
 * Tira da frente o que estiver sobre o mapa quando se toca o mapa.
 *
 * Sem isto a folha só sairia da frente por arrasto, e quem toca o mapa está
 * pedindo justamente o mapa. O toque no pino chega aqui junto — o MapLibre
 * pendura os marcadores dentro do mesmo contêiner que ele escuta —, então
 * quem recebe o evento precisa separar os dois; ver `tocarNoMapa`.
 *
 * Arrastar não é a mesma coisa que tocar: arrastar recolhe a folha para
 * liberar mapa, mas mantém o lugar aberto — quem move o mapa com um cartão em
 * cena costuma estar olhando onde aquele lugar fica.
 */
function ToqueNoMapa({
  onToque,
  onArrasto,
}: {
  onToque: (evento: { originalEvent: MouseEvent }) => void;
  onArrasto: () => void;
}) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    map.on('click', onToque);
    map.on('dragstart', onArrasto);

    return () => {
      map.off('click', onToque);
      map.off('dragstart', onArrasto);
    };
  }, [map, isLoaded, onToque, onArrasto]);

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
 * Sem agrupamento por zona: são poucas dezenas de lugares em um vale pequeno,
 * e trocar os pinos por bolhas com um número dizia menos do que os próprios
 * pinos já diziam — de longe eles não chegam a virar mancha. Afastar o mapa
 * agora só afasta.
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
  // Quem está em cena agora: quem passou pelo filtro. O resto continua
  // montado, só que transparente.
  const visiveis = useMemo(
    () => new Set(locais.map((item) => item.id)),
    [locais],
  );

  return (
    <>
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
  const origem = useOrigem();

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
  const tracado = local ? getRota(local, origem) : null;

  /**
   * Eco do último lugar aberto.
   *
   * Fechar o cartão zera `selecionado` no mesmo quadro em que ele começa a
   * descer, e um cartão sem lugar não tem o que desenhar enquanto sai. Este eco
   * segura o conteúdo até a animação terminar.
   *
   * Quem sai de cena lê o eco; quem entra lê `local`. A ficha dos dois
   * tamanhos e o cartão do celular fecham por aqui, então leem o eco. A rota é
   * o contrário: dela só se volta para a ficha, com o lugar ainda selecionado,
   * e por isso ela e o traçado no mapa seguem em `local`.
   */
  const [ultimoLocal, setUltimoLocal] = useState<Local | null>(null);

  if (local && local !== ultimoLocal) setUltimoLocal(local);

  const locais = useMemo(
    () => filtrarLocais(filtro, termo),
    [filtro, termo],
  );
  // A busca varre o cadastro inteiro, o Refúgio junto. Ele já foi escondido
  // daqui, de quando era a origem das distâncias e aparecer no autocomplete o
  // fazia parecer resposta a uma busca que ninguém tinha feito. Agora que a
  // medida sai do centro, a pousada é um pino como os outros — e quem digita o
  // nome dela e não acha nada só conclui que o mapa está incompleto.
  const resultados = useMemo(() => filtrarLocais(FILTRO_TODOS, termo), [termo]);

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

    // Vai direto para o Google Maps, no celular e no desktop. Quem clica em
    // "como chegar" está indo embora do mapa: o painel de rota interrompia
    // isso com um resumo do trajeto para, no fim, mandar para o mesmo lugar.
    //
    // O painel continua no código (`painel-rota.tsx`, e o `'rota'` que ele usa
    // em `Painel`/`OrdemCamera`) porque o resumo em si — distância, duração e
    // traçado sobre o mapa — tem valor fora do gesto de sair para navegar, e
    // pode voltar por outra porta.
    //
    // O destino do link é a parada de carro, e não o pino: quem resolve isso é
    // `getRotaUrl`. Mandar `travelmode=driving` para o cume da Pedra do Baú
    // fazia o Google escolher sozinho uma estrada qualquer por perto.
    window.open(getRotaUrl(local), '_blank', 'noopener,noreferrer');
  }

  /**
   * Foco no campo do topo. No mobile a folha desce junto: o balão de
   * resultados nasce logo abaixo das pílulas e a folha em repouso é o que
   * deixa a lista inteira caber na tela.
   */
  function abrirBusca() {
    setBuscaAberta(true);
    if (mobile) setFolha('minima');
  }

  /**
   * Fecha a ficha e devolve a coluna ao estado de repouso.
   *
   * Zera `selecionado` junto. Sem isso o painel saía mas o pino ficava para
   * trás, grande e com o rótulo aberto, apontando para uma ficha que não
   * estava mais na tela — e como só um pino fica assim por vez, o mapa passava
   * a afirmar uma seleção que a pessoa acabara de desfazer. Quem segura o
   * conteúdo enquanto o painel desce é `ultimoLocal`, que existe para isto.
   */
  function fecharFicha() {
    setSelecionado(null);
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
  // O dropdown de resultados desce por cima da coluna. Enquanto ele estiver na
  // tela o painel sai de cena — seja a lista, a ficha ou a rota; ao fechar a
  // busca ele volta, com animação.
  const buscaSugerindo =
    buscaAberta && termo.trim().length > 0 && resultados.length > 0;

  const mostraLista = !mobile && painel === 'lista' && !buscaSugerindo;
  const mostraDetalhes =
    painel === 'detalhes' && !!local && !(buscaSugerindo && !mobile);
  const mostraRota =
    !mobile && painel === 'rota' && !!local && !buscaSugerindo;

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
    mobile && folha !== 'alta' && painel !== 'detalhes';

  // Mesma regra do desktop, aplicada às bordas: desmontar no quadro em que a
  // condição vira falsa faz tudo sumir sem sair de cena.
  const cromoPresente = usePresenca(mostraCromoMobile);

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
    // O balão de resultados também está "na frente": no mobile ele flutua
    // sobre o mapa, e o mesmo gesto que abaixa a folha o dispensa.
    setBuscaAberta(false);
  }, []);

  /**
   * Toque no vazio do mapa também fecha o lugar aberto.
   *
   * No vazio, e não em qualquer lugar: o clique num pino sobe até o contêiner
   * do canvas, porque é ali que o MapLibre pendura os marcadores. Sem o
   * guarda, tocar num lugar o abriria e o fecharia no mesmo gesto.
   */
  const tocarNoMapa = useCallback(
    (evento: { originalEvent: MouseEvent }) => {
      const alvo = evento.originalEvent.target;
      if (alvo instanceof Element && alvo.closest('.maplibregl-marker')) return;

      setSelecionado(null);
      recolherFolha();
    },
    [recolherFolha],
  );

  return (
    <div
      data-mapa
      style={{ background: 'var(--map-base)' }}
      className='relative isolate size-full overflow-hidden'
    >
      <Map
        theme='light'
        styles={{ light: ESTILO_BASE, dark: ESTILO_BASE }}
        center={[origem.lng, origem.lat]}
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
        <Redimensiona />
        <Repintura />
        <Abertura mobile={mobile} />
        <Camera camera={camera} mobile={mobile} origem={origem} />

        {mobile && (
          <ToqueNoMapa onToque={tocarNoMapa} onArrasto={recolherFolha} />
        )}

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
                  from: [origem.lng, origem.lat],
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
              onAbrir={abrirBusca}
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

        {/*
          Lê `ultimoLocal`, e não `local`, pelo mesmo motivo que a ficha do
          mobile: fechar zera `selecionado` no quadro em que o painel começa a
          sair, e um guard em `local` o desmontaria ali mesmo, sem a animação
          que `detalhesPresente` está segurando. O eco tem o conteúdo até o fim.
        */}
        {naColuna(detalhesPresente, mostraDetalhes) && ultimoLocal && (
          <PainelDetalhes
            local={ultimoLocal}
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
        {/* O campo é o de verdade, e não um botão com cara de campo que abria
            uma tela cheia por cima do mapa: trocar de campo no meio do gesto
            custava uma transição inteira e apagava o mapa atrás. Fica acima da
            folha (z-50) para o balão de resultados poder cair sobre ela. */}
        {cromoPresente && (
          <div
            className={cn(
              'absolute inset-x-0 top-0 z-50 flex flex-col gap-2 px-3 pt-3',
              mostraCromoMobile ? ANIMA_TOPO_ENTRA : ANIMA_TOPO_SAI,
            )}
          >
            <Busca
              variante='mobile'
              termo={termo}
              onTermo={setTermo}
              resultados={resultados}
              aberto={buscaAberta}
              onAbrir={abrirBusca}
              onFechar={() => setBuscaAberta(false)}
              onEscolher={(id) => selecionar(id, { daBusca: true })}
            />

            <Filtros ativo={filtro} onChange={trocarFiltro} className='-m-3' />
          </div>
        )}

        {/* Uma pilha só, empilhada de baixo para cima logo acima da folha.
            Cada peça posicionada por conta própria precisaria saber a altura
            das outras — e a do cartão muda com o nome do lugar, então o número
            escrito à mão erra justamente na tela curta, onde sobrepor dói.
            Não há botão de lista aqui: a folha nunca sai de cena, então a
            própria faixa dela é o caminho para a lista e para o mapa. */}
        {mobile && (
          <div
            // Com a folha fora de cena a pilha desce até o rodapé: apoiada na
            // altura de uma folha que não está ali, ela flutuaria no meio da
            // tela com uma faixa vazia embaixo.
            style={{ bottom: buscaAberta ? '2.5rem' : acimaDaFolha(folhaAltura) }}
            className='pointer-events-none absolute inset-x-2.5 z-40 flex flex-col transition-[bottom] duration-300'
          >
            <Controles variante='mobile' className='self-end' />

            {/* O cartão encolhe até zero em vez de desmontar. Desmontando, os
                controles de zoom caíam de uma vez para o lugar que ele
                ocupava, no quadro em que ele saía. Colapsar a linha do grid faz
                a pilha inteira descer no mesmo tempo do resto, e o respiro
                entre os dois mora aqui dentro para ir embora junto. */}
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
                mostraCartaoMobile ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              {/* O recorte precisa sobrar dos lados e embaixo, senão ele corta
                  a sombra do cartão num quadrado. As margens negativas devolvem
                  esse respiro à conta da linha, que continua medindo só o
                  cartão. */}
              <div className='-mx-3 -mb-3 overflow-hidden px-3 pb-3'>
                {ultimoLocal && (
                  <div
                    inert={!mostraCartaoMobile}
                    className={cn(
                      'pt-3 transition-opacity duration-200 ease-out',
                      mostraCartaoMobile
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0',
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
              </div>
            </div>
          </div>
        )}

        {mobile && (
          <FolhaMobile
            altura={folhaAltura}
            onAltura={setFolha}
            // Com a busca aberta a tela é do balão de resultados: a faixa da
            // folha só somaria disputa embaixo. Ela volta na mesma parada.
            oculta={buscaAberta}
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
