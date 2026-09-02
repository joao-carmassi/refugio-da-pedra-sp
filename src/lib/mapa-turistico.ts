import {
  Briefcase,
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
} from "lucide-react";
import Fuse from "fuse.js";
import locaisJson from "@/data/mapa-turistico.json";
import centroJson from "@/data/centro.json";
import rotasJson from "@/data/rotas.json";

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
 *      Belvedere do Serrano (um GPS só), Capelinhas de Mosaico,
 *      Igreja N. Sra. do Rosário,
 *      Praça Dr. Braz Reale (o logradouro não está no OSM; o pino é o ponto
 *      médio entre a Biblioteca Municipal e os Correios, que têm a praça como
 *      endereço), Portal da Cidade, Arte no Quilombo (não está no OSM; a
 *      coordenada é a do pino do Google republicado pelo portal de turismo do
 *      Estado, sem cruzamento independente) e Bar SBS Bebidas (também fora do
 *      OSM; a coordenada é a geocodificação do endereço pelo Tripadvisor, que
 *      cai na rua e na quadra certas, a 40 m do coreto — mas a foto de fachada
 *      recebida em 02/09/2026 mostra uma via larga com faixa pintada, canteiro
 *      e prédios do outro lado, e nenhum coreto no quadro; confirmar o
 *      endereço e a frase "de frente para o coreto" da descrição) e Letreiro (o pino é o
 *      da Praça General Marcondes Salgado, que é onde as letras estão — falta
 *      só o ponto delas dentro do gramado, e por isso os dois pinos hoje se
 *      sobrepõem). Remover a marca ao
 *      confirmar o ponto exato. O Ateliê Ditinho Joana saiu da lista porque o proprietário
 *      confirmou o pino, mas segue sem logradouro publicado: nenhuma fonte dá
 *      rua e número, e o cadastro traz só o bairro.
 *   2. `aConferir` da Igreja N. Sra. do Rosário. Dois templos do Centro estão
 *      no OpenStreetMap sem nome: um na Av. Conselheiro Rodrigues Alves e
 *      outro junto à Praça General Marcondes Salgado. Foram atribuídos a Santo
 *      Antônio e ao Rosário por bater com o logradouro publicado, e o pino de
 *      Santo Antônio saiu do cadastro em 02/09/2026, por decisão do
 *      proprietário — sobrou o Rosário.
 *      A atribuição dele tem prova própria: a fachada de
 *      `mapa/igreja-rosario/igreja-rosario-1.webp` traz "NSR 1934" escrito no
 *      frontão, a foto é do templo junto à Praça General Marcondes Salgado, e
 *      o ano do cadastro confere. O que segurava o `aConferir` era depender do
 *      mesmo raciocínio que atribuía Santo Antônio ao outro templo; sem esse
 *      pino, a dúvida some e a marca pode cair — falta só alguém da região
 *      dizer que sim.
 *      Fica registrado, para ninguém refazer a pesquisa: a ficha "Igreja Santo
 *      Antônio" do Google aponta -22.691902, -45.7330289, uns 530 m abaixo do
 *      pino que o cadastro tinha, ainda na Avenida Conselheiro Rodrigues
 *      Alves — ou seja, o templo da Praça Santo Antônio, e não o da Av.
 *      Conselheiro Rodrigues Alves que o cadastro apontava.
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
 *
 *      O Bar SBS Bebidas, a Hot Stone e a CAMPOMAX ficaram em branco por muito
 *      tempo porque as fontes secundárias (Instagram, Tripadvisor, portal de
 *      turismo) se contradiziam. O que desempatou foi ler a tabela completa da
 *      ficha do Google de cada um — a ficha gerida pelo próprio dono, que é a
 *      melhor fonte pública que existe para comércio, e não o resumo que a
 *      busca mostra. Duas ressalvas continuam abertas: a ficha do bar traz um
 *      segundo conjunto, o da cozinha, que fecha às 23h no domingo em vez de
 *      meia-noite, e a Hot Stone tem uma ficha separada de entrega com grade
 *      própria. As duas descrições dizem isso em português.
 *
 *      O Bauzinho recebeu o horário da portaria, como o proprietário supôs:
 *      o site oficial do Monumento Natural e o Guia de Áreas Protegidas do
 *      Estado dizem 9h às 18h todos os dias; o portal municipal (São Bento
 *      TUR) diz 9h às 17h. Duas fontes oficiais contra uma — mas a divergência
 *      fica registrada aqui, e uma ligação para a portaria a encerraria.
 *
 *      Seguem em branco de propósito, e cada um por um motivo diferente:
 *      - Cume do Baú e Pedra Ana Chata. O dado existe e as fontes oficiais
 *        concordam, mas não é horário de funcionamento: é janela de largada
 *        (9h às 14h pela portaria, 7h às 14h pelo Chico Bento, permanência
 *        até 17h, via ferrata só até 15h). Cadastrar faria o selo dizer
 *        "fechado" às 15h para quem está legitimamente na trilha até as 17h.
 *        Levado ao proprietário em 31/08/2026 com a pesquisa em mãos, e a
 *        resposta foi não cadastrar. Não é pendência: é decisão. A pesquisa
 *        fica registrada aqui para ninguém refazê-la, não para reabrir o
 *        assunto.
 *      - Portal da Cidade. O Centro de Informação ao Turista quase certamente
 *        tem horário, mas ninguém o publica: a carta de serviços da
 *        Prefeitura traz só local e telefone. O "seg a sex, 8h às 17h" que
 *        aparece na página da Secretaria de Turismo é do prédio dela, na Rua
 *        Doutor Gama Rodrigues, e não do balcão no Portal. O proprietário
 *        decidiu, em 31/08/2026, não ligar atrás do dado: fica sem horário.
 *      - Cachoeira do Toldi e Cachoeira do Encontro. Nenhuma fonte publica
 *        horário — o mesmo vazio que o item 3 descreve para a taxa. Também
 *        fechado com o proprietário em 31/08/2026: ficam sem horário.
 *      - As três igrejas que não são a Matriz. A Diocese de Taubaté publica
 *        a grade de missa só da Matriz; São Benedito, Rosário e Remédios são
 *        capelas da mesma paróquia e não têm grade própria publicada.
 *      - Praças, mirantes, o letreiro, a Ladeira dos Pirilampos, as
 *        Capelinhas de Mosaico, a Pedra da Balança e a Cachoeira do Tobogã.
 *        Onde o Google Maps diz "atendimento 24 horas" isso é valor-padrão de
 *        diretório para logradouro público, não horário declarado por um
 *        gestor. Campo vazio significa "sem horário publicado", que é
 *        diferente de "aberto sempre" — cadastrar as 24h seria afirmar o que
 *        ninguém afirmou.
 *   5. `nota` / `avaliacoes` — só o Refúgio tem, vindo do próprio Google
 *      Business Profile. Preencher os demais só com número real; a estrela
 *      some enquanto não houver. O que existe e não entrou: o Sabor com Arte
 *      publica 4,3 com 511 avaliações no Tripadvisor (e 4,5 numa outra faixa
 *      do próprio site, que se contradiz), e o Bar SBS Bebidas tem 4,7 no
 *      Tripadvisor com três avaliações. Nenhum dos dois é Google, e três
 *      avaliações não são média — pedir os números do Business Profile. A Hot
 *      Stone e a CAMPOMAX entraram sem nota pela mesma regra.
 *
 *      O endereço dos dois saiu do cadastro federal (CNPJ
 *      37.196.231/0001-22 e 65.204.731/0001-02), e foi ele que desempatou a
 *      Hot Stone: as fontes públicas se dividiam entre o nº 32 e o nº 60 da
 *      Avenida Conselheiro Rodrigues Alves, e a Receita diz 32.
 *
 *      Nenhum dos dois telefones é o do cadastro, e é de propósito: a Receita
 *      guarda o número com que a empresa se registrou, que não costuma ser o
 *      que ela atende. O da Hot Stone é o que o proprietário confirmou — é o
 *      WhatsApp do pedido, e não o (12) 99755-2244 que a Receita traz. O da
 *      CAMPOMAX é o do site da própria empresa, e não o (12) 9112-4409 do
 *      cadastro.
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
 *        Boi Quim Costa, Espaço de Leitura e Arte Eugênia Sereno, Campo Escola
 *        e Praça Presidente João Goulart: existem e estavam cadastrados com
 *        dado conferido, mas saíram do mapa a pedido. Voltam sem pesquisa
 *        nova — o histórico do Git tem o cadastro inteiro. A Praça da Bandeira
 *        e a Praça São Benedito saíram depois, pelo mesmo caminho.
 *      - No lugar das duas entrou a Praça General Marcondes Salgado, que é
 *        onde estão o marco zero, o espelho d'água e o letreiro — e que o
 *        cadastro já citava desde o começo, como endereço da Igreja do
 *        Rosário, sem nunca ter tido pino próprio. A coordenada é o pino do
 *        Google indicado pelo proprietário.
 *   7. Nomes corrigidos em relação ao pedido original: "Pedra Serra da
 *      Balança" são duas coisas — a Pedra da Balança (o cume, que entrou) e a
 *      Serra da Balança (crista e roteiro tropeiro até Gonçalves). "Pedreira
 *      Campo Escola" não existe: o setor de escalada se chama só Campo Escola
 *      — que depois saiu do mapa a pedido, mas a correção fica registrada
 *      porque o nome errado tende a voltar. E o "Mirante do Toldi" não é um ponto à parte: o nome oficial
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
 *   9. As duas entradas do Complexo do Baú. O cadastro diz que o cume do Baú
 *      e a Ana Chata entram pelo estacionamento do Chico Bento
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
 *  10. Onde fica a porta da CAMPOMAX. Aqui o problema é o inverso do item 1: a
 *      coordenada é boa — é o pino que a própria empresa publica no Google —, e
 *      o que não fecha é o endereço. O cadastro federal declara Rua Doutor
 *      Rubião Júnior, 122, e o pino cai a uns 80 m dela, mais perto da
 *      Travessa Nossa Senhora do Rosário. Não levou `aConferir` de propósito:
 *      a ressalva que essa marca imprime na ficha fala em horário de visitação
 *      e em subir a serra, e nenhuma das duas coisas se aplica a um escritório
 *      no centro. A descrição avisa em português. Confirmar qual dos dois
 *      endereços é a porta e acertar o que estiver errado.
 *  11. O letreiro estava dentro da ficha errada. `igreja-rosario-1.webp` e
 *      `-2.webp` mostravam as letras coloridas do nome da cidade, e não a
 *      igreja — o `alt` das duas já dizia isso em voz alta e ninguém tinha
 *      reparado. As duas passaram para `mapa/letreiro/`, o Rosário ganhou três
 *      fotos reais da igreja e o letreiro virou ponto próprio a pedido do
 *      proprietário. Fica o aviso: quando o `alt` e a pasta discordarem, quem
 *      costuma estar certo é o `alt`, porque ele foi escrito olhando a imagem.
 *  12. As duas fotos da Pedra da Balança vieram de uma pasta rotulada "Serra
 *      da Balança", e o item 7 explica por que os dois nomes não são a mesma
 *      coisa. `pedra-balanca-1.webp` mostra um cume pontiagudo que encaixa na
 *      descrição; a `-2` é uma vista de crista e pasto que serve às duas.
 *      Conferir se a primeira é mesmo o cume — se não for, ela é ilustração de
 *      serra e não retrato do ponto.
 *  13. A fachada da Hot Stone contradiz o nome do ponto. O letreiro do
 *      prédio, em `hot-stone-1.webp`, diz "HOT STONE Pizzaria & Choperia", e
 *      o cadastro registra "Hot Stone Pizzaria & Hambúrgueria". As duas
 *      coisas são verdade — a casa faz pizza, hambúrguer e chope, e a
 *      `descricao` já diz isso —, mas só uma está pintada na parede. O nome
 *      do cadastro ficou como estava porque é por ele que a casa aparece na
 *      busca; confirmar com o proprietário qual dos dois ele quer no mapa.
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
  turismo: { label: "Turismo", cor: "#2f6b4f", icone: Camera },
  /**
   * Igreja, museu e casa de cultura saíram de `turismo` porque São Bento tem
   * dez deles: misturados com mirante e cachoeira, o chip "Turismo" virava a
   * lista inteira e deixava de filtrar. O cinza-ardósia é o único tom
   * quase-neutro da paleta — é a cor da taipa e da pedra, e não briga com o
   * azul de `hospedagem`, que só marca o próprio Refúgio.
   */
  cultura: { label: "Cultura", cor: "#4f5d6b", icone: Landmark },
  restaurantes: {
    label: "Restaurantes",
    cor: "#b4523a",
    icone: UtensilsCrossed,
  },
  cafes: { label: "Cafés", cor: "#8a6b3b", icone: Coffee },
  hospedagem: { label: "Hospedagem", cor: "#4a6fa5", icone: TentTree },
  compras: { label: "Compras", cor: "#7a5a8c", icone: ShoppingBag },
  aventura: { label: "Aventura", cor: "#2e7d8a", icone: Mountain },
  experiencias: { label: "Experiências", cor: "#9a4a5f", icone: Compass },
  /**
   * O eixo que não é passeio.
   *
   * As oito categorias acima respondem "o que fazer no fim de semana". Esta
   * responde a outra pergunta, que quem sobe a serra acaba fazendo: quem
   * resolve alguma coisa aqui. Ela nasceu com a imobiliária do centro —
   * visitante que volta muito uma hora procura terreno — e é onde entra o
   * serviço que o hóspede precisa achar sem sair do mapa.
   *
   * Mantê-la separada de `compras` é o que impede as duas de mentirem:
   * `compras` é o artesanato de São Bento, palha de bananeira e escultura em
   * madeira, e uma corretora de imóveis no meio disso desmancharia o filtro
   * para os dois lados.
   *
   * O oliva é o único vão que sobrava na paleta: entre o marrom dos cafés
   * (36°) e o verde do turismo (150°) não havia nada, e é terra lavrada, que
   * convive com a base em areia sem disputar com o verde de mato.
   */
  servicos: { label: "Serviços", cor: "#6d7f3c", icone: Briefcase },
} as const satisfies Record<
  string,
  { label: string; cor: string; icone: LucideIcon }
