import { Suspense } from 'react';
import MapaTuristico from '@/components/mapa-turistico/mapa-turistico';
import { ProvedorOrigem } from '@/components/mapa-turistico/origem';

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
      {/*
        A âncora textual descreve o mapa como ele abre sem parâmetro nenhum: da
        cidade, medido do centro. Ela é estática — é HTML que o buscador lê
        antes de existir URL com parâmetro —, e prometer aqui a medida do
        hóspede seria descrever uma tela que quase ninguém que chega pela busca
        vai ver.
      */}
      <p className='sr-only'>
        Filtre por categoria, toque em um pino e veja a que distância cada
        lugar está do centro de São Bento do Sapucaí. O texto sobre cada lugar
        está na página do mapa turístico.
      </p>

      {/*
        `<Suspense>` sem `fallback`: o provedor lê a URL com
        `useSearchParams()`, e numa rota estática isso obriga a um limite de
        suspensão — sem ele o `next build` falha. Aqui não há o que mostrar
        enquanto isso: o conteúdo desta rota é WebGL, que só existe depois do
        JavaScript de qualquer jeito, e o `<h1>` e o lede acima ficam de fora
        do limite justamente para continuarem no HTML.
      */}
      <Suspense>
        <ProvedorOrigem>
          <MapaTuristico />
        </ProvedorOrigem>
      </Suspense>
    </main>
  );
}

export default MapaPage;
