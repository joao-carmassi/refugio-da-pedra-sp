/**
 * Localização. O mapa entra como banda de largura total — na macroestrutura
 * Photographic a borda da imagem é o divisor, então ele não fica dentro de um
 * cartão arredondado. Sem reveal: o iframe carrega em lazy e animar o quadro
 * enquanto o mapa desenha só chama atenção para o carregamento.
 */
function Mapa() {
  return (
    <section id='mapa-anchor' className='bg-card pt-12 md:pt-20'>
      <div className='container'>
        <header className='max-w-3xl'>
          <h2 className='text-2xl tracking-tight text-pretty md:text-4xl lg:text-5xl'>
            Localização
          </h2>
          <p className='mt-3 max-w-prose text-muted-foreground'>
            A apenas 1,5 km do pé da Pedra do Baú, um dos destinos mais
            incríveis da Serra da Mantiqueira. Aqui você está cercado por
            trilhas deslumbrantes, montanhas imponentes e vistas de tirar o
            fôlego — perfeitas para quem busca aventura e contato com a
            natureza.
          </p>
        </header>
      </div>

      <div className='mt-8 md:mt-12'>
        <iframe
          loading='lazy'
          title='Localização do Refúgio da Pedra SP no Google Maps'
          className='block h-100 w-full md:h-140'
          src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.3469548877215!2d-45.66375792387372!3d-22.67812457941675!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cc7de7a1085cab%3A0xfbaf5cb9454d9009!2sRef%C3%BAgio%20da%20Pedra%20Sp!5e0!3m2!1spt-BR!2sbr!4v1741976848192!5m2!1spt-BR!2sbr'
          referrerPolicy='no-referrer-when-downgrade'
        />
      </div>
    </section>
  );
}

export default Mapa;
