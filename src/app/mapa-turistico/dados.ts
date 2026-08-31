import { getAlt } from '@/lib/image-alt';
import {
  CATEGORIAS,
  LOCAIS,
  ZONAS,
  type CategoriaId,
  type Local,
  type ZonaId,
} from '@/lib/mapa-turistico';

/**
 * Números desta página saem do cadastro, nunca da mão de quem escreve.
 *
 * A copy diz "9 lugares de turismo" e "31 pontos no mapa" — se alguém
 * acrescentar uma cachoeira em `mapa-turistico.json`, o texto tem de
 * acompanhar sozinho. Digitar o número no JSX transformaria cada edição de
 * dado numa página que mente até alguém reparar.
 */

/** O Refúgio fica de fora: ele é a origem das medidas, não um atrativo. */
export const LUGARES = LOCAIS.filter((local) => !local.refugio);

export function contarZona(zona: ZonaId): number {
  return LOCAIS.filter((local) => local.zona === zona).length;
}

interface CategoriaDaPagina {
  id: CategoriaId;
  label: string;
  /** Uma linha sobre o que a categoria cobre — escrita sobre o cadastro. */
  texto: string;
  /** Link de continuidade, quando a categoria tem para onde mandar. */
  leitura?: { href: string; texto: string };
}

/**
 * As nove categorias do mapa, na ordem em que a página as conta.
 *
 * Sem número de lugares, de propósito: contagem numa página institucional
 * envelhece mal e convida à comparação errada — "só 2 cachoeiras?" —, quando o
 * que importa é o que existe em cada eixo. Quem quiser contar abre o mapa.
 *
 * TODO(proprietário): mandar a lista de cafés e experiências guiadas (nome,
 * endereço e horário, quando houver) para o cadastro. São as duas categorias
 * que hoje aparecem na página sem um único pino no mapa — a página promete um
 * guia da cidade inteira e por enquanto cobre esses dois eixos só pelos guias
 * do blog.
 *
 * TODO(proprietário): serviços é a categoria mais nova e tem um lugar só. Se a
 * ideia é que ela cubra o que o hóspede precisa resolver na cidade — farmácia,
 * posto, mercado, caixa eletrônico —, dizer quais entram. Se ela existe só
 * para o parceiro imobiliário, ela já está pronta como está.
 */
