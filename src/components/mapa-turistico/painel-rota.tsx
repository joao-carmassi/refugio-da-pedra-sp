'use client';

import { useState } from 'react';
import { ArrowLeft, Navigation, Share2 } from 'lucide-react';
import {
  REFUGIO,
  formatarDistancia,
  formatarDuracao,
  getDistancia,
  getRota,
  getRotaUrl,
  type Local,
} from '@/lib/mapa-turistico';
import { cn } from '@/lib/utils';
import BotaoMapa from './botao-mapa';
import { Rotulo } from './etiquetas';

interface Props {
  local: Local;
  onVoltar: () => void;
  className?: string;
}

/**
 * Painel de rota.
 *
 * O traçado real fica com o Google Maps — abrir o app que a pessoa já usa
 * dirigindo é melhor do que reimplementar navegação aqui. Este painel resolve
 * a pergunta anterior a essa: quanto tempo, que distância, e a rota desenhada
 * sobre o mapa para dar a noção de direção.
 */
function PainelRota({ local, onVoltar, className }: Props) {
  const [copiado, setCopiado] = useState(false);
  const url = getRotaUrl(local);
  const rota = getRota(local);

  async function compartilhar() {
    const dados = {
      title: `Como chegar em ${local.nome}`,
      text: `${local.nome} — ${getDistancia(local)} do ${REFUGIO.nome}.`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(dados);
        return;
      } catch {
        // Cancelar o share nativo não é erro: cai no copiar abaixo.
      }
    }

    await navigator.clipboard.writeText(url);
    setCopiado(true);
    window.setTimeout(() => setCopiado(false), 2400);
  }

  return (
    <div
      role='region'
      aria-label={`Como chegar em ${local.nome}`}
      style={{
        background: 'var(--map-surface)',
        borderColor: 'var(--map-line)',
        boxShadow: 'var(--map-shadow-panel)',
      }}
      className={cn('overflow-hidden rounded-2xl border', className)}
    >
      <div
        style={{ background: 'var(--map-green-deep)', color: 'var(--map-sand)' }}
        className='flex items-center gap-2.5 px-4 py-3.5'
      >
        <button
          type='button'
          onClick={onVoltar}
          aria-label='Voltar'
          className='grid size-7.5 place-items-center rounded-full bg-white/15 transition-colors hover:bg-white/25'
        >
          <ArrowLeft className='size-4.5' />
        </button>
        <span className='font-display text-base font-semibold'>
          Como chegar
        </span>
      </div>

      <div className='p-4'>
        <div className='flex gap-3'>
          <div
            aria-hidden='true'
            className='flex flex-col items-center pt-1.5'
          >
            <span
              style={{ background: 'var(--map-stone)' }}
              className='size-2.5 rounded-full'
            />
            <span
              style={{
                backgroundImage:
                  'repeating-linear-gradient(var(--map-line) 0 4px, transparent 4px 8px)',
              }}
              className='min-h-8.5 w-0.5 flex-1'
            />
            <span
              style={{ background: 'var(--map-green)' }}
              className='size-3 rounded-[3px]'
            />
          </div>

          <div className='flex flex-1 flex-col gap-3.5'>
            <div>
              <Rotulo>Origem</Rotulo>
              <p
                style={{ color: 'var(--map-ink)' }}
                className='text-[15px] font-medium'
              >
                {REFUGIO.nome}
              </p>
            </div>
            <div>
              <Rotulo>Destino</Rotulo>
              <p
                style={{ color: 'var(--map-ink)' }}
                className='text-[15px] font-medium'
              >
                {local.nome}
              </p>
            </div>
          </div>
        </div>

        <div
          style={{ borderColor: 'var(--map-line)' }}
          className='mt-4 border-t pt-3.5'
        >
          <p className='flex items-baseline gap-2'>
            <span
              style={{ color: 'var(--map-green)' }}
              className='font-display text-3xl leading-none font-semibold'
            >
              {rota ? formatarDistancia(rota.metros) : getDistancia(local)}
            </span>
            {rota && (
              <span
                style={{ color: 'var(--map-ink)' }}
                className='text-base font-medium'
              >
                {formatarDuracao(rota.segundos)} de carro
              </span>
            )}
          </p>
          <p
            style={{ color: 'var(--map-meta)' }}
            className='mt-1 text-[13px]'
          >
            Trajeto pela estrada, calculado sobre o OpenStreetMap. Boa parte da
            região é estrada de terra, então o relógio real varia com a
            condição do piso e a época do ano.
          </p>

          {/* Cume e cachoeira não têm estrada até a porta. Dizer só "18,6 km de
              carro" mandaria a pessoa procurar um estacionamento que não
              existe — o número do trecho a pé é o que evita isso. */}
          {rota && rota.desvio > 250 && (
            <p
              style={{ color: 'var(--map-ink)' }}
              className='mt-2 text-[13px] font-medium'
            >
              A estrada chega a {formatarDistancia(rota.desvio)} do ponto: o
              final do caminho é a pé.
            </p>
          )}
        </div>

        <div className='mt-4 flex gap-2.5'>
          <BotaoMapa asChild className='flex-1'>
            <a href={url} target='_blank' rel='noopener noreferrer'>
              <Navigation aria-hidden='true' />
              Iniciar rota
            </a>
          </BotaoMapa>
          <BotaoMapa tom='contorno' onClick={compartilhar} className='px-4'>
            <Share2 aria-hidden='true' />
            {copiado ? 'Link copiado' : 'Enviar'}
          </BotaoMapa>
        </div>
      </div>
    </div>
  );
}

export default PainelRota;
