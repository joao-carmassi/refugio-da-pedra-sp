'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getAlt } from '@/lib/image-alt';
import { getFotoPrincipal, type Local } from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';

/**
 * Hachura que ocupa o lugar da foto enquanto ela não existe. Vem da própria
 * identidade do mapa (o cartão de exemplo do guia usa esta trama), então um
 * local sem foto continua parecendo parte do sistema em vez de um buraco.
 */
const HACHURA =
  'repeating-linear-gradient(135deg, #dde1d6 0 7px, #d2d7c9 7px 14px)';

function Hachura({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      style={{ background: HACHURA, color: 'var(--map-meta)' }}
      className={cn('absolute inset-0 grid place-items-center', className)}
    >
      <span className='text-[9px] font-semibold tracking-[0.1em] uppercase'>
        foto
      </span>
    </div>
  );
}

interface Props {
  local: Local;
  /** Repassado ao `sizes` do next/image. */
  sizes: string;
  className?: string;
  priority?: boolean;
}

function FotoLocal({ local, sizes, className, priority }: Props) {
  const src = getFotoPrincipal(local);

  /*
   * A foto pode existir no cadastro e não chegar — arquivo renomeado, rede que
   * cai no meio do carregamento. Sem este estado, a ficha mostraria o ícone de
   * imagem quebrada do navegador, e "quebrado" é o que o hóspede concluiria do
   * mapa inteiro, que naquele momento está funcionando. Caindo na mesma hachura
   * de quem não tem foto, a ficha fica com a cara de "sem foto", que é o mais
   * perto da verdade que dá para dizer daqui.
   */
  const [falhou, setFalhou] = useState(false);

  if (!src || falhou) return <Hachura className={className} />;

  return (
    <Image
      src={src}
      alt={getAlt(src, local.nome)}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setFalhou(true)}
      className={cn('object-cover', className)}
    />
  );
}

export default FotoLocal;