export const CATEGORIAS_DA_PAGINA: CategoriaDaPagina[] = (
  [
    {
      id: 'turismo',
      texto:
        'Cachoeiras, mirantes e praças. Entram aqui a portaria do Monumento Natural da Pedra do Baú, a Cachoeira do Toldi, com salto de mais de 70 metros, a Cachoeira do Encontro, o Mirante do Cruzeiro, o Portal da Cidade, onde funciona o Centro de Informação ao Turista, e as cinco praças do centro, do coreto ao largo da rodoviária.',
    },
    {
      id: 'aventura',
      texto:
        'O Complexo da Pedra do Baú inteiro: o cume do Baú a 1.950 m, o Bauzinho, a Pedra Ana Chata e a rampa de voo livre do Mirante do Caramuru. Fora do complexo, a Pedra da Balança, no extremo oeste do município.',
      leitura: {
        href: '/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/',
        texto: 'As trilhas do complexo, uma a uma',
      },
    },
    {
      id: 'cultura',
      texto:
        'As igrejas do centro, a Ladeira dos Pirilampos, com trechos de Eugênia Sereno em mosaico, as Capelinhas de Mosaico e a Casa da Cultura Professor Miguel Reale, casarão do século XIX de entrada gratuita.',
      leitura: {
        href: '/blog/igreja-matriz-de-sao-bento-do-sapucai-historia-arquitetura-e-visitacao/',
        texto: 'A história da Igreja Matriz',
      },
    },
    {
      id: 'restaurantes',
      texto:
        'A mesa da serra. No mapa estão o Sabor com Arte, que serve truta em sete preparos e tem deck de frente para a Pedra do Baú, a Hot Stone, que é pizzaria, hamburgueria e choperia na avenida do centro, e o Bar SBS Bebidas, o boteco de frente para o coreto.',
      leitura: {
        href: '/blog/gastronomia-em-sao-bento-do-sapucai-os-melhores-restaurantes-da-serra/',
        texto: 'O guia de gastronomia',
      },
    },
    {
      id: 'cafes',
      texto:
        'A parada antes de subir e depois de descer — cafés, casas de chá e as padarias que abrem cedo no centro.',
    },
    {
      id: 'compras',
      texto:
        'O que São Bento faz à mão. No mapa estão os dois do bairro do Quilombo: o Arte no Quilombo, associação com mais de oitenta artesãos trançando palha de bananeira e de milho, e o Ateliê Ditinho Joana, que esculpe madeira desde 1974.',
      leitura: {
        href: '/blog/artesanato-em-sao-bento-do-sapucai-guia-completo/',
        texto: 'O guia de artesanato',
      },
    },
    {
      id: 'experiencias',
      texto:
        'O que se faz acompanhado: voo livre de parapente, escalada e cachoeirismo com condutor, cavalgada e passeio de jipe pelas estradas de terra.',
      leitura: {
        href: '/blog/como-reservar-passeios-guiados-em-sao-bento-do-sapucai/',
        texto: 'Como reservar um passeio guiado',
      },
    },
    {
      id: 'hospedagem',
      texto:
        'Onde dormir no pé da serra. O mapa marca hoje o Refúgio da Pedra SP, a pousada que mantém este projeto, com cinco acomodações a caminho da Pedra do Baú.',
      leitura: { href: '/chales/', texto: 'Conheça as acomodações' },
    },
    {
      id: 'servicos',
      texto:
        'O eixo que não é passeio, para quem já está aqui e precisa resolver alguma coisa. Hoje marca a CAMPOMAX, a imobiliária do centro, que trabalha com terreno e casa na serra — a busca de quem sobe muito e uma hora pensa em ficar.',
    },
  ] satisfies Omit<CategoriaDaPagina, 'label'>[]
).map(({ id, texto, leitura }) => ({
  id,
  label: CATEGORIAS[id].label,
  texto,
  leitura,
}));

export interface PontoDaPagina {
  id: string;
  nome: string;
  resumo: string;
  categoria: CategoriaId;
  categoriaLabel: string;
  /** Enquadramento da foto que vai ocupar o lugar do espaço reservado. */
  foto: string;
  /**
   * A fotografia, quando o lugar já tem uma cadastrada. Presente, o cartão
   * mostra a foto; ausente, mostra o espaço reservado com o enquadramento
   * pedido em `foto`. É a primeira do carrossel da ficha do mapa — a mesma
   * imagem representa o lugar nos dois lugares.
   */
  imagem?: { src: string; alt: string };
}

export interface GrupoDePontos {
  id: ZonaId;
  label: string;
  /** Uma linha sobre o trecho, no cabeçalho do grupo. */
  texto: string;
  /** Post do blog que aprofunda o trecho, quando existe um. */
  leitura?: { href: string; texto: string };
  pontos: PontoDaPagina[];
}

/**
 * Enquadramento pedido para a foto de cada ponto.
 *
 * Não é texto de tela: é a legenda do espaço reservado e o `alt` que a
 * fotografia herda quando chegar. Escrever aqui, e não no componente, mantém
 * o briefing junto do cadastro que ele descreve.
 *
 * TODO(proprietário): as fotos. Cada linha abaixo é o pedido de uma delas.
 */
