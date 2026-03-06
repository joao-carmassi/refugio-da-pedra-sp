'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { MinusIcon, PlusIcon } from 'lucide-react';
import generateWhatsLink from '@/lib/generate-whats-link';
import { cn } from '@/lib/utils';
import { ClassNameValue } from 'tailwind-merge';

interface Props {
  chale: string;
  petsPermitidos: boolean;
  className?: ClassNameValue;
}

function CardReserva({
  chale,
  petsPermitidos,
  className,
}: Props): React.ReactNode {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const totalGuests = adults + children;
  const guestLabel = [
    `${adults} adulto${adults !== 1 ? 's' : ''}`,
    children > 0 ? `${children} criança${children !== 1 ? 's' : ''}` : '',
    pets > 0 ? `${pets} anima${pets !== 1 ? 'is' : 'l'} de estimação` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const msgText =
    `Olá, gostaria de reservar o chalé *${chale}* para *${guestLabel}${dateRange?.from && dateRange?.to ? `* no período de *${dateRange.from.toLocaleDateString()} a ${dateRange.to.toLocaleDateString()}` : ''}*.`.replaceAll(
      ' · ',
      ' ',
    );

  return (
    <Card
      className={cn('shadow-xl border border-border py-4 gap-3', className)}
    >
      <CardHeader className='px-5'>
        <CardTitle className='text-2xl'>Reserve agora mesmo</CardTitle>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='w-full border border-border rounded-xl!'>
          <DropdownMenu
            open={dateMenuOpen}
            onOpenChange={(v) => {
              if (!v) setDateMenuOpen(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => setDateMenuOpen((v) => !v)}
                className='rounded-t-xl overflow-hidden grid-cols-[1fr_auto_1fr] grid w-full'
              >
                <div className='w-full py-2 px-3 flex flex-col items-start hover:bg-muted'>
                  <span className='text-xs text-foreground font-medium'>
                    Check-in
                  </span>
                  <span className='text-muted-foreground text-start'>
                    {dateRange?.from?.toLocaleDateString() || 'Adicionar data'}
                  </span>
                </div>
                <Separator orientation='vertical' />
                <div className='w-full py-2 px-3 flex flex-col items-start hover:bg-muted'>
                  <span className='text-xs text-foreground font-medium'>
                    Check-out
                  </span>
                  <span className='text-muted-foreground text-start'>
                    {dateRange?.to?.toLocaleDateString() || 'Adicionar data'}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-fit'>
              <Calendar
                mode='range'
                locale={ptBR}
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => date < today}
                className='w-fit bg-card'
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator className='col-span-3' />
          <DropdownMenu
            open={guestMenuOpen}
            onOpenChange={(v) => {
              if (!v) setGuestMenuOpen(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => setGuestMenuOpen((v) => !v)}
                className='w-full py-2 px-3 rounded-b-xl flex flex-col items-start col-span-3 hover:bg-muted'
              >
                <span className='text-xs text-foreground font-medium'>
                  Hóspedes
                </span>
                <span className='text-muted-foreground text-sm text-start'>
                  {guestLabel}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-4' align='start'>
              <div className='flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>Adultos</span>
                    <span className='text-xs text-muted-foreground'>
                      Com 13 anos ou mais
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      onClick={() => setAdults((v) => Math.max(1, v - 1))}
                      disabled={adults <= 1}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </Button>
                    <span className='w-4 text-center text-sm'>{adults}</span>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      onClick={() => setAdults((v) => v + 1)}
                    >
                      <PlusIcon className='w-3 h-3' />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>Crianças</span>
                    <span className='text-xs text-muted-foreground'>
                      De 2 a 12 anos
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      onClick={() => setChildren((v) => Math.max(0, v - 1))}
                      disabled={children <= 0}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </Button>
                    <span className='w-4 text-center text-sm'>{children}</span>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      onClick={() => setChildren((v) => v + 1)}
                    >
                      <PlusIcon className='w-3 h-3' />
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        !petsPermitidos && 'line-through text-muted-foreground',
                      )}
                    >
                      Animais de estimação
                    </span>
                    {!petsPermitidos && (
                      <span className='text-xs text-muted-foreground'>
                        Não permitido neste chalé
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      onClick={() => setPets((v) => Math.max(0, v - 1))}
                      disabled={pets <= 0 || !petsPermitidos}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </Button>
                    <span
                      className={cn(
                        'w-4 text-center text-sm',
                        !petsPermitidos && 'text-muted-foreground',
                      )}
                    >
                      {pets}
                    </span>
                    <Button
                      variant={'outline'}
                      size='icon-sm'
                      className='rounded-full'
                      disabled={!petsPermitidos}
                      onClick={() => setPets((v) => v + 1)}
                    >
                      <PlusIcon className='w-3 h-3' />
                    </Button>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <CardFooter className='px-5'>
        <Button
          effect={'ringHover'}
          size={'lg'}
          className='w-full rounded-full'
          asChild
        >
          <a target='_blank' href={generateWhatsLink(msgText)}>
            Reservar
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CardReserva;
