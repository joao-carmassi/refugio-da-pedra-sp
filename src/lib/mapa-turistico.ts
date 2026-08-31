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
import centroJson from '@/data/centro.json';
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
 *      endereço), Portal da Cidade, Arte no Quilombo (não está no OSM; a
 *      coordenada é a do pino do Google republicado pelo portal de turismo do
 *      Estado, sem cruzamento independente) e Bar SBS Bebidas (também fora do
 *      OSM; a coordenada é a geocodificação do endereço pelo Tripadvisor, que
 *      cai na rua e na quadra certas, a 40 m do coreto). Remover a marca ao
 *      confirmar o ponto exato. O Ateliê Ditinho Joana saiu da lista porque o proprietário
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
 *      desempatou foi o proprietário. O do Bar SBS Bebidas ficou em branco:
 *      o Instagram do bar e o Tripadvisor dizem quinta a domingo a partir das
 *      18h, o portal de turismo diz quarta a domingo a partir das 15h, e não
 *      há como desempatar sem ligar. A descrição do bar avisa disso.
 *   5. `nota` / `avaliacoes` — só o Refúgio tem, vindo do próprio Google
 *      Business Profile. Preencher os demais só com número real; a estrela
 *      some enquanto não houver. O que existe e não entrou: o Sabor com Arte
 *      publica 4,3 com 511 avaliações no Tripadvisor (e 4,5 numa outra faixa
 *      do próprio site, que se contradiz), e o Bar SBS Bebidas tem 4,7 no
 *      Tripadvisor com três avaliações. Nenhum dos dois é Google, e três
 *      avaliações não são média — pedir os números do Business Profile.
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
 *      Os parceiros do Refúgio (Baú Ecoturismo, Villa Santa Maria, OLIQ)
 *      saíram do mapa a pedido — as fotos continuam em `public/assets/`. O
 *      Sabor com Arte saiu junto e voltou depois, agora como restaurante e
 *      não como parceiro: as duas fotos antigas seguem em uso pela seção de
 *      parceiros da pousada, e as cinco do cadastro são novas.
 *   8. Onde se deixa o carro para subir a Pedra da Balança. O `acesso` dela é
 *      a única coordenada avulsa do cadastro, e essa coordenada é onde o OSRM
 *      encaixou: o último lugar em que o OpenStreetMap conhece uma via, no fim
 *      da estrada de terra do Bairro dos Serranos. A descrição fala em 1 km de
 *      trilha e a rota parava a 390 m do cume — alguma coisa dessa conta sobra,
 *      e o mais provável é que os 19,2 km já entrem uns metros de trilha. A
 *      ficha não mente (diz que o carro para e que há caminhada), mas confirmar
 *      o ponto exato tiraria a dúvida.
 *   9. As duas entradas do Complexo do Baú. O cadastro diz que o cume do Baú,
 *      a Ana Chata e o Campo Escola entram pelo estacionamento do Chico Bento
 *      — 1,9 km do Refúgio, trilha mais longa —, e que o Bauzinho e a rampa
 *      de voo livre entram pela portaria do Monumento Natural — 17,3 km,
 *      trilha mais curta. É o que o proprietário descreve como o costume da
 *      casa. O Chico Bento entrou como coordenada de `acesso`, e não como
 *      pino: é negócio de terceiro, e o proprietário não quis marcá-lo no
 *      mapa. A rota leva até lá do mesmo jeito. Duas coisas seguem em aberto:
 *      quanto custa o estacionamento (as fontes públicas divergem entre R$ 20
 *      e R$ 30 por carro, e por isso nem o cadastro nem o FAQ citam valor) e
 *      se piloto de parapente com equipamento nas costas pode subir de carro
 *      os 400 m até a rampa, que o visitante comum faz a pé.
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

/**
 * Onde o carro para e o que sobra depois disso.
 *
 * Duas informações separadas de propósito, porque elas não andam sempre
 * juntas: a Pedra do Baú tem parada declarada — o estacionamento do Chico
 * Bento — e caminhada; a
 * Cachoeira do Encontro tem só caminhada, porque o pino já é o recuo onde se
 * estaciona e ainda assim são 700 m de trilha até a queda.
 */
