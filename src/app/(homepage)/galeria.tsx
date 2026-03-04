import Image from 'next/image';

function Galeria() {
  return (
    <section className='py-6 md:py-12'>
      <div className='container flex flex-col items-center gap-6 md:gap-12'>
        <div className='space-y-3 md:space-y-6 text-center'>
          <h2 className='text-2xl tracking-tight md:text-4xl lg:text-5xl'>
            Nossa pousada:
          </h2>
          <p className='text-muted-foreground leading-snug md:max-w-2/3 mx-auto'>
            Aqui, cada detalhe foi pensado para proporcionar conforto, conexão
            com a natureza e momentos inesquecíveis. Veja mais sobre a nossa
            pousada nas fotos abaixo!
          </p>
        </div>
        <div className='columns-1 md:columns-2 lg:columns-3'>
          {Array.from({ length: 29 }, (_, index) => (
            <div key={index}>
              <Image
                className='w-full h-auto mb-2.5 md:mb-5 shadow-md inset-shadow-2xs'
                src={`/assets/refugio/geral/refugio-${index + 1}.webp`}
                alt={`Foto ${index + 1} da pousada`}
                width={500}
                height={500}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Galeria;
