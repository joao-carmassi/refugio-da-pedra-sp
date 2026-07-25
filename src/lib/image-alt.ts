import map from '@/data/image-alt.json';

// Mapa único de alt text, chaveado pelo caminho público da imagem.
//
// Por que por `src` e não por dados do chalé: os dois loops que rendem 113 das
// 137 imagens (`(homepage)/galeria.tsx` e `chales/[slug]/chale-content.tsx`)
// iteram sobre uma contagem — `Array.from({ length: n })` —, então a única coisa
// que identifica univocamente a foto dentro do loop é a `src` que o próprio loop
// acabou de montar. Chavear por `src` também garante que a mesma foto usada em
// lugares diferentes (ex.: `geral/refugio-28.webp` na galeria e no FAQ) sempre
// receba a mesma descrição.
//
// O mapa é intencionalmente incompleto: só entram aqui as fotos que alguém
// abriu e descreveu. Para as demais, `fallback` preserva o texto de hoje — é
// melhor um alt genérico do que uma descrição inventada.
//
// TODO(proprietário): `colmeia/refugio-3.webp` mostra bancada com cooktop e
// coifa, mas `chales.json` descreve o Domo Colmeia como `ambientes: ["Suíte"]`,
// sem cozinha. A descrição atual fala só do que está enquadrado e não afirma que
// aquilo é a cozinha da unidade. Confirmar com a pousada se a foto é do Colmeia
// ou de um espaço gourmet compartilhado — se for compartilhado, a foto deveria
// sair da pasta do chalé, e não só mudar de alt.
//
// TODO(proprietário): `ametista/refugio-2.webp` e `ametista/refugio-3.webp` têm
// enquadramento fechado demais para provar, só pela imagem, que o prédio/detalhe
// é o da Cabana Ametista. As descrições foram escritas sem citar a unidade.
// Confirmar a qual chalé pertencem — se não forem da Ametista, mover de pasta.

export function getAlt(src: string, fallback: string): string {
  return (map as Record<string, string>)[src] ?? fallback;
}