>;

export type CategoriaId = keyof typeof CATEGORIAS;

/** `todos` não é uma categoria de dado — é o estado "sem filtro" dos chips. */
export const FILTRO_TODOS = "todos" as const;
export type FiltroId = typeof FILTRO_TODOS | CategoriaId;

/** Trecho do vale onde cada lugar fica, usado para descrevê-lo por perto. */
export const ZONAS = {
  bau: "Vale do Baú",
  centro: "Centro",
  vale: "Rota rural",
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
   * ficha. Já o estacionamento do Chico Bento, por onde sobem o cume do Baú e
   * a Ana Chata, é negócio de terceiro: dar pino a ele seria
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
   * Parceiro do plano Vitrine: tem página própria em
   * `/mapa-turistico/<id>/`. É o que separa o Vitrine do Destaque — no mapa
   * os dois são idênticos, e o que o Vitrine paga a mais é a página.
   */
  vitrine?: boolean;
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
export type OrigemId = "refugio" | "centro";

export interface Origem {
  id: OrigemId;
  nome: string;
  lat: number;
  lng: number;
}

export const ORIGEM_REFUGIO: Origem = {
  id: "refugio",
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
  id: "centro",
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
  { id: FILTRO_TODOS, label: "Todos", icone: LayoutGrid },
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

  return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
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
  if (ehOrigem(local, origem)) return "Ponto de partida";

  const rota = getRota(local, origem);

  if (!rota) {
    const km = getDistanciaKm(local, origem);

    return km < 1
      ? `${Math.round(km * 1000)} m em linha reta`
      : `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km em linha reta`;
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
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
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
    { name: "nome", weight: 0.7 },
    { name: "categoria", weight: 0.3 },
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
export function filtrarLocais(filtro: FiltroId, termo: string): Local[] {
  const scores = pontuar(termo);

  return LOCAIS.filter((local) => {
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

/**
 * Fuso do vale. O hóspede pode abrir o mapa de qualquer lugar do mundo, e
 * "Aberto agora" só significa alguma coisa no relógio de São Bento.
 */
const FUSO = "America/Sao_Paulo";

/** Dias como o cadastro os escreve, na ordem de `Date#getDay`. */
const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

/** Nomes do `Intl` em `en-US`, na mesma ordem. */
const DIAS_INTL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DIA = 24 * 60;
const SEMANA = 7 * DIA;

/** Uma abertura, em minutos desde a meia-noite de domingo. */
interface Faixa {
  abre: number;
  /** Sempre maior que `abre`; passa de `SEMANA` quando a faixa vira o domingo. */
  fecha: number;
}

/** `Seg a qui`, `sáb e dom`, `dom`, `Todos os dias` — nada além disso. */
function lerDias(texto: string): number[] | null {
  const t = semAcento(texto).trim();

  if (t === "todos os dias") return [0, 1, 2, 3, 4, 5, 6];

  const intervalo = t.match(/^(\w+) a (\w+)$/);

  if (intervalo) {
    const de = DIAS.indexOf(intervalo[1]);
    const ate = DIAS.indexOf(intervalo[2]);

    if (de < 0 || ate < 0) return null;

    // Anda em círculo porque "sex a dom" atravessa o fim da semana.
    const dias: number[] = [];

    for (let d = de; dias.length < 7; d = (d + 1) % 7) {
      dias.push(d);
      if (d === ate) return dias;
    }

    return null;
  }

  const lista = t.split(/\s+e\s+/).map((d) => DIAS.indexOf(d.trim()));

  return lista.some((d) => d < 0) ? null : lista;
}

/** `9h`, `11h30`. Devolve minutos desde a meia-noite. */
function lerHora(texto: string): number | null {
  const m = texto.trim().match(/^(\d{1,2})h(\d{2})?$/);

  if (!m) return null;

  const hora = Number(m[1]);
  const minuto = Number(m[2] ?? 0);

  if (hora > 24 || minuto > 59) return null;

  return hora * 60 + minuto;
}

/**
 * Traduz o `horario` do cadastro para faixas de relógio.
 *
 * Devolve `null` na primeira coisa que não entende, e é de propósito: o campo
 * é texto livre escrito à mão, e um palpite sobre um texto que o parser não
 * reconhece vira um "Aberto agora" falso — que é exatamente o erro que manda
 * o hóspede subir a serra à toa. Sem leitura certa, sem selo; o texto do
 * horário continua aparecendo como está. É o que acontece com o cartão do
 * próprio Refúgio, cujo campo traz check-in e check-out, e não funcionamento.
 */
function lerHorario(horario: string | undefined): Faixa[] | null {
  if (!horario) return null;

  const faixas: Faixa[] = [];

  for (const trecho of horario.split("·")) {
    const corte = trecho.indexOf(",");

    if (corte < 0) return null;

    const dias = lerDias(trecho.slice(0, corte));

    if (!dias?.length) return null;

    for (const parte of trecho.slice(corte + 1).split(/\s+e\s+/)) {
      const [de, ate] = parte.split(/\s+às\s+/);
      const abre = lerHora(de ?? "");
      const fecha = lerHora(ate ?? "");

      if (abre === null || fecha === null) return null;

      for (const dia of dias) {
        const base = dia * DIA;

        // Fechar antes de abrir é a madrugada do dia seguinte, não um erro.
        faixas.push({
          abre: base + abre,
          fecha: base + (fecha > abre ? fecha : fecha + DIA),
        });
      }
    }
  }

  return faixas.length ? faixas : null;
}

/** Minuto da semana, no fuso do vale, contado a partir da meia-noite de domingo. */
function minutoDaSemana(quando: Date): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(quando);

  const valor = (tipo: string) =>
    partes.find((p) => p.type === tipo)?.value ?? "";

  const dia = DIAS_INTL.indexOf(valor("weekday"));

  // `hour12: false` devolve 24 à meia-noite em alguns motores.
  const hora = Number(valor("hour")) % 24;

  return (dia < 0 ? 0 : dia) * DIA + hora * 60 + Number(valor("minute"));
}

/**
 * Se o lugar está aberto neste minuto. `null` quando não dá para afirmar —
 * ver o comentário de `lerHorario`.
 */
export function estaAberto(
  local: Local,
  quando: Date = new Date(),
): boolean | null {
  const faixas = lerHorario(local.horario);

  if (!faixas) return null;

  const agora = minutoDaSemana(quando);

  return faixas.some(
    ({ abre, fecha }) =>
      (agora >= abre && agora < fecha) ||
      // A faixa que vira o domingo ainda vale na madrugada de domingo.
      (fecha > SEMANA && agora + SEMANA >= abre && agora + SEMANA < fecha),
  );
}

/**
 * O horário quebrado em uma linha por faixa de dias. Numa linha só, o campo
 * do cadastro fica longo demais para ser lido de relance — e é justamente de
 * relance que ele é lido. A inicial sobe porque cada trecho vira frase.
 */
export function linhasHorario(horario: string): string[] {
  return horario
    .split("·")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t[0].toUpperCase() + t.slice(1));
}

/** Códigos de dia do Schema.org, na ordem de `DIAS`. */
const DIAS_SCHEMA = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** `1080` vira `18:00`; `1440` vira `24:00`, que o ISO 8601 aceita. */
function relogio(minutos: number): string {
  const hora = Math.floor(minutos / 60);
  const minuto = minutos % 60;

  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
}

/**
 * O `horario` do cadastro traduzido para o `openingHours` do Schema.org.
 *
 * O campo do cadastro é português corrido — `Seg a qui, 18h às 23h30 · sex a
 * dom, 18h às 0h` —, escrito para quem lê o cartão. O `openingHours` não é
 * texto livre: a especificação pede código de dia em inglês abreviado e hora
 * em 24h, `Mo-Th 18:00-23:30`. Publicar a frase em português naquele campo
 * não é um horário "mais ou menos certo" para o buscador; é um valor que ele
 * não consegue ler, e o rich result sai sem horário nenhum ou com o texto
 * cru. Daí a tradução aqui, a partir do mesmo parser que alimenta o selo de
 * "Aberto agora" — as duas leituras não têm como divergir.
 *
 * Devolve `undefined` no que o parser não entende, e quem chama omite o campo.
 * Esse é o ponto: um campo ausente diz "não sei"; um campo com frase solta diz
 * uma coisa errada com cara de dado estruturado.
 *
 * Fechamento à meia-noite sai como `24:00` do mesmo dia, e não como `00:00` do
 * seguinte — `18:00-00:00` seria um intervalo negativo.
 */
export function horarioSchema(
  horario: string | undefined,
): string[] | undefined {
  const faixas = lerHorario(horario);

  if (!faixas) return undefined;

  /*
   * As faixas saem do parser já expandidas por dia — `Seg a qui` vira quatro.
   * Agrupar de volta por par de horas devolve `Mo-Th 18:00-23:30` no lugar de
   * quatro linhas idênticas, que é o que a especificação espera e o que o
   * cadastro de fato disse.
   */
  const porIntervalo = new Map<string, number[]>();

  for (const { abre, fecha } of faixas) {
    const dia = Math.floor(abre / DIA);
    const chave = `${relogio(abre % DIA)}-${relogio(fecha - dia * DIA)}`;

    porIntervalo.set(chave, [...(porIntervalo.get(chave) ?? []), dia]);
  }

  return [...porIntervalo].map(([intervalo, dias]) => {
    /*
     * A ordem vem do parser, não do `sort`, e isso importa: `sex a dom` sai
     * como `[5, 6, 0]`, contíguo dando a volta na semana. Ordenado viraria
     * `[0, 5, 6]` e a volta se perderia — sairia `Su,Fr,Sa` em vez de
     * `Fr-Su`. Ambos são válidos, mas só um se lê.
     */
    const contiguo = dias.every(
      (d, i) => i === 0 || d === (dias[i - 1] + 1) % 7,
    );
    const dia = (d: number) => DIAS_SCHEMA[d];

    if (dias.length === 1) return `${dia(dias[0])} ${intervalo}`;

    if (contiguo) {
      return `${dia(dias[0])}-${dia(dias[dias.length - 1])} ${intervalo}`;
    }

    // Fora de sequência: lista explícita, que a especificação também aceita.
    return `${dias.map(dia).join(",")} ${intervalo}`;
  });
}
