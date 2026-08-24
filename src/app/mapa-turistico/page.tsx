import MapaTuristico from '@/components/mapa-turistico/mapa-turistico';

/*
  Esta rota é a tela do mapa — não uma página que tem um mapa dentro.

  Não há conteúdo abaixo nem rolagem de página: o `<main>` mede exatamente o
  que sobra da viewport abaixo do cabeçalho fixo (`--header-height`, publicada
  pelo próprio cabeçalho, que aqui fica travado no estado compacto) e o mapa
  preenche esse espaço sozinho, com `size-full`. Daí a ausência de container,
  de padding e de qualquer wrapper extra: qualquer um deles roubaria altura do
  mapa e devolveria a barra de rolagem que esta tela existe para não ter.
*/
function MapaTuristicoPage(): React.ReactNode {
  return (
    <main className='h-[calc(100svh-var(--header-height,4rem))]'>
      {/*
        Título e lede seguem no DOM, apenas fora do alcance dos olhos.

        Uma página sem `<h1>` é regressão de acessibilidade e de SEO, e um mapa
        em WebGL é opaco tanto para leitor de tela quanto para buscador: o que
        o mapa mostra não existe como texto em lugar nenhum. Este par é a única
        âncora textual da rota — some da tela, não do documento.
      */}
      <h1 className='sr-only'>Mapa turístico de São Bento do Sapucaí</h1>
      <p className='sr-only'>
        Onde ir na serra — trilhas, mesas e experiências em um mapa só. Filtre
        por categoria, toque em um pino e veja a que distância cada lugar está
        do Refúgio da Pedra SP.
      </p>

      <MapaTuristico />
    </main>
  );
}

export default MapaTuristicoPage;
