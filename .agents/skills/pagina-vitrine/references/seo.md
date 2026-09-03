# SEO da página de parceiro

A página existe para duas leituras: a busca por "pizzaria em São Bento do
Sapucaí" e a pergunta a um modelo de IA ("onde comer em São Bento do
Sapucaí?"). As duas leem HTML. Nada do que importa pode nascer só no cliente.

## Metadata

`generateMetadata` no `page.tsx` da rota — nunca no layout, que é compartilhado
com a landing do mapa.

```tsx
const pageUrl = `${getSiteUrl()}/mapa-turistico/hot-stone/`;

export function generateMetadata() {
  return {
    /* `absolute` escapa do template `%s | Refúgio da Pedra SP` do layout raiz.
       Quem procura a pizzaria não pode ler o nome de uma pousada no título do
       resultado — o vínculo com o Refúgio está no rodapé e no JSON-LD. */
    title: { absolute: 'Hot Stone — Pizzaria e Hamburgueria em São Bento do Sapucaí' },
    description: '…',
    openGraph: {
      title: '…',
      description: '…',
      siteName: 'Mapa de São Bento do Sapucaí',
      type: 'website',
      url: pageUrl,
      /* O Next substitui o objeto `openGraph` inteiro quando um filho o
         declara, então `images` precisa ser repetido aqui. */
      images: [ogImage],
    },
    alternates: { canonical: pageUrl },
  };
}
```

`title` de até ~60 caracteres, com o nome do negócio **e** a cidade — a busca
local sempre traz a cidade junto. `description` diz o que se come/compra, o
horário em palavras e onde fica.

**A imagem de OG é a foto que abre a página** — o mesmo arquivo que a dobra
usa, declarado uma vez e apontado pelos dois lados:

```tsx
/* dobra.tsx */
const FOTO = '/assets/mapa/hot-stone/hot-stone-2.webp';

/* page.tsx */
const ogImage = {
  url: '/assets/mapa/hot-stone/hot-stone-2.webp',
  width: 1620,
  height: 1215,
  alt: 'Salão de mesas altas com o forno de pizza aceso ao fundo',
};
```

Não é preciosismo de coerência: o cartão do WhatsApp é visto antes da página, e
é ele que o cliente manda para a lista dele. Cartão com uma foto e dobra com
outra faz o visitante achar que clicou no link errado. Vale a foto da dobra, e
não a capa do cadastro, quando as duas divergem — a capa manda no cartão do
mapa, a dobra manda na página.

O `alt` é cópia literal do que `src/data/image-alt.json` guarda para o arquivo
(metadata não roda no cliente e não passa pelo `getAlt`; as duas descrições se
conferem juntas quando a foto muda). `width`/`height` são os da imagem em
disco. O validador do Passo 9 compara a URL da OG com a foto encontrada em
`dobra.tsx` e reprova quando divergem.

## JSON-LD

**Toda rota sob `/mapa-turistico/` publica três nós: a entidade, o `WebPage` e
o `BreadcrumbList`.** Não há exceção — nem para página de teste, nem para
atrativo público, nem para vitrine que ainda espera foto. A landing
(`/mapa-turistico/`) já segue isso com `ItemList` + `CollectionPage` +
`BreadcrumbList` + `FAQPage`, e `/mapa/` com `CollectionPage` +
`BreadcrumbList` no layout. Página nova entra no mesmo padrão ou não entra.

Um nó de negócio por página, com o subtipo certo — `Restaurant`, `CafeOrCoffeeShop`,
`Store`, `LodgingBusiness`, `TouristAttraction`, `HealthAndBeautyBusiness`.
`LocalBusiness` genérico só quando nenhum subtipo serve.

