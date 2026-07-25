'use client';

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { useState } from 'react';

// `trailingSlash: true` (next.config.ts) — todo href interno precisa terminar
// com barra, senão o Next responde 308 antes de servir a página.
const links = [
  { href: '/chales/', label: 'Chalés' },
  { href: '/blog/', label: 'Blog' },
];

function Header(): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className='w-full h-16 grid place-items-center fixed top-0 z-50 bg-card'>
        <nav className='container flex items-center justify-between'>
          <div>
            <Link
              className='md:text-xl font-semibold text-foreground font-display'
              href='/'
              aria-label='Brand'
            >
              Refúgio da Pedra SP
            </Link>
          </div>
          <div className='flex items-center gap-2'>
            <NavigationMenu className='hidden md:block'>
              <NavigationMenuList>
                {links.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Button
                      asChild
                      variant='ghost'
                      size='sm'
                      className='rounded-full'
                    >
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <Button
              effect={'shineHover'}
              className='ml-2 md:rounded-full'
              asChild
            >
              <Link href='/reservar/'>Reservar</Link>
            </Button>

            {/* Mobile */}
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label='Menu de navegação'
                  // size-11 = 44px: alvo mínimo de toque recomendado (WCAG 2.5.8).
                  className='md:hidden size-11'
                  size={'icon'}
                  variant='outline'
                >
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={6}
                align='end'
                className='w-44 bg-popover'
              >
                <DropdownMenuGroup>
                  {links.map((link) => (
                    <DropdownMenuItem asChild key={link.href}>
                      <Link onClick={() => setIsOpen(false)} href={link.href}>
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>
      {/* Scrim do menu mobile: sem ele o painel flutua sobre o H1 do hero, que
          fica visível mas ilegível por trás. z-40 mantém o header (z-50) e o
          painel do dropdown por cima. */}
      {isOpen ? (
        <div
          aria-hidden='true'
          className='fixed inset-0 z-40 bg-background/85 backdrop-blur-sm pointer-events-none md:hidden'
        />
      ) : null}
      <div className='pt-16' />
    </>
  );
}

export default Header;