export interface Acesso {
  /**
   * Id do local do cadastro onde o carro para, quando essa parada já é um
   * ponto do mapa. Hoje só a portaria do Monumento Natural se encaixa: ela
   * tem taxa, horário e ficha própria, e por ela entram o Bauzinho e a rampa
   * de voo livre. Guardar o id, e não a coordenada, faz com que corrigir a
   * portaria corrija de uma vez todos os pontos que entram por ela.
   */
  ponto?: string;
  /**
   * Coordenada avulsa da parada, quando ela não é ponto do mapa. Duas razões
   * diferentes levam a isso. A Pedra da Balança acaba no fim de uma estrada de
   * terra que não é atrativo, não tem horário e não teria o que dizer numa
   * ficha. Já o estacionamento do Chico Bento, por onde sobem o cume do Baú, a
   * Ana Chata e o Campo Escola, é negócio de terceiro: dar pino a ele seria
   * vitrine, e essa não é decisão do mapa a tomar. A coordenada leva o hóspede
   * até a porteira sem que o mapa anuncie a casa.
   *
   * Vai com `ponto` ou com `lat`/`lng` — nunca com os dois.
   */
  lat?: number;
  lng?: number;
  /**
   * Como a frase chama a parada, em minúscula e com artigo: é o que entra em
   * "O carro vai até ___". Sem isso cai no `nome` do local apontado por
   * `ponto`, que é um título e nem sempre cabe na frase — "a portaria do
   * Monumento Natural" lê melhor que "Portaria do Monumento Natural da Pedra
   * do Baú".
   */
  nome?: string;
  /**
   * O que sobra depois que o carro para, escrito à mão por quem já subiu.
   *
   * É prosa, e não um par de números, porque a realidade não é um par de
   * números: a Ana Chata são 3,8 km ida e volta pela portaria ou 5,5 km pela
   * entrada do Chico Bento, em 1 a 2 horas, com via ferrata no fim. Nenhum
   * campo `metrosAPe` diz isso, e o que ele dissesse seria uma segunda
   * mentira no lugar da primeira.
   *
   * Único campo obrigatório: sem coordenada de parada, ele é o `acesso`
   * inteiro.
   */
  aPe: string;
}

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
  /**
   * Onde o carro para, quando ele não para no ponto — e o que falta a pé.
   *
   * Só existe onde a ficha mentiria sem ele. O pino continua no cume: a
   * atração está lá, e é ela que o mapa está mostrando. Quem muda de lugar é
   * o número — a rota passa a ser medida até a parada, e o botão "Como
   * chegar" manda o Google Maps para a parada, porque mandar um carro para o
   * cume da Pedra do Baú é mandá-lo para onde não há estrada.
   *
   * Não sai do `desvio` da rota porque o `desvio` erra dos dois lados: a Ana
   * Chata encaixa a 57 m de uma estrada que não é a dela e tem 3,8 km de
   * trilha; a Pedra do Baú encaixa a 686 m que não são caminhada nenhuma, são
   * o pedaço de trilha carroçável que o OSRM aceitou percorrer. Quem sabe
   * onde se estaciona é quem edita o cadastro.
   */
  acesso?: Acesso;
  tel?: string;
  site?: string;
  /** Nota e nº de avaliações do Google, quando conferidos. */
  nota?: string;
  avaliacoes?: number;
  /**
   * Prioridade na lista, cartão maior e selo no pino. Marca parceiro do
   * Refúgio — e o próprio Refúgio, que é quem mais precisa ser achado no
   * mapa da própria pousada. `refugio` só diz qual pino é a pousada; é este
   * campo que empurra o lugar para o topo da lista.
   */
  destaque?: boolean;
  /**
   * O próprio Refúgio da Pedra.
   *
   * Já foi "a origem de todas as distâncias", e não é mais: de onde se mede
   * agora é `Origem`, que vem da URL e pode ser o Centro. Este campo ficou
   * com o que sempre foi só dele — dizer qual pino é a pousada, para ele ser
   * desenhado maior, em cima dos outros e na cor da hospedagem.
   */
  refugio?: boolean;
  /** Pasta em `public/assets/` e arquivos, quando há foto real. */
  fotos?: { pasta: string; arquivos: string[] };
  /** `true` quando nome, horário e coordenada ainda não foram conferidos. */
  aConferir?: boolean;
}