```tsx
const local = getLocal('hot-stone')!;
const horario = horarioSchema(local.horario);

const jsonLd: WithContext<Restaurant> = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${pageUrl}#business`,
  name: local.nome,
  description: local.resumo,
  address: {
    '@type': 'PostalAddress',
    streetAddress: local.endereco,
    addressLocality: 'São Bento do Sapucaí',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  geo: { '@type': 'GeoCoordinates', latitude: local.lat, longitude: local.lng },
  ...(horario ? { openingHours: horario } : {}),
  ...(local.tel ? { telephone: local.tel } : {}),
  ...(local.site ? { url: local.site } : {}),
  image: fotos.map((f) => `${siteUrl}${f}`),
};
```

Regras que o repositório já segue e que valem aqui:

- **`horarioSchema` traduz, e omite quando não consegue.** Horário que o
  buscador não lê é pior que nenhum, e horário inventado manda gente subir a
  serra à toa.
- **`aggregateRating` só com nota conferida.** `local.nota` e
  `local.avaliacoes` vêm do cadastro; sem eles o campo não existe. Nota
  inventada é fraude de marcação e derruba o site inteiro, não só a página.
- **Nunca crie um segundo nó para o Refúgio.** Ele é descrito uma vez como
  `LodgingBusiness` em `src/app/layout.tsx`, com `@id` `${siteUrl}/#business`.
  Referencie por `@id` quando precisar.
- Um `WebPage` com `isPartOf: { '@id': ${siteUrl}/#website }` e
  `mainEntity: { '@id': ${pageUrl}#business }` amarra a página ao site.
- `BreadcrumbList` de três níveis: Home → Mapa Turístico → nome do parceiro.
  Ele fica **nesta** página; o do layout descreve a landing.
- Serialize com `serialize-javascript`, como o resto do repositório:
  `dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}`.

## Ligar ao mapa

Três pontos, e sem eles a página é uma ilha que ninguém acha:

1. **`vitrine: true`** no ponto, em `src/data/mapa-turistico.json`.
2. **O `ItemList` da landing** (`src/app/mapa-turistico/page.tsx`, depois do
   Passo 0) ganha `url` nos pontos que têm página:

   ```ts
   ...(local.vitrine ? { url: `${pageUrl}${local.id}/` } : {}),
   ```

   O nó já existia como âncora (`#hot-stone`); agora ele tem endereço próprio.
3. **O cartão do ponto** passa a linkar "Ver a página" quando `local.vitrine`.
   É por aí que o visitante do mapa chega — e é o que o cliente vê quando
   pergunta o que ganhou com o plano.

## Sitemap

`src/app/sitemap.ts` mantém `lastModified` à mão de propósito (o `mtime` do
checkout de CI reescrevia tudo a cada deploy e ensinava o crawler a ignorar o
campo). Gere as rotas de vitrine a partir do cadastro, com a data de quando a
página foi publicada ou mexida:

```ts
const LAST_MODIFIED_PAGINA_DE_PONTO: Record<string, string> = {
  'pedra-do-bau': '2026-09-02',
};

const paginaDePontoUrls: MetadataRoute.Sitemap = LOCAIS
  .filter((local) => local.vitrine || local.id in LAST_MODIFIED_PAGINA_DE_PONTO)
  .map((local) => ({
    url: `${baseUrl}/mapa-turistico/${local.id}/`,
    lastModified:
      LAST_MODIFIED_PAGINA_DE_PONTO[local.id] ?? LAST_MODIFIED.mapaTuristico,
  }));
```

**Criou a pasta da rota, acrescenta a linha — no mesmo commit.** A lista é o
que manda: o `vitrine: true` também inclui a rota, mas ele é campo de plano, e
página existe sem plano. A Pedra do Baú é o caso — atrativo público com página
publicada, que ficou fora do sitemap enquanto o critério era só o campo do
plano. Atualize a data quando trocar texto ou foto: data que não muda quando a
página muda vale tanto quanto data que muda quando nada mudou.

O validador do Passo 9 procura a linha do ponto neste arquivo. A checagem
antiga procurava a palavra "vitrine" e passava sempre, porque o `sitemap.ts`
cita o plano por outros motivos — é assim que uma rota some do índice sem
ninguém ver.

## O que não fazer

- Não repita na página o texto da landing do mapa. Duas páginas do mesmo
  domínio dizendo a mesma coisa competem entre si.
- Não copie a descrição que o cliente tem no Google Meu Negócio. Conteúdo
  duplicado com a ficha dele não ajuda nenhum dos dois.
- Não coloque `keywords` só porque a landing do mapa tem: lá a lista existe com
  motivo declarado (documentar de que buscas a página é a resposta). Numa
  vitrine, ou tem esse motivo, ou não entra.
- Não indexe página que ainda espera material do cliente. Enquanto estiver
  incompleta, ela não vai para o sitemap e não recebe link do cartão.