const ENQUADRAMENTOS: Record<string, string> = {
  'mona-pedra-bau':
    'Portaria do Monumento Natural Estadual da Pedra do Baú, com a placa de entrada e o maciço ao fundo',
  'pedra-bau':
    'Cume da Pedra do Baú visto de baixo, com a via ferrata riscando a face de granito',
  bauzinho:
    'Trilha do Bauzinho no trecho final, com caminhantes chegando ao topo e a vista da Mantiqueira aberta',
  'ana-chata':
    'Laje suspensa da Pedra Ana Chata sobre o vale, com a serra ao fundo',
  'rampa-voo-livre':
    'Rampa de voo livre do Mirante do Caramuru com parapente pronto para decolar sobre o vale',
  'cachoeira-encontro':
    'Encontro das duas quedas da Cachoeira do Encontro, com as piscinas rasas em primeiro plano',
  'cachoeira-toldi':
    'Salto de mais de 70 metros da Cachoeira do Toldi visto do deck de mirante na estrada',
  'sbs-bebidas':
    'Fachada do Bar SBS Bebidas à noite, com o coreto da praça em frente',
  'hot-stone':
    'Salão da Hot Stone cheio à noite, com a pizza saindo do forno em primeiro plano',
  campomax:
    'Fachada da CAMPOMAX na Avenida Doutor Rubião Júnior, com a vitrine de imóveis à vista',
  'pedra-balanca':
    'Cruz no cume da Pedra da Balança a 1.600 m, com o vale a oeste ao fundo',
  'cachoeira-toboga':
    'Escorregador natural de rocha da Cachoeira do Tobogã terminando na piscina rasa',
  'belvedere-serrano':
    'Deck de pedra e tora do Belvedere do Serrano ao nascer do sol, com o mar de nuvens abaixo',
  'igreja-matriz':
    'Fachada da Igreja Matriz de São Bento, de taipa de pilão, vista da praça em frente',
  'ladeira-pirilampos':
    'Ladeira dos Pirilampos revestida de mosaico, descendo da Matriz para a parte baixa da cidade',
  'capelinhas-mosaico':
    'Uma das Capelinhas de Mosaico em detalhe, com o revestimento de caco de vidro e miçanga',
  'igreja-sao-benedito':
    'Igreja de São Benedito com a Congada em festa no adro',
  'igreja-rosario':
    'Torre única da Igreja Nossa Senhora do Rosário, de 1934, vista do marco zero da cidade',
  'igreja-remedios':
    'Fachada azul da Igreja Nossa Senhora dos Remédios, de frente para o coreto',
  'igreja-santo-antonio':
    'Igreja Santo Antônio vista da rua, no roteiro de igrejas do centro',
  'casa-cultura-miguel-reale':
    'Casarão do século XIX da Casa da Cultura Professor Miguel Reale, com a fachada colonial inteira no quadro',
  'mirante-cruzeiro':
    'Rosa dos ventos em mosaico no piso do Mirante do Cruzeiro, com a cidade ao fundo',
  'praca-bandeira':
    'Praça da Bandeira arborizada, com os bancos e o caminho de pedestres',
  'praca-adhemar-barros':
    'Coreto da Praça Dr. Adhemar Pereira de Barros ao centro, com as árvores e os bancos à sombra em volta',
  'praca-monsenhor-pedro':
    'Praça Monsenhor Pedro do Vale Monteiro vista da Avenida Conselheiro Rodrigues Alves',
  'praca-braz-reale':
    'Praça Dr. Braz Reale com a fachada da Biblioteca Municipal ao fundo',
  'praca-sao-benedito':
    'Praça São Benedito com a igreja de frente para o largo e a rodoviária ao lado',
  'arte-no-quilombo':
    'Balcão do Arte no Quilombo com as peças de palha de bananeira e de milho expostas',
  'atelie-ditinho-joana':
    'Ditinho Joana esculpindo no ateliê, com as peças de madeira prontas em volta',
  'portal-cidade':
    'Portal da Cidade de São Bento do Sapucaí, com o Centro de Informação ao Turista aberto',
};

function montarPonto(local: Local): PontoDaPagina {
  const capa = local.fotos?.arquivos[0];
  const src = capa && `/assets/${local.fotos!.pasta}/${capa}`;

  return {
    id: local.id,
    nome: local.nome,
    resumo: local.resumo,
    categoria: local.cat,
    categoriaLabel: CATEGORIAS[local.cat].label,
    foto: ENQUADRAMENTOS[local.id] ?? `${local.nome}, em São Bento do Sapucaí`,
    ...(src ? { imagem: { src, alt: getAlt(src, local.nome) } } : {}),
  };
}

