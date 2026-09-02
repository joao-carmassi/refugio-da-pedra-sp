# O tema de cada vitrine

## Por que escopado

`globals.css` define os tokens em `:root` e os expõe ao Tailwind num
`@theme inline`:

```css
:root { --primary: oklch(75.211% 0.16495 66.443); --radius: 0.5rem; }
@theme inline { --color-primary: var(--primary); --radius-lg: var(--radius); }
```

O `@theme inline` mantém o `var()` dentro da utilitária — `bg-primary` vira
`background-color: var(--primary)`, resolvido no ponto de uso. Redeclarar
`--primary` num seletor mais interno repinta tudo que está debaixo dele:
`Button`, `Badge`, `Card`, borda, anel de foco. Nenhum componente precisa saber
que existe um parceiro.

O repositório já faz isso uma vez, para o mapa (`globals.css`, ~linha 976):

```css
[data-mapa-tema] { --background: var(--map-sand); --primary: var(--map-green); … }
```

aplicado em `<main data-mapa-tema>` — e o escopo para no `<main>` de propósito,
para o cabeçalho e o rodapé continuarem sendo a marca do Refúgio. **A vitrine
copia esse desenho.** A diferença é o arquivo: o tema do mapa é do site e mora
no `globals.css`; o tema de um parceiro é da página e mora ao lado dela, para
que o CSS de um cliente não seja baixado por quem abriu a página de outro.

```
src/app/mapa-turistico/hot-stone/
  page.tsx     ← import './tema.css'
  tema.css     ← main[data-vitrine='hot-stone'] { … }
```

`main` na frente do atributo não é enfeite: `[data-mapa-tema]` e
`[data-vitrine='x']` têm a mesma especificidade (0,1,0), e a ordem em que o
Next concatena `globals.css` e o CSS da rota não é contrato. Com `main` o
seletor vai a 0,1,1 e ganha sempre.

## O que sobrescrever

| Token | Vem de |
| --- | --- |
| `--background` | fundo da marca — quase nunca branco puro; papel, creme, carvão |
| `--foreground` | tinta do texto, testada contra o fundo |
| `--primary` | a cor do botão e dos destaques: a cor que o cliente chama de "a minha" |
| `--primary-foreground` | o que fica **em cima** do primary. Calculado, não escolhido |
| `--secondary` / `--secondary-foreground` | segunda cor da marca, se houver |
| `--muted` / `--muted-foreground` | fundo de bloco calmo e texto de apoio |
| `--accent` / `--accent-foreground` | estado de hover em item de lista |
| `--card` / `--card-foreground` | quase sempre iguais a background/foreground |
| `--border` / `--input` / `--ring` | fio e foco, derivados do fundo e do primary |
| `--radius` | a personalidade da forma — ver abaixo |

## O que **não** sobrescrever

- `--destructive`: erro é vermelho em todo lugar do site, inclusive aqui.
- A escala de sombra (`--shadow-*`), os breakpoints, as animações: são do
  sistema, não da marca.
- `--accent-deep`: é um token deste projeto, criado para ter âmbar que passa em
  AA. Se a página não usa, não declare.
- Qualquer coisa em `:root`. Se você está editando `globals.css` para atender um
  parceiro, parou de fazer uma vitrine e começou a repintar o site.

## Raio

`--radius` é o único valor que sozinho muda a impressão da página. A escala do
projeto deriva tudo dele (`--radius-sm: calc(var(--radius) - 4px)` etc.), então
basta o número:

| Valor | Lê como | Cabe em |
| --- | --- | --- |
| `0rem` | duro, industrial | pizzaria de forno, oficina, açougue, cervejaria |
| `0.25rem` | sóbrio | restaurante, prestador de serviço, imobiliária |
| `0.5rem` | neutro (é o padrão do site) | quando a marca não diz nada |
| `0.75rem`–`1rem` | macio, acolhedor | pousada, café, ateliê, spa |

## Fonte

O `layout.tsx` raiz carrega Archivo e Piazzolla e pendura `--font-sans` /
`--font-serif` no `<html>`. Uma vitrine com fonte própria carrega a dela **na
própria página**, com `next/font`, e aponta os tokens de papel para ela:

```tsx
import { Bebas_Neue } from 'next/font/google';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-vitrine-display',
});

// …
<main data-vitrine='hot-stone' className={`${bebas.variable} bg-background`}>
```

```css
main[data-vitrine='hot-stone'] {
  --font-display: var(--font-vitrine-display), Georgia, serif;
}
```

`--font-display` e `--font-text` são os tokens que a camada base do projeto
aplica (`h1..h6 { @apply font-display }`, `p, span, a, li { @apply font-text }`),
então trocar os dois basta — nenhum componente pede fonte no JSX.

Duas fontes no máximo, e só uma se a marca não tiver par definido. Fonte de
display do cliente + Archivo no corpo funciona quase sempre e não custa
requisição a mais no corpo do texto.

## Escuro

O site não usa `prefers-color-scheme`: `dark` é classe
(`@custom-variant dark (&:where(.dark, .dark *))`) e aparece em bloco isolado —
uma faixa escura no meio de uma página clara. Se um bloco escolhido faz isso,
o tema precisa dizer como aquela faixa fica na marca do parceiro:

```css
main[data-vitrine='hot-stone'] .dark {
  --background: oklch(0.18 0.02 30);
  --foreground: oklch(0.96 0.01 60);
  --primary: /* a versão que ainda contrasta no escuro */;
}
```

Sem isso a faixa herda o escuro do site (marrom do Refúgio) e destoa.

## Contraste

`scripts/tema.mjs` calcula e falha quando não passa:

| Par | Mínimo |
| --- | --- |
| `foreground` sobre `background` | 4,5:1 |
| `primary-foreground` sobre `primary` | 4,5:1 |
| `muted-foreground` sobre `background` e sobre `muted` | 4,5:1 |
| `border` sobre `background` | 3:1 |
| `ring` sobre `background` | 3:1 |

Quando a cor da marca não passa — vermelho vivo, amarelo, verde-limão —, a
saída **não** é trocar a cor do cliente. É:

1. manter `--primary` como a cor da marca em superfície grande (faixa, ícone,
   fio, fundo de bloco), e
2. usar uma versão mais escura só onde há texto por cima ou onde o botão é
   pequeno.

É o que este repositório já faz com `--accent-deep`, criado exatamente porque
o âmbar da pousada não passa em AA como cor de texto. O comentário no
`tema.css` deve dizer isso — senão alguém "corrige" o tom mais escuro de volta
para o da marca daqui a seis meses.
