'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';

interface Props {
  chale: string;
}

function CardReserva({ chale }: Props): React.ReactNode {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Card className='shadow-xl border border-border py-4 gap-3'>
      <CardHeader className='px-5'>
        <CardTitle className='text-2xl'>Reserve agora mesmo</CardTitle>
      </CardHeader>
      <CardContent className='px-5'>
        <div className='w-full border border-border rounded-xl!'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='rounded-xl grid-cols-[1fr_auto_1fr] grid w-full'>
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
                  Hospedes
                </span>
                <span className='text-muted-foreground'>1 Hospede</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      <CardFooter className='px-5'>
        <Button size={'lg'} className='w-full'>
          Reservar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CardReserva;
