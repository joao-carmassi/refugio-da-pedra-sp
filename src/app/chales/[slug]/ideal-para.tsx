import { PawPrint } from 'lucide-react';
import LinhaFio from './linha-fio';
import type { ChaleDescription } from './types';

interface Props {
  description: ChaleDescription;
}

/**
 * Para quem a unidade foi pensada, em três peças: a frase de perfil, a política
 * de pets escrita para este chalé e os diferenciais exclusivos dele.
 *
 * A frase de perfil é um `<dl>`, não um rótulo solto acima de um título: "Ideal
 * para:" define o que vem depois, e marcar isso como `dt`/`dd` mantém a relação
 * no HTML em vez de deixá-la só na diagramação.
 */
function IdealPara({ description }: Props): React.ReactNode {
  return (
    <div className='space-y-12 md:space-y-16'>
      <dl className='max-w-[46ch]'>
        <dt className='font-text text-sm font-semibold tracking-[0.12em] text-accent-deep [font-variant-caps:small-caps]'>
          Ideal para:
        </dt>
        <dd className='mt-3 font-display text-xl leading-snug tracking-tight text-balance md:text-2xl'>
          {description.idealPara}
        </dd>
      </dl>

      <p className='flex max-w-[62ch] items-start gap-2 leading-relaxed text-muted-foreground'>
        <PawPrint
          aria-hidden='true'
          className='mt-1 h-4 w-4 shrink-0'
          strokeWidth={2.2}
        />
        <span>{description.politicaPet}</span>
      </p>

      {description.destaques && (
        <ul className='lg:max-w-1/2'>
          {description.destaques.map((destaque) => (
            <LinhaFio key={destaque}>{destaque}</LinhaFio>
          ))}
        </ul>
      )}
    </div>
  );
}

export default IdealPara;
