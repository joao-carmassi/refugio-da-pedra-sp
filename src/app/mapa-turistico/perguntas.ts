export interface Pergunta {
  pergunta: string;
  /**
   * Texto exato do parágrafo visível na página. É o mesmo string que vai para
   * o `FAQPage` do JSON-LD — daí ser texto puro, sem JSX: markup de FAQ que
   * não corresponde ao que está escrito na tela é markup enganoso, e o
   * Google trata como tal.
   */
  resposta: string;
  /** Leitura complementar, renderizada como uma linha depois da resposta. */
  leitura?: { href: string; texto: string };
}

/**
 * Perguntas frequentes do mapa.
 *
 * Toda resposta sai de `src/data/mapa-turistico.json` e de `rotas.json`. Não
 * há pergunta sobre preço de hospedagem, telefone de terceiro nem horário que
 * o cadastro não tenha conferido: o mapa cala onde a fonte é duvidosa, e a
 * página que fala do mapa segue a mesma regra.
 */
export const PERGUNTAS: Pergunta[] = [
  {
    pergunta: 'Preciso pagar para entrar no Complexo da Pedra do Baú?',
    resposta:
      'Sim. O Monumento Natural Estadual da Pedra do Baú cobra taxa de conservação ambiental de R$ 18 por pessoa, paga em dinheiro na portaria. Maiores de 60 anos, crianças até 12 anos e moradores do município são isentos.',
  },
  {
    pergunta: 'Dá para subir a Pedra do Baú sem guia?',
    resposta:
      'Não. Guia credenciado é obrigatório, na proporção de um monitor a cada seis pessoas, e o agendamento tem de ser feito com pelo menos um dia de antecedência. São cerca de 4 km de trilha e 3 horas de subida, com via ferrata de degraus e grampos no trecho final. A Pedra Ana Chata também exige agendamento prévio.',
    leitura: {
      href: '/blog/como-reservar-passeios-guiados-em-sao-bento-do-sapucai/',
      texto: 'Como reservar passeios guiados em São Bento',
    },
  },
  {
    pergunta: 'Qual é o horário do Monumento Natural da Pedra do Baú?',
    resposta:
      'Aberto todos os dias, das 9h às 18h. A entrada é permitida até as 18h e a permanência vai até 18h30. A subida ao cume do Baú só pode começar até as 14h, e o acesso ao cume do Bauzinho fecha às 17h30. Depois desse horário ainda se chega ao Mirante do Caramuru.',
  },
  {
    pergunta: 'Existe trilha fácil no complexo?',
    resposta:
      'A Pedra do Bauzinho. São cerca de 30 minutos de caminhada a partir da portaria, nível fácil, sem via ferrata e sem agendamento. O cume fica a 1.760 m, e é a saída indicada para quem quer a vista sem encarar a subida do Baú.',
  },
  {
    pergunta: 'Posso levar meu cachorro?',
    resposta:
      'No Monumento Natural, não: animais de estimação não entram na unidade de conservação, com uma exceção, que é o trecho até o Mirante do Caramuru, onde fica a rampa de voo livre. Fora dela depende de cada lugar — o Refúgio da Pedra SP, a pousada que mantém este mapa, aceita pet na maior parte das acomodações.',
  },
  {
    // TODO(proprietário): confirmar a taxa atual da Cachoeira dos Amores, que
    // é o que se paga para chegar à Cachoeira do Encontro. O roteiro oficial
    // publica R$ 10 e relatos de 2024 a 2026 falam em R$ 20 a R$ 25 — sem
    // desempate, a resposta não publica valor nenhum.
    pergunta: 'As cachoeiras cobram entrada?',
    resposta:
      'A Cachoeira do Tobogã tem acesso gratuito. Para a Cachoeira do Encontro entra-se por dentro da Cachoeira dos Amores, e a taxa cobrada é a dela — confirme o valor no local, porque as fontes públicas divergem.',
  },
  {
    pergunta: 'As distâncias do mapa são medidas a partir de onde?',
    resposta:
      'De um ponto fixo no pé da serra, o Refúgio da Pedra SP, que é a pousada que mantém este mapa. Medir tudo do mesmo lugar deixa os números comparáveis entre si, e a conta é por estrada, não em linha reta. A Cachoeira do Encontro fica a 3,5 km desse ponto, o centro da cidade a 10 km, a portaria do Complexo da Pedra do Baú a 17,3 km e o cume do Baú a 19 km de carro mais o trecho final a pé.',
  },
];
