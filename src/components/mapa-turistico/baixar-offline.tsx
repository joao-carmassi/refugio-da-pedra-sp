'use client';

import { ArrowDownToLine, Check, RotateCw, TriangleAlert, X } from 'lucide-react';
import { useMapaOffline } from '@/hooks/use-mapa-offline';
import { PACOTE, formatarBytes } from '@/lib/mapa-offline';
import { cn } from '@/lib/utils';

/**
 * Rodapé da lista: guardar o mapa no aparelho.
 *
 * A oferta mora aqui, e não na pilha de controles, por dois motivos. O primeiro
 * é espaço: a pilha é de botões redondos de zoom, e uma barra de progresso não
 * cabe lá sem virar outra coisa. O segundo é o momento — quem está passando os
 * olhos pela lista está planejando o passeio, e é planejando que se pensa em
 * "vou ficar sem sinal lá em cima"; quem está com o dedo no zoom está lendo o
 * mapa agora, com sinal.
 *
 * O texto promete o mapa, não o site: fotos ficam de fora do pacote, e prometer
 * a ficha inteira seria mentir para quem já estiver na estrada quando descobrir.
 *
 * A casca do app não depende deste botão. O service worker guarda o que passa
 * por `/_next/static/` durante a visita, então o que se baixa aqui é a base
 * cartográfica — que é o pesado e o que nenhuma navegação normal traz inteiro.
 */
function BaixarOffline({ className }: { className?: string }) {
  const { estado, guardado, progresso, erro, baixar, cancelar, remover } =
    useMapaOffline();

  // `null` é o quadro antes da primeira leitura do cache, e `indisponivel` é o
  // navegador sem CacheStorage. Nos dois casos não há oferta honesta a fazer.
  if (estado === null || estado === 'indisponivel') return null;

  const baixando = progresso !== null;
  const porcento = Math.round((progresso ?? 0) * 100);

  const moldura = cn(
    'flex w-full items-center gap-2.5 px-3.5 py-3 text-left text-xs',
    className,
  );

  if (baixando) {
    return (
      <div
        style={{ borderColor: 'var(--map-line)', color: 'var(--map-body)' }}
        className={cn(moldura, 'border-t')}
      >
        <div className='min-w-0 flex-1'>
          <p className='font-semibold'>Guardando o mapa… {porcento}%</p>
          {/* A barra é o único lugar da interface onde o verde do mapa vira
              medida, e não decoração. */}
          <div
            role='progressbar'
            aria-valuenow={porcento}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label='Progresso do download do mapa'
            style={{ background: 'var(--map-chip)' }}
            className='mt-1.5 h-1 overflow-hidden rounded-full'
          >
            <div
              style={{
                width: `${porcento}%`,
                background: 'var(--map-green)',
              }}
              className='h-full rounded-full transition-[width] duration-300'
            />
          </div>
        </div>

        <button
          type='button'
          onClick={cancelar}
          aria-label='Cancelar download'
          style={{ color: 'var(--map-meta)' }}
          className='grid size-7 shrink-0 place-items-center rounded-full transition-colors hover:bg-black/5'
        >
          <X className='size-4' />
        </button>
      </div>
    );
  }

  if (estado === 'pronto' && !erro) {
    return (
      <div
        style={{ borderColor: 'var(--map-line)', color: 'var(--map-body)' }}
        className={cn(moldura, 'border-t')}
      >
        <Check
          aria-hidden='true'
          className='size-4 shrink-0'
          style={{ color: 'var(--map-green)' }}
        />
        <p className='min-w-0 flex-1'>
          <span className='font-semibold'>Mapa guardado no aparelho.</span>{' '}
          <span style={{ color: 'var(--map-meta)' }}>
            Funciona sem internet, menos as fotos.
          </span>
        </p>
        <button
          type='button'
          onClick={remover}
          style={{ color: 'var(--map-meta)' }}
          className='shrink-0 underline underline-offset-2 transition-colors hover:text-[color:var(--map-ink)]'
        >
          apagar
        </button>
      </div>
    );
  }

  const rotulo = {
    espaco: 'Sem espaço no aparelho para guardar o mapa.',
    rede: 'O download falhou. Tentar de novo?',
  };

  /*
   * "Continuar" só quando houve mesmo um download interrompido. Navegar pelo
   * mapa já deixa algumas dezenas de tiles guardados sozinho — abaixo de um
   * décimo do pacote isso é rastro de navegação, não download pela metade, e
   * dizer "continuar" a quem nunca apertou nada seria falar de uma coisa que não
   * aconteceu. Retomar continua acontecendo de qualquer forma; o que muda é só o
   * que a frase promete.
   */
  const retomando = estado === 'parcial' && guardado >= 0.1;

  const texto = erro
    ? rotulo[erro]
    : retomando
      ? `Continuar o download do mapa (${Math.round(guardado * 100)}%)`
      : estado === 'desatualizado'
        ? 'Atualizar o mapa guardado'
        : 'Guardar o mapa para usar sem internet';

  const Icone = erro
    ? TriangleAlert
    : estado === 'desatualizado'
      ? RotateCw
      : ArrowDownToLine;

  return (
    <button
      type='button'
      onClick={baixar}
      // Sem espaço, o clique não tem o que fazer — mas o aviso continua na tela,
      // porque some-lo esconderia justamente a explicação de por que não deu.
      disabled={erro === 'espaco'}
      style={{
        borderColor: 'var(--map-line)',
        color: erro ? 'var(--map-closed-fg)' : 'var(--map-ink)',
      }}
      className={cn(
        moldura,
        'border-t transition-colors hover:bg-black/[0.03] disabled:cursor-default disabled:hover:bg-transparent',
      )}
    >
      <Icone
        aria-hidden='true'
        className='size-4 shrink-0'
        style={{ color: erro ? undefined : 'var(--map-green)' }}
      />
      <span className='min-w-0 flex-1 font-semibold'>{texto}</span>
      <span style={{ color: 'var(--map-meta)' }} className='shrink-0'>
        {formatarBytes(PACOTE.bytes)}
      </span>
    </button>
  );
}

export default BaixarOffline;
