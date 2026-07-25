import Image from 'next/image';
import Form from './form';

function ReservarPage(): React.ReactNode {
  return (
    <main className='relative min-h-container isolate'>
      {/* Imagem de fundo servida pelo next/image (formato negociado + srcset).
          Renderizada no HTML do servidor, sem opacity-0, para não bloquear o LCP. */}
      <Image
        src='/assets/refugio/geral/refugio-1.webp'
        alt='Vista da pousada Refúgio da Pedra, em São Bento do Sapucaí, na Serra da Mantiqueira'
        fill
        priority
        quality={75}
        sizes='100vw'
        className='object-cover object-center -z-10'
      />
      <div className='absolute inset-0 -z-10 bg-black/50' aria-hidden='true' />

      <section className='w-full h-full grid place-items-center min-h-container'>
        <div className='p-6 md:p-12 w-full grid place-items-center gap-6'>
          <div className='w-full max-w-md space-y-2 text-center text-white'>
            <h1 className='text-2xl tracking-tight md:text-3xl'>
              Reserve sua estadia em São Bento do Sapucaí
            </h1>
            <p className='text-sm leading-snug text-white/90 md:text-base'>
              Chalés, cabana e domo na Serra da Mantiqueira, a 1,5 km da Pedra
              do Baú. Preencha o formulário e sua solicitação segue direto para
              o nosso WhatsApp.
            </p>
          </div>

          <Form />

          <div className='w-full max-w-md space-y-1 text-center text-xs leading-relaxed text-white/80'>
            <p>
              Check-in a partir das 14h · Check-out até as 12h · Café da manhã
              incluso
            </p>
            <p>
              O envio do formulário é uma solicitação de reserva, não uma
              confirmação: verificamos a disponibilidade do chalé escolhido e
              respondemos pelo WhatsApp com as condições e a forma de pagamento.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ReservarPage;
