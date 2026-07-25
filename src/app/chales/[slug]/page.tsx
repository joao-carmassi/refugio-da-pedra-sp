import chales from '@/data/chales.json';
import slugify from 'slugify';
import ChaleContent, { type ChaleDescription } from './chale-content';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const descriptions: Record<string, ChaleDescription> = {
  colmeia: {
    title: 'Um domo para dois, sem barulho e sem pressa',
    paragraphs: [
      'O Domo Colmeia é a menor e a mais recolhida das nossas acomodações: 30 m² de suíte única, cama Queen e uma abertura grande apontada para a montanha. Quem escolhe o domo normalmente quer o oposto de um hotel — ninguém circulando do lado de fora, nenhum corredor, nenhum horário a cumprir.',
      'O deck é onde o domo acontece de verdade. É de lá que se acompanha o fim de tarde na Mantiqueira, com o céu mudando de cor atrás das montanhas, e é lá que a maioria dos hóspedes toma o café da manhã quando o tempo colabora.',
      'Dentro, o essencial resolvido: TV Smart para as noites de chuva, micro-ondas e frigobar para não precisar sair por causa de uma bebida gelada ou de um lanche fora de hora.',
    ],
    idealPara:
      'Casais em lua de mel, aniversários e fins de semana a dois com privacidade total.',
    politicaPet:
      'O Colmeia é a única acomodação do Refúgio que não recebe animais. Se você viaja com o seu, a Cabana Ametista e os três chalés são pet friendly.',
  },
  ametista: {
    title: 'A cabana da lareira',
    paragraphs: [
      'A Cabana Ametista existe por causa de uma coisa: a lareira. Não é aquecedor imitando fogo — é lenha, fumaça e o barulho da madeira estalando enquanto a temperatura cai lá fora. Em uma suíte de 30 m² com cama Queen, isso muda completamente o clima da noite.',
      'Para os dias em que o fogo não é necessário, a cabana também tem aquecedor, TV Smart, micro-ondas e frigobar. A varanda privativa fica voltada para as montanhas e é onde a maioria dos casais termina a noite, depois que o fogo baixa.',
    ],
    destaques: [
      'Lareira a lenha, além de aquecedor elétrico',
      'Varanda privativa voltada para a serra',
      'Suíte de 30 m² com cama Queen',
    ],
    idealPara:
      'Casais que viajam no inverno e querem o ritual da lareira — com o cachorro junto, se for o caso.',
    politicaPet:
      'Pets são bem-vindos na Ametista, inclusive na varanda e ao lado da lareira.',
  },
  jade: {
    title: 'O chalé de quem prefere cozinhar',
    paragraphs: [
      'Com 32 m², o Chalé Jade é a maior suíte do Refúgio, e o que o diferencia não é o tamanho: é a sala integrada com cozinha equipada. Dá para fazer as compras na cidade, voltar com o que encontrou na feira e cozinhar sem improviso.',
      'Isso muda o ritmo da estadia. Em vez de organizar o dia em função do horário do restaurante, o casal decide na hora se janta em casa ou sai. Para viagens mais longas, é a diferença entre visitar São Bento do Sapucaí e morar nela por alguns dias.',
      'A suíte tem cama de casal, TV Smart e aquecedor para as madrugadas frias. O deck privativo se abre para as montanhas — é o lugar natural para o café da manhã e para o almoço que saiu da própria cozinha.',
    ],
    destaques: [
      'Sala integrada com cozinha equipada',
      'A maior suíte do Refúgio, com 32 m²',
      'Deck privativo com vista para as montanhas',
    ],
    idealPara:
      'Casais em estadias mais longas, que fazem das refeições parte do passeio.',
    politicaPet:
      'O Jade aceita pets, e a sala integrada dá espaço de sobra para a caminha do seu.',
  },
  esmeralda: {
    title: 'Lareira e cozinha na mesma acomodação',
    paragraphs: [
      'O Chalé Esmeralda é o único que reúne lareira e cozinha equipada ao mesmo tempo. Some a isso o mezanino e as duas camas de casal e você tem a acomodação mais completa do Refúgio, para até três pessoas.',
      'O mezanino resolve o problema clássico de quem viaja em grupo: acomodar mais gente sem que ninguém durma na sala. Costuma ficar com as crianças ou com o terceiro hóspede, enquanto a suíte fica para o casal.',
      'A varanda é espaçosa o bastante para todo mundo caber ao mesmo tempo, com a Serra da Mantiqueira na frente. Depois de um dia de trilha, é onde o grupo se junta — e, quando esfria, a noite continua dentro, ao redor da lareira.',
    ],
    destaques: [
      'Lareira e cozinha equipada na mesma unidade',
      'Mezanino e duas camas de casal, para até 3 pessoas',
      'Varanda ampla com vista para a serra',
    ],
    idealPara:
      'Famílias e grupos de até 3 pessoas que não querem abrir mão nem da lareira nem da cozinha.',
    politicaPet:
      'Pets entram na Esmeralda sem problema — com suíte, sala e mezanino, é a unidade com mais ambientes para um cachorro circular.',
  },
  turmalina: {
    title: 'Espaço para o grupo, sem complicação',
    paragraphs: [
      'O Chalé Turmalina tem a mesma capacidade da Esmeralda — até três pessoas, duas camas de casal e mezanino —, só que com um perfil mais direto: sem lareira, com aquecedor dando conta do frio da montanha.',
      'A sala integrada com cozinha equipada é o centro da casa. Grupos que passam o dia na trilha costumam voltar, cozinhar algo simples e comer todo mundo junto, sem precisar descer para a cidade de novo.',
      'A varanda ampla é o ponto de encontro do fim de tarde, com as montanhas da Mantiqueira na frente. Pelo mezanino, é a escolha mais prática para quem viaja com criança.',
    ],
    idealPara:
      'Grupos e famílias de até 3 pessoas que priorizam espaço, cozinha própria e praticidade.',
    politicaPet:
      'A Turmalina também recebe pets; a varanda costuma virar o lugar preferido deles no fim da tarde.',
  },
};

async function ChalePage({ params }: Props): Promise<React.ReactNode> {
  const { slug } = await params;
  const chale = chales.find(
    (c) => slugify(c.nome, { lower: true, strict: true }) === slug,
  );

  if (!chale) return;

  const description = descriptions[chale.id];

  return <ChaleContent chale={chale} description={description} />;
}

export default ChalePage;
