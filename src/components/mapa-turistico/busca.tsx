'use client';

import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { CATEGORIAS, type Local } from '@/lib/mapa-turistico';
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
  /** No mobile o campo mora na barra do topo, e o formato dele muda. */
  variante?: 'desktop' | 'mobile';
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
          // O foco sozinho não basta: quem escolhe um resultado fecha o balão
          // com o campo ainda focado, e tocar nele de novo não dispara `focus`.
          onClick={onAbrir}
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
            'animate-in fade-in slide-in-from-top-2 absolute top-full z-20 mt-3 overflow-hidden rounded-2xl border duration-200 ease-out',
            // O balão sai do fluxo nos dois layouts: dentro dele, as pílulas de
            // categoria desciam e subiam a cada letra digitada. Sem `relative`
            // aqui de propósito — ele ancora no bloco do topo inteiro (campo
            // mais pílulas), que é o pai posicionado, e assim cai abaixo do
            // último dos dois em vez de cobri-lo: no desktop o campo, que vem
            // embaixo das pílulas; no mobile as pílulas, que vêm embaixo do
            // campo.
            //
            // O `mt-3` é o respiro entre o balão e esse último elemento, e não
            // sobra de graça em nenhum dos dois: a fila de categorias cancela
            // o próprio `p-3` com margem negativa, então o bloco termina rente
            // ao que estiver por último e sem ele o balão encostava.
            //
            // No mobile o pai ainda tem padding lateral, que o posicionamento
            // absoluto ignora: `inset-x-3` repõe a mesma margem. E a lista
            // rola por dentro, porque ali a tela acaba antes dos seis itens.
            mobile
              ? 'inset-x-3 max-h-[60vh] overflow-y-auto'
              : 'inset-x-0',
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
                    {categoria.label}
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
