/* Hallmark · genre: editorial · chrome: N6 masthead + Ft1 footer · design-system: design.md · designed-as-app */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// `trailingSlash: true` (next.config.ts) — todo href interno precisa terminar
// com barra, senão o Next responde 308 antes de servir a página.
const links = [
  { href: '/chales/', label: 'Chalés' },
  { href: '/blog/', label: 'Blog' },
  { href: '/sobre/', label: 'Sobre' },
];

// Anel de foco da casa (design.md § Microinteractions): idêntico ao do Button,
// aplicado à mão nos links porque eles não passam pelo `buttonVariants`.
const focusRing =
  'outline-none rounded-xs focus-visible:ring-3 focus-visible:ring-ring/50';

const navLink = `inline-flex min-h-9 items-center px-1 text-sm font-medium text-foreground transition-colors hover:text-accent-deep ${focusRing}`;

const wordmark =
  'font-display leading-none font-semibold tracking-tight text-balance text-foreground';

const locality =
  'text-muted-foreground [font-variant-caps:small-caps] tracking-[0.16em]';

// Curva expo-out: sai rápido e assenta devagar. Meio segundo é longo para um
// botão, mas aqui o cabeçalho inteiro se reorganiza — abaixo disso a troca lê
// como corte, não como transição.
const morph =
  'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

// Mesma curva do cabeçalho, um pouco mais curta: meio segundo num painel de
// três itens lê como lentidão.
const panel =
  'transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

// Alturas do bloco desktop. Precisam ser explícitas porque as duas camadas do
// crossfade são absolutas — nenhuma delas dita a altura do cabeçalho.
// Expandida = wordmark + localidade + fila de links; compacta = altura do CTA.
const deskHeight = 'h-[7rem] lg:h-[7.75rem]';

