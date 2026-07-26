/* Hallmark · genre: editorial · macrostructure: Photographic
 * H6 dobra (full-bleed · legenda inferior-esquerda · texto sobreposto)
 * F3 ficha (só valores · fio em toda linha · tabular-nums)
 * C3 link tipográfico · C4 barra fixa (reveal=após a dobra · sombra=fio)
 * chrome: N6 masthead + Ft1 rodapé (compartilhados, fora de escopo)
 * design-system: design.md · designed-as-app
 */
import chales from '@/data/chales.json';
import slugify from 'slugify';
import CardReserva from './card-reserva';
import Comodidades from './comodidades';
import Descricao from './descricao';
import Dobra from './dobra';
import Ficha from './ficha';
import Fotografias from './fotografias';
import IdealPara from './ideal-para';
import Localizacao from './localizacao';
import type { ChaleDescription } from './types';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const descriptions: Record<string, ChaleDescription> = {
  colmeia: {
    title: 'Um domo para dois, sem barulho e sem pressa',
    paragraphs: [
      'O Domo Colmeia é a acomodação mais marcante do Refúgio: uma estrutura geodésica de 30 m², com suíte, cama Queen e uma fachada de vidro inteira apontada para a montanha. Quem escolhe o domo normalmente quer o oposto de um hotel — ninguém circulando do lado de fora, nenhum corredor, nenhum horário a cumprir.',
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
      'Com 32 m², o Chalé Jade é uma tiny house completa: suíte, sala integrada e cozinha equipada na mesma planta. Dá para fazer as compras na cidade, voltar com o que encontrou na feira e cozinhar sem improviso.',
      'Isso muda o ritmo da estadia. Em vez de organizar o dia em função do horário do restaurante, o casal decide na hora se janta em casa ou sai. Para viagens mais longas, é a diferença entre visitar São Bento do Sapucaí e morar nela por alguns dias.',
      'A suíte tem cama de casal, TV Smart e aquecedor para as madrugadas frias. O deck privativo é amplo e se abre para as montanhas — é o lugar natural para o café da manhã e para o almoço que saiu da própria cozinha.',
    ],
    destaques: [
      'Sala integrada com cozinha completa',
      'Tiny house de 32 m², com suíte e sala',
      'Deck privativo amplo, com vista para as montanhas',
    ],
    idealPara:
      'Casais em estadias mais longas, que fazem das refeições parte do passeio.',
    politicaPet:
      'O Jade aceita pets, e a sala integrada dá espaço de sobra para a caminha do seu.',
  },
  esmeralda: {
    title: 'Lareira e cozinha na mesma acomodação',
    paragraphs: [
      'O Chalé Esmeralda reúne lareira e cozinha equipada na mesma acomodação. Some a isso o mezanino e as duas camas de casal e você tem uma das unidades mais completas do Refúgio, para até três pessoas.',
      'O mezanino resolve o problema clássico de quem viaja em grupo: acomodar mais gente sem que ninguém durma na sala. Costuma ficar com as crianças ou com o terceiro hóspede, enquanto a suíte fica para o casal.',
      'A varanda tem a Serra da Mantiqueira na frente e é onde o dia termina: depois da trilha, é ali que se senta para ver o sol baixar — e, quando esfria, a noite continua dentro, ao redor da lareira.',
    ],
    destaques: [
      'Lareira e cozinha equipada na mesma unidade',
      'Mezanino e duas camas de casal, para até 3 pessoas',
      'Varanda com vista para a serra',
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

  return (
    // `pb-20` no mobile é a folga da barra fixa de reserva (~68px); no desktop
    // a barra não existe e o rodapé encosta na última faixa da galeria.
    <main className="bg-background pb-20 lg:pb-0">
      <Dobra chale={chale} />
      <Ficha chale={chale} />

      {/* Corpo editorial: coluna de texto à esquerda, trilho de reserva
          grudado à direita. A grade mora aqui, e não dentro de um componente,
          porque é ela que define quais seções o trilho acompanha na rolagem —
          uma decisão de página, não de seção. */}
      <div className="container grid gap-12 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
        <div className="min-w-0 space-y-12 md:space-y-16">
          <Descricao chale={chale} description={description} />
          <IdealPara description={description} />
          <Comodidades chale={chale} />
          <Localizacao chale={chale} />
        </div>

        <CardReserva
          chale={chale.nome}
          petsPermitidos={chale.politica.pets_permitidos}
        />
      </div>

      <Fotografias chale={chale} />
    </main>
  );
}

export default ChalePage;