/**
 * Ordem em que os pontos entram na galeria, dentro de cada trecho.
 *
 * A ordem do JSON é a de cadastro, não a de quem chega: começar o Vale do Baú
 * pela portaria e o Centro pela Matriz é o que um anfitrião faria. Quem não
 * está listado aqui entra depois, na ordem do cadastro — acrescentar um lugar
 * ao JSON nunca deixa a galeria incompleta.
 */
const ORDEM: string[] = [
  'mona-pedra-bau',
  'pedra-bau',
  'bauzinho',
  'ana-chata',
  'rampa-voo-livre',
  'cachoeira-encontro',
  'cachoeira-toldi',
  'sabor-com-arte',
  'igreja-matriz',
  'ladeira-pirilampos',
  'casa-cultura-miguel-reale',
  'sbs-bebidas',
  'hot-stone',
  'mirante-cruzeiro',
  'capelinhas-mosaico',
  'igreja-sao-benedito',
  'igreja-rosario',
  'igreja-remedios',
  'igreja-santo-antonio',
  'portal-cidade',
  'praca-adhemar-barros',
  'praca-monsenhor-pedro',
  'praca-braz-reale',
  'praca-sao-benedito',
  'praca-bandeira',
  'campomax',
  'arte-no-quilombo',
  'atelie-ditinho-joana',
  'belvedere-serrano',
  'cachoeira-toboga',
  'pedra-balanca',
];

function ordenar(a: PontoDaPagina, b: PontoDaPagina): number {
  const posicao = (id: string) => {
    const indice = ORDEM.indexOf(id);

    return indice === -1 ? ORDEM.length : indice;
  };

  return posicao(a.id) - posicao(b.id);
}

/**
 * Os lugares, agrupados pelo trecho do município em que ficam.
 *
 * O agrupamento é o mesmo `zona` do cadastro, que o mapa já usa. Ele responde
 * à pergunta que a lista solta não responde: o que dá para juntar num dia só.
 */
export const GRUPOS_DE_PONTOS: GrupoDePontos[] = (
  [
    {
      id: 'bau',
      texto:
        'O complexo da Pedra do Baú, as duas cachoeiras do caminho e o restaurante que fica na volta da trilha. É o trecho das caminhadas, e o que se alcança sem passar pela cidade.',
      leitura: {
        href: '/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/',
        texto: 'As trilhas do complexo, uma a uma',
      },
    },
    {
      id: 'centro',
      texto:
        'Cabe numa tarde a pé: as igrejas, as seis praças, o casarão da Casa da Cultura, a escadaria de mosaico e o mirante que se alcança caminhando.',
      leitura: {
        href: '/blog/igreja-matriz-de-sao-bento-do-sapucai-historia-arquitetura-e-visitacao/',
        texto: 'A história da Igreja Matriz',
      },
    },
    {
      id: 'vale',
      texto:
        'A rota das estradas rurais, e ela vai para dois lados. A oeste, no rumo do Serrano e da divisa com Minas, é terra na maior parte do caminho — vá de carro preparado e evite dia de chuva forte. Ao norte, logo depois da cidade, fica o bairro do Quilombo, com o artesanato de palha e o ateliê de escultura.',
    },
  ] satisfies Omit<GrupoDePontos, 'label' | 'pontos'>[]
).map((grupo) => ({
  ...grupo,
  label: ZONAS[grupo.id],
  pontos: LUGARES.filter((local) => local.zona === grupo.id)
    .map(montarPonto)
    .sort(ordenar),
}));

/** Todos os pontos numa lista só, na ordem editorial dos grupos. */
export const PONTOS = GRUPOS_DE_PONTOS.flatMap((grupo) => grupo.pontos);
