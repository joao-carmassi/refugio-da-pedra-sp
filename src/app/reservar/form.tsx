/* Hallmark · component: booking flow · genre: editorial · design-system: design.md · designed-as-app
 * archetypes: F4 step sequence · C4 sticky bottom bar
 * states: default · hover · focus · active · disabled · error
 *
 * Removido nesta passagem: a foto de fundo com `bg-black/50` e o cartão
 * centrado em `min-h-container`. A rota é uma superfície de tarefa — a foto
 * cobrava contraste (texto branco sobre imagem variável), atrasava o LCP e
 * empurrava o formulário para fora da primeira tela no celular. O enredo agora
 * é o próprio processo: quatro estágios numerados e o que acontece depois.
 */
'use client';

import { Fragment, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ptBR } from 'date-fns/locale';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import generateWhatsLink from '@/lib/generate-whats-link';
import { cn } from '@/lib/utils';
import chales from '@/data/chales.json';

// Horários de operação da pousada (mesmos valores exibidos no FAQ da home).
const CHECKIN_HORA = '14h';
const CHECKOUT_HORA = '12h';

// Estadia máxima aceita pelo formulário. Acima disso o hóspede é orientado a
// falar direto com a pousada, porque envolve condições específicas.
const MAX_NOITES = 30;

const UM_DIA_EM_MS = 1000 * 60 * 60 * 24;

// Mesmo gutter do `page.tsx`. Duplicado de propósito: extrair a constante para
// um módulo compartilhado obrigaria a editar as outras rotas que já a repetem.
const SHELL = 'mx-auto w-full max-w-5xl px-5 sm:px-8';

// Anel de foco da casa (idêntico ao do `Button`), aplicado à mão nos alvos que
// não passam pelo `buttonVariants`.
const FOCUS = 'outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

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
    chale: z.string().min(1, 'Escolha uma das acomodações acima'),
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

/**
 * Dois meses de calendário só cabem a partir de ~640px: em 320px o popover
 * ultrapassa a viewport e o mês seguinte fica inalcançável. Começa em `false`
 * — o servidor renderiza o caso estreito, que é o que a maioria dos visitantes
 * recebe, e o mês extra entra depois da hidratação em telas largas.
 *
 * Cópia deliberada do hook de `chales/[slug]/card-reserva.tsx`: promovê-lo a
 * módulo compartilhado exigiria editar aquela rota, que está fora do escopo
 * desta passagem.
 */
function useTwoMonthCalendar(): boolean {
  const [twoMonths, setTwoMonths] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 40rem)');
    const sync = () => setTwoMonths(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return twoMonths;
}

/**
 * F4 · Estágio numerado. O número fica na mesma linha do título, dentro do
 * mesmo `<h2>` — nunca em coluna própria à esquerda: cabeçalho de duas colunas
 * (rótulo à esquerda, título à direita) é um dos tells mais confiáveis de
 * página gerada, e em 320px come metade da largura útil.
 */
function Estagio({
  numero,
  titulo,
  descricao,
  children,
}: {
  numero: number;
  titulo: string;
  descricao?: string;
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <section className='mt-10 border-t border-border pt-6 first:mt-0 first:border-t-0 first:pt-0'>
      <h2 className='flex min-w-0 items-baseline gap-2.5 text-xl tracking-tight text-pretty [overflow-wrap:anywhere] sm:text-2xl'>
        <span
          aria-hidden='true'
          className='font-text text-sm font-medium tabular-nums text-accent-deep'
        >
          {numero}
        </span>
        {titulo}
      </h2>
      {descricao && (
        <p className='mt-1.5 max-w-[62ch] text-sm leading-relaxed text-muted-foreground'>
          {descricao}
        </p>
      )}
      <div className='mt-5'>{children}</div>
    </section>
  );
}

/**
 * Linha de apoio do campo. Altura mínima reservada mesmo vazia: sem isso, o
 * primeiro erro empurra o resto do formulário para baixo enquanto a pessoa
 * ainda está lendo. O erro substitui a dica — nunca aparecem os dois.
 */