export const LOCAIS = locaisJson as Local[];

/** O próprio Refúgio da Pedra, como lugar do cadastro. */
export const REFUGIO = LOCAIS.find((l) => l.refugio) as Local;

/**
 * De onde as distâncias são medidas.
 *
 * Isto começou como uma constante — o Refúgio, e ponto final — e virou um
 * parâmetro porque o mapa passou a ter dois usos. Sem parâmetro nenhum na URL
 * ele é o mapa da cidade: mede tudo do Centro de São Bento, não anuncia a
 * pousada e serve a quem só quer saber onde ficam as cachoeiras. Com
 * `?refugio=1` ele é o mapa do hóspede: mede da varanda, e é por isso que o
 * botão "Refúgio" existe nos controles. As distâncias são o site inteiro
 * mudando de dono, então elas não podem sair de uma constante de módulo.
 *
 * `id` é a chave do conjunto gravado em `rotas.json`, e `nome` é o que a ficha
 * escreve em "A partir do ___" — daí ele viajar junto e não ser derivado do
 * `id` na hora de renderizar.
 */
export type OrigemId = 'refugio' | 'centro';

export interface Origem {
  id: OrigemId;
  nome: string;
  lat: number;
  lng: number;
}

export const ORIGEM_REFUGIO: Origem = {
  id: 'refugio',
  nome: REFUGIO.nome,
  lat: REFUGIO.lat,
  lng: REFUGIO.lng,
};

/**
 * O centro como lugar, e não como ponto turístico.
 *
 * A coordenada é a da praça da matriz e é a mesma que a Igreja Matriz tem no
 * cadastro — mas o nome não pode ser o dela. "A partir do Centro de São Bento"
 * é uma medida que qualquer um entende; "a partir da Igreja Matriz" faria o
 * visitante achar que o mapa mede distância de igreja. Por isso o par
 * nome/coordenada mora em `centro.json`, fora do cadastro de atrativos, e é
 * lido também pelo `gerar-rotas.mjs`.
 */
export const ORIGEM_CENTRO: Origem = {
  id: 'centro',
  nome: centroJson.nome,
  lat: centroJson.lat,
  lng: centroJson.lng,
};

/** Sem pedido em contrário, o mapa é da cidade. */
export const ORIGEM_PADRAO = ORIGEM_CENTRO;

/**
 * O lugar que está exatamente sobre a origem.
 *
 * Ele não tem distância a mostrar: tem uma frase, "Ponto de partida". A regra
 * é a coordenada, e não `local.refugio`, porque ela precisa valer para as duas
 * origens — com o Centro ativo quem cai aqui é a Igreja Matriz, que divide a
 * coordenada com a praça da matriz, e sem isso a ficha dela anunciaria "0 m ·
 * 0 min de carro". É a mesma regra que tira o ponto da lista de destinos em
 * `gerar-rotas.mjs`, e as duas precisam concordar: se discordassem, a ficha
 * pediria uma rota que o gerador não gravou.
 */
export function ehOrigem(local: Local, origem: Origem): boolean {
  return local.lat === origem.lat && local.lng === origem.lng;
}

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
 * Até onde o carro vai, de verdade.
 *
 * Devolve sempre um ponto: sem parada declarada, a parada é o próprio lugar.
 * `nome` só vem preenchido quando a parada é outra coisa — é ele que a ficha
 * usa para dizer onde o carro morre, e é a ausência dele que faz a ficha
 * calar sobre isso.
 *
 * É esta função que decide para onde vai a rota gravada, para onde aponta o
 * botão "Como chegar" e o que a ficha promete. Um `ponto` que não resolve
 * cairia aqui de volta no próprio lugar e devolveria em silêncio o número
 * errado — por isso quem valida o cadastro é `gerar-rotas.mjs`, antes de
 * qualquer requisição, e não este `if`.
 */
