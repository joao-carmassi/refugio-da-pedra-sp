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
 *
 * A ordem não é aleatória. Abre no planejamento ("dá para conhecer num fim de
 * semana"), passa pelo que se paga e pelo que é obrigatório, e fecha nas
 * perguntas sobre a ferramenta — impressão, aplicativo, origem das medidas.
 * É o percurso de quem está montando a viagem, não o do site.
 *
 * Quatro delas nasceram da pesquisa de intenção de 25/08/2026 sobre o que se
 * pergunta a ChatGPT e Gemini nos termos "mapa turístico" e "guia turístico
 * de São Bento do Sapucaí": mapa para impressão, mapa sem aplicativo, onde
 * contratar guia e roteiro de dois dias apareceram em ambas as plataformas. O
 * termo de cauda curta praticamente não tem volume no Google — quem procura
 * isso está perguntando a um modelo, e é por passagem citável, não por
 * palavra-chave, que esta página é encontrada.
 */
export const PERGUNTAS: Pergunta[] = [
  {
    pergunta: 'Dá para conhecer São Bento do Sapucaí em um fim de semana?',
    resposta:
      'Dá, dividindo por trecho — é assim que o mapa está organizado. O Vale do Baú toma um dia inteiro: a portaria do Monumento Natural, a trilha que você escolher e as cachoeiras do Encontro e do Toldi, todas do mesmo lado. O centro histórico se faz a pé em meio período, com as cinco igrejas, as quatro praças, a Ladeira dos Pirilampos, as Capelinhas de Mosaico e a Casa da Cultura. Sobra a rota rural, com a Cachoeira do Tobogã, o Belvedere do Serrano e a Pedra da Balança, que rende a segunda manhã.',
  },
  {
    pergunta: 'Preciso pagar para entrar no Complexo da Pedra do Baú?',
    resposta:
      'Depende da entrada. Pela portaria do Monumento Natural Estadual da Pedra do Baú paga-se taxa de conservação ambiental de R$ 18 por pessoa, em dinheiro, com isenção para maiores de 60 anos, crianças até 12 anos e moradores do município. O outro acesso, o estacionamento do Chico Bento, é particular e cobra por carro, não por pessoa, e não tem bilheteria do Monumento Natural — confirme o valor no local.',
  },
  {
    pergunta: 'Dá para subir a Pedra do Baú sem guia?',
    resposta:
      'Não. Guia credenciado é obrigatório, na proporção de um monitor a cada seis pessoas, e o agendamento tem de ser feito com pelo menos um dia de antecedência. Pela portaria do Monumento Natural são cerca de 4 km de trilha e 3 horas de subida; pelo estacionamento do Chico Bento, que fica bem mais perto de carro, são cerca de 5 km ida e volta e umas 5 horas, com mais subida. Nos dois casos o trecho final é uma via ferrata de degraus e grampos. A Pedra Ana Chata também exige agendamento prévio.',
    leitura: {
      href: '/blog/como-reservar-passeios-guiados-em-sao-bento-do-sapucai/',
      texto: 'Como reservar passeios guiados em São Bento',
    },
  },
  {
    // Preço fica de fora de propósito: varia por trilha e por tamanho de
    // grupo, e valor de terceiro que o cadastro não confere não entra na
    // página — a mesma regra que cala sobre a taxa das cachoeiras.
    pergunta: 'Onde contratar um guia para as trilhas de São Bento do Sapucaí?',
    resposta:
      'Com os condutores credenciados do município ou com as agências locais, sempre com pelo menos um dia de antecedência — no cume do Baú e na Pedra Ana Chata o guia é obrigatório, na proporção de um monitor a cada seis pessoas. O Centro de Informação ao Turista, que funciona no Portal da Cidade e está marcado no mapa, é o balcão oficial para essa pergunta, e o telefone dele aparece na ficha do ponto. Esta página não publica preço de guia: ele varia por trilha e por tamanho do grupo, e valor de terceiro que não dá para conferir não entra no cadastro.',
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
    // TODO(proprietário): confirmar se há cobrança na entrada nova da
    // Cachoeira do Encontro, pela Estrada da Ana Chata. Relatos de 2024 e 2026
    // falam em acesso gratuito, mas nenhuma fonte oficial descreve esse acesso
    // — o portal do município sequer tem página da cachoeira — e a trilha
    // atravessa terreno particular, onde cobrança aparece e some sem aviso.
    // Enquanto não houver confirmação, a resposta manda perguntar no local.
    pergunta: 'As cachoeiras cobram entrada?',
    resposta:
      'A Cachoeira do Tobogã tem acesso gratuito. A Cachoeira do Encontro mudou de entrada: não se passa mais por dentro da Cachoeira dos Amores, e sim pela Estrada da Ana Chata, de onde sai uma trilha que desce por um terreno particular. Pergunte no local se há taxa — nenhuma fonte oficial cobre esse acesso.',
  },
  {
    // TODO(proprietário): confirmar com o Centro de Informação ao Turista se
    // há folheto impresso disponível e em que horário atendem. Enquanto não
    // houver confirmação, a resposta manda ligar antes em vez de prometer.
    pergunta: 'Existe um mapa turístico de São Bento do Sapucaí para imprimir?',
    resposta:
      'Este não tem versão para impressão: é um mapa de tela, feito para abrir no celular durante a viagem, com a ficha de cada lugar e a rota de carro a um toque. Material impresso do município sai do Centro de Informação ao Turista, que funciona no Portal da Cidade, na entrada da cidade — vale ligar antes para saber o que há disponível.',
  },
  {
    pergunta: 'Preciso baixar algum aplicativo para usar o mapa?',
    resposta:
      'Não. O mapa abre no navegador do celular ou do computador, sem instalar nada, sem criar conta e sem pagar. Precisa de internet para carregar. Depois disso, o botão Como chegar entrega a rota para o Google Maps, que é onde a navegação passo a passo acontece.',
  },
  {
    pergunta: 'As distâncias do mapa são medidas a partir de onde?',
    resposta:
      'Do centro de São Bento do Sapucaí, na praça da matriz — o lugar de onde qualquer morador diria que se sai. Medir tudo do mesmo ponto deixa os números comparáveis entre si, e a conta é por estrada, não em linha reta. A Cachoeira do Encontro fica a 7,6 km do centro, e o Refúgio da Pedra SP, a pousada que mantém este mapa, a 10 km. No Complexo da Pedra do Baú o número é o do estacionamento onde a trilha começa, e são dois: o cume do Baú e a Pedra Ana Chata sobem pelo estacionamento do Chico Bento, a 8,3 km, e o Bauzinho e a rampa de voo livre entram pela portaria do Monumento Natural, a 22,4 km, do outro lado do maciço. Onde o carro não chega ao ponto, a ficha diz onde ele para e quanto sobra de caminhada. Quem se hospeda no Refúgio abre o mapa por um link próprio, que refaz todas as contas a partir da pousada.',
  },
];
