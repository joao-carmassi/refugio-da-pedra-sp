import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { NavMenu } from './nav-menu';
import { SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Link from 'next/link';
import { Separator } from '../ui/separator';

export const NavigationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle asChild>
            <Link href="/">Refúgio da Pedra SP</Link>
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <NavMenu orientation="vertical" className="m-3 items-start" />
      </SheetContent>
    </Sheet>
  );
};

