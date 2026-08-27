'use client';

import { useEffect, useId, useState } from 'react';
import Image from 'next/image';
import { Share, SquarePlus, X } from 'lucide-react';
import {
  useConviteInstalacao,
  type ModoConvite,
} from '@/hooks/use-convite-instalacao';
import { usePresenca } from '@/hooks/use-presenca';
import { cn } from '@/lib/utils';
import BotaoMapa from './botao-mapa';

/** Igual à duração da animação de saída lá embaixo. */
const SAIDA_MS = 200;

/**
 * Altura que o cartão sobe no desktop de `/mapa/` para não cobrir a pilha de
 * controles, que mora no mesmo canto (`right-5 bottom-6` em
 * `mapa-turistico.tsx`).
 *
 * A conta: o botão "Refúgio" (2,625rem) + o intervalo (0,625rem) + a pilha de
 * zoom, com três botões de 2,625rem e dois filetes (8rem) = 11,25rem, sobre um
 * `bottom` de 1,5rem. Meia unidade de folga fecha em 13,25rem.
 *
 * Só no desktop, e só nesta rota: no celular a pilha vira um botão só, e em
 * `/mapa-turistico/` não há controle nenhum nesse canto.
 */
const ACIMA_DOS_CONTROLES = 'sm:bottom-[13.25rem]';

interface Props {
  /** Ver `ACIMA_DOS_CONTROLES`. */
  elevado?: boolean;
}

/**
 * Convite para instalar o mapa como app.
 *
 * Aparece na segunda visita, alguns segundos depois de a rota abrir, e some
 * por um mês a cada recusa — as regras e o porquê de cada uma estão em
 * `lib/pwa-instalacao.ts`.
 *
 * Não é modal de propósito: não escurece a tela, não prende o foco e não
 * bloqueia o mapa atrás dele. Quem chegou aqui veio ver onde ficam as
 * cachoeiras, não responder a uma pergunta do site; o convite é uma oferta de
 * canto de tela, e ignorá-lo tem que ser tão barato quanto recusá-lo.
 *
 * `data-mapa-tema` no nó raiz porque o cartão é montado pelo layout, fora do
 * `<main>` de `/mapa-turistico/` e do quadro `[data-mapa]` da ferramenta — sem
 * ele os `var(--map-*)` abaixo não resolveriam e o cartão sairia sem cor.
 */
function CartaoConvite({ elevado = false }: Props): React.ReactNode {
  const { modo, instalar, dispensar } = useConviteInstalacao();
  const titulo = useId();
  const descricao = useId();

  /*
   * O modo precisa sobreviver ao fechamento: `modo` vira `null` no clique, e
   * sem esta lembrança o cartão perderia o texto no meio da animação de saída.
   */
  const [lembrado, setLembrado] = useState<ModoConvite | null>(null);
  if (modo && modo !== lembrado) setLembrado(modo);

  const aberto = modo !== null;
  const montado = usePresenca(aberto, SAIDA_MS);

  useEffect(() => {
    if (!aberto) return;

    const naTecla = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') dispensar();
    };
    window.addEventListener('keydown', naTecla);
    return () => window.removeEventListener('keydown', naTecla);
  }, [aberto, dispensar]);

  if (!montado || !lembrado) return null;

  const ios = lembrado === 'ios';

  return (
    <div
      data-mapa-tema
      role='dialog'
      aria-labelledby={titulo}
      aria-describedby={descricao}
      style={{
        background: 'var(--map-surface)',
        borderColor: 'var(--map-line)',
        boxShadow: 'var(--map-shadow-panel)',
      }}
      className={cn(
        'fixed inset-x-3 z-60 rounded-3xl border p-4',
        'bottom-[calc(0.75rem+env(safe-area-inset-bottom))]',
        'sm:right-4 sm:left-auto sm:w-92',
        elevado ? ACIMA_DOS_CONTROLES : 'sm:bottom-4',
        aberto
          ? 'animate-in fade-in slide-in-from-bottom-4 duration-300'
          : 'animate-out fade-out slide-out-to-bottom-4 duration-200',
      )}
    >
      <button
        type='button'
        onClick={dispensar}
        aria-label='Fechar'
        style={{ color: 'var(--map-meta)' }}
        className='absolute top-3 right-3 rounded-full p-1.5 transition-colors hover:bg-[color:var(--map-chip)]'
      >
        <X className='size-4' aria-hidden />
      </button>

      <div className='flex gap-3'>
        {/* O ícone do app, e não um genérico de download: mostra exatamente o
            que vai aparecer na tela de início. */}
        <Image
          src='/mapa-icon-96x96.png'
          alt=''
          width={48}
          height={48}
          className='size-12 shrink-0 rounded-xl'
          style={{ boxShadow: 'var(--map-shadow-pin)' }}
        />

        <div className='min-w-0 pr-6'>
          <h2
            id={titulo}
            style={{ color: 'var(--map-ink)' }}
            className='text-base leading-tight font-semibold'
          >
            Deixe o mapa a um toque
          </h2>
          <p
            id={descricao}
            style={{ color: 'var(--map-body)' }}
            className='mt-1 text-sm leading-snug'
          >
            {ios
              ? 'Dá para guardar este mapa na tela de início do iPhone, em dois toques.'
              : 'Guarde o mapa de São Bento do Sapucaí na tela de início. Abre em tela cheia, direto no mapa, sem barra de navegador.'}
          </p>
        </div>
      </div>

      {ios ? (
        <>
          {/*
            No iPhone não há botão que instale: o WebKit nunca implementou o
            evento que dá essa ação à página, e todo navegador do iOS é WebKit
            por baixo. O que resta é mostrar o caminho — com os mesmos dois
            ícones que a pessoa vai procurar na tela.
          */}
          <ol
            style={{ background: 'var(--map-chip)', color: 'var(--map-body)' }}
            className='mt-3 space-y-2 rounded-2xl p-3 text-sm'
          >
            <li className='flex items-center gap-2'>
              <Share
                className='size-4 shrink-0'
                style={{ color: 'var(--map-green)' }}
                aria-hidden
              />
              <span>
                Toque em <strong className='font-semibold'>Compartilhar</strong>
                , na barra do navegador.
              </span>
            </li>
            <li className='flex items-center gap-2'>
              <SquarePlus
                className='size-4 shrink-0'
                style={{ color: 'var(--map-green)' }}
                aria-hidden
              />
              <span>
                Escolha{' '}
                <strong className='font-semibold'>
                  Adicionar à Tela de Início
                </strong>
                .
              </span>
            </li>
          </ol>
          <BotaoMapa onClick={dispensar} className='mt-3 w-full'>
            Entendi
          </BotaoMapa>
        </>
      ) : (
        <div className='mt-4 flex gap-2'>
          <BotaoMapa onClick={instalar} className='flex-1'>
            Instalar
          </BotaoMapa>
          <BotaoMapa tom='contorno' onClick={dispensar} className='flex-1'>
            Agora não
          </BotaoMapa>
        </div>
      )}
    </div>
  );
}

export default CartaoConvite;
