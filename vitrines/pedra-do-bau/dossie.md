# Pedra do Baú — dossiê da vitrine (teste)

Esta pasta normalmente guarda `formulario.md` com as respostas do cliente. Aqui
não há cliente: a Pedra do Baú é atrativo público, não tem dono, não assina
plano e não respondeu formulário nenhum. A página foi feita para **exercitar o
processo da skill `pagina-vitrine` de ponta a ponta** antes da primeira vitrine
vendida.

Como o formulário não existe, cada campo dele foi substituído por uma fonte de
dentro do repositório — e nada foi escrito de cabeça.

| O que o formulário pediria | De onde veio aqui |
| --- | --- |
| a frase de uma linha | `resumo` do ponto em `src/data/mapa-turistico.json` |
| o diferencial concreto | `descricao` do mesmo ponto |
| o que vende, com preço | não existe. A vaga virou "o que a subida exige", escrita sobre `descricao` e `acesso.aPe` |
| 8 a 12 fotos | as 6 já cadastradas em `public/assets/mapa/pedra-do-bau/` + 1 do Bauzinho, todas com alt já em `image-alt.json` |
| logo e cores | não existe. A paleta foi derivada da própria pedra — ver `marca.json` |
| depoimento ou nota | não existe, e não foi inventado. A vaga virou três números verificáveis |
| horário | o ponto não tem. A página mostra o da **portaria** (`mona-pedra-bau`), dizendo de quem é |
| o que ele quer que aconteça | traçar a rota até o estacionamento onde a trilha começa |

## O que ficou diferente de uma vitrine de verdade

- **A identidade é inventada** — derivada do granito, do líquen e da neblina.
  Um parceiro traz as cores dele, e é isso que o `marca.json` normalmente
  registra.
- **Nada aponta para a página.** O cadastro não foi tocado: o ponto segue sem
  `destaque` e sem `vitrine`, então nem o cartão do mapa nem o sitemap a
  publicam. O validador acusa isso como erro, e o erro está certo — é o teste
  que é a exceção.
- **A vaga de prova social trocou de assunto** em vez de cair, o que virou uma
  regra escrita na skill (Passo 4).

## Costura, achada no olho

A primeira montagem manteve a medida que cada bloco trouxe: dobra centrada em
`max-w-3xl`, `subir` e `visita` presos em `mx-auto max-w-5xl`, galeria e
números na largura cheia do `.container`. Cinco réguas numa página só — e o
efeito é o de seções que não se encostam, mesmo com tema, fonte e ritmo
certos.

Agora as cinco abrem no `.container`, alinham à esquerda no mesmo eixo, usam o
`Rotulo` da landing como eyebrow e a mesma escala de título
(`text-2xl md:text-4xl lg:text-5xl`). A grade de `subir` foi de 2x2 presa a
`max-w-5xl` para quatro colunas na largura cheia, e a faixa da galeria trocou
`bg-background` (que não pintava nada) por `bg-muted`.

Isso virou a regra 7 da skill, o item 1 do Passo 7 e duas checagens novas no
validador (seção fora do `.container`; invólucro `mx-auto max-w-*`).

## Divergência de dado encontrada no caminho

A altitude do cume aparece com **três valores** no repositório: 1.950 m (no
cadastro do mapa e em vários posts), 1.964 m (nos posts de história e de
altitude) e 1.969 m (em `sao-bento-do-sapucai.md`). A Ana Chata aparece como
1.670 m na maioria e 1.738 m nesse mesmo post.

A página usa **1.950 m**, que é o valor do cadastro — a regra da skill é que o
cadastro é a fonte. Mas o site está se contradizendo em público, e isso é
assunto para quem edita o blog, não para esta página.
