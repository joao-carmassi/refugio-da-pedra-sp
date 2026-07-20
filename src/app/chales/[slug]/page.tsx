import { Separator } from '@/components/ui/separator';
import chales from '@/data/chales.json';
import Image from 'next/image';
import slugify from 'slugify';
import CardReserva from './card-reserva';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const comodidades = ['Wifi gratuito', 'Café da manhã', 'Estacionamento'];

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

  return (
    <main className='min-h-container pb-6 lg:py-12 bg-card'>
      <Image
        src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
        alt={chale.nome}
        className='aspect-square object-cover lg:hidden w-full'
        width={800}
        height={800}
        sizes='100vw'
        priority
      />
      <section className='lg:container rounded-4xl lg:rounded-none bg-card px-6 pt-6 -mt-14 lg:mt-0 lg:pt-0 z-10 relative'>
        <div className='grid lg:grid-cols-[3fr_1fr] gap-6'>
          <div className='space-y-6'>
            <Breadcrumb className='hidden lg:flex'>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink aria-label='Homepage' href='/'>
                    <Home className='h-4 w-4' />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href='/chales'>Chalés</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{chale.nome}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Image
              src={`/assets/refugio/chales/${chale.id}/refugio-${chale.banner[0]}.webp`}
              alt={chale.nome}
              className='rounded-2xl aspect-video object-cover shadow-md inset-shadow-2xs hidden lg:block'
              width={1104}
              height={621}
              sizes='(min-width: 1024px) 75vw, 100vw'
              priority
            />
            <div className='space-y-2'>
              <h1 className='text-2xl tracking-tight md:text-3xl text-center lg:text-left'>
                {chale.nome}
              </h1>
              <p className='text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.capacidade} · {chale.camas} · {chale.banheiros}
              </p>
              <p className='text-muted-foreground leading-snug text-center lg:text-left'>
                {chale.ambientes.join(' · ')} · {chale.area_externa.join(' · ')}
              </p>
            </div>
            <CardReserva
              chale={chale.nome}
              petsPermitidos={chale.politica.pets_permitidos}
              className='h-fit space-y-3 lg:hidden'
            />
            <div className='space-y-2 border border-border p-6 rounded-2xl'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                {description.title}
              </h2>
              {description.paragraphs.map((paragraph, index) => (
                <p
                  className='text-muted-foreground leading-snug'
                  key={index}
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <h2 className='text-2xl tracking-tight md:text-3xl col-span-2'>
                Comodidades
              </h2>
              {chale.comodidades.concat(comodidades).map((comodidade) => (
                <p
                  className='text-muted-foreground leading-snug'
                  key={comodidade}
                >
                  {comodidade}
                </p>
              ))}
            </div>
            <Separator />
            <div className='space-y-3'>
              <h2 className='text-2xl tracking-tight md:text-3xl'>
                Fotografias
              </h2>
              <div className='columns-1 md:columns-2 lg:columns-3'>
                {Array.from({ length: chale.fotos }, (_, index) => (
                  <div key={index}>
                    <Image
                      className='w-full h-auto mb-2.5 md:mb-5 shadow-md inset-shadow-2xs'
                      src={`/assets/refugio/chales/${chale.id}/refugio-${index + 1}.webp`}
                      alt={`${chale.nome} - foto ${index + 1}`}
                      width={500}
                      height={500}
                      sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CardReserva
            chale={chale.nome}
            petsPermitidos={chale.politica.pets_permitidos}
            className='h-fit sticky top-22 space-y-3 hidden lg:block'
          />
        </div>
      </section>
    </main>
  );
}

export default ChalePage;
