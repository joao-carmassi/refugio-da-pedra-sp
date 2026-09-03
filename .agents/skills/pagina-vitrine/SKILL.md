---
name: pagina-vitrine
description: Monta a página própria de um parceiro do plano Vitrine do mapa turístico — cinco seções montadas com blocos do registry @shadcnblocks, tema escopado com a identidade da marca do cliente, conteúdo vindo do cadastro do ponto mais as respostas do formulário. Use quando pedirem para criar, refazer ou atualizar a página, landing, site ou vitrine de um parceiro; quando um cliente fechar o plano Vitrine e precisar da página; quando chegarem as respostas do formulário de um parceiro; quando pedirem para trocar as cores, as fotos ou o texto de uma página de parceiro já publicada. Vale sem citar "Vitrine" nem "shadcnblocks" — "faz a página do Hot Stone", "o cliente do plano de 89,90 mandou as fotos", "monta uma landing pro restaurante que tá no mapa" são todos casos desta skill.
---

# Página do plano Vitrine

O plano Vitrine (R$ 89,90/mês) custa quase o dobro do Destaque e entrega, no
mapa, exatamente a mesma coisa: um pino com selo e seis fotos. **O que o
cliente paga a mais é esta página.** Se ela não existir, ou existir feia, o
plano não tem produto — tem só um pino mais caro.

Por isso o padrão aqui é alto e o escopo é curto: **cinco seções, no máximo**.
Não é um site; é uma página que responde "o que é, como é, quanto custa, onde
fica" e manda falar com o dono. Quem precisa de site inteiro não está no plano
de R$ 89,90.

Cada parceiro tem a **identidade dele**: a pizzaria é vermelha e quadrada, o
ateliê é bege e redondo. A página segue a marca do cliente, não o âmbar do
Refúgio nem o verde do mapa. O cabeçalho e o rodapé continuam sendo os do
mapa — é ali que mora o vínculo que ele está pagando.

O cadastro do pino é feito por outra skill (`cadastrar-ponto-mapa`). Chegue
aqui com o ponto já no mapa.

## O que esta skill toca

| Arquivo | O que muda |
| --- | --- |
| `src/app/mapa-turistico/<id>/` | a página: `page.tsx`, `tema.css` e as seções |
| `vitrines/<id>/` | formulário respondido e `marca.json` — fora do build, é o dossiê |
| `src/data/mapa-turistico.json` | o campo `vitrine: true` no ponto |
| `public/assets/mapa/<id>/` | as fotos da página, em `.webp`, continuando a numeração |
| `src/data/image-alt.json` | o alt de cada foto nova |
| `src/app/sitemap.ts` | a rota nova |
| `src/lib/mapa-turistico.ts` | o campo `vitrine` na interface `Local` (uma vez só) |

Não toca `src/app/globals.css`. Nunca. Ver Passo 3.

`vitrines/<id>/` é o dossiê do cliente e entra no git: é o que explica, daqui a
um ano, por que a página diz o que diz. As fotos cruas que ele mandou ficam em
`vitrines/<id>/originais/`, que **não** entra — o que o site serve são as
`.webp` de `public/assets/`.

### O que vem na skill

| Arquivo | Para quê |
| --- | --- |
| `templates/formulario.md` | o questionário que vai para o cliente |
| `templates/formulario-whatsapp.md` | o mesmo questionário, formatado para colar no WhatsApp |
| `templates/marca.json` | esqueleto das cores, raio e fontes |
| `scripts/blocos.mjs` | procurar e vetar bloco no registry |
| `scripts/tema.mjs` | `marca.json` → `tema.css`, com teste de contraste |
| `scripts/validar-vitrine.mjs` | o portão do Passo 9 |
| `references/blocos.md` | vaga → categoria, regras de recusa, o que fazer depois do `add` |
| `references/tema.md` | tokens, raio, fonte, escuro, o que não sobrescrever |
| `references/seo.md` | metadata, JSON-LD, sitemap, ligação com o mapa |

## A rota é `/mapa-turistico/<id>/`

Não `/mapa/<id>/`, e a diferença não é de gosto:

