import {
  Camera,
  Coffee,
  Compass,
  Landmark,
  LayoutGrid,
  Mountain,
  ShoppingBag,
  TentTree,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import Fuse from 'fuse.js';
import locaisJson from '@/data/mapa-turistico.json';
import rotasJson from '@/data/rotas.json';

/**
 * TODO(proprietário): conferir e completar o cadastro de `mapa-turistico.json`.
 *
 * O cadastro foi refeito do zero contra fontes públicas primárias: mapa e
 * roteiros oficiais da Prefeitura (saobentotur.com.br), Cadastro Nacional de
 * Museus (IBRAM), Fundação Florestal, CBVL, OpenStreetMap e tracks de GPS com
 * waypoint nomeado. Nenhuma coordenada foi estimada no olho. O que ainda
 * depende de quem conhece a região:
 *
 *   1. `aConferir: true` marca coordenada aproximada — a rua certa, não o
 *      imóvel. Está em: Cachoeira do Tobogã (dois GPS a 140 m um do outro),
 *      Belvedere do Serrano (um GPS só), Capelinhas de Mosaico, Igreja Santo
 *      Antônio, Igreja N. Sra. do Rosário, Praça Presidente João Goulart,
 *      Praça Dr. Braz Reale (o logradouro não está no OSM; o pino é o ponto
 *      médio entre a Biblioteca Municipal e os Correios, que têm a praça como
 *      endereço), Portal da Cidade e Arte no Quilombo (não está no OSM; a
 *      coordenada é a do pino do Google republicado pelo portal de turismo do
 *      Estado, sem cruzamento independente). Remover a marca ao confirmar o
 *      ponto exato. O Ateliê Ditinho Joana saiu da lista porque o proprietário
 *      confirmou o pino, mas segue sem logradouro publicado: nenhuma fonte dá
 *      rua e número, e o cadastro traz só o bairro.
 *   2. Dois templos do Centro estão no OpenStreetMap sem nome: um na Av.
 *      Conselheiro Rodrigues Alves e outro junto à Praça General Marcondes
 *      Salgado. Foram atribuídos a Santo Antônio e ao Rosário por bater com o
 *      logradouro publicado — confirmar qual é qual antes de tirar o
 *      `aConferir`. Há um segundo candidato para Santo Antônio, 570 m ao sul,
 *      na Praça Santo Antônio.
 *   3. Taxa da Cachoeira do Encontro. A entrada mudou: não se passa mais por
 *      dentro da Cachoeira dos Amores, e sim pela Estrada da Ana Chata, onde
 *      o pino agora fica. Dois relatos (2024 e 2026) dizem que o acesso novo
 *      é gratuito, nenhuma fonte oficial o descreve — o portal do município
 *      não tem sequer página da cachoeira — e a trilha atravessa terreno
 *      particular, onde cobrança aparece e some sem aviso. Confirmar se há
 *      taxa hoje; enquanto não houver resposta, o cadastro não cita valor.
 *   4. `horario` — só está preenchido onde há horário publicado por fonte
 *      oficial. Sem esse campo o cartão não exibe funcionamento, de propósito.
 *      Segue em branco onde as fontes divergem sem desempate. O do Arte no
 *      Quilombo é o do site do próprio espaço; o portal de turismo do Estado
 *      publica outro (terça a domingo, sem intervalo de almoço), e quem
 *      desempatou foi o proprietário.
 *   5. `nota` / `avaliacoes` — só o Refúgio tem, vindo do próprio Google
 *      Business Profile. Preencher os demais só com número real; a estrela
 *      some enquanto não houver.
 *   6. Ficaram de fora, por não existirem nas fontes ou por falta de
 *      coordenada utilizável:
 *      - "Parquinho Municipal": nenhum equipamento com esse nome no OSM, na
 *        Prefeitura ou no portal de turismo, e não há um único
 *        `leisure=playground` mapeado no centro. A Praça Adhemar de Barros era
 *        o candidato mais provável e foi descartada pelo proprietário: ela tem
 *        o coreto, não tem brinquedo. Sem outra pista, o apelido segue sem
 *        dono — dizer de que praça se trata.
 *      - Cachoeira do Monjolinho: o curso d'água existe, mas não consta de
 *        nenhum material oficial e as duas referências públicas apontam áreas
 *        distintas do município. Provavelmente é propriedade particular sem
 *        visitação estruturada.
 *      - Cachoeira do Poção: fica ao lado da do Tobogã, mas o acesso é negado
 *        pelo proprietário. Não anunciar como visitável.
 *      - Cachoeira dos Amores, Museu da Revolução de 1932, Museu do Carro de
 *        Boi Quim Costa e Espaço de Leitura e Arte Eugênia Sereno: existem e
 *        estavam cadastrados com dado conferido, mas saíram do mapa a pedido.
 *        Voltam sem pesquisa nova — o histórico do Git tem o cadastro inteiro.
 *   7. Nomes corrigidos em relação ao pedido original: "Pedra Serra da
 *      Balança" são duas coisas — a Pedra da Balança (o cume, que entrou) e a
 *      Serra da Balança (crista e roteiro tropeiro até Gonçalves). "Pedreira
 *      Campo Escola" não existe: o setor de escalada se chama só Campo
 *      Escola. E o "Mirante do Toldi" não é um ponto à parte: o nome oficial
 *      dele é Mirante da Cachoeira do Toldi e o deck fica a 30 m da queda, no
 *      mesmo estacionamento — viraram um pino só. Separá-los também quebrava a
 *      distância: a base da cachoeira encaixa numa estrada desconectada e o
 *      OSRM devolvia 15,7 km para um vizinho de 250 m que dá 6,1 km.
 *      Os parceiros do Refúgio (Baú Ecoturismo, Sabor com Arte,
 *      Villa Santa Maria, OLIQ) saíram do mapa a pedido — as fotos continuam
 *      em `public/assets/`.
 */

/**
 * Categorias do mapa turístico.
 *
 * As cores vêm do arquivo "Identidade Visual Mapa" do design: sete tons
 * dessaturados que convivem com a base em areia. Elas só aparecem em pinos,
 * ícones e etiquetas de categoria — nunca como fundo de bloco. Por isso ficam
 * aqui como hex literal e não como token do tema: são cor de dado, não cor de
 * interface.
 */
export const CATEGORIAS = {
  turismo: { label: 'Turismo', cor: '#2f6b4f', icone: Camera },
  /**
   * Igreja, museu e casa de cultura saíram de `turismo` porque São Bento tem
   * dez deles: misturados com mirante e cachoeira, o chip "Turismo" virava a
   * lista inteira e deixava de filtrar. O cinza-ardósia é o único tom
   * quase-neutro da paleta — é a cor da taipa e da pedra, e não briga com o
   * azul de `hospedagem`, que só marca o próprio Refúgio.
   */
  cultura: { label: 'Cultura', cor: '#4f5d6b', icone: Landmark },
  restaurantes: { label: 'Restaurantes', cor: '#b4523a', icone: UtensilsCrossed },
  cafes: { label: 'Cafés', cor: '#8a6b3b', icone: Coffee },
  hospedagem: { label: 'Hospedagem', cor: '#4a6fa5', icone: TentTree },
  compras: { label: 'Compras', cor: '#7a5a8c', icone: ShoppingBag },
  aventura: { label: 'Aventura', cor: '#2e7d8a', icone: Mountain },
  experiencias: { label: 'Experiências', cor: '#9a4a5f', icone: Compass },
} as const satisfies Record<
  string,
  { label: string; cor: string; icone: LucideIcon }
>;

export type CategoriaId = keyof typeof CATEGORIAS;

/** `todos` não é uma categoria de dado — é o estado "sem filtro" dos chips. */
export const FILTRO_TODOS = 'todos' as const;
export type FiltroId = typeof FILTRO_TODOS | CategoriaId;

/** Trecho do vale onde cada lugar fica, usado para descrevê-lo por perto. */
export const ZONAS = {
  bau: 'Vale do Baú',
  centro: 'Centro',
  vale: 'Rota rural',
} as const;

export type ZonaId = keyof typeof ZONAS;

export interface Local {
  id: string;
  nome: string;
  cat: CategoriaId;
  zona: ZonaId;
  lat: number;
  lng: number;
  /**
   * Só é preenchido quando o horário do lugar foi conferido com o
   * estabelecimento. Sem isso o cartão não exibe selo de aberto/fechado —
   * dizer "Aberto agora" com base em palpite manda o hóspede subir a serra à
   * toa. Ver `TODO(proprietário)` no topo de `mapa-turistico.json`.
   */
  horario?: string;
  resumo: string;
  descricao?: string;
  endereco: string;
  tel?: string;
  site?: string;
  /** Nota e nº de avaliações do Google, quando conferidos. */
  nota?: string;
  avaliacoes?: number;
  /**
   * Prioridade na lista, cartão maior e selo no pino. Marca parceiro do
   * Refúgio — e o próprio Refúgio, que é quem mais precisa ser achado no
   * mapa da própria pousada. `refugio` só diz de onde saem as distâncias; é
   * este campo que empurra o lugar para o topo da lista.
   */
  destaque?: boolean;
  /** O próprio Refúgio da Pedra — origem de todas as distâncias. */
  refugio?: boolean;
  /** Pasta em `public/assets/` e arquivos, quando há foto real. */
  fotos?: { pasta: string; arquivos: string[] };
  /** `true` quando nome, horário e coordenada ainda não foram conferidos. */
  aConferir?: boolean;
}

export const LOCAIS = locaisJson as Local[];

/** Origem de todas as distâncias e do enquadramento inicial do mapa. */
export const REFUGIO = LOCAIS.find((l) => l.refugio) as Local;

/**
 * Chips da barra de filtros.
 *
 * Só entram categorias que têm pelo menos um lugar cadastrado: um chip que
 * abre uma lista vazia é pior do que chip nenhum. Assim, incluir o primeiro
 * café no JSON já faz o chip "Cafés" aparecer, sem tocar aqui.
 */
export const FILTROS: {
  id: FiltroId;
  label: string;
  icone: LucideIcon;
}[] = [
  { id: FILTRO_TODOS, label: 'Todos', icone: LayoutGrid },
  ...(Object.keys(CATEGORIAS) as CategoriaId[])
    .filter((id) => LOCAIS.some((local) => local.cat === id))
    .map((id) => ({
      id,
      label: CATEGORIAS[id].label,
      icone: CATEGORIAS[id].icone,
    })),
];

export function getLocal(id: string): Local | undefined {
  return LOCAIS.find((l) => l.id === id);
}

export interface Rota {
  /** Estrada percorrida, em metros, do Refúgio até o ponto. */
  metros: number;
  segundos: number;
  /**
   * Quanto a estrada mais próxima parou longe do ponto cadastrado. Grande em
   * cume e cachoeira, que se alcança a pé: é o trecho que o carro não faz.
   */
  desvio: number;
  /** Traçado da rota, em pares [lng, lat]. */
  linha: [number, number][];
}

/**
 * Rotas de carro, calculadas pelo OSRM sobre o OpenStreetMap e gravadas em
 * `rotas.json` por `npm run rotas`.
 *
 * Ficam no repositório em vez de serem buscadas pelo navegador porque a origem
 * é fixa e os destinos são uma lista curada: a resposta é a mesma para todo
 * visitante. Assim o painel abre sem espera, continua de pé se o serviço de
 * rotas cair, e o site em produção não despeja tráfego no servidor de
 * demonstração do OSRM, que existe para desenvolvimento.
 *
 * Mexeu em coordenada no `mapa-turistico.json`? Rode `npm run rotas` de novo.
 */
// O TypeScript lê a geometria do JSON como `number[][]`, sem saber que cada par
// tem exatamente dois números — daí a passagem por `unknown`. Quem garante o
// formato é o gerador, não o compilador.
const ROTAS = rotasJson.rotas as unknown as Record<string, Rota>;

export function getRota(local: Local): Rota | null {
  return ROTAS[local.id] ?? null;
}

/**
 * Distância em linha reta até o Refúgio. Serve de reserva para o lugar que
 * ainda não tem rota gravada — cadastrado depois da última geração, ou fora do
 * alcance do roteamento. Um número aproximado é melhor do que espaço em branco,
 * e o rótulo diz que é linha reta para não passar por quilometragem de estrada.
 */
export function getDistanciaKm(local: Local): number {
  const R = 6371;
  const rad = (graus: number) => (graus * Math.PI) / 180;

  const dLat = rad(local.lat - REFUGIO.lat);
  const dLng = rad(local.lng - REFUGIO.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(REFUGIO.lat)) *
      Math.cos(rad(local.lat)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Metros em texto: abaixo de 1 km o número redondo diz mais que "0,2 km". */
export function formatarDistancia(metros: number): string {
  if (metros < 1000) return `${Math.round(metros / 10) * 10} m`;

  const km = metros / 1000;

  return `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`;
}

export function formatarDuracao(segundos: number): string {
  const minutos = Math.round(segundos / 60);

  if (minutos < 60) return `${minutos} min`;

  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;

  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

/**
 * A linha de distância que aparece em cartão, lista e busca.
 *
 * Mostra estrada e tempo de carro — é a resposta que o hóspede procura ao
 * escolher o que fazer no dia. A linha reta enganava justamente onde mais
 * importa: a Pedra do Baú fica a 1,2 km da varanda e a 18,6 km de carro,
 * porque a estrada contorna o maciço.
 */
export function getDistancia(local: Local): string {
  if (local.refugio) return 'Ponto de partida';

  const rota = getRota(local);

  if (!rota) {
    const km = getDistanciaKm(local);

    return km < 1
      ? `${Math.round(km * 1000)} m em linha reta`
      : `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km em linha reta`;
  }

  return `${formatarDistancia(rota.metros)} · ${formatarDuracao(rota.segundos)} de carro`;
}

/** Minúsculas e sem acento: quem digita "sao bento" quer "São Bento". */
function semAcento(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/**
 * Índice de busca: nome e categoria, que é o que o hóspede digita.
 *
 * O resumo ficou de fora de propósito. Casar palavra solta de descrição enche
 * a lista de lugar que não parece resposta para o que foi perguntado, e num
 * mapa com poucas dezenas de pontos isso atrapalha mais do que ajuda.
 */
const REGISTROS = LOCAIS.map((local) => ({
  local,
  nome: local.nome,
  categoria: CATEGORIAS[local.cat].label,
  texto: semAcento(`${local.nome} ${CATEGORIAS[local.cat].label}`),
}));

const FUSE = new Fuse(REGISTROS, {
  keys: [
    { name: 'nome', weight: 0.7 },
    { name: 'categoria', weight: 0.3 },
  ],
  includeScore: true,
  ignoreDiacritics: true,
  // O termo pode estar em qualquer ponto do nome: "baú" tem de achar
  // "Restaurante Pedra do Baú", não só o que começa com a palavra.
  ignoreLocation: true,
  threshold: 0.4,
  minMatchCharLength: 2,
});

/**
 * Teto de score do palpite. Acima disso o Fuse já está casando letra avulsa —
 * "vila" com "Vinícola" — e o resultado polui mais do que informa.
 */
const SCORE_MAXIMO = 0.5;

/**
 * Pontua cada local contra o termo, palavra por palavra.
 *
 * Toda palavra digitada precisa bater em algum lugar (E, não OU), senão
 * "cachoeira amores" devolveria todas as cachoeiras do mapa.
 *
 * Para cada palavra tenta-se primeiro o trecho literal, ignorando acento: é o
 * que acerta a busca bem escrita, sem ruído nenhum. Só quando a palavra não
 * aparece em lugar algum entra o Fuse, que tolera letra trocada
 * ("restarante") em troca de palpites piores — daí o teto de score.
 *
 * O número devolvido é a soma dos scores: 0 é acerto literal, e quanto maior,
 * mais o resultado dependeu de palpite. `null` significa termo vazio, que não
 * é busca nenhuma.
 */
function pontuar(termo: string): Map<string, number> | null {
  const palavras = semAcento(termo).trim().split(/\s+/).filter(Boolean);
  if (!palavras.length) return null;

  let acumulado: Map<string, number> | null = null;

  for (const palavra of palavras) {
    const rodada = new Map<string, number>();

    for (const registro of REGISTROS) {
      if (registro.texto.includes(palavra)) rodada.set(registro.local.id, 0);
    }

    if (!rodada.size) {
      for (const { item, score = 1 } of FUSE.search(palavra)) {
        if (score <= SCORE_MAXIMO) rodada.set(item.local.id, score);
      }
    }

    if (!acumulado) {
      acumulado = rodada;
    } else {
      for (const id of [...acumulado.keys()]) {
        const score = rodada.get(id);

        if (score === undefined) acumulado.delete(id);
        else acumulado.set(id, acumulado.get(id)! + score);
      }
    }

    if (!acumulado.size) return acumulado;
  }

  return acumulado;
}

/**
 * Filtro único da tela: categoria + termo de busca. A ordenação coloca os
 * parceiros em Destaque primeiro — é a regra do design, e vale tanto para a
 * lista lateral quanto para o autocomplete. O score só desempata dentro de
 * cada grupo, para que o acerto literal venha antes do palpite.
 */
export function filtrarLocais(
  filtro: FiltroId,
  termo: string,
  { incluirRefugio = true }: { incluirRefugio?: boolean } = {},
): Local[] {
  const scores = pontuar(termo);

  return LOCAIS.filter((local) => {
    if (!incluirRefugio && local.refugio) return false;
    if (filtro !== FILTRO_TODOS && local.cat !== filtro) return false;

    return !scores || scores.has(local.id);
  }).sort((a, b) => {
    const porDestaque = Number(!!b.destaque) - Number(!!a.destaque);
    if (porDestaque !== 0 || !scores) return porDestaque;

    return scores.get(a.id)! - scores.get(b.id)!;
  });
}

/**
 * Link de rota do Google Maps até o lugar.
 *
 * Sem `origin` de propósito: o Maps assume a localização de quem abriu. Fixar a
 * saída no Refúgio traçava a rota errada para quem ainda está vindo de casa, e
 * quem já está hospedado sai do Refúgio de qualquer jeito — o padrão acerta os
 * dois casos, e ninguém precisa apagar um endereço antes de sair dirigindo.
 *
 * O destino vai em coordenada, e não no nome do lugar: o nome nem sempre
 * resolve para o ponto certo em estrada rural, a coordenada sempre resolve.
 */
export function getRotaUrl(destino: Local): string {
  const chegada = `${destino.lat},${destino.lng}`;

  return `https://www.google.com/maps/dir/?api=1&destination=${chegada}&travelmode=driving`;
}

/** Caminho da primeira foto do local, quando existe. */
export function getFotoPrincipal(local: Local): string | null {
  if (!local.fotos?.arquivos.length) return null;

  return `/assets/${local.fotos.pasta}/${local.fotos.arquivos[0]}`;
}
