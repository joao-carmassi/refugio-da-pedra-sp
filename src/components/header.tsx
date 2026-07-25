/* Hallmark · genre: editorial · chrome: N6 masthead + Ft1 footer · design-system: design.md · designed-as-app */
'use client';

import Link from 'next/link';
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

// Alturas do bloco desktop. Precisam ser explícitas porque as duas camadas do
// crossfade são absolutas — nenhuma delas dita a altura do cabeçalho.
// Expandida = wordmark + localidade + fila de links; compacta = altura do CTA.
const deskHeight = 'h-[7rem] lg:h-[7.75rem]';

function Header(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
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

  // Só mede enquanto o cabeçalho está expandido; no estado compacto o último
  // valor medido é mantido (é a altura que o spacer precisa reservar).
  useEffect(() => {
    const el = shellRef.current;
    if (compact || !el) return;
    const observer = new ResizeObserver(() =>
      setExpandedHeight(el.offsetHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [compact]);

  // Antes da primeira medição o cabeçalho fica no fluxo (é o que o servidor
  // renderiza), então não há salto entre HTML estático e hidratação.
  const measured = expandedHeight > 0;

  return (
    <>
      <header
        className={cn(
          'w-full border-b bg-card',
          morph,
          measured && 'fixed inset-x-0 top-0 z-50',
          // No topo o cabeçalho não tem contorno: funde com o hero, que usa a
          // mesma superfície. Compacto ele flutua sobre o conteúdo e precisa da
          // hairline para o texto não passar colado por baixo.
          compact ? 'border-border' : 'border-transparent',
        )}
      >
        <div
          ref={shellRef}
          className={cn(
            'container',
            morph,
            compact ? 'py-2 md:py-3.5' : 'pt-4 pb-3 md:pt-7 md:pb-4',
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
              {isOpen ? <X /> : <Menu />}
            </Button>

            <Link
              className={cn(wordmark, morph, 'text-lg', focusRing)}
              href='/'
              aria-label='Refúgio da Pedra — página inicial'
            >
              Refúgio da Pedra
            </Link>

            <Button
              effect={'ringHover'}
              size={'sm'}
              className='h-11 shrink-0 rounded-full px-4'
              asChild
            >
              <Link href='/reservar/'>Reservar</Link>
            </Button>
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
            {/* CTA é o único elemento compartilhado: ele não some, só desliza
                para o centro vertical da barra. */}
            <div
              className={cn(
                'absolute right-0 z-10',
                morph,
                compact ? 'top-1/2 -translate-y-1/2' : 'top-0 lg:top-1.5',
              )}
            >
              <Button effect={'ringHover'} className='rounded-full px-5' asChild>
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
              <div className='text-center'>
                <Link
                  className={cn(
                    wordmark,
                    'text-4xl lg:text-5xl',
                    focusRing,
                  )}
                  href='/'
                  aria-label='Refúgio da Pedra — página inicial'
                >
                  Refúgio da Pedra
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
                aria-label='Refúgio da Pedra — página inicial'
              >
                Refúgio da Pedra
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
              dispensa o scrim que o dropdown antigo exigia. */}
          {isOpen ? (
            <ul
              id='menu-principal'
              className='mt-3 border-t border-border pt-1 md:hidden'
            >
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
          ) : null}
        </div>
      </header>

      {/* Spacer: segura no fluxo a altura do masthead expandido. */}
      {measured ? <div style={{ height: expandedHeight }} /> : null}
    </>
  );
}

export default Header;
