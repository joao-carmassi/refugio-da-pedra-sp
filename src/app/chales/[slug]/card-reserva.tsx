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

interface Props {
  chale: string;
}

function CardReserva({ chale }: Props): React.ReactNode {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // const totalGuests = adults + children;
  const guestLabel = [
    `${adults} adulto${adults !== 1 ? 's' : ''}`,
    children > 0 ? `${children} criança${children !== 1 ? 's' : ''}` : '',
    pets > 0 ? `${pets} animal${pets !== 1 ? 'is' : ''} de estimação` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const msgText = `Olá, gostaria de reservar o chalé ${chale} para ${guestLabel}${dateRange?.from && dateRange?.to ? ` no período de ${dateRange.from.toLocaleDateString()} a ${dateRange.to.toLocaleDateString()}` : ''}.`;

  return (
    <Card className='shadow-xl border border-border py-4 gap-3'>
      <CardHeader className='px-5'>
        <CardTitle className='text-2xl'>Reserve agora mesmo</CardTitle>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='w-full border border-border rounded-xl!'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='rounded-t-xl overflow-hidden grid-cols-[1fr_auto_1fr] grid w-full'>
                <div className='w-full py-2 px-3 flex flex-col items-start hover:bg-muted'>
                  <span className='text-xs text-foreground font-medium'>
                    Check-in
                  </span>
                  <span className='text-muted-foreground'>
                    {dateRange?.from?.toLocaleDateString() || 'Adicionar data'}
                  </span>
                </div>
                <Separator orientation='vertical' />
                <div className='w-full py-2 px-3 flex flex-col items-start hover:bg-muted'>
                  <span className='text-xs text-foreground font-medium'>
                    Check-out
                  </span>
                  <span className='text-muted-foreground'>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='w-full py-2 px-3 rounded-b-xl flex flex-col items-start col-span-3 hover:bg-muted'>
                <span className='text-xs text-foreground font-medium'>
                  Hóspedes
                </span>
                <span className='text-muted-foreground text-sm'>
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
                    <button
                      onClick={() => setAdults((v) => Math.max(1, v - 1))}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40'
                      disabled={adults <= 1}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </button>
                    <span className='w-4 text-center text-sm'>{adults}</span>
                    <button
                      onClick={() => setAdults((v) => v + 1)}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted'
                    >
                      <PlusIcon className='w-3 h-3' />
                    </button>
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
                    <button
                      onClick={() => setChildren((v) => Math.max(0, v - 1))}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40'
                      disabled={children <= 0}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </button>
                    <span className='w-4 text-center text-sm'>{children}</span>
                    <button
                      onClick={() => setChildren((v) => v + 1)}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted'
                    >
                      <PlusIcon className='w-3 h-3' />
                    </button>
                  </div>
                </div>
                <Separator />
                <div className='flex items-center justify-between'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                      Animais de estimação
                    </span>
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => setPets((v) => Math.max(0, v - 1))}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40'
                      disabled={pets <= 0}
                    >
                      <MinusIcon className='w-3 h-3' />
                    </button>
                    <span className='w-4 text-center text-sm'>{pets}</span>
                    <button
                      onClick={() => setPets((v) => v + 1)}
                      className='w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted'
                    >
                      <PlusIcon className='w-3 h-3' />
                    </button>
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
