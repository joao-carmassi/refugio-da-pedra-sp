'use client';

import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
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

// Horários de operação da pousada (mesmos valores exibidos no FAQ da home).
const CHECKIN_HORA = '14h';
const CHECKOUT_HORA = '12h';

// Estadia máxima aceita pelo formulário. Acima disso o hóspede é orientado a
// falar direto com a pousada, porque envolve condições específicas.
const MAX_NOITES = 30;

// TODO: confirmar com o proprietário o tempo médio real de resposta no
// WhatsApp e o horário de atendimento. Os valores abaixo são a expectativa
// comunicada ao hóspede e devem refletir a operação real.
const TEMPO_RESPOSTA = 'em até 2 horas, das 8h às 20h';

const UM_DIA_EM_MS = 1000 * 60 * 60 * 24;

const inicioDeHoje = (): Date => {
  const data = new Date();
  data.setHours(0, 0, 0, 0);
  return data;
};

const contarNoites = (checkin: Date, checkout: Date): number =>
  Math.round((checkout.getTime() - checkin.getTime()) / UM_DIA_EM_MS);

const formatarData = (data: Date): string => data.toLocaleDateString('pt-BR');

const schema = z
  .object({
    nome: z.string().min(2, 'Informe seu nome completo'),
    chale: z.string().min(1, 'Selecione um chalé'),
    checkin: z.date({ message: 'Informe a data de check-in' }),
    checkout: z.date({ message: 'Informe a data de check-out' }),
    adultos: z.number().min(1, 'Mínimo 1 adulto'),
    criancas: z.number().min(0),
    pets: z.number().min(0),
  })
  .refine((d) => !d.checkin || d.checkin >= inicioDeHoje(), {
    message: 'A data de check-in não pode estar no passado',
    path: ['checkin'],
  })
  .refine((d) => !d.checkin || !d.checkout || d.checkout > d.checkin, {
    message: 'O check-out precisa ser depois do check-in',
    path: ['checkout'],
  })
  .refine(
    (d) =>
      !d.checkin ||
      !d.checkout ||
      contarNoites(d.checkin, d.checkout) <= MAX_NOITES,
    {
      message: `Estadias acima de ${MAX_NOITES} noites são combinadas direto com a pousada`,
      path: ['checkout'],
    },
  );

type FormData = z.infer<typeof schema>;

