import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './ui/navigation-menu';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Menu } from 'lucide-react';

const links = [
  { href: '/chales', label: 'Chalés' },
  { href: '/blog', label: 'Blog' },
  { href: '/reserva', label: 'Reserva', variant: 'default' } as const,
];

function Header(): React.ReactNode {
  return (
    <>
      <header className='w-full h-16 grid place-items-center fixed top-0 z-50'>
        <nav className='container flex items-center justify-between'>
          <div>
            <Link
              className='text-xl font-semibold text-foreground'
              href='/'
              aria-label='Brand'
            >
              Refúgio da Pedra SP
            </Link>
          </div>
          <NavigationMenu className='hidden md:block'>
            <NavigationMenuList>
              {links.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Button
                    effect={link.variant && 'shineHover'}
                    variant={link.variant || 'ghost'}
                    size={link.variant ? 'default' : 'sm'}
                    className={cn(link.variant && 'ml-2', 'rounded-full')}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='md:hidden' size={'icon'} variant='outline'>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuGroup>
                {links.map((link) => (
                  <DropdownMenuItem key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <div className='pt-16' />
    </>
  );
}

export default Header;
