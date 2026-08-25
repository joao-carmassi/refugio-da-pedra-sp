import MapaTuristico from '@/components/mapa-turistico/mapa-turistico';

/*
  Esta rota é a tela do mapa — não uma página que tem um mapa dentro.

  Não há conteúdo abaixo nem rolagem de página: o `<main>` mede exatamente o
  que sobra da viewport abaixo do cabeçalho fixo (`h-below-header`, que desconta
  a `--header-height` publicada pelo próprio cabeçalho — aqui travado no estado
  compacto, então é essa a altura que entra na conta) e o mapa
  preenche esse espaço sozinho, com `size-full`. Daí a ausência de container,
  de padding e de qualquer wrapper extra: qualquer um deles roubaria altura do
  mapa e devolveria a barra de rolagem que esta tela existe para não ter.
*/
function MapaPage(): React.ReactNode {
  return (
    <main className='h-below-header'>
      {/*
        Título e lede seguem no DOM, apenas fora do alcance dos olhos.

        Uma página sem `<h1>` é regressão de acessibilidade e de SEO, e um mapa
        em WebGL é opaco tanto para leitor de tela quanto para buscador: o que
        o mapa mostra não existe como texto em lugar nenhum. Este par é a única
        âncora textual da rota — some da tela, não do documento.
      */}
      <h1 className='sr-only'>
        Mapa interativo de São Bento do Sapucaí
      </h1>
      <p className='sr-only'>
        Filtre por categoria, toque em um pino e veja a que distância cada
        lugar está do Refúgio da Pedra SP. O texto sobre cada lugar está na
        página do mapa turístico.
      </p>

      <MapaTuristico />
    </main>
  );
}

export default MapaPage;