export function getParada(local: Local): {
  lat: number;
  lng: number;
  nome: string | null;
} {
  const acesso = local.acesso;

  if (acesso?.ponto) {
    const parada = getLocal(acesso.ponto);

    if (parada) {
      return {
        lat: parada.lat,
        lng: parada.lng,
        nome: acesso.nome ?? parada.nome,
      };
    }
  }

  if (acesso?.lat !== undefined && acesso.lng !== undefined) {
    return { lat: acesso.lat, lng: acesso.lng, nome: acesso.nome ?? null };
  }

  return { lat: local.lat, lng: local.lng, nome: null };
}

export interface Rota {
  /** Estrada percorrida, em metros, da origem ativa até o ponto. */
  metros: number;
  segundos: number;
  /**
   * Quanto a estrada mais próxima parou longe do ponto para onde a rota foi
   * pedida. Depois que os cumes ganharam `acesso`, esse ponto é a parada de
   * carro, e o número tem de ser pequeno em todo lugar: quando ele cresce, é
   * o cadastro que está errado — falta `acesso`, ou o `acesso` aponta para
   * onde não passa carro. Não é mais medida de caminhada; quem diz o que
   * falta a pé é `Acesso.aPe`, escrito à mão.
   */
  desvio: number;
  /** Traçado da rota, em pares [lng, lat]. */
  linha: [number, number][];
}

/**
 * Rotas de carro, calculadas pelo OSRM sobre o OpenStreetMap e gravadas em
 * `rotas.json` por `npm run rotas`.
 *
 * Ficam no repositório em vez de serem buscadas pelo navegador porque as
 * origens são fixas e os destinos são uma lista curada: a resposta é a mesma
 * para todo visitante. Assim o painel abre sem espera, continua de pé se o
 * serviço de rotas cair, e o site em produção não despeja tráfego no servidor
 * de demonstração do OSRM, que existe para desenvolvimento.
 *
 * São dois conjuntos, um por origem, gravados na mesma rodada. Os dois viajam
 * no bundle porque a origem só se conhece na URL, já no navegador — e buscar o
 * conjunto certo depois seria trocar um arquivo a mais por uma espera que este
 * arquivo existe para não ter.
 *
 * Mexeu em coordenada no `mapa-turistico.json` ou no `centro.json`? Rode
 * `npm run rotas` de novo.
 */
// O TypeScript lê a geometria do JSON como `number[][]`, sem saber que cada par
// tem exatamente dois números — daí a passagem por `unknown`. Quem garante o
// formato é o gerador, não o compilador.
const ROTAS = rotasJson.origens as unknown as Record<
  OrigemId,
  { rotas: Record<string, Rota> }
>;

export function getRota(local: Local, origem: Origem): Rota | null {
  return ROTAS[origem.id].rotas[local.id] ?? null;
}

/**
 * Distância em linha reta até a origem. Serve de reserva para o lugar que
 * ainda não tem rota gravada — cadastrado depois da última geração, ou fora do
 * alcance do roteamento. Um número aproximado é melhor do que espaço em branco,
 * e o rótulo diz que é linha reta para não passar por quilometragem de estrada.
 *
 * Mede até a parada de carro, e não até o pino, pela mesma razão que a rota:
 * a reserva tem de reservar a mesma coisa. Sem isso, o lugar que perdesse a
 * rota trocaria "17,3 km de carro até a portaria" por "1,0 km em linha reta"
 * — que é a distância da varanda ao cume do Bauzinho, e não um caminho que
 * exista.
 */