function Nota({
  id,
  erro,
  children,
}: {
  id: string;
  erro?: string;
  children?: React.ReactNode;
}): React.ReactNode {
  return (
    <p
      id={id}
      role={erro ? 'alert' : undefined}
      className={cn(
        'mt-2 min-h-5 text-sm leading-5',
        erro ? 'font-medium text-destructive' : 'text-muted-foreground',
      )}
    >
      {erro ?? children}
    </p>
  );
}

/**
 * Contador de hóspedes. Ficava dentro de um dropdown; virou linha direta no
 * fluxo — no celular o popover custava um toque a mais e podia estourar a
 * viewport. Alvos de 44px (WCAG 2.5.8).
 */
function Contador({
  rotulo,
  detalhe,
  valor,
  minimo,
  desabilitado,
  onChange,
}: {
  rotulo: string;
  detalhe?: string;
  valor: number;
  minimo: number;
  desabilitado?: boolean;
  onChange: (valor: number) => void;
}): React.ReactNode {
  return (
    <div className='flex items-center justify-between gap-4 border-t border-border py-3 first:border-t-0'>
      <div className='flex min-w-0 flex-col'>
        <span
          className={cn(
            'text-sm font-medium',
            desabilitado && 'text-muted-foreground line-through',
          )}
        >
          {rotulo}
        </span>
        {detalhe && (
          <span className='text-xs text-muted-foreground'>{detalhe}</span>
        )}
      </div>
      <div className='flex shrink-0 items-center gap-2'>
        <Button
          variant='outline'
          size='icon'
          className='size-11 rounded-full'
          type='button'
          aria-label={`Remover um item de ${rotulo.toLowerCase()}`}
          onClick={() => onChange(Math.max(minimo, valor - 1))}
          disabled={desabilitado || valor <= minimo}
        >
          <MinusIcon className='h-4 w-4' />
        </Button>
        <span
          aria-live='polite'
          className={cn(
            'w-6 text-center text-sm tabular-nums',
            desabilitado && 'text-muted-foreground',
          )}
        >
          {valor}
        </span>
        <Button
          variant='outline'
          size='icon'
          className='size-11 rounded-full'
          type='button'
          aria-label={`Adicionar um item de ${rotulo.toLowerCase()}`}
          onClick={() => onChange(valor + 1)}
          disabled={desabilitado}
        >
          <PlusIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}

function Form(): React.ReactNode {
  const today = inicioDeHoje();
  const twoMonths = useTwoMonthCalendar();
  const [dateMenuOpen, setDateMenuOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Valida no primeiro blur e revalida a cada mudança depois disso. Validar
    // em cada tecla desde o início é hostil: o campo fica vermelho enquanto a
    // pessoa ainda está digitando a segunda letra do nome.
    mode: 'onTouched',
    defaultValues: {
      nome: '',
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

  const chaleSelecionado = chales.find((c) => c.id === chaleSelecionadoId);
  const petsPermitidos = chaleSelecionado?.politica.pets_permitidos ?? true;

  const dateRange: DateRange = { from: checkin, to: checkout };

  const noites =
    checkin && checkout ? Math.max(0, contarNoites(checkin, checkout)) : 0;

  const erroDatas = errors.checkin?.message || errors.checkout?.message;

  useEffect(() => {
    if (!petsPermitidos) {
      setValue('pets', 0);
    }
  }, [petsPermitidos, setValue]);

  const handleDateSelect = (range: DateRange | undefined) => {
    const from = range?.from;
    // O react-day-picker devolve `{ from: X, to: X }` no primeiro toque, não
    // `{ from: X, to: undefined }`. Gravar esse `to` faria o formulário acusar
    // "o check-out precisa ser depois do check-in" por um toque que a pessoa
    // ainda não terminou de dar — e fecharia o calendário no meio da escolha.
    const to =
      from && range?.to && range.to.getTime() !== from.getTime()
        ? range.to
        : undefined;

    const completo = Boolean(from && to);

    setValue('checkin', from as Date, { shouldValidate: completo });
    setValue('checkout', to as Date, { shouldValidate: completo });

    // Intervalo fechado: o popover já cumpriu a função. Fechá-lo devolve a
    // página inteira ao polegar em vez de exigir um toque fora do calendário.
    if (completo) setDateMenuOpen(false);
  };

  const guestLabel = [
    `${adultos} adulto${adultos !== 1 ? 's' : ''}`,
    criancas > 0 ? `${criancas} criança${criancas !== 1 ? 's' : ''}` : '',
    pets > 0 ? `${pets} anima${pets !== 1 ? 'is' : 'l'} de estimação` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const nomeCorrido = chaleSelecionado?.nome.replace(' · ', ' ');

  // Um controle só. O calendário é `mode="range"`: dois gatilhos separados
  // prometiam dois campos independentes que nunca existiram — tocar no de
  // check-out abria exatamente o mesmo seletor de intervalo, e a escolha
  // continuava sendo uma só. Enquanto falta o check-out o reticências marca
  // a metade em aberto.
  const rotuloDatas = checkin
    ? `${formatarData(checkin)} – ${checkout ? formatarData(checkout) : '…'}`
    : 'Escolher datas';

  const onSubmit = (data: FormData) => {
    const escolhido = chales.find((c) => c.id === data.chale);
    const totalNoites = contarNoites(data.checkin, data.checkout);
    const msgText = [
      `Olá, me chamo *${data.nome}* e gostaria de solicitar uma reserva no Refúgio da Pedra SP, em São Bento do Sapucaí.`,
      `*Acomodação:* ${escolhido?.nome.replace(' · ', ' ')}`,
      `*Check-in:* ${formatarData(data.checkin)} (a partir das ${CHECKIN_HORA})`,
      `*Check-out:* ${formatarData(data.checkout)} (até as ${CHECKOUT_HORA})`,
      `*Noites:* ${totalNoites}`,
      `*Hóspedes:* ${guestLabel}`,
      'Podem confirmar a disponibilidade e o valor da diária, por favor?',
    ].join('\n');
    window.open(generateWhatsLink(msgText), '_blank');
  };

  // Resumo vivo. Alimenta o cartão fixo do desktop; a barra do mobile mostra a
  // versão curta das mesmas três informações.
  const resumo: [string, string][] = [
    ['Acomodação', nomeCorrido ?? '—'],
    ['Check-in', checkin ? `${formatarData(checkin)} · ${CHECKIN_HORA}` : '—'],
    [
      'Check-out',
      checkout ? `${formatarData(checkout)} · ${CHECKOUT_HORA}` : '—',
    ],
    ['Noites', noites > 0 ? String(noites) : '—'],
    ['Hóspedes', guestLabel],
  ];

  return (
    <div className='mt-10'>
      <div
        className={`${SHELL} lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:items-start lg:gap-x-12`}
      >
        {/* Coluna esquerda. O formulário e o "o que acontece depois" ficam no
            mesmo trilho para que o cartão fixo da direita continue ao lado dos
            dois — antes o cartão parava onde o formulário acabava e a última
            seção corria sozinha na largura inteira. */}
        <div className='min-w-0'>
          <form id='form-reserva' noValidate onSubmit={handleSubmit(onSubmit)}>
            {/* ---------- 1 · Acomodação ---------- */}
            <Estagio
              numero={1}
              titulo='Acomodação'
              descricao='Cinco unidades, cada uma com capacidade e política de pets própria.'
            >
              <fieldset aria-describedby='nota-chale'>
                <legend className='sr-only'>Escolha a acomodação</legend>
                {/* Rádios no fluxo normal — nada de âncora nem `scrollIntoView`,
                  que fariam a página saltar a cada escolha no celular. */}
                {chales.map((c) => {
                  const marcado = chaleSelecionadoId === c.id;

                  return (
                    <label
                      key={c.id}
                      className='flex min-h-14 cursor-pointer items-start gap-3 border-t border-border py-3 first:border-t-0 hover:bg-muted/50'
                    >
                      <input
                        type='radio'
                        value={c.id}
                        {...register('chale')}
                        className={`mt-0.5 size-5 shrink-0 rounded-full accent-primary ${FOCUS}`}
                      />
                      <span className='min-w-0'>
                        <span
                          className={cn(
                            'block text-sm font-medium',
                            marcado ? 'text-accent-deep' : 'text-foreground',
                          )}
                        >
                          {c.nome.replace(' · ', ' ')}
                        </span>
                        <span className='mt-0.5 block text-sm text-muted-foreground'>
                          {c.capacidade} · {c.camas} · {c.tamanho}
                        </span>
                        {!c.politica.pets_permitidos && (
                          <span className='mt-0.5 block text-xs text-muted-foreground'>
                            Não aceita pets
                          </span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <Nota id='nota-chale' erro={errors.chale?.message} />
            </Estagio>

            {/* ---------- 2 · Datas ---------- */}
            <Estagio
              numero={2}
              titulo='Datas'
              descricao={`Entrada a partir das ${CHECKIN_HORA}, saída até as ${CHECKOUT_HORA}.`}
            >
              {/* O sinal de erro é um anel, não uma borda extra: trocar a
                espessura da borda desloca o bloco em 1px quando a validação
                dispara. O anel ocupa fora do fluxo. */}
              <div
                className={cn(
                  'w-full rounded-xl border border-border',
                  erroDatas && 'ring-3 ring-destructive/25',
                )}
              >
                <DropdownMenu
                  open={dateMenuOpen}
                  onOpenChange={(v) => {
                    if (!v) setDateMenuOpen(false);
                  }}
                >
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      aria-describedby='nota-datas'
                      onClick={() => setDateMenuOpen((v) => !v)}
                      className={cn(
                        'flex min-h-14 w-full min-w-0 flex-col items-start justify-center rounded-xl bg-input/30 px-3 py-2 hover:bg-muted active:bg-muted',
                        FOCUS,
                      )}
                    >
                      <span className='text-xs font-medium text-foreground'>
                        Check-in · Check-out
                      </span>
                      <span className='max-w-full truncate text-start text-sm tabular-nums text-muted-foreground'>
                        {rotuloDatas}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='center'
                    collisionPadding={12}
                    className='w-fit max-w-[calc(100vw-1.5rem)] overflow-x-auto'
                  >
                    <Calendar
                      mode='range'
                      locale={ptBR}
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateSelect}
                      numberOfMonths={twoMonths ? 2 : 1}
                      disabled={(date) => date < today}
                      className='w-fit bg-card'
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Nota id='nota-datas' erro={erroDatas}>
                {noites > 0
                  ? `${noites} noite${noites !== 1 ? 's' : ''} · ${formatarData(checkin!)} a ${formatarData(checkout!)}`
                  : checkin
                    ? 'Agora escolha a data de check-out.'
                    : 'Abra o calendário e marque o período da estadia.'}
              </Nota>
            </Estagio>

            {/* ---------- 3 · Hóspedes ---------- */}
            <Estagio numero={3} titulo='Hóspedes'>
              <Contador
                rotulo='Adultos'
                detalhe='Com 13 anos ou mais'
                valor={adultos}
                minimo={1}
                onChange={(v) =>
                  setValue('adultos', v, { shouldValidate: true })
                }
              />
              <Contador
                rotulo='Crianças'
                detalhe='De 2 a 12 anos'
                valor={criancas}
                minimo={0}
                onChange={(v) =>
                  setValue('criancas', v, { shouldValidate: true })
                }
              />
              <Contador
                rotulo='Animais de estimação'
                detalhe={
                  petsPermitidos
                    ? undefined
                    : `Não permitido no ${nomeCorrido ?? 'chalé escolhido'}`
                }
                valor={pets}
                minimo={0}
                desabilitado={!petsPermitidos}
                onChange={(v) => setValue('pets', v, { shouldValidate: true })}
              />
            </Estagio>

            {/* ---------- 4 · Seus dados ---------- */}
            <Estagio numero={4} titulo='Seus dados'>
              <label
                htmlFor='form-nome'
                className='block text-sm font-medium text-foreground'
              >
                Nome
              </label>
              <Input
                id='form-nome'
                // h-11 = 44px: mesmo alvo de toque dos botões da página. Um
                // formulário com botões de 44px e campos de 36px lê como
                // desafinado.
                className='mt-2 h-11'
                placeholder='Seu nome completo'
                autoComplete='name'
                aria-invalid={errors.nome ? true : undefined}
                aria-describedby='nota-nome'
                {...register('nome')}
              />
              <Nota id='nota-nome' erro={errors.nome?.message}>
                É o nome que vai na mensagem do WhatsApp.
              </Nota>
            </Estagio>
          </form>

          {/* ---------- O que acontece depois ---------- */}
          {/* O handoff honesto que antes vivia em letra miúda embaixo do
              botão. É a continuação real do processo — por isso são estágios
              numerados, na mesma linguagem dos quatro de cima. */}
          <section className='mt-12'>
            <h2 className='border-t border-border pt-6 text-xl tracking-tight sm:text-2xl'>
              O que acontece depois
            </h2>
            <ol className='mt-5'>
              {[
                [
                  'Você envia',
                  'O botão abre o WhatsApp da pousada com a mensagem já escrita. É só apertar enviar.',
                ],
                [
                  'Nós conferimos',
                  'Verificamos a disponibilidade da acomodação escolhida para as datas que você marcou.',
                ],
                [
                  'Respondemos',
                  'Voltamos com o valor da diária e a forma de pagamento.',
                ],
              ].map(([titulo, texto], indice) => (
                <li
                  key={titulo}
                  className='flex gap-3 border-t border-border py-4 first:border-t-0 first:pt-0'
                >
                  <span
                    aria-hidden='true'
                    className='mt-0.5 text-sm font-medium tabular-nums text-accent-deep'
                  >
                    {indice + 1}
                  </span>
                  <span className='min-w-0'>
                    <span className='block font-medium'>{titulo}</span>
                    <span className='mt-1 block max-w-[62ch] text-sm leading-relaxed text-muted-foreground'>
                      {texto}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className='mt-4 max-w-[62ch] text-sm leading-relaxed text-muted-foreground'>
              O envio é uma solicitação de reserva, não uma confirmação: não há
              cobrança nesta etapa.
            </p>
          </section>
        </div>

        {/* ---------- Resumo fixo (desktop) ---------- */}
        {/* `top-32` deixa o cabeçalho compacto passar por cima sem cobrir o
            topo do cartão. No mobile o mesmo papel é da barra inferior. */}
        <aside className='sticky top-24 mt-10 hidden h-fit rounded-2xl border border-border bg-card p-5 lg:mt-0 lg:block'>
          <h2 className='text-lg tracking-tight'>Sua solicitação</h2>
          <dl className='mt-4 grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] text-sm'>
            {resumo.map(([rotulo, valor]) => (
              <Fragment key={rotulo}>
                <dt className='border-t border-border py-2 text-foreground'>
                  {rotulo}
                </dt>
                <dd className='border-t border-border py-2 text-muted-foreground'>
                  {valor}
                </dd>
              </Fragment>
            ))}
          </dl>
          <Button
            type='submit'
            form='form-reserva'
            className='mt-5 h-11 w-full rounded-full'
          >
            Enviar pelo WhatsApp
          </Button>
          <p className='mt-3 text-xs leading-relaxed text-muted-foreground'>
            Sem cobrança e sem confirmação automática nesta etapa.
          </p>
        </aside>
      </div>

      {/* ---------- C4 · barra fixa (mobile) ---------- */}
      {/* `sticky` e não `fixed`: assim ela some quando o rodapé entra em cena,
          em vez de cobri-lo. Mora fora do grid para que nenhum ancestral com
          `overflow` a prenda. */}
      <div className='sticky bottom-0 z-30 mt-10 shadow bg-card lg:hidden'>
        <div
          className={`${SHELL} flex items-center justify-between gap-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]`}
        >
          <p className='min-w-0 text-sm leading-tight text-muted-foreground'>
            <span className='block truncate font-medium text-foreground'>
              {nomeCorrido ?? 'Escolha uma acomodação'}
            </span>
            <span className='block truncate'>
              {noites > 0
                ? `${noites} noite${noites !== 1 ? 's' : ''} · ${guestLabel}`
                : guestLabel}
            </span>
          </p>
          {/* Rótulo curto de propósito: "Enviar pelo WhatsApp" quebra em duas
              linhas em 320px, e rótulo de botão em duas linhas lê como erro de
              layout. */}
          <Button
            type='submit'
            form='form-reserva'
            className='h-11 shrink-0 rounded-full px-6 whitespace-nowrap'
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Form;