function Header(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  // Espelha `isOpen` para o medidor, que é montado uma vez só e não pode
  // capturar o estado por closure.
  const openRef = useRef(false);
  // eslint-disable-next-line react-hooks/refs
  openRef.current = isOpen;
  // Altura do masthead expandido. O cabeçalho é `fixed`; este valor alimenta um
  // spacer no fluxo, para que a página nunca suba quando ele encolhe.
  const [expandedHeight, setExpandedHeight] = useState(0);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 0);
    // Chamada imediata: um reload no meio da página já nasce rolado.
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // O spacer tem que ficar travado na altura expandida. Medir de forma contínua
  // (ResizeObserver) faria ele acompanhar a animação e empurrar o hero para
  // baixo na volta ao topo — por isso só se mede em repouso: na montagem, ao
  // redimensionar a janela e no fim da transição de volta ao topo.
  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;
    const measure = () => {
      // Fora do topo o cabeçalho está compacto, e com o painel mobile aberto
      // ele está mais alto do que o spacer deve reservar: nos dois casos a
      // medida seria errada.
      if (window.scrollY !== 0 || openRef.current) return;
      setExpandedHeight(el.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    el.addEventListener('transitionend', measure);
    return () => {
      window.removeEventListener('resize', measure);
      el.removeEventListener('transitionend', measure);
    };
  }, []);

  // Publica a altura expandida para o resto da página. O hero usa isso para
  // ocupar exatamente o que sobra da viewport (`100svh - --header-height`) sem
  // precisar repetir a medição nem chutar um valor fixo.
  useEffect(() => {
    if (!expandedHeight) return;
    document.documentElement.style.setProperty(
      '--header-height',
      `${expandedHeight}px`,
    );
  }, [expandedHeight]);

  // Antes da primeira medição o cabeçalho fica no fluxo (é o que o servidor
  // renderiza), então não há salto entre HTML estático e hidratação.
  const measured = expandedHeight > 0;

  return (
    <>
      <header
        className={cn(
          // Sem contorno nos dois estados: o cabeçalho funde com a superfície
          // logo abaixo dele em vez de se anunciar como uma barra.
          'w-full bg-card',
          morph,
          measured && 'fixed inset-x-0 top-0 z-50',
        )}
      >
        <div
          ref={shellRef}
          className={cn(
            'container',
            morph,
            // Padding simétrico no estado expandido: com pb menor que pt o
            // brasão (centrado na altura do bloco) lia como desalinhado para
            // baixo dentro da caixa do cabeçalho.
            compact ? 'py-2 md:py-3.5' : 'py-4 md:py-7',
          )}
        >
          {/* ---------- Mobile: hambúrguer · wordmark · CTA ---------- */}
          <div className='flex items-center justify-between gap-2 md:hidden'>
            <Button
              type='button'
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu de navegação'}
              aria-expanded={isOpen}
              aria-controls='menu-principal'
              onClick={() => setIsOpen((open) => !open)}
              // size-11 = 44px: alvo mínimo de toque recomendado (WCAG 2.5.8).
              className='size-11 shrink-0'
              size={'icon'}
              variant='ghost'
            >
              {/* Os dois ícones ficam empilhados na mesma célula e giram um
                  para dentro do outro — trocar o nó direto daria um corte seco
                  ao lado de um painel que abre suave. */}
              <span className='grid place-items-center'>
                <Menu
                  className={cn(
                    'col-start-1 row-start-1',
                    panel,
                    isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
                  )}
                />
                <X
                  className={cn(
                    'col-start-1 row-start-1',
                    panel,
                    isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
                  )}
                />
              </span>
            </Button>

            <Link
              className={cn(wordmark, morph, 'text-lg', focusRing)}
              href='/'
              aria-label='Refúgio da Pedra SP — página inicial'
            >
              Refúgio da Pedra SP
            </Link>

            {/* Com o painel aberto o CTA passa para dentro dele. O nó continua
                montado e só perde opacidade: removê-lo do fluxo faria o
                wordmark deslizar para a direita a cada abertura do menu. */}
            <div
              inert={isOpen}
              className={cn(
                'shrink-0',
                panel,
                isOpen ? 'pointer-events-none opacity-0' : 'opacity-100',
              )}
            >
              <Button
                effect={'ringHover'}
                size={'sm'}
                className='h-11 rounded-full px-4'
                asChild
              >
                <Link href='/reservar/'>Reservar</Link>
              </Button>
            </div>
          </div>

          {/* Linha de localidade: colapsa por `max-h`/`opacity` para a altura do
              cabeçalho correr junto com o desaparecimento. */}
          <p
            className={cn(
              'overflow-hidden text-center text-[0.68rem] md:hidden',
              locality,
              morph,
              compact ? 'mt-0 max-h-0 opacity-0' : 'mt-2 max-h-6 opacity-100',
            )}
          >
            São Bento do Sapucaí · Serra da Mantiqueira
          </p>

          {/* ---------- Desktop ---------- */}
          {/* Duas camadas sobrepostas que se cruzam em fade: a do masthead
              (wordmark grande, centrado) e a da barra (wordmark pequeno, à
              esquerda). A que está de saída sai antes; a de entrada tem delay,
              para as duas nunca aparecerem sobrepostas em opacidade cheia. */}
          <div
            className={cn(
              'relative hidden md:block',
              morph,
              compact ? 'h-9' : deskHeight,
            )}
          >
            {/* CTA é o único elemento compartilhado: não some entre os estados,
                só acompanha a altura do bloco. Fica no centro vertical nos dois
                — expandido, é o contrapeso do brasão à esquerda; encostá-lo no
                topo deixava a linha dos dois tortas. */}
            <div
              className={cn(
                'absolute top-1/2 right-0 z-10 -translate-y-1/2',
                morph,
              )}
            >
              <Button
                effect={'ringHover'}
                className='rounded-full px-5'
                asChild
              >
                <Link href='/reservar/'>Reservar</Link>
              </Button>
            </div>

            {/* --- Camada masthead --- */}
            <div
              inert={compact}
              className={cn(
                'absolute inset-x-0 top-0',
                morph,
                compact
                  ? 'pointer-events-none -translate-y-3 opacity-0 blur-[2px]'
                  : 'translate-y-0 opacity-100 blur-0 delay-150',
              )}
            >
              {/* Brasão à esquerda. Fica dentro da camada masthead de
                  propósito: some junto com ela no mesmo fade, sem estado
                  próprio. `aria-hidden` + `tabIndex={-1}` porque o wordmark ao
                  lado já é o link para a home — dois links idênticos seguidos
                  só dobrariam o anúncio no leitor de tela. */}
              <Link
                href='/'
                aria-hidden='true'
                tabIndex={-1}
                className='absolute top-1/2 left-0 -translate-y-1/2'
              >
                <Image
                  src='/logo.png'
                  alt=''
                  width={88}
                  height={88}
                  priority
                  className='size-16 lg:size-[4.5rem]'
                />
              </Link>

              <div className='text-center'>
                <Link
                  className={cn(wordmark, 'text-4xl lg:text-5xl', focusRing)}
                  href='/'
                  aria-label='Refúgio da Pedra SP — página inicial'
                >
                  Refúgio da Pedra SP
                </Link>
                <p className={cn('mt-2.5 text-xs', locality)}>
                  São Bento do Sapucaí · Serra da Mantiqueira
                </p>
              </div>

              {/* Único landmark de navegação da página — a camada compacta usa
                  uma `<ul>` sem `<nav>` para não duplicar o marco. */}
              <nav aria-label='Principal' className='mt-3'>
                <ul className='flex items-center justify-center gap-8'>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={navLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* --- Camada barra compacta --- */}
            <div
              inert={!compact}
              className={cn(
                // pr reserva a faixa do CTA, que está fora do fluxo.
                'absolute inset-0 flex items-center gap-8 pr-36',
                morph,
                compact
                  ? 'translate-y-0 opacity-100 blur-0 delay-150'
                  : 'pointer-events-none translate-y-3 opacity-0 blur-[2px]',
              )}
            >
              <Link
                className={cn(wordmark, 'text-xl', focusRing)}
                href='/'
                aria-label='Refúgio da Pedra SP — página inicial'
              >
                Refúgio da Pedra SP
              </Link>

              <ul className='ml-auto flex items-center gap-6'>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={navLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---------- Painel de navegação mobile ---------- */}
          {/* Disclosure simples: desce dentro do próprio cabeçalho, o que
              dispensa o scrim que o dropdown antigo exigia.
              O painel fica sempre montado e abre por `grid-template-rows`
              (0fr → 1fr): é a única forma de animar altura automática sem
              fixar um `max-height` chutado, que ou corta o conteúdo ou faz a
              transição parecer atrasada. O `overflow-hidden` fica no wrapper
              para a hairline superior também ser recortada quando fechado. */}
          <div
            className={cn(
              'grid overflow-hidden md:hidden',
              panel,
              isOpen ? 'mt-3 grid-rows-[1fr]' : 'mt-0 grid-rows-[0fr]',
            )}
          >
            {/* A célula do grid não pode ter borda nem padding: com a trilha em
                0fr eles continuam ocupando altura (a hairline chegaria a
                aparecer no cabeçalho fechado). Ficam no `<ul>`, que transborda
                e é recortado pelo wrapper. */}
            <div className='min-h-0'>
              <div
                id='menu-principal'
                inert={!isOpen}
                className={cn(
                  'border-t border-border pt-1 pb-2',
                  panel,
                  isOpen
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-2 opacity-0',
                )}
              >
                <ul>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        // min-h-11 = 44px de alvo de toque (WCAG 2.5.8).
                        className={`flex min-h-11 items-center text-base font-medium text-foreground ${focusRing}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Button
                  effect={'ringHover'}
                  className='mx-auto mt-3 flex h-11 w-full max-w-xs rounded-full'
                  asChild
                >
                  <Link href='/reservar/' onClick={() => setIsOpen(false)}>
                    Reservar
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer: segura no fluxo a altura do masthead expandido. */}
      {measured ? <div style={{ height: expandedHeight }} /> : null}
    </>
  );
}

export default Header;
