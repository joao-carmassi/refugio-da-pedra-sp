# Escolher blocos no @shadcnblocks

## Como o registry funciona aqui

`components.json` já registra o registry:

```json
"@shadcnblocks": {
  "url": "https://www.shadcnblocks.com/r/{name}",
  "headers": { "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}" }
}
```

A chave está em `.env.local`. O índice (`/r/registry.json`, ~1,4 MB, 4.161
itens) e as primeiras chamadas passam sem autenticação, mas **em rajada o
registry devolve 401** — abrir a ficha de cinco finalistas seguidos já derruba.
Por isso o `scripts/blocos.mjs` manda `Authorization: Bearer` em toda chamada,
lendo `SHADCNBLOCKS_API_KEY` do ambiente ou do `.env.local`. Ele usa `fetch`
direto e não gasta chamada do MCP para navegar: o MCP do shadcn serve para
instalar e para ver exemplo de uso, não para procurar em 4 mil descrições.

Os itens do índice trazem `name`, `title` e `description`. **Não** trazem
dependências nem código — isso só vem no JSON do item. É por isso que a
escolha tem duas etapas: filtrar pelo índice, depois abrir a ficha dos
finalistas.

## Vaga → categoria

Os nomes seguem `<categoria><número>`. As categorias que interessam a uma
vitrine, com o tamanho de cada uma:

| Vaga | Categorias | Quantidade |
| --- | --- | --- |
| 1 Dobra | `hero`, `banner` | 273, 25 |
| 2 Oferta | `pricing`, `feature`, `services`, `product-list`, `product-card`, `compare` | 96, 306, 19, 10, 14, 10 |
| 3 Ambiente | `gallery`, `about`, `bento`, `our-story`, `projects` | 52, 40, 53, 9, 18 |
| 4 Prova | `testimonial`, `reviews`, `stats`, `logos`, `faq`, `awards` | 39, 14, 19, 31, 26, 7 |
| 5 Visita | `contact`, `cta`, `banner` | 30, 38, 25 |

Categorias que **não** entram numa vitrine, e o motivo: `navbar`, `footer`,
`sidebar` (o chrome é o do mapa), `login`, `signup`, `checkout`,
`shopping-cart`, `dashboard`, `data-table`, `settings-*` (a página não tem
conta nem carrinho — o pedido acontece no WhatsApp ou no balcão),
`background-pattern` e `shader` (peso de GPU numa página que vive no celular
de quem está na serra, com sinal ruim).

Como escolher dentro da categoria, por tipo de negócio:

| Negócio | Oferta | Ambiente |
| --- | --- | --- |
| restaurante, pizzaria, café | `pricing` com itens e preço, ou `feature` de pratos | `gallery` de salão e prato |
| pousada, camping | `feature` de acomodação | `gallery` grande — o ambiente é o produto |
| ateliê, loja, artesanato | `product-list` ou `product-card` | `gallery` das peças |
| agência, passeio, guia | `services` ou `feature` numerado | `projects` / `our-story` |
| prestador de serviço | `services` | `about` — a prova é a pessoa |

## Buscar

```bash
node .agents/skills/pagina-vitrine/scripts/blocos.mjs --vaga oferta --palavras "cardapio preco item pizza"
node .agents/skills/pagina-vitrine/scripts/blocos.mjs --categoria gallery --palavras "carrossel foto grande"
node .agents/skills/pagina-vitrine/scripts/blocos.mjs --ver hero12
```

`--vaga` filtra pelas categorias da tabela acima. `--categoria` força uma só.
`--palavras` pontua título e descrição (cada palavra que casa vale ponto;
casar no título vale o dobro). `--limite` muda os 8 padrão.

`--ver` busca o JSON do item e imprime a ficha: `use client`, dependências npm,
dependências de registry, quantas imagens, quantos blocos de texto, quantas
linhas.

## Vetar antes de instalar

Recuse o bloco quando:

- **pede dependência que o projeto não tem.** `framer-motion`/`motion` é o caso
  comum. Este repositório anima com GSAP (`src/hooks/use-reveal.ts`) e não vai
  ganhar uma segunda biblioteca de animação por causa de uma seção. `recharts`,
  `three`, `cobe`: mesma resposta.
- **pede mais conteúdo do que existe.** Seis depoimentos quando há um; nove
  fotos quando vieram oito. Preencher isso é inventar — e inventar avaliação de
  cliente é o pior erro possível numa página que existe para dar credibilidade
  a um negócio real.
- **é `use client` sem interação.** Muito bloco marca `"use client"` só por
  causa de um `useState` de carrossel que a seção nem vai usar. Se a seção é
  texto e foto, prefira a irmã estática — a página tem de sair inteira no HTML
  para o buscador e para os modelos de IA que respondem "onde comer em São
  Bento".
- **repete o layout do vizinho.** Dois grids de três cartões em sequência
  parecem erro de montagem. Vaga 2 e vaga 4 são as que costumam colidir.
- **tem chrome embutido.** Bloco de hero que já vem com navbar dentro: o
  cabeçalho aqui é o `<Header compact />` do layout.

Aceite sem medo o que só precisa de `lucide-react` (instalado) e das primitivas
de `src/components/ui/` — 24 já existem, e o `shadcn add` traz o que faltar.

## Depois do `add`

```bash
npx shadcn@latest add @shadcnblocks/hero12 @shadcnblocks/gallery4
git status
```

O `add` pode mexer em `globals.css` (variáveis de tema do item) e em
`components.json`. **Reverta essas duas partes**: o tema do site não muda por
causa de um bloco, e o tema do parceiro mora no `tema.css` escopado.

**E confira o `Button`.** Este projeto tem um Button próprio em
`src/components/ui/button/index.tsx` — um diretório, com `style.css` e a prop
`effect` que o shadcn não tem. Bloco que declara `button` como dependência de
registry faz o `add` escrever `src/components/ui/button.tsx` **ao lado** do
diretório, e a resolução de módulo prefere o arquivo: `@/components/ui/button`
passa a apontar para o Button de fábrica, e o site inteiro perde o customizado
sem um erro sequer. Apague o arquivo solto:

```bash
rm src/components/ui/button.tsx
```

Os arquivos de bloco caem em `src/components/`. Mova para
`src/app/mapa-turistico/<id>/` com nome de vaga em português. As primitivas que
caírem em `src/components/ui/` ficam.

## MCP do shadcn, quando vale

`search_items_in_registries` faz busca difusa que erra bastante em 4 mil itens
(procurar "hero fullscreen image overlay booking cta" devolve `background-pattern`
e `community`). Use o script.

`get_item_examples_from_registries` vale quando um bloco tem uma API estranha e
você quer ver o uso pronto. `get_audit_checklist` vale depois de montar tudo.
