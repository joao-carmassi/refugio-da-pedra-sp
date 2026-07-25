'use client';

import {
  Coffee,
  Calendar,
  Wifi,
  PawPrint,
  Baby,
  Car,
  Bed,
  MountainSnow,
  type LucideIcon,
} from 'lucide-react';
import { useReveal } from '@/hooks/use-reveal';

type Comodidade = {
  Icon: LucideIcon;
  /** Nome da comodidade — a coluna fixa da ficha. */
  label: string;
  /** Resposta curta, o dado em si. */
  value: string;
  /** Detalhe opcional, em corpo menor. */
  nota?: string;
};

// Os oito fatos são exatamente os do acordeão anterior — só mudaram de forma:
// de pergunta e resposta para ficha técnica.
const comodidades: Comodidade[] = [
  {
    Icon: Coffee,
    label: 'Café da manhã',
    value: 'Incluso na reserva',
    nota: 'Produtos típicos da região: pães caseiros, bolos, pão de queijo, geleias, manteiga, leite, café, sucos e frutas. Servido no deck principal, com vista para as montanhas.',
  },
  {
    Icon: Calendar,
    label: 'Check-in · check-out',
    value: '14h · 12h',
    nota: 'O descanso começa às 14h e se estende até o meio-dia, para você aproveitar cada minuto da estadia.',
  },
  {
    Icon: Wifi,
    label: 'Wi-Fi',
    value: 'Gratuito em todos os chalés',
    nota: 'Para compartilhar os melhores momentos da estadia sem perder o contato com o mundo.',
  },
  {
    Icon: PawPrint,
    label: 'Pets',
    value: 'Aceitos — somos pet-friendly',
    nota: 'Animais de estimação são parte da família. Ficaremos felizes em receber o seu amigo peludo.',
  },
  {
    Icon: Baby,
    label: 'Crianças',
    value: 'A partir de 13 anos',
    nota: 'É a nossa maneira de manter a experiência confortável e prática para toda a família.',
  },
  {
    Icon: Car,
    label: 'Estacionamento',
    value: 'Privativo, um por chalé',
    nota: 'Cada chalé tem a própria vaga individual — segurança e praticidade durante toda a hospedagem.',
  },
  {
    Icon: Bed,
    label: 'Roupa de cama e toalhas',
    value: 'Inclusas na reserva',
    nota: 'Roupas de cama macias e toalhas de banho e rosto, sempre prontas para o seu conforto.',
  },
  {
    Icon: MountainSnow,
    label: 'Pedra do Baú',
    value: '1,5 km da pousada',
    nota: 'O ponto de partida certo para quem gosta de explorar a natureza da Serra da Mantiqueira.',
  },
];

/**
 * Ficha técnica tabular (F3): uma linha por comodidade, réguas de 1px entre
 * elas. Substitui o acordeão — a página já usa esse gesto em
 * `outras-experiencias`, onde ele tem função (trocar a foto).
 */
const Faq = () => {
  const scope = useReveal<HTMLElement>();

  return (
    <section id='faq-anchor' ref={scope} className='py-12 md:py-20'>
      {/* No desktop a ficha vira duas colunas: o título fica grudado enquanto a
          lista corre ao lado. `items-start` é o que permite o `sticky` — sem
          ele o item do grid estica até a altura da linha inteira e nunca chega
          a destacar. O corte é em `lg`: em `md` as duas colunas espremeriam
          tanto o título quanto os rótulos da ficha. */}
      <div className='container lg:grid lg:grid-cols-[19rem_1fr] lg:items-start lg:gap-16'>
        <header
          data-reveal
          className='max-w-3xl lg:sticky lg:top-24 lg:max-w-none'
        >
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Comodidades
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            Nos importamos com o seu conforto, por isso toda reserva no Refúgio
            da Pedra SP já inclui o que está nesta ficha.
          </p>
        </header>

        <dl data-reveal className='mt-8 md:mt-12 lg:mt-0'>
          {comodidades.map(({ Icon, label, value, nota }) => (
            <div
              key={label}
              className='grid grid-cols-1 gap-x-10 gap-y-1 border-t border-border py-4 last:border-b md:grid-cols-[16rem_1fr] md:py-5'
            >
              <dt className='flex items-center gap-2 font-medium'>
                <Icon
                  aria-hidden='true'
                  className='size-4 shrink-0 text-muted-foreground'
                />
                {label}
              </dt>
              <dd>
                <p className='tabular-nums'>{value}</p>
                {nota ? (
                  <p className='mt-1 max-w-prose text-sm text-muted-foreground'>
                    {nota}
                  </p>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default Faq;