function Form(): React.ReactNode {
  const today = inicioDeHoje();

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

  const noites =
    checkin && checkout ? Math.max(0, contarNoites(checkin, checkout)) : 0;

  const mostrarResumoDatas =
    Boolean(checkin) &&
    Boolean(checkout) &&
    noites > 0 &&
    !errors.checkin &&
    !errors.checkout;

  const petsPermitidos =
    chales.find((c) => c.id === chaleSelecionadoId)?.politica.pets_permitidos ??
    true;

  useEffect(() => {
    if (!petsPermitidos) {
      setValue('pets', 0);
    }
  }, [petsPermitidos, setValue]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.set('.gsap-reveal-reservar', { y: 40, opacity: 0 });
    tl.to(
      '.gsap-reveal-reservar',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'expo.out',
        stagger: 0.08,
      },
      0,
    );
  }, []);

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
    const totalNoites = contarNoites(data.checkin, data.checkout);
    const msgText = [
      `Olá, me chamo *${data.nome}* e gostaria de solicitar uma reserva no Refúgio da Pedra SP, em São Bento do Sapucaí.`,
      `*Acomodação:* ${chaleSelecionado?.nome}`,
      `*Check-in:* ${formatarData(data.checkin)} (a partir das ${CHECKIN_HORA})`,
      `*Check-out:* ${formatarData(data.checkout)} (até as ${CHECKOUT_HORA})`,
      `*Noites:* ${totalNoites}`,
      `*Hóspedes:* ${guestLabel}`,
      'Podem confirmar a disponibilidade e o valor da diária, por favor?',
    ].join('\n');
    window.open(generateWhatsLink(msgText), '_blank');
  };

  return (
    <Card className='w-full max-w-md shadow-xl'>
      <CardHeader className='gsap-reveal-reservar opacity-0'>
        <CardTitle>
          <h2 className='text-2xl tracking-tight md:text-3xl font-normal text-center'>
            Solicite sua reserva
          </h2>
        </CardTitle>
        <CardDescription className='text-muted-foreground leading-snug text-center'>
          Preencha os dados abaixo. Ao enviar, abrimos o WhatsApp da pousada com
          a sua solicitação já escrita — é só apertar enviar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Nome */}
            <Field className='gsap-reveal-reservar opacity-0'>
              <FieldLabel htmlFor='form-nome'>Nome</FieldLabel>
              <Input
                id='form-nome'
                className='min-h-11'
                placeholder='Seu nome completo'
                autoComplete='name'
                {...register('nome')}
              />
              {errors.nome && (
                <p className='text-destructive text-xs'>
                  {errors.nome.message}
                </p>
              )}
            </Field>

            {/* Chalé */}
            <Field className='gsap-reveal-reservar opacity-0'>
              <FieldLabel htmlFor='form-chale'>Chalé</FieldLabel>
              <Controller
                name='chale'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id='form-chale' className='w-full min-h-11'>
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
            <Field className='gsap-reveal-reservar opacity-0'>
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
                          'w-full min-h-11 py-2 px-3 flex flex-col items-start justify-center hover:bg-muted',
                          errors.checkin &&
                            'border border-destructive rounded-tl-xl',
                        )}
                      >
                        <span className='text-xs text-foreground font-medium'>
                          Check-in · a partir das {CHECKIN_HORA}
                        </span>
                        <span className='text-muted-foreground text-sm text-start'>
                          {checkin ? formatarData(checkin) : 'Adicionar data'}
                        </span>
                      </div>
                      <Separator orientation='vertical' />
                      <div
                        className={cn(
                          'w-full min-h-11 py-2 px-3 flex flex-col items-start justify-center hover:bg-muted',
                          errors.checkout &&
                            'border border-destructive rounded-tr-xl',
                        )}
                      >
                        <span className='text-xs text-foreground font-medium'>
                          Check-out · até as {CHECKOUT_HORA}
                        </span>
                        <span className='text-muted-foreground text-sm text-start'>
                          {checkout ? formatarData(checkout) : 'Adicionar data'}
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
                      className='w-full min-h-11 py-2 px-3 rounded-b-xl flex flex-col items-start justify-center hover:bg-muted bg-input/30'
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
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Remover um adulto'
                            onClick={() =>
                              setValue('adultos', Math.max(1, adultos - 1), {
                                shouldValidate: true,
                              })
                            }
                            disabled={adultos <= 1}
                          >
                            <MinusIcon className='w-4 h-4' />
                          </Button>
                          <span className='w-4 text-center text-sm'>
                            {adultos}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Adicionar um adulto'
                            onClick={() =>
                              setValue('adultos', adultos + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-4 h-4' />
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
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Remover uma criança'
                            onClick={() =>
                              setValue('criancas', Math.max(0, criancas - 1), {
                                shouldValidate: true,
                              })
                            }
                            disabled={criancas <= 0}
                          >
                            <MinusIcon className='w-4 h-4' />
                          </Button>
                          <span className='w-4 text-center text-sm'>
                            {criancas}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Adicionar uma criança'
                            onClick={() =>
                              setValue('criancas', criancas + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-4 h-4' />
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
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Remover um animal de estimação'
                            onClick={() =>
                              setValue('pets', Math.max(0, pets - 1), {
                                shouldValidate: true,
                              })
                            }
                            disabled={pets <= 0 || !petsPermitidos}
                          >
                            <MinusIcon className='w-4 h-4' />
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
                            size='icon'
                            className='size-11 rounded-full'
                            type='button'
                            aria-label='Adicionar um animal de estimação'
                            disabled={!petsPermitidos}
                            onClick={() =>
                              setValue('pets', pets + 1, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <PlusIcon className='w-4 h-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {mostrarResumoDatas && checkin && checkout && (
                <p className='text-muted-foreground text-xs'>
                  {noites} noite{noites !== 1 ? 's' : ''} · check-in{' '}
                  {formatarData(checkin)} às {CHECKIN_HORA} · check-out{' '}
                  {formatarData(checkout)} até as {CHECKOUT_HORA}
                </p>
              )}
              {(errors.checkin || errors.checkout) && (
                <p className='text-destructive text-xs'>
                  {errors.checkin?.message || errors.checkout?.message}
                </p>
              )}
            </Field>

            <Button
              type='submit'
              size='lg'
              className='gsap-reveal-reservar opacity-0 h-11 w-full rounded-full'
            >
              Enviar solicitação pelo WhatsApp
            </Button>

            {/* Handoff honesto: o formulário não confirma reserva, apenas abre
                a conversa no WhatsApp com os dados preenchidos. */}
            <p className='text-muted-foreground text-xs leading-relaxed text-center'>
              Não há cobrança nem confirmação automática nesta etapa. Nós
              conferimos a disponibilidade da acomodação escolhida e respondemos
              com o valor e a forma de pagamento — normalmente {TEMPO_RESPOSTA}.
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}

export default Form;
