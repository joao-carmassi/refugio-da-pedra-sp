import { getAlt } from '@/lib/image-alt';
import Image from 'next/image';
import type { Chale, ChaleDescription } from './types';

interface Props {
  chale: Chale;
  description: ChaleDescription;
}

/**
 * Banda de texto que termina em fotografia. A prosa fica em medida curta e sem
 * contorno — o texto sobre o papel creme já é a banda; a caixa que existia
 * antes só empilhava contenção sobre o cartão de reserva ao lado.
 */
function Descricao({ chale, description }: Props): React.ReactNode {
  // Campo opcional vindo dos dados. Ainda não preenchido em chales.json —
  // quando existir, entra como um parágrafo exclusivo da unidade.
  const destaqueExclusivo = (chale as { destaque_exclusivo?: string })
    .destaque_exclusivo;

  // Segunda foto do par de capas — a mesma que faz o crossfade no card de
  // /chales/. A primeira abre a página; esta é a quebra de grade. Nenhuma das
  // duas se repete na galeria.
  const src = `/assets/refugio/chales/${chale.id}/refugio-${chale.banner[1]}.webp`;

  return (
    <div className='space-y-12 md:space-y-16'>
      <div className='space-y-4'>
        <h2 className='text-2xl tracking-tight text-pretty md:text-3xl'>
          {description.title}
        </h2>
        {description.paragraphs.map((paragraph, index) => (
          <p key={index} className='leading-relaxed text-muted-foreground'>
            {paragraph}
          </p>
        ))}
        {destaqueExclusivo && (
          <p className='leading-relaxed text-muted-foreground'>
            {destaqueExclusivo}
          </p>
        )}
      </div>

      {/* Quebra de grade: a foto cancela o padding do container e escapa a
          coluna de texto. Até 1280px isso a leva à borda da viewport; acima
          disso ela para na sarjeta do container, que é onde todo o resto do
          site também para. É o único elemento da página que cruza o gutter —
          uma vez basta. */}
      <figure className='-mx-8 lg:-ml-8 lg:mr-0'>
        <Image
          src={src}
          alt={getAlt(src, `${chale.nome} - vista alternativa`)}
          width={1400}
          height={600}
          sizes='(min-width: 1024px) 66vw, 100vw'
          className='aspect-4/3 w-full object-cover md:aspect-21/9'
        />
      </figure>
    </div>
  );
}

export default Descricao;
