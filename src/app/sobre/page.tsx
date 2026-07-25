import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import Link from 'next/link';

// Identidade de quem recebe os hóspedes, em um único lugar.
// Nome e função foram confirmados pelos proprietários.
// TODO (ainda pendente com os proprietários): sobrenomes, texto de bio e foto.
// Enquanto `bio` estiver vazia, o parágrafo de bio não é renderizado — nada de
// placeholder ou espaço quebrado na página publicada. A foto entra aqui como um
// novo campo assim que for enviada.
const PROPRIETARIOS: {
  nome: string;
  cargo: string;
  bio: string;
} = {
  nome: 'Daniel e Marcia',
  cargo: 'Anfitriões do Refúgio da Pedra',
  bio: '',
};

const temNomeDosProprietarios = PROPRIETARIOS.nome.length > 0;
const temBioDosProprietarios = PROPRIETARIOS.bio.length > 0;

function SobrePage(): React.ReactNode {
  return (
    <main className='min-h-container bg-card py-6 md:py-12 grid place-items-center animate-in fade-in duration-300 fill-mode-both'>
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
            Uma pousada sustentável ao pé da Pedra do Baú
          </h1>
          <p className='text-muted-foreground md:text-lg'>
            Desde 2018,{' '}
            {temNomeDosProprietarios
              ? `${PROPRIETARIOS.nome} recebem`
              : 'recebemos'}{' '}
            quem vem para a Serra da Mantiqueira em busca de natureza, silêncio
            e aventura — em São Bento do Sapucaí, a 1,5 km do pé da Pedra do
            Baú.
          </p>
        </div>

        <div className='prose dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed'>
          <div className='space-y-4'>
            <h2 className='text-xl md:text-2xl text-foreground'>
              Como o Refúgio da Pedra começou
            </h2>
            <p>
              O Refúgio da Pedra nasceu em 2018 de uma vontade simples: viver
              mais perto da serra e compartilhar esse lugar com quem também
              precisa desacelerar. Foi em São Bento do Sapucaí, entre neblina,
              pedras centenárias e o cheiro de eucalipto molhado, que trocamos a
              rotina da cidade grande por um pedaço de terra na Mantiqueira e
              começamos a construir, aos poucos, as primeiras acomodações.
            </p>
            <p>
              A ideia sempre foi a mesma: uma pousada sustentável, pequena o
              suficiente para ser cuidada de perto e integrada à paisagem em vez
              de imposta a ela. Não somos uma rede de hotéis, nem um
              empreendimento gerido à distância. Somos uma família que mora
              perto, que cuida do jardim no fim de semana, que conhece cada
              chalé pelo nome e sabe qual deles pega o melhor sol da manhã.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl md:text-2xl text-foreground'>
              No pé da Pedra do Baú
            </h2>
            <p>
              Estamos a apenas 1,5 km do pé da Pedra do Baú, um dos cartões
              postais da Serra da Mantiqueira. É essa localização que define o
              nosso dia a dia: trilhas que começam praticamente na porta,
              escalada e rapel a poucos minutos, montanhas imponentes de um lado
              e o vale se abrindo do outro. Quem chega costuma dizer a mesma
              coisa — o silêncio impressiona. Os dias começam com o vapor
              subindo do vale e terminam com o céu mais estrelado do que a
              maioria das pessoas já viu.
            </p>
            <p>
              Estar aqui também é uma escolha: acreditamos no turismo rural e no
              turismo de aventura como forma de movimentar a economia local. Por
              isso trabalhamos lado a lado com quem produz e recebe na região —
              a vinícola do Vale do Baú, o azeite extravirgem da Mantiqueira, os
              restaurantes da cidade e as agências de ecoturismo que conduzem as
              trilhas e escaladas. Cada hóspede que chega ao Refúgio acaba
              deixando algo para São Bento do Sapucaí inteira.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl md:text-2xl text-foreground'>
              Acomodações simples, do jeito que a serra pede
            </h2>
            <p>
              São cinco acomodações no total: três chalés, uma cabana com
              lareira e um domo geodésico. Todas são propositalmente simples —
              não vai encontrar aqui luxo de vitrine, e sim o essencial bem
              feito. Suíte confortável, deck ou varanda privativa com vista para
              as montanhas, aquecedor para as noites frias, cozinha equipada nos
              chalés e lareira de verdade onde faz sentido ter uma.
            </p>
            <p>
              A reserva já inclui o que importa: café da manhã com produtos
              típicos da região, roupa de cama e toalhas, Wi-Fi, estacionamento
              privativo em cada acomodação e seguro sem custo adicional. Somos
              pet friendly na maior parte das unidades, porque entendemos que os
              animais de estimação são parte da família.{' '}
              <Link
                className='underline underline-offset-4 hover:text-foreground'
                href='/chales/'
              >
                Conheça as acomodações
              </Link>{' '}
              e escolha a que combina com a sua viagem.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl md:text-2xl text-foreground'>
              Sustentabilidade não é discurso
            </h2>
            <p>
              Levamos a sério o compromisso com a terra que nos acolhe.
              Procuramos manter a vegetação nativa, usar os recursos da
              propriedade com consciência e respeitar o ritmo da montanha, que
              muda de temperatura e de humor várias vezes ao dia. Não
              construímos o Refúgio da Pedra para ser grande — construímos para
              que ele continuasse de pé, do jeito que é, daqui a vinte anos.
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl md:text-2xl text-foreground'>
              Quem recebe você
            </h2>
            {temNomeDosProprietarios && (
              <div className='space-y-1'>
                <p className='text-foreground font-medium'>
                  {PROPRIETARIOS.nome}
                </p>
                {PROPRIETARIOS.cargo.length > 0 && (
                  <p className='text-sm'>{PROPRIETARIOS.cargo}</p>
                )}
                {temBioDosProprietarios && <p>{PROPRIETARIOS.bio}</p>}
              </div>
            )}
            <p>
              Se está pensando em vir, saiba que não vai encontrar um atendimento
              padronizado de central telefônica. Você fala diretamente com{' '}
              {temNomeDosProprietarios
                ? PROPRIETARIOS.nome
                : 'quem cuida do lugar'}
              , tira dúvidas pelo WhatsApp e é recebido por gente que gosta
              genuinamente de receber.
              É assim que gostaríamos de ser recebidos também — e é esse o
              Refúgio da Pedra que convidamos você a conhecer, aqui em São Bento
              do Sapucaí.{' '}
              <Link
                className='underline underline-offset-4 hover:text-foreground'
                href='/reservar/'
              >
                Reserve sua estadia
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SobrePage;
