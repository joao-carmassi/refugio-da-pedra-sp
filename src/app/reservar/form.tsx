'use client';

import { useState, useEffect } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ptBR } from 'date-fns/locale';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import generateWhatsLink from '@/lib/generate-whats-link';
import { cn } from '@/lib/utils';
import chales from '@/data/chales.json';

const schema = z.object({
  nome: z.string().min(2, 'Informe seu nome completo'),
  chale: z.string().min(1, 'Selecione um chalé'),
  checkin: z.date({ message: 'Informe a data de check-in' }),
  checkout: z.date({ message: 'Informe a data de check-out' }),
  adultos: z.number().min(1, 'Mínimo 1 adulto'),
  criancas: z.number().min(0),
  pets: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

function Form(): React.ReactNode {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      chale: '',
      adultos: 1,
      criancas: 0,
      pets: 0,
    },
  });

  const adultos = useWatch({ control, name: 'adultos' }) ?? 1;
  const criancas = useWatch({ control, name: 'criancas' }) ?? 0;
  const pets = useWatch({ control, name: 'pets' }) ?? 0;
  const chaleSelecionadoId = useWatch({ control, name: 'chale' });
  const checkin = useWatch({ control, name: 'checkin' });
  const checkout = useWatch({ control, name: 'checkout' });

  const dateRange: DateRange = { from: checkin, to: checkout };

  const petsPermitidos =
    chales.find((c) => c.id === chaleSelecionadoId)?.politica.pets_permitidos ??
    true;

  useEffect(() => {
    if (!petsPermitidos) {
      setValue('pets', 0);
    }
  }, [petsPermitidos, setValue]);

  const handleDateSelect = (range: DateRange | undefined) => {
    setValue('checkin', range?.from as Date, { shouldValidate: true });
    setValue('checkout', range?.to as Date, { shouldValidate: true });
  };

  const guestLabel = [
    `${adultos} adulto${adultos !== 1 ? 's' : ''}`,
    criancas > 0 ? `${criancas} criança${criancas !== 1 ? 's' : ''}` : '',
    pets > 0 ? `${pets} anima${pets !== 1 ? 'is' : 'l'} de estimação` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const onSubmit = (data: FormData) => {
    const chaleSelecionado = chales.find((c) => c.id === chaleSelecionadoId);
    const msgText = `Olá, me chamo *${data.nome}* e gostaria de reservar o *${chaleSelecionado?.nome}* para *${guestLabel}* no período de *${data.checkin.toLocaleDateString()} a ${data.checkout.toLocaleDateString()}*.`;
    window.open(generateWhatsLink(msgText), '_blank');
  };

  return (
    <Card className='w-full max-w-md shadow-xl'>
      <CardHeader>
        <CardTitle>
          <h1 className='text-2xl tracking-tight md:text-3xl font-normal text-center'>
            Reserve agora mesmo
          </h1>
        </CardTitle>
        <CardDescription className='text-muted-foreground leading-snug text-center'>
          Preencha os dados abaixo para solicitar sua reserva
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Nome */}
            <Field>
              <FieldLabel htmlFor='form-nome'>Nome</FieldLabel>
              <Input
                id='form-nome'
                placeholder='Seu nome completo'
                {...register('nome')}
              />
              {errors.nome && (
                <p className='text-destructive text-xs'>
                  {errors.nome.message}
                </p>
              )}
            </Field>

            {/* Chalé */}
            <Field>
              <FieldLabel htmlFor='form-chale'>Chalé</FieldLabel>
              <Controller
                name='chale'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='form-chale'>
                      <SelectValue placeholder='Selecione um chalé' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {chales.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.nome}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.chale && (
                <p className='text-destructive text-xs'>
                  {errors.chale.message}
                </p>
              )}
            </Field>

            {/* Check-in / Check-out + Hóspedes */}
            <Field>
              <FieldLabel>Datas e hóspedes</FieldLabel>
              <div className='w-full border border-border rounded-xl'>
                {/* Date picker trigger */}
                <DropdownMenu
                  open={dateMenuOpen}
                  onOpenChange={(v) => {
                    if (!v) setDateMenuOpen(false);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      onClick={() => setDateMenuOpen((v) => !v)}
                      className='rounded-t-xl overflow-hidden grid-cols-[1fr_auto_1fr] grid w-full bg-input/30'
                    >
                      <div
                        className={cn(
                          'w-full py-2 px-3 flex flex-col items-start hover:bg-muted',
                          errors.checkin &&
                            'border border-destructive rounded-tl-xl',
                        )}
                      >
                        <span className='text-xs text-foreground font-medium'>
                          Check-in
                        </span>
                        <span className='text-muted-foreground text-sm text-start'>
                          {checkin?.toLocaleDateString() || 'Adicionar data'}
                        </span>
                      </div>
                      <Separator orientation='vertical' />
                      <div
                        className={cn(
                          'w-full py-2 px-3 flex flex-col items-start hover:bg-muted',
                          errors.checkout &&
                            'border border-destructive rounded-tr-xl',
                        )}
                      >
                        <span className='text-xs text-foreground font-medium'>
                          Check-out
                        </span>
                        <span className='text-muted-foreground text-sm text-start'>
                          {checkout?.toLocaleDateString() || 'Adicionar data'}
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
                      onSelect={handleDateSelect}
                      numberOfMonths={2}
                      disabled={(date) => date < today}
                      className='w-fit bg-card'
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <Separator />

                {/* Guest picker trigger */}
                <DropdownMenu
                  open={guestMenuOpen}
                  onOpenChange={(v) => {
                    if (!v) setGuestMenuOpen(false);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      onClick={() => setGuestMenuOpen((v) => !v)}
                      className='w-full py-2 px-3 rounded-b-xl flex flex-col items-start hover:bg-muted bg-input/30'
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
                      {/* Adultos */}
                      <div className='flex items-center justify-between gap-8'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>Adultos</span>
                          <span className='text-xs text-muted-foreground'>
                            Com 13 anos ou mais
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            onClick={() =>
                              setValue('adultos', Math.max(1, adultos - 1), {
                                shouldValidate: true,
                              })
                            }
                            disabled={adultos <= 1}
                          >
                            <MinusIcon className='w-3 h-3' />
                          </Button>
                          <span className='w-4 text-center text-sm'>
                            {adultos}
                          </span>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            onClick={() =>
                              setValue('adultos', adultos + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                      <Separator />
                      {/* Crianças */}
                      <div className='flex items-center justify-between gap-8'>
                        <div className='flex flex-col'>
                          <span className='text-sm font-medium'>Crianças</span>
                          <span className='text-xs text-muted-foreground'>
                            De 2 a 12 anos
                          </span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            onClick={() =>
                              setValue('criancas', Math.max(0, criancas - 1), {
                                shouldValidate: true,
                              })
                            }
                            disabled={criancas <= 0}
                          >
                            <MinusIcon className='w-3 h-3' />
                          </Button>
                          <span className='w-4 text-center text-sm'>
                            {criancas}
                          </span>
                          <Button
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            onClick={() =>
                              setValue('criancas', criancas + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                      <Separator />
                      {/* Pets */}
                      <div className='flex items-center justify-between gap-8'>
                        <div className='flex flex-col'>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              !petsPermitidos &&
                                'line-through text-muted-foreground',
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
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            onClick={() =>
                              setValue('pets', Math.max(0, pets - 1), {
                                shouldValidate: true,
                              })
                            }
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
                            variant='outline'
                            size='icon-sm'
                            className='rounded-full'
                            type='button'
                            disabled={!petsPermitidos}
                            onClick={() =>
                              setValue('pets', pets + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-3 h-3' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {(errors.checkin || errors.checkout) && (
                <p className='text-destructive text-xs'>
                  {errors.checkin?.message || errors.checkout?.message}
                </p>
              )}
            </Field>

            <Button
              type='submit'
              effect='ringHover'
              size='lg'
              className='w-full rounded-full'
            >
              Reservar
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default Form;
