import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getSiteUrl } from '@/lib/env';
import { Home } from 'lucide-react';

export function generateMetadata() {
  const siteUrl = getSiteUrl();
  return {
    title: 'Quem Somos - Refúgio da Pedra',
    description:
      'Conheça a história por trás do Refúgio da Pedra, em São Bento do Sapucaí: uma pousada de família na Serra da Mantiqueira feita para quem busca descanso de verdade.',
    keywords: [
      'quem somos',
      'sobre',
      'pousada de família',
      'São Bento do Sapucaí',
      'Serra da Mantiqueira',
    ],
    openGraph: {
      title: 'Quem Somos - Refúgio da Pedra',
      description:
        'A história por trás do Refúgio da Pedra, uma pousada de família na Serra da Mantiqueira.',
      type: 'website',
      url: `${siteUrl}/sobre`,
    },
    alternates: {
      canonical: `${siteUrl}/sobre`,
    },
  };
}

function SobrePage(): React.ReactNode {
  return (
    <main className='min-h-container bg-card py-6 md:py-12 grid place-items-center'>
      <section className='container space-y-6 md:space-y-8'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink aria-label='Homepage' href='/'>
                <Home className='h-4 w-4' />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Quem Somos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='space-y-3'>
          <h1 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            A família por trás do Refúgio da Pedra
          </h1>
          {/* TODO: replace with real owner name + photo once provided */}
        </div>

        <div className='prose dark:prose-invert max-w-none space-y-4 text-muted-foreground leading-relaxed'>
          <p>
            O Refúgio da Pedra nasceu de uma vontade simples: viver mais perto
            da serra e compartilhar esse lugar com quem também precisa
            desacelerar. Foi em São Bento do Sapucaí, entre neblina, pedras
            centenárias e o cheiro de eucalipto molhado, que decidimos trocar a
            rotina da cidade grande por um pedaço de terra na Mantiqueira e
            construir, aos poucos, os primeiros chalés.
          </p>
          <p>
            Não somos uma rede de hotéis, nem um empreendimento gerido à
            distância. Somos uma família que mora perto, que cuida do jardim no
            fim de semana, que conhece cada chalé pelo nome e sabe qual deles
            pega o melhor sol da manhã. Cada detalhe da hospedagem — da lenha
            separada para a lareira ao horário do café — passa pelas nossas
            mãos, porque acreditamos que hospitalidade de verdade não se
            terceiriza.
          </p>
          <p>
            Quem chega ao Refúgio da Pedra costuma dizer a mesma coisa: o
            silêncio impressiona. Aqui, os dias começam com o vapor subindo do
            vale e terminam com o céu mais estrelado do que a maioria das
            pessoas já viu. Entre uma coisa e outra, dá tempo de caminhar até a
            cachoeira, ler um livro na varanda ou simplesmente não fazer nada —
            o que, na correria do dia a dia, virou um luxo raro.
          </p>
          <p>
            Também levamos a sério o compromisso com a terra que nos acolhe.
            Procuramos manter a vegetação nativa, usar os recursos da
            propriedade com consciência e respeitar o ritmo da montanha, que
            muda de temperatura e de humor várias vezes ao dia. Não construímos
            o Refúgio da Pedra para ser grande — construímos para que ele
            continuasse de pé, do jeito que é, daqui a vinte anos.
          </p>
          <p>
            Se você está pensando em vir, saiba que não vai encontrar um
            atendimento padronizado de central telefônica. Vai falar diretamente
            com quem cuida do lugar, tirar dúvidas pelo WhatsApp e ser recebido
            por gente que gosta genuinamente de receber. É assim que gostaríamos
            de ser recebidos também — e é esse o Refúgio da Pedra que convidamos
            você a conhecer.
          </p>
        </div>
      </section>
    </main>
  );
}

export default SobrePage;