- `/mapa/` é a ferramenta — tela cheia, sem rodapé, WebGL, e é o *start_url* do
  PWA (`public/mapa.webmanifest`, `"display": "standalone"`). Página de parceiro
  pendurada ali abre sem barra de endereço para quem instalou o app: sem URL
  para copiar, sem botão de compartilhar. É o oposto do que o cliente comprou.
- `/mapa-turistico/` é o ramo em HTML: tem texto, tem `Header compact` +
  `Footer`, tem trilha de migalhas e já publica um `ItemList` em que cada lugar
  é um nó com `@id` de âncora (`…/mapa-turistico/#hot-stone`). A página do
  parceiro promove essa âncora a URL de verdade — e o `ItemList` ganha um `url`
  apontando para ela (Passo 8).

Uma pasta por parceiro, estática, feita à mão. Nada de `[parceiro]` dinâmico:
cada vitrine tem tema, seções e copy próprios, e rota estática deixa o Next
separar o CSS por página em vez de mandar o tema de todo mundo para todo mundo.

## Regras que não se negociam

1. **Cinco seções.** Cabeçalho e rodapé não contam; são o chrome do mapa.
   Se sobrar assunto para uma sexta, corte assunto, não aumente a página.
2. **O cadastro é a fonte.** Endereço, telefone, horário, nota do Google,
   coordenada e as fotos do pino saem de `src/data/mapa-turistico.json` via
   `@/lib/mapa-turistico`. Redigitar isso na página cria uma segunda verdade
   que sai do ar na primeira mudança.
3. **Zero imagem externa.** Os blocos do registry vêm cheios de URL do
   CloudFront do shadcnblocks. Toda uma vira `next/image` com arquivo em
   `public/assets/`. O validador falha se sobrar uma.
4. **Tema escopado.** As cores do cliente vivem em `tema.css`, presas ao
   `<main>` daquela página. Editar `globals.css` para atender um parceiro
   repinta o site inteiro.
5. **Barra final.** `trailingSlash: true` — todo href interno e todo canonical
   terminam em `/`, senão apontam para um 308.