export function getDistanciaKm(local: Local, origem: Origem): number {
  const parada = getParada(local);
  const R = 6371;
  const rad = (graus: number) => (graus * Math.PI) / 180;

  const dLat = rad(parada.lat - origem.lat);
  const dLng = rad(parada.lng - origem.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(origem.lat)) *
      Math.cos(rad(parada.lat)) *
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
 * O trecho de carro, e só ele: estrada e tempo da origem ativa até onde o
 * carro para.
 *
 * A linha reta enganava justamente onde mais importa — a portaria do
 * Monumento Natural fica a 1,3 km da varanda e a 17,3 km de estrada, porque
 * a estrada contorna o maciço inteiro para chegar até ela.
 *
 * Onde o carro não para no ponto, esta função não é a resposta inteira: quem
 * monta as duas linhas da ficha é `getChegada`.
 */
export function getDistancia(local: Local, origem: Origem): string {
  if (ehOrigem(local, origem)) return 'Ponto de partida';

  const rota = getRota(local, origem);

  if (!rota) {
    const km = getDistanciaKm(local, origem);

    return km < 1
      ? `${Math.round(km * 1000)} m em linha reta`
      : `${km.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km em linha reta`;
  }

  return `${formatarDistancia(rota.metros)} · ${formatarDuracao(rota.segundos)} de carro`;
}

export interface Chegada {
  /** A linha grande: '17,3 km · 28 min de carro'. */
  carro: string;
  /**
   * A linha miúda embaixo. `null` na maior parte do cadastro, onde o carro
   * encosta no ponto e não sobra caminhada nenhuma para avisar.
   */
  aPe: string | null;
}

/**
 * O que a ficha diz sobre chegar num lugar, em duas linhas.
 *
 * A de cima é sempre trecho de carro — e só ele. A de baixo só existe onde a
 * de cima, sozinha, mentiria: dizer "19,0 km · 38 min de carro" para a Pedra
 * do Baú mandava o hóspede procurar um estacionamento a 4 km de trilha do
 * lugar onde ele tinha acabado de parar.
 */
export function getChegada(local: Local, origem: Origem): Chegada {
  const carro = getDistancia(local, origem);
  const acesso = local.acesso;

  if (!acesso) return { carro, aPe: null };

  const { nome } = getParada(local);

  return {
    carro,
    aPe: nome ? `O carro vai até ${nome}. ${acesso.aPe}` : acesso.aPe,
  };
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
 * Sem `origin` de propósito, e é por isso que esta é a única função de rota que
 * não recebe a origem: o Maps assume a localização de quem abriu. Fixar a
 * saída traçava a rota errada para quem ainda está vindo de casa, e quem já
 * está na cidade sai de onde está de qualquer jeito — o padrão acerta os dois
 * casos, e ninguém precisa apagar um endereço antes de sair dirigindo. O ponto
 * fixo mede; ele não dirige.
 *
 * O destino vai em coordenada, e não no nome do lugar: o nome nem sempre
 * resolve para o ponto certo em estrada rural, a coordenada sempre resolve.
 *
 * E a coordenada é a da parada, não a do pino. `travelmode=driving` para o
 * cume da Pedra do Baú não devolve "não é possível dirigir até aqui": o
 * Google escolhe sozinho uma estrada próxima, e a que ele escolhe não é
 * nenhuma das duas entradas do complexo — é a mesma carroçável que enganou o
 * OSRM. Mandar para a parada declarada é a única forma de a rota terminar
 * onde há um portão e um lugar para deixar o carro.
 */
export function getRotaUrl(destino: Local): string {
  const parada = getParada(destino);
  const chegada = `${parada.lat},${parada.lng}`;

  return `https://www.google.com/maps/dir/?api=1&destination=${chegada}&travelmode=driving`;
}

/** Caminho da primeira foto do local, quando existe. */
export function getFotoPrincipal(local: Local): string | null {
  if (!local.fotos?.arquivos.length) return null;

  return `/assets/${local.fotos.pasta}/${local.fotos.arquivos[0]}`;
}
