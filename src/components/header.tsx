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

const links = [
  { href: '/chales', label: 'Chalés' },
  { href: '/blog', label: 'Blog' },
];

function Header(): React.ReactNode {
  return (
    <>
      <header className='w-full h-16 grid place-items-center fixed top-0 z-50 bg-card'>
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
          <div className='flex items-center gap-2'>
            <NavigationMenu className='hidden md:block'>
              <NavigationMenuList>
                {links.map((link) => (
                  <NavigationMenuItem key={link.href}>
                    <Button variant='ghost' size='sm' className='rounded-full'>
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
              <Link href='/reserva'>Reservar</Link>
            </Button>

            {/* Mobile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='md:hidden' size={'icon'} variant='outline'>
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={6} align='end'>
                <DropdownMenuGroup>
                  {links.map((link) => (
                    <DropdownMenuItem key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>
      <div className='pt-16' />
    </>
  );
}

export default Header;
