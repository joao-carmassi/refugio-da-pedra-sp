'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useReveal } from '@/hooks/use-reveal';
import { getAlt } from '@/lib/image-alt';
import { ArrowRight, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Foto de abertura, em constante porque o caminho é usado duas vezes: na
 * `src` e na consulta ao mapa de alt text, que é chaveado por ele.
 */
const FOTO = '/assets/mapa/pedra-bau/pedra-bau-4.webp';

/**
 * Abertura da página.
 *
 * Não é a dobra fotográfica da homepage: aqui a rota é editorial e abre como
 * /chales/, /blog/ e /sobre/ — breadcrumb primeiro, `pt-12 md:pt-20` de folga
 * abaixo do cabeçalho. A fotografia entra logo depois do texto, em largura
 * total.
 *
 * `onMount` porque o bloco está acima da dobra: esperar o ScrollTrigger aqui
 * significaria abrir a página com o título invisível.
 */
function Hero(): React.ReactNode {
  const scope = useReveal<HTMLElement>({ onMount: true, delay: 0.15 });

  return (
    <section ref={scope} className='py-12 md:py-20'>
      <div className='container'>
        <div data-reveal>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink aria-label='Homepage' href='/'>
                  <Home className='h-4 w-4' />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mapa Turístico</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Assinatura de marca da identidade do mapa: o selo do projeto, o
            nome em Piazzolla, régua de 1px e o crédito em Archivo 600, caixa
            alta, marrom pedra — sempre menor que o nome. É o único ponto da
            rota onde as duas marcas aparecem lado a lado; o resto da página é
            do mapa. O marrom vem por `style` porque é cor de marca, não papel
            de interface: não há token de tema que signifique "vínculo com o
            refúgio".

            O selo entra ao lado do nome, e não no lugar dele. O losango traz
            "Mapa Turístico de São Bento do Sapucaí" escrito em curva ao redor
            da rosa dos ventos, mas num quadro de 56–64 px essa volta de texto
            tem uns quatro pixels de altura: lê-se como ornamento, não como
            palavra. Tirar o `<span>` confiando no que está desenhado dentro da
            marca deixaria a assinatura sem nome legível — e sem nenhum nome no
            leitor de tela, já que o `alt` descreve o desenho, não repete o
            título. A redundância é só aparente.

            O bloco virou duas camadas — selo fora, texto dentro — porque a
            fila antiga era `flex-wrap`: quando o crédito quebrava para a linha
            de baixo, ele voltava a encostar na margem do container e o selo
            ficava órfão em cima. Com o texto num invólucro próprio, a quebra
            acontece dentro dele e a assinatura continua sendo um bloco só ao
            lado da marca. */}
        <div data-reveal className='mt-8 flex items-center gap-3 md:mt-10'>
          {/* Arquivo próprio, e não o ícone do PWA (`mapa-web-app-manifest-
              512x512.png`), porque aquele traz o fundo branco chapado que o
              instalador de aplicativo exige. Sobre o creme desta página o
              branco vira um quadrado visível em volta do losango. Aqui o fundo
              é transparente e o quadro está cortado rente às pontas — o selo
              apoia no creme em vez de flutuar dentro de um adesivo. */}
          <Image
            src='/assets/mapa/logo-mapa-turistico.webp'
            alt='Selo do mapa: losango verde com rosa dos ventos, alfinete e a silhueta da Pedra do Baú'
            width={412}
            height={412}
            sizes='64px'
            priority
            className='size-14 shrink-0 md:size-16'
          />
          <div className='flex flex-wrap items-center gap-x-3 gap-y-1'>
            <span className='font-display text-base leading-none font-semibold tracking-tight md:text-lg'>
              Mapa de São Bento do Sapucaí
            </span>
            <span
              aria-hidden='true'
              className='hidden h-5 w-px bg-border sm:block'
            />
            <span
              style={{ color: 'var(--map-stone)' }}
              className='text-[0.6875rem] font-semibold tracking-[0.12em] uppercase'
            >
              um projeto do Refúgio da Pedra
            </span>
          </div>
        </div>

        <h1
          data-reveal
          className='mt-4 max-w-4xl text-2xl tracking-tight text-pretty md:mt-5 md:text-4xl lg:text-5xl'
        >
          Mapa turístico de São Bento do Sapucaí: o que visitar, onde comer e o
          que fazer na serra
        </h1>

        <p
          data-reveal
          className='mt-3 max-w-prose text-muted-foreground md:mt-4 md:text-lg'
        >
          Um guia da cidade em forma de mapa, aberto a quem estiver planejando a
          viagem: as trilhas do Complexo da Pedra do Baú, as cachoeiras do vale,
          as igrejas e os mirantes do centro histórico. Cada ponto traz
          endereço, horário quando existe horário publicado e a rota de carro
          medida por estrada de verdade — e, onde o carro não chega, o que ainda
          falta caminhar.
        </p>

        <div
          data-reveal
          className='mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10'
        >
          <Button
            asChild
            effect='ringHover'
            size='lg'
            className='w-full rounded-full sm:w-auto'
          >
            <Link href='/mapa/'>
              Abrir o mapa
              <ArrowRight className='size-4' />
            </Link>
          </Button>
          {/* O segundo botão leva para dentro do próprio guia, não para a
              reserva: quem chega da busca está escolhendo o que fazer na
              cidade, e a pousada tem o bloco de fecho para se apresentar. */}
          <Button
            variant='outline'
            asChild
            size='lg'
            className='w-full rounded-full sm:w-auto'
          >
            <Link href='#pontos-anchor'>Ver os lugares</Link>
          </Button>
        </div>

        {/* Moldura de `@shadcnblocks/hero263`: a fotografia fica dentro do
            container, com régua de 1px em volta e canto arredondado, em vez de
            sangrar de borda a borda. A moldura continua valendo agora que há
            foto: esta rota é editorial, e o texto que vem acima e abaixo dela
            corre no mesmo container — uma imagem sangrando de parede a parede
            romperia a coluna de leitura no meio da página, que é gesto de
            dobra fotográfica (a homepage e `/chales/[slug]/` fazem isso, e lá
            a foto é a abertura, não uma ilustração do texto). A proporção abre
            em 4/3 no celular e vira 16/9 no resto — 21/9 numa tela estreita
            seria uma tarja de 100 px. `object-cover` porque o recorte muda com
            a proporção, e o assunto da foto (o paredão) está no centro.

            `priority`: com o cabeçalho travado em compacto, esta imagem entra
            na primeira tela em telas grandes e é a candidata a LCP da rota. */}
        <div data-reveal className='mt-10 md:mt-14'>
          <Image
            src={FOTO}
            alt={getAlt(
              FOTO,
              'Vista aérea do maciço da Pedra do Baú entre nuvens baixas',
            )}
            width={1620}
            height={1213}
            sizes='100vw'
            priority
            className='aspect-4/3 max-h-[70svh] w-full rounded-lg border border-border object-cover md:aspect-video'
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
