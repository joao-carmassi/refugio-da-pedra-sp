'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { CATEGORIAS, getDistancia, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import { Rotulo, SeloDestaque } from './etiquetas';

interface Props {
  termo: string;
  onTermo: (termo: string) => void;
  resultados: Local[];
  aberto: boolean;
  onAbrir: () => void;
  onFechar: () => void;
  onEscolher: (id: string) => void;
  /** Mobile abre a busca em tela cheia; o layout do campo muda. */
  variante?: 'desktop' | 'mobile';
  autoFocus?: boolean;
}

function Busca({
  termo,
  onTermo,
  resultados,
  aberto,
  onAbrir,
  onFechar,
  onEscolher,
  variante = 'desktop',
  autoFocus,
}: Props) {
  const listaId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [ativo, setAtivo] = useState(-1);
  const [termoAnterior, setTermoAnterior] = useState(termo);

  const mobile = variante === 'mobile';
  const temTermo = termo.trim().length > 0;
  // Sem termo não há lista: o campo vazio não sugere nada, só espera.
  const itens = temTermo ? resultados.slice(0, 6) : [];
  const mostraLista = aberto && itens.length > 0;

  // Ajuste durante a renderização, não em efeito: a lista já mudou de conteúdo,
  // então manter o índice antigo destacaria a linha errada por um quadro.
  if (termo !== termoAnterior) {
    setTermoAnterior(termo);
    setAtivo(-1);
  }

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      onFechar();
      return;
    }

    if (!itens.length) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const passo = event.key === 'ArrowDown' ? 1 : -1;
      setAtivo((i) => (i + passo + itens.length) % itens.length);
      return;
    }

    if (event.key === 'Enter' && ativo >= 0) {
      event.preventDefault();
      onEscolher(itens[ativo].id);
    }
  }

  return (
    <div className='flex flex-col gap-2.5'>
      <div
        style={{
          background: 'var(--map-surface)',
          borderColor: 'var(--map-line)',
          boxShadow: 'var(--map-shadow-control)',
        }}
        className={cn(
          'flex h-13 items-center gap-2.5 border px-3',
          mobile ? 'rounded-full' : 'rounded-2xl',
        )}
      >
        <Search
          aria-hidden='true'
          className='size-5 shrink-0'
          style={{ color: 'var(--map-green)' }}
        />

        <input
          ref={inputRef}
          type='search'
          role='combobox'
          value={termo}
          onChange={(event) => onTermo(event.target.value)}
          onFocus={onAbrir}
          onKeyDown={onKeyDown}
          aria-label='Buscar lugares em São Bento do Sapucaí'
          aria-expanded={mostraLista}
          aria-controls={listaId}
          aria-autocomplete='list'
          aria-activedescendant={
            ativo >= 0 ? `${listaId}-${ativo}` : undefined
          }
          placeholder='Buscar lugares em São Bento...'
          style={{ color: 'var(--map-ink)' }}
          className='min-w-0 flex-1 bg-transparent text-[15px] outline-none [&::-webkit-search-cancel-button]:hidden'
        />

        {temTermo && (
          <button
            type='button'
            onClick={() => {
              onTermo('');
              inputRef.current?.focus();
            }}
            aria-label='Limpar busca'
            style={{ color: 'var(--map-meta)' }}
            className='grid size-6.5 shrink-0 place-items-center rounded-full transition-colors hover:bg-black/5'
          >
            <X className='size-4.5' />
          </button>
        )}

        <span
          aria-hidden='true'
          style={{ background: 'var(--map-line)' }}
          className='h-6 w-px shrink-0'
        />

        {/* Assinatura do mapa: as duas marcas só aparecem juntas aqui. */}
        <span
          title='Um projeto do Refúgio da Pedra'
          aria-hidden='true'
          style={{ background: 'var(--map-green)', color: 'var(--map-sand)' }}
          className='grid size-7 shrink-0 place-items-center rounded-lg text-[11px] font-bold'
        >
          RP
        </span>
      </div>

      {mostraLista && (
        <div
          id={listaId}
          role='listbox'
          aria-label='Resultados'
          style={{
            background: 'var(--map-surface)',
            borderColor: 'var(--map-line)',
            boxShadow: 'var(--map-shadow-panel)',
          }}
          className={cn(
            'animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-2xl border duration-200 ease-out',
            // No desktop o balão sai do fluxo: nele, as pílulas de categoria
            // desciam e subiam a cada letra digitada. Sem `relative` aqui de
            // propósito — ele ancora no bloco do topo inteiro (campo mais
            // filas), que é o pai posicionado, e assim cai logo abaixo das
            // pílulas em vez de cobri-las.
            //
            // No mobile a busca ocupa a tela e a lista é a própria coluna.
            !mobile && 'absolute inset-x-0 top-full z-20',
          )}
        >
          <div className='px-3.5 pt-2.5 pb-1.5'>
            <Rotulo>Resultados</Rotulo>
          </div>

          {itens.map((local, indice) => {
            const categoria = CATEGORIAS[local.cat];
            const Icone = categoria.icone;

            return (
              <button
                key={local.id}
                id={`${listaId}-${indice}`}
                role='option'
                aria-selected={ativo === indice}
                type='button'
                onMouseEnter={() => setAtivo(indice)}
                onClick={() => onEscolher(local.id)}
                style={{ borderColor: 'var(--map-line)' }}
                className={cn(
                  'flex w-full items-center gap-3 border-t px-3.5 py-2.5 text-left transition-colors',
                  ativo === indice && 'bg-black/[0.035]',
                )}
              >
                <span
                  aria-hidden='true'
                  style={{
                    background: 'rgb(138 107 59 / 0.1)',
                    color: categoria.cor,
                  }}
                  className='grid size-8 shrink-0 place-items-center rounded-[9px]'
                >
                  <Icone className='size-4.5' />
                </span>

                <span className='min-w-0 flex-1'>
                  <span
                    style={{ color: 'var(--map-ink)' }}
                    className='block truncate text-sm font-medium'
                  >
                    {local.nome}
                  </span>
                  <span
                    style={{ color: 'var(--map-meta)' }}
                    className='block truncate text-[11px]'
                  >
                    {categoria.label} · {getDistancia(local)}
                  </span>
                </span>

                {local.destaque ? (
                  <SeloDestaque />
                ) : (
                  <ArrowUpRight
                    aria-hidden='true'
                    className='size-4 shrink-0'
                    style={{ color: 'var(--map-line)' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Busca;
