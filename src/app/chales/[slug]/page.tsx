import chales from '@/data/chales.json';
import slugify from 'slugify';
import ChaleContent from './chale-content';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const descriptions: Record<string, { title: string; paragraphs: string[] }> = {
  colmeia: {
    title: 'Um Refúgio Intimista para Dois',
    paragraphs: [
      'O Domo Colmeia foi pensado para casais que buscam simplicidade, privacidade e uma pausa genuína na rotina. Com 30 m² e uma suíte confortável equipada com cama Queen, o espaço concentra tudo o que é essencial para dias tranquilos em meio à Serra da Mantiqueira — sem excessos, sem distrações.',
      'O deck externo é o ponto alto da experiência: de lá, a vista se abre para as montanhas, e o entardecer pinta o céu em tons quentes enquanto a brisa da serra refresca o ambiente. É o cenário ideal para um café da manhã ao ar livre ou uma taça de vinho ao pôr do sol, a dois.',
      'Por dentro, TV Smart, micro-ondas e frigobar garantem o conforto necessário para uma estadia sem complicações. O Domo não recebe pets, o que o torna especialmente indicado para quem procura um ambiente mais reservado e silencioso — ótimo para lua de mel, aniversários ou um tempo a sós com quem se ama.',
      'Se o que você busca é objetividade, aconchego e a paisagem da montanha como pano de fundo, o Domo Colmeia entrega exatamente isso: o essencial, bem feito, para uma dupla.',
    ],
  },
  ametista: {
    title: 'Aconchego de Lareira nas Montanhas',
    paragraphs: [
      'A Cabana Ametista foi criada para casais que querem sentir o friozinho da serra do jeito certo — com uma lareira de verdade. Em uma suíte de 30 m² com cama Queen, o crepitar da lenha e o calor da chama transformam noites frias em momentos de puro aconchego, com as montanhas da Mantiqueira como cenário.',
      'Além da lareira, a cabana conta com aquecedor, TV Smart, micro-ondas e frigobar, unindo o charme rústico ao conforto necessário para dias de descanso prolongado. A varanda privativa é o convite perfeito para observar o pôr do sol e o céu estrelado, envolvidos pelo silêncio da montanha.',
      'A Ametista também é pet friendly: seu companheiro de quatro patas é bem-vindo para dividir a experiência, tornando a estadia ainda mais completa para quem não abre mão da companhia do pet mesmo em uma viagem romântica.',
      'Ideal para casais que valorizam o ritual do fogo na lareira, o clima intimista e a liberdade de viajar com seus animais de estimação, a Cabana Ametista é o refúgio perfeito para o inverno na serra — ou para qualquer época do ano em que o coração pede aconchego.',
    ],
  },
  jade: {
    title: 'Para Casais que Gostam de Cozinhar',
    paragraphs: [
      'O Chalé Jade é a escolha certa para casais que querem mais autonomia durante a estadia. Com 32 m², é a maior suíte do Refúgio, e conta com um diferencial importante: uma sala integrada com cozinha totalmente equipada, pensada para quem gosta de preparar as próprias refeições com calma, sem abrir mão do conforto.',
      'A suíte, com cama de casal, TV Smart e aquecedor, garante noites tranquilas mesmo nos dias mais frios da serra. Do lado de fora, o deck privativo oferece uma vista aberta para as montanhas da Mantiqueira — cenário perfeito para o café da manhã ou um almoço preparado na própria cozinha do chalé.',
      'Diferente das cabanas com lareira, o Jade aposta em um perfil mais funcional e caseiro, ideal para estadias mais longas em que cozinhar em casa faz parte do passeio. E, claro, pets são bem-vindos, então o pet da família também pode aproveitar a experiência.',
      'Se o seu roteiro inclui produtos locais da região, vinho e queijo na cozinha do chalé e uma vista de tirar o fôlego no deck, o Chalé Jade foi feito para vocês.',
    ],
  },
  esmeralda: {
    title: 'O Refúgio Completo para Grupos e Famílias',
    paragraphs: [
      'O Chalé Esmeralda é a acomodação mais completa do Refúgio, pensada para pequenos grupos, famílias ou casais que viajam com mais gente. Com capacidade para até 3 pessoas, duas camas de casal e um mezanino que amplia o espaço, o chalé combina amplitude com todos os diferenciais das demais unidades reunidos em um só lugar.',
      'Aqui você encontra lareira, aquecedor, cozinha equipada e sala integrada — ou seja, o calor do fogo nas noites frias e a liberdade de preparar as próprias refeições, tudo na mesma estadia. A varanda espaçosa se abre para a vista das montanhas da Serra da Mantiqueira, ideal para reunir todo mundo ao redor de um café ou de um entardecer compartilhado.',
      'Por ter mais espaço, o mezanino é ótimo para acomodar crianças ou um casal extra, tornando a Esmeralda a opção natural para famílias e grupos de amigos que não querem abrir mão do conforto. Pets também são bem-vindos, então até o membro peludo da família pode vir junto.',
      'Lareira, cozinha, mezanino, varanda e pets liberados: o Chalé Esmeralda reúne, em uma única acomodação, tudo o que o Refúgio tem de melhor para quem viaja acompanhado.',
    ],
  },
  turmalina: {
    title: 'Espaço e Conforto para Pequenos Grupos',
    paragraphs: [
      'O Chalé Turmalina foi feito para quem viaja em grupo ou família e precisa de mais espaço, sem perder o clima aconchegante da serra. Com capacidade para até 3 pessoas, duas camas de casal e um mezanino integrado, o chalé oferece a mesma amplitude da Esmeralda, com um perfil um pouco mais leve.',
      'A sala integrada com cozinha equipada permite preparar refeições com tranquilidade durante toda a estadia, enquanto o aquecedor garante o conforto térmico nas noites mais frias da montanha — mesmo sem lareira, o ambiente se mantém aconchegante graças à disposição dos espaços e à vista para as montanhas.',
      'A varanda ampla é o ponto de encontro ideal para o grupo relaxar ao entardecer, com a Serra da Mantiqueira como pano de fundo. Pets são bem-vindos, o que faz da Turmalina uma opção versátil para famílias completas, incluindo os pets.',
      'Para quem busca espaço, praticidade na cozinha e liberdade para viajar com o pet, sem o ritual de uma lareira, o Chalé Turmalina é a escolha equilibrada entre conforto e simplicidade.',
    ],
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
