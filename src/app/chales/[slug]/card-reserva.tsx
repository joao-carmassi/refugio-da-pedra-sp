/* Hallmark · component: booking rail + sticky bar · genre: editorial
 * C4 knobs: reveal=after-fold, anchored=viewport-bottom, shadow=hairline
 * states: default · hover · focus · active · disabled · loading(n/a) · error(n/a) · success(n/a)
 * design-system: design.md · designed-as-app
 */
'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAfterFold } from '@/hooks/use-after-fold';
import generateWhatsLink from '@/lib/generate-whats-link';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { ChevronDown, MinusIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';

interface Props {
  chale: string;
  petsPermitidos: boolean;
}

// Anel de foco da casa, aplicado à mão nos alvos que não passam pelo Button.
const focusRing =
  'outline-none rounded-xs focus-visible:ring-3 focus-visible:ring-ring/50';

// Curva expo-out do design system. Usada só na entrada da barra mobile —
// é a única motion desta ilha.
const barMotion =
  'transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:translate-y-0';

/** Um passo de contador. Alvo de toque de 44px via `after`, sem inflar o botão. */
function Stepper({
  label,
  hint,
  value,
  min,
  disabled = false,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  disabled?: boolean;
  onChange: (next: number) => void;
}): React.ReactNode {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            disabled && 'text-muted-foreground line-through',
          )}
        >
          {label}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Menos ${label.toLowerCase()}`}
          className='relative rounded-full after:absolute after:-inset-1.5 after:content-[""]'
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={disabled || value <= min}
        >
          <MinusIcon className="h-3 w-3" />
        </Button>
        <span
          className={cn(
            'w-4 text-center text-sm tabular-nums',
            disabled && 'text-muted-foreground',
          )}
        >
          {value}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label={`Mais ${label.toLowerCase()}`}
          className='relative rounded-full after:absolute after:-inset-1.5 after:content-[""]'
          onClick={() => onChange(value + 1)}
          disabled={disabled}
        >
          <PlusIcon className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Uma única instância governa as duas superfícies de reserva — o trilho sticky
 * do desktop e a barra fixa do mobile. Antes eram dois `<CardReserva>` montados
 * lado a lado, cada um com seu `useState`: quem escolhia a data no mobile e
 * girava o aparelho encontrava o formulário vazio.
 */
function CardReserva({ chale, petsPermitidos }: Props): React.ReactNode {
  // Lido direto da sentinela que a dobra publica no DOM, e não recebido por
  // prop: os dois componentes são irmãos sob `page.tsx`, que é servidor e não
  // pode segurar estado. Ver `use-after-fold`.
  const afterFold = useAfterFold();

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // A barra só existe depois da dobra. Se o leitor voltar ao topo com o painel
  // aberto, ele recolhe junto — derivado, não sincronizado por efeito, senão
  // haveria um render intermediário com a barra fora da tela e o painel aberto.
  const panelOpen = sheetOpen && afterFold;

  const guestLabel = [
    `${adults} adulto${adults !== 1 ? 's' : ''}`,
    children > 0 ? `${children} criança${children !== 1 ? 's' : ''}` : '',
    pets > 0 ? `${pets} anima${pets !== 1 ? 'is' : 'l'} de estimação` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const checkIn = dateRange?.from?.toLocaleDateString();
  const checkOut = dateRange?.to?.toLocaleDateString();

  const msgText =
    `Olá, gostaria de reservar o chalé *${chale}* para *${guestLabel}${dateRange?.from && dateRange?.to ? `* no período de *${dateRange.from.toLocaleDateString()} a ${dateRange.to.toLocaleDateString()}` : ''}*.`.replaceAll(
      ' · ',
      ' ',
    );

  const whatsHref = generateWhatsLink(msgText);

  /* ---------- peças compartilhadas entre trilho e painel ---------- */

  const guestRows = (
    <>
      <Stepper
        label="Adultos"
        hint="Com 13 anos ou mais"
        value={adults}
        min={1}
        onChange={setAdults}
      />
      <div className="border-t border-border" />
      <Stepper
        label="Crianças"
        hint="De 2 a 12 anos"
        value={children}
        min={0}
        onChange={setChildren}
      />
      <div className="border-t border-border" />
      <Stepper
        label="Animais de estimação"
        hint={petsPermitidos ? undefined : 'Não permitido neste chalé'}
        value={pets}
        min={0}
        disabled={!petsPermitidos}
        onChange={setPets}
      />
    </>
  );

  return (
    <>
      {/* ---------------- Trilho sticky · desktop ---------------- */}
      {/* Uma única camada de contenção: papel do cartão, cantos e sombra de
          cabelo. Por dentro só há fios — um segundo contorno em volta dos
          campos faria caixa-dentro-de-caixa. */}
      {/* O id fica no wrapper, e não no `<aside>`: o aside é `hidden` no
          mobile, e um elemento sem caixa de layout não é alvo válido de âncora
          — o "Reservar ↓" da dobra não levava a lugar nenhum no celular. Aqui
          ele leva ao ponto do fluxo onde a barra fixa já está na tela. */}
      <aside
        id="reservar"
        className="h-fit scroll-mt-24 lg:sticky lg:top-24"
        aria-label="Reserva"
      >
        <div className="hidden lg:block">
          <div className="rounded-2xl bg-card p-5 shadow-2xs ring-1 ring-border">
            <h2 className="font-display text-xl tracking-tight">
              Reserve agora mesmo
            </h2>

            <div className="mt-4 border-t border-border">
              <DropdownMenu
                open={dateMenuOpen}
                onOpenChange={(v) => {
                  if (!v) setDateMenuOpen(false);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={() => setDateMenuOpen((v) => !v)}
                    className={cn(
                      'grid w-full grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] text-left transition-colors hover:bg-muted',
                      focusRing,
                    )}
                  >
                    <span className="flex flex-col px-1 py-3">
                      <span className="text-xs font-medium">Check-in</span>
                      <span className="truncate text-sm text-muted-foreground tabular-nums">
                        {checkIn || 'Adicionar data'}
                      </span>
                    </span>
                    <span aria-hidden="true" className="my-3 bg-border" />
                    <span className="flex flex-col px-3 py-3">
                      <span className="text-xs font-medium">Check-out</span>
                      <span className="truncate text-sm text-muted-foreground tabular-nums">
                        {checkOut || 'Adicionar data'}
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-fit">
                  <Calendar
                    mode="range"
                    locale={ptBR}
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    disabled={(date) => date < today}
                    className="w-fit bg-card"
                  />
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border-t border-border" />

              <DropdownMenu
                open={guestMenuOpen}
                onOpenChange={(v) => {
                  if (!v) setGuestMenuOpen(false);
                }}
              >
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={() => setGuestMenuOpen((v) => !v)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-1 py-3 text-left transition-colors hover:bg-muted',
                      focusRing,
                    )}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="text-xs font-medium">Hóspedes</span>
                      <span className="truncate text-sm text-muted-foreground">
                        {guestLabel}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none',
                        guestMenuOpen && 'rotate-180',
                      )}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 p-4">
                  {guestRows}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="border-t border-border" />
            </div>

            <Button
              effect="ringHover"
              size="lg"
              className="mt-5 w-full rounded-full"
              asChild
            >
              <a target="_blank" rel="noopener noreferrer" href={whatsHref}>
                Reservar
              </a>
            </Button>
          </div>
        </div>
      </aside>

      {/* ---------------- Barra fixa · mobile ---------------- */}
      {/* Entra só depois da dobra: sobre a fotografia de abertura ela cobriria
          justamente o que a página tem de melhor. `translate-y-full` a mantém
          fora da tela sem removê-la do DOM, para a transição existir nos dois
          sentidos. */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card lg:hidden',
          barMotion,
          afterFold
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-full opacity-0',
        )}
      >
        {/* Painel: abre por `grid-template-rows` (0fr → 1fr), mesmo padrão do
            menu do cabeçalho — anima altura automática sem `max-height` chutado. */}
        <div
          className={cn(
            'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none',
            panelOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="min-h-0">
            <div
              id="painel-reserva"
              inert={!panelOpen}
              className="max-h-[65svh] overflow-y-auto px-4 pt-4"
            >
              <Calendar
                mode="range"
                locale={ptBR}
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={(date) => date < today}
                className="mx-auto w-fit bg-card"
              />
              <div className="mt-2 border-t border-border" />
              {guestRows}
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={() => setSheetOpen((v) => !v)}
            aria-expanded={panelOpen}
            aria-controls="painel-reserva"
            className={cn(
              'flex min-h-11 min-w-0 flex-1 items-center gap-2 text-left',
              focusRing,
            )}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium tabular-nums">
                {checkIn && checkOut
                  ? `${checkIn} – ${checkOut}`
                  : 'Adicionar data'}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {guestLabel}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-out motion-reduce:transition-none',
                !panelOpen && 'rotate-180',
              )}
            />
          </button>

          <Button
            effect="ringHover"
            className="h-11 shrink-0 rounded-full px-6"
            asChild
          >
            <a target="_blank" rel="noopener noreferrer" href={whatsHref}>
              Reservar
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}

export default CardReserva;