6. **Comentário explica porquê.** Este repositório documenta decisão, não
   sintaxe. Uma seção que existe por um motivo comercial ("a galeria vem antes
   do cardápio porque o cliente vende ambiente, não preço") diz isso no
   arquivo.
7. **Uma régua só.** As cinco seções têm de parecer desenhadas juntas para
   este site, não baixadas e empilhadas. Isso é medida, não é cor: cada bloco
   do registry chega com o `max-w-` e o eixo que o autor dele escolheu, e cinco
   escolhas diferentes numa página só é o que faz o visitante sentir que as
   seções não se encostam — sem saber nomear o quê. Ver Passo 7.

## Passo 0 — pré-requisito, uma vez só

Antes da **primeira** vitrine, `src/app/mapa-turistico/layout.tsx` precisa
parar de declarar conteúdo. Hoje ele carrega `generateMetadata()` e quatro
blocos de JSON-LD (`CollectionPage`, `ItemList`, `BreadcrumbList`, `FAQPage`)
que descrevem a **landing do mapa** — e layout no App Router vale para todas as
rotas filhas. Sem mexer nisso, `/mapa-turistico/hot-stone/` sairia se anunciando
como a coleção de 31 lugares e com um FAQ que não está na tela dela.

Mova `generateMetadata` e os quatro `jsonLd` de `layout.tsx` para
`src/app/mapa-turistico/page.tsx` (page aceita `generateMetadata` do mesmo
jeito). O `layout.tsx` fica só com o chrome: `<Header compact />`,
`{children}`, `<Footer />`, `<ConviteInstalar />`. O `ItemList` guarda o `@id`
`${pageUrl}#lugares`, então quem o referencia por `@id` continua achando.

Confira depois: `npx tsc --noEmit` e a landing ainda com os quatro scripts no
HTML (`curl -s localhost:3000/mapa-turistico/ | grep -c ld+json` → 4).

E acrescente o campo em `src/lib/mapa-turistico.ts`, na interface `Local`, logo
depois de `destaque`:

```ts
/** Parceiro do plano Vitrine: tem página própria em /mapa-turistico/<id>/. */
vitrine?: boolean;
```

## Passo 1 — conferir antes de começar

- O ponto existe em `src/data/mapa-turistico.json`? Se não, pare: rode a skill
  `cadastrar-ponto-mapa` primeiro. Vitrine sem pino é venda pela metade.
- O ponto é **comércio** e está com `destaque: true`? Vitrine implica Destaque.
- O `id` do cadastro é o nome da pasta da rota. Não invente outro slug: `id`,
  pasta de fotos, chave de `rotas.json` e URL são a mesma palavra.
- Tem `horario` conferido? Se não, a seção de visita mostra endereço sem selo de
  aberto/fechado — e isso entra na lista de pendências do cliente, não numa
  invenção.

## Passo 2 — o formulário

A página é feita à mão, mas a coleta é padronizada: sem isso, cada cliente manda
um punhado diferente de material e a página trava esperando um dado.

Copie `templates/formulario.md` para `vitrines/<id>/formulario.md`: esse é o
arquivo onde as respostas vão morar. Para **mandar** ao cliente, use
`templates/formulario-whatsapp.md` — o mesmo questionário em uma mensagem só,
com os marcadores do WhatsApp e sem o markdown que aparece cru na conversa. Não existe página de formulário no site.

Ele responde na conversa ou por áudio; quem transcreve para
`vitrines/<id>/formulario.md` é você. O formulário do WhatsApp não repete
endereço, telefone, horário nem nota do Google — isso já está no cadastro do
pino, e perguntar de novo cria duas versões do mesmo dado.

O formulário pede, e é ele que define o que a página consegue ser:

| Bloco | Serve para |
| --- | --- |
| a frase de uma linha | o `<h1>` da dobra |
| o que vende, com preço | a seção de oferta |
| o diferencial concreto | a razão de a dobra não ser genérica |
| 8 a 15 fotos | a galeria e o fundo da dobra, depois de você cortar as ruins |
| logo em vetor + cores | `marca.json` → `tema.css` |
| a nota do Google, que vem do cadastro | a prova social |
| o que ele quer que aconteça | o CTA primário |

**Não comece a página com o formulário pela metade.** Página montada com
"lorem" esperando texto do cliente é página que fica meses assim. Falta foto?
A galeria não entra e a página tem quatro seções — quatro seções honestas
valem mais que cinco com espaço reservado.

## Passo 3 — a marca vira tema

Preencha `vitrines/<id>/marca.json` a partir do que o cliente mandou (template
em `templates/marca.json`) e gere o tema:

```bash
node .agents/skills/pagina-vitrine/scripts/tema.mjs <id>
```

O script converte as cores para OKLCH (é o espaço que o repositório usa),
escreve `src/app/mapa-turistico/<id>/tema.css` e **testa o contraste** dos
pares que importam. Se o vermelho da pizzaria dá 3,1:1 com branco em cima, ele
falha e diz de quanto precisa escurecer — a marca do cliente não vale um texto
ilegível.

O que sai é um remapeamento escopado, o mesmo mecanismo que `[data-mapa-tema]`
já usa em `globals.css` (linhas ~976): trocando os tokens, `Button`, `Badge` e
tudo mais mudam de cor sem que nenhum componente seja repintado.

```css
main[data-vitrine='hot-stone'] {
  --background: oklch(...);
  --foreground: oklch(...);
  --primary: oklch(...);
  --primary-foreground: oklch(...);
  --radius: 0.25rem;
}
```

O seletor leva `main` na frente de propósito: `[data-mapa-tema]` tem a mesma
especificidade, e a ordem de carga dos dois arquivos de CSS não é garantida.

Detalhes de fonte, escala de raio e o que **não** sobrescrever: `references/tema.md`.

## Passo 4 — o esqueleto

Cinco vagas, nesta ordem, e uma seção por vaga:

| # | Vaga | Responde | Some quando |
| --- | --- | --- | --- |
| 1 | **Dobra** | o que é, onde, e o botão | nunca |
| 2 | **Oferta** | o que vende, com preço | nunca |
| 3 | **Ambiente** | como é estar lá (fotos) | não vieram fotos boas |
| 4 | **Prova** | por que confiar (nota, depoimento) | não há avaliação real |
| 5 | **Visita** | endereço, horário, rota, CTA final | nunca |

As vagas 3 e 4 são as que caem. As vagas 1, 2 e 5 são o produto.

A vaga 4 tem uma terceira saída, além de ficar e cair: **trocar de assunto**.
Quando o parceiro é novo, ou quando o ponto não é um negócio e não tem
avaliação nenhuma, a vaga vira uma faixa de números verificáveis — altitude,
distância medida, anos de casa, quantidade de alguma coisa que dá para
conferir. Categoria `stats` em vez de `testimonial`. O que não pode acontecer,
em nenhuma das três saídas, é preencher a vaga com elogio inventado: a página
existe para dar credibilidade a um negócio real, e depoimento falso é o único
erro daqui que respinga no cliente e no site.

A ordem inverte num caso: quando o que se vende é ambiente (pousada, café,
espaço de evento), Ambiente vem antes de Oferta. Escreva o motivo no comentário
do `page.tsx`.

## Passo 5 — escolher os blocos

São 4.161 itens no `@shadcnblocks`. Escolher no olho custa caro e escolhe mal.
Use o índice, que é público e não precisa de chave:

```bash
node .agents/skills/pagina-vitrine/scripts/blocos.mjs --vaga dobra --palavras "restaurante noite forno foto"
```

Ele baixa e guarda `registry.json` (recarrega sozinho a cada 7 dias), filtra
pelas categorias daquela vaga e ordena pelas palavras. Devolve nome, título e
descrição — o suficiente para uma lista curta de três.

As descrições do registry são em inglês; o script traduz os termos comuns
("cardápio" pontua `menu` e `pricing`, "depoimento" pontua `testimonial`). Se
nenhuma palavra casar ele avisa, em vez de devolver ordem alfabética fingindo
ser resultado — quando isso acontecer, busque com o termo em inglês.

Antes de instalar qualquer um, veja a ficha:

```bash
node .agents/skills/pagina-vitrine/scripts/blocos.mjs --ver hero12
```

Sai `use client`, dependências npm, dependências de registry, quantas imagens e
quantos campos de texto o bloco pede. É por aí que se recusa um bloco:

- pede `framer-motion` ou `motion` e o projeto não tem → recuse (o repositório
  anima com GSAP; ver `src/hooks/use-reveal.ts`);
- pede 9 imagens e o cliente mandou 8 → recuse, não invente foto;
- pede 6 depoimentos e existe 1 → recuse;
- é `use client` sem precisar de interação → prefira o irmão estático, a página
  é conteúdo.

Duas seções da mesma página nunca usam blocos com o mesmo layout (dois grids de
três cartões seguidos parecem erro de montagem). O mapa de vaga → categoria e o
resto das regras estão em `references/blocos.md`.

## Passo 6 — instalar e mudar de casa

Um comando só, com os blocos escolhidos:

```bash
npx shadcn@latest add @shadcnblocks/hero12 @shadcnblocks/gallery4 @shadcnblocks/feature73
```

Os arquivos caem em `src/components/`. Eles **não moram ali**: mova cada um
para `src/app/mapa-turistico/<id>/` com nome de vaga em português
(`dobra.tsx`, `cardapio.tsx`, `ambiente.tsx`, `prova.tsx`, `visita.tsx`),
como toda seção deste repositório. O que o comando trouxer para
`src/components/ui/` (primitivas que faltavam) fica onde caiu.

Toda seção abre com a marca de origem, para que daqui a um ano dê para saber de
onde ela veio:

```tsx
/* Origem: @shadcnblocks/hero12 · vitrine hot-stone · adaptado */
```

Confira o `git status` depois do `add`: se ele tocou `globals.css` ou
`components.json`, reverta essa parte. Bloco não manda no tema do site.

## Passo 7 — personalizar

É aqui que mora o trabalho, e é o que separa a página vendida da página gerada:

1. **Costure na régua do site, antes de tudo.** É o primeiro ajuste porque é o
   que decide se a página parece feita ou parece juntada — e o único que dá
   para ver de longe, com a tela desfocada:

   - **Toda seção abre com `<div className='container'>`.** É a régua da casa
     (`globals.css`: `margin-inline: auto; padding-inline: 2rem`, sem
     `max-width`). Uma seção fora dela nasce com margem própria.
   - **Nenhum `mx-auto max-w-*` de invólucro.** O bloco veio com `max-w-5xl` ou
     `max-w-6xl` no wrapper para se defender de páginas sem grade; aqui isso
     faz a seção terminar antes da borda em que a vizinha termina. Apague.
     `max-w-3xl` num `<header>` e `max-w-prose` num `<p>` ficam — esses são
     medida de leitura, não de bloco, e não levam `mx-auto`.
   - **Um eixo para a página inteira.** Se o cabeçalho de uma seção alinha à
     esquerda, todos alinham — dobra inclusive. Bloco de registry adora
     `text-center`; misturado com seções à esquerda, cria duas linhas de
     leitura na mesma página.
   - **Um cabeçalho só, o do site.** Use `Rotulo` (`src/app/mapa-turistico/rotulo.tsx`)
     no lugar do eyebrow que o bloco trouxe, e a mesma escala de título das
     seções da landing: `text-2xl tracking-tight md:text-4xl lg:text-5xl`.
     Tingir o `Rotulo` com `text-[var(--primary-forte)]` é o que põe a marca do
     parceiro na página sem inventar tipografia.
   - **Um ritmo vertical só.** `py-12 md:py-20` na seção, `mt-10 md:mt-12`
     entre cabeçalho e conteúdo. Faixa de fundo alternada é bem-vinda, mas com
     o token que existe no tema do parceiro — em tema onde `--card` é igual ao
     fundo, `bg-card` não pinta nada e a faixa some.

   O validador do Passo 9 acusa os dois primeiros itens. Os outros três são
   olho.

2. **Corte o que não tem conteúdo.** Bloco vem com quatro cartões; se há dois
   assuntos, ficam dois. Não preencha por simetria.
3. **Mate a interface de props.** Bloco de registry exporta `Props` e um `data`
   de exemplo para ser reusável — esta seção tem um único uso. Apague os dois e
   deixe o conteúdo no JSX; menos código, edição direta.
4. **Copy do formulário, dados do cadastro.** Texto de venda vem de
   `vitrines/<id>/formulario.md`. Endereço, telefone, horário, nota e rota vêm
   de `getLocal('<id>')`, `getChegada`, `getRotaUrl` (`@/lib/mapa-turistico`).
5. **Toda imagem vira `next/image`.** Com `width`/`height` reais e `sizes`; a
   primeira da dobra com `priority`. O alt sai de `getAlt(src, fallback)`
   (`@/lib/image-alt`) e cada foto nova ganha linha em
   `src/data/image-alt.json`.
6. **Ícones.** Os blocos importam `lucide-react`, que está instalado. Não
   converta para hugeicons por conversão; converta se a seção mostrar dois
   estilos de ícone lado a lado.
7. **Links.** Interno com barra final. WhatsApp por
   `generateWhatsLink` (`@/lib/generate-whats-link.ts`). Botão que não leva a
   lugar nenhum sai.
8. **Revelação no scroll.** Se a página usar, é `useReveal()`
   (`@/hooks/use-reveal.ts`), o mesmo do resto do site — não a animação que
   veio no bloco.
9. **Fotos.** Convertidas para `.webp` com o maior lado em 1620 px, na pasta
   `public/assets/mapa/<id>/`, continuando a numeração das fotos do pino (o pino
   mostra só o que está listado em `fotos.arquivos`, então as extras não
   aparecem lá):

   ```bash
   ffmpeg -hide_banner -loglevel error -i "<origem>" \
     -vf "scale='min(1620,iw)':'min(1620,ih)':force_original_aspect_ratio=decrease" \
     -c:v libwebp -quality 82 -y "public/assets/mapa/<id>/<id>-7.webp"
   ```

## Passo 8 — SEO e a ligação com o mapa

Sem isto a página existe e ninguém chega nela:

- `page.tsx` declara `generateMetadata` com `title: { absolute: … }` (o sufixo
  do template raiz é da pousada), `description` escrita para a busca do
  negócio, `alternates.canonical` com barra final e `openGraph.images`
  repetido — o Next substitui o objeto inteiro.
- **A imagem de OG é a foto que abre a página.** A mesma da dobra, o mesmo
  arquivo — não a segunda melhor, não a do cadastro, não uma montagem com o
  logo. Quem recebe o link no WhatsApp vê o cartão antes da página: cartão com
  uma foto e dobra com outra é promessa que o site não cumpre, e é o cliente
  quem repara, porque é ele quem manda o link. O `alt` é cópia literal do que
  `src/data/image-alt.json` guarda para o arquivo — metadata não roda no
  cliente e não passa pelo `getAlt`, então as duas descrições se conferem
  juntas quando a foto muda. Trocou a foto da dobra, troca a OG no mesmo
  commit; o validador do Passo 9 compara as duas.
- **Três nós de JSON-LD, sempre, em toda rota sob `/mapa-turistico/`** — não
  há página deste ramo sem os três, e o validador reprova quem sair sem eles:
  1. a **entidade**: `LocalBusiness` ou o subtipo certo (`Restaurant`,
     `Store`, `LodgingBusiness`, `TouristAttraction`), com `@id`
     `${siteUrl}/mapa-turistico/<id>/#business`, `address`, `geo`,
     `openingHours` via `horarioSchema` e `image`. Quando o ponto já é nó do
     `ItemList` da landing, **reuse o `@id` da âncora** em vez de criar um
     segundo nó para a mesma coisa — é o que a Pedra do Baú faz;
  2. o **`WebPage`**, com `isPartOf` `${siteUrl}/#website`, `publisher`
     `${siteUrl}/#business` e `mainEntity` apontando para a entidade;
  3. o **`BreadcrumbList`** de três níveis: Home → Mapa Turístico → o ponto.

  Os três vão para o HTML por `<script type="application/ld+json">` com
  `serialize-javascript`. Nunca crie um segundo nó para o Refúgio.
- `vitrine: true` no ponto em `mapa-turistico.json`, e o `ItemList` da landing
  ganha `url` para os pontos que têm página.
- O cartão do ponto no mapa passa a linkar a página — é o caminho pelo qual o
  cliente vê que pagou por algo.
- **A rota entra em `src/app/sitemap.ts`, no mesmo commit da página.** A linha
  vai em `LAST_MODIFIED_PAGINA_DE_PONTO`, com a data de publicação:

  ```ts
  const LAST_MODIFIED_PAGINA_DE_PONTO: Record<string, string> = {
    'pedra-do-bau': '2026-09-02',
    'hot-stone': '2026-09-10',
  };
  ```

  Quem manda no sitemap é essa lista, não o `vitrine: true` — página sem plano
  por trás (a Pedra do Baú é atrativo público) também é rota publicada e
  também precisa ser achada. Foi por depender do campo do plano que
  `/mapa-turistico/pedra-do-bau/` ficou fora do índice desde que nasceu.
  Atualize a data quando trocar texto ou foto.

Receitas completas em `references/seo.md`.

## Passo 9 — conferir

```bash
node .agents/skills/pagina-vitrine/scripts/validar-vitrine.mjs <id>
# página de ponto sem assinatura por trás (atrativo público):
node .agents/skills/pagina-vitrine/scripts/validar-vitrine.mjs <id> --sem-plano
npx tsc --noEmit
npm run build
```

O validador checa o que é mecânico: cinco seções ou menos, nenhuma URL de
imagem externa, nenhum resto de texto de exemplo, `tema.css` escopado com
`main[data-vitrine=…]`, alt de cada foto nova, fotos em `.webp` dentro de
1620 px, hrefs internos com barra final, a OG batendo com a foto da dobra,
`vitrine: true` no cadastro, a linha da rota no sitemap, os três nós de JSON-LD do Passo 8 injetados no HTML,
telefone/endereço da página batendo com o cadastro, e a costura do
Passo 7: toda seção no `.container`, nenhum invólucro `mx-auto max-w-*` e um
eixo só de alinhamento.

Depois, olho: `npm run dev` e a página em 390 px e em 1440 px. Três coisas que
máquina nenhuma pega — se a página parece do cliente ou parece um template com
as cores trocadas; se a dobra diz o que o lugar é sem precisar rolar; e, com a
tela desfocada a ponto de não dar para ler, se as seções desenham uma coluna só
ou cinco retângulos de larguras diferentes.

## O que reportar no fim

Em poucas linhas: qual parceiro ganhou página e em que URL; quais blocos
entraram em cada vaga e por quê; quantas seções ficaram (e qual caiu, se caiu);
quais fotos foram convertidas e quantas ficaram de fora; o que o formulário
ainda não respondeu e o que a página está deixando de mostrar por causa disso;
e o link para o cliente aprovar.
