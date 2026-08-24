import {
  Camera,
  Coffee,
  Compass,
  LayoutGrid,
  Mountain,
  ShoppingBag,
  TentTree,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import locaisJson from '@/data/mapa-turistico.json';

/**
 * TODO(proprietário): conferir e completar o cadastro de `mapa-turistico.json`.
 *
 * Todos os lugares vieram de fontes públicas verificáveis — coordenadas do
 * OpenStreetMap e descrições já publicadas no blog do próprio site. O que
 * ainda falta e depende de quem conhece a região:
 *
 *   1. `horario` — só está preenchido onde há horário publicado. Sem esse
 *      campo o cartão não exibe funcionamento, de propósito.
 *   2. `nota` / `avaliacoes` — nenhum lugar tem nota hoje. Preencher só com o
 *      número real do Google Business Profile; a estrela some enquanto não
 *      houver.
 *   3. `tel` — só telefones já publicados no blog. Não inventar.
 *   4. `aConferir: true` marca coordenada aproximada (centro da rua ou do
 *      bairro, não do imóvel). Remover a marca ao confirmar o ponto exato.
 *   5. "Padaria Cazarim", citada em dois posts do blog, não existe em nenhuma
 *      fonte pública — nem no Google Maps, nem no diretório de turismo da
 *      prefeitura. O nome mais próximo é "Padaria Casarão", no Centro. Por
 *      isso ela não entrou no mapa: confirmar a grafia e corrigir também os
 *      posts.
 *   6. Fica de fora, por falta de coordenada confiável: a portaria do MoNa
 *      Pedra do Baú (o marco do monumento não é o portão), "Manacá" e "Bento"
 *      (dois estabelecimentos com esse nome no Centro, a 450 m um do outro),
 *      e "Mache" — o único "Ma Che" da região fica em Paiol Grande, não no
 *      Centro como o blog descreve.
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

/**
 * Zonas usadas para agrupar os pinos quando o mapa está afastado demais para
 * mostrar cada local separadamente.
 */
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
  /** Parceiro do Refúgio: ganha prioridade na lista e selo no pino. */
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

/**
 * Distância em linha reta até o Refúgio.
 *
 * É calculada a partir das coordenadas, e não guardada no JSON, por dois
 * motivos: não há como conferir quilometragem de estrada de terra sem
 * percorrer, e um número guardado à mão vira mentira no dia em que a
 * coordenada é corrigida. O rótulo diz "em linha reta" justamente porque o
 * trajeto real é maior — quem quer o número da estrada usa o "Como chegar",
 * que abre o Google Maps.
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

export function getDistancia(local: Local): string {
  if (local.refugio) return 'Ponto de partida';

  const km = getDistanciaKm(local);

  if (km < 1) {
    return `${Math.round(km * 1000)} m em linha reta`;
  }

  return `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km em linha reta`;
}

/**
 * Filtro único da tela: categoria + termo de busca. A ordenação coloca os
 * parceiros em Destaque primeiro — é a regra do design, e vale tanto para a
 * lista lateral quanto para o autocomplete.
 */
export function filtrarLocais(
  filtro: FiltroId,
  termo: string,
  { incluirRefugio = true }: { incluirRefugio?: boolean } = {},
): Local[] {
  const busca = termo.trim().toLowerCase();

  return LOCAIS.filter((local) => {
    if (!incluirRefugio && local.refugio) return false;
    if (filtro !== FILTRO_TODOS && local.cat !== filtro) return false;
    if (!busca) return true;

    return `${local.nome} ${CATEGORIAS[local.cat].label}`
      .toLowerCase()
      .includes(busca);
  }).sort((a, b) => Number(!!b.destaque) - Number(!!a.destaque));
}

/**
 * Link de rota do Google Maps saindo do Refúgio. Usa coordenadas em vez do
 * nome do lugar: o nome nem sempre resolve para o ponto certo em estrada
 * rural, a coordenada sempre resolve.
 */
export function getRotaUrl(destino: Local): string {
  const origem = `${REFUGIO.lat},${REFUGIO.lng}`;
  const chegada = `${destino.lat},${destino.lng}`;

  return `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${chegada}&travelmode=driving`;
}

/** Caminho da primeira foto do local, quando existe. */
export function getFotoPrincipal(local: Local): string | null {
  if (!local.fotos?.arquivos.length) return null;

  return `/assets/${local.fotos.pasta}/${local.fotos.arquivos[0]}`;
}
