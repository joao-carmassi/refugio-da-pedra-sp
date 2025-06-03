import { Button } from '@/components/ui/button';
import { NavigationSheet } from './navigation-sheet';
import Link from 'next/link';
import { NavMenu } from './nav-menu';

const NavBar = () => {
  return (
    <nav className="h-16 bg-card border border-border fixed top-0 w-full z-40">
      <div className="max-w-7xl w-full mx-auto h-full flex items-center justify-between px-6 md:px-12">
        <div className="flex-1">
          <Link
            className="text-xl font-semibold text-foreground"
            href="/"
            aria-label="Brand"
          >
            Refúgio da Pedra SP
          </Link>
        </div>

        {/* Desktop Menu */}

        <div className="flex justify-end items-center gap-5 flex-1">
          <NavMenu className="hidden md:block" />
          <Button
            className="text-sm tracking-wide"
            asChild
            size="lg"
            effect="ringHover"
          >
            <Link href="/reservar">Reservar</Link>
          </Button>
          {/* Mobile Menu */}
          <div className="md:hidden">
            <NavigationSheet />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
