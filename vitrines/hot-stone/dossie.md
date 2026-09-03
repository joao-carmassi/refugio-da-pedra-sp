# Hot Stone — dossiê da vitrine

Primeira página do plano Vitrine feita para um negócio de verdade. A da Pedra
do Baú é o teste do processo; esta é o produto.

- **Rota:** `/mapa-turistico/hot-stone/`
- **Publicada em:** 02/09/2026 (`LAST_MODIFIED_PAGINA_DE_PONTO` em `src/app/sitemap.ts`)
- **Material de origem:** o site que a própria casa mantém
  (`https://www.hotstonepizzaria.com.br`, código em
  `D:\vs-programs\hotstone\hot-stone`) e o cadastro do pino em
  `src/data/mapa-turistico.json`.

**O cliente não respondeu o formulário.** Tudo o que a página diz saiu de uma
das duas fontes acima, e `formulario.md` registra campo por campo de onde veio
e o que ficou pendente.

## As cinco seções

| # | Vaga | Arquivo | Bloco de origem | Por que este |
| --- | --- | --- | --- | --- |
| 1 | Dobra | `dobra.tsx` | `@shadcnblocks/hero157` | foto de tela cheia com véu, rótulo, título e um botão — a foto é o argumento de uma pizzaria, e o bloco não pede nada além de `lucide-react` |
| 2 | Oferta | `cardapio.tsx` | `@shadcnblocks/feature132` | quatro cartões com foto, um por frente da casa. Quatro é exatamente o que a ficha federal descreve: restaurante, bar, bufê e comida para levar |
| 3 | Ambiente | `ambiente.tsx` | `@shadcnblocks/gallery49` | moldura de retrato revelado, torta. O site da casa é feito de adesivo, fita e vinil — grade limpa seria de outra pizzaria |
| 4 | Prova | `prova.tsx` | `@shadcnblocks/stats8` | três números com régua em cima. Sem depoimento (ver abaixo), a vaga vira número verificável |
| 5 | Visita | `visita.tsx` | `@shadcnblocks/cta3` | painel com dois botões de um lado e dois cartões do outro: os cartões seguram horário e o link de volta para o mapa |

Nenhuma seção caiu — as cinco vagas foram preenchidas. A ordem é a padrão
(oferta antes de ambiente): o que a Hot Stone vende é comida, e quem procura
onde jantar decide pelo prato e confirma pelo salão.

Recusados no caminho: `gallery25` e `gallery26`, que pedem `framer-motion` —
este repositório anima com GSAP (`src/hooks/use-reveal.ts`).

## Fotos

Doze arquivos novos em `public/assets/mapa/hot-stone/`, `hot-stone-7` a
`hot-stone-13`, convertidos do acervo do site da casa (`.webp`, maior lado em
1620 px, qualidade 82). As seis primeiras (`-1` a `-6`) já eram do cadastro do
pino. Todas com alt em `src/data/image-alt.json`.

`hot-stone-2` (o balcão visto de perto) saiu da galeria depois da primeira
montagem: lado a lado com `hot-stone-10`, que é o mesmo canto num ângulo
parecido, as duas pareciam a mesma foto repetida. Entrou `hot-stone-13`, o
salão de mesas com os discos na parede. A `-2` continua no cadastro e continua
aparecendo no cartão do mapa.

O acervo da casa tem 80 arquivos. Ficaram de fora as 33 fotos de pizza sabor a
sabor (servem a um cardápio, não a uma página de cinco seções), as de drinque
isolado, as de delivery e as da equipe.

## O que a página não mostra, e por quê

| Falta | Consequência na página | O que resolve |
| --- | --- | --- |
| **preço** | a seção de oferta mostra categoria e foto, e manda pedir o cardápio no WhatsApp | o PDF do cardápio. O site da casa espera por ele desde que foi feito |
| **depoimento** | a vaga de prova virou três números, e o parágrafo diz em voz alta que não há comentário ainda | 1 a 3 avaliações do Google que a casa queira destacar, com nome e data |
| **logo em vetor** | o nome aparece como texto, em Anton | `.ai`, `.svg` ou `.pdf` do logotipo |
| **link de pedido online** | não há botão de delivery | a URL nova da loja. A que a casa publica ainda aponta para a antiga |
| **ano de abertura** | a página não cita tempo de casa | o ano real (2020 é a data do CNPJ) |
| **horário da entrega** | a página só publica o horário do salão | a grade da entrega, que o cadastro registra como diferente |

## Decisões que alguém vai querer refazer

- **A nota do Google entrou no cadastro, e não no JSON-LD.** `nota: "4,7"` e
  `avaliacoes: 169` são o que a própria casa publica no site dela. A página os
  mostra e o cartão do mapa passa a mostrar também, mas **não** há
  `aggregateRating` na marcação: este site não hospeda as avaliações nem as
  apurou, e marcar isso como dado estruturado é o que derruba o domínio
  inteiro, não só a página. Se alguém confirmar a nota direto no perfil do
  Google, ainda assim a decisão de marcar é outra conversa.
- **Não se fala em forno a lenha nem em forno de pedra.** A foto de preparo que
  a casa publica mostra forno de esteira. A página diz "assada na hora", que é
  o que a foto sustenta. Confirmar com a casa antes de escrever qualquer outra
  coisa sobre o forno.
- **O `@type` do nó do negócio é `Restaurant`, e na landing do mapa o mesmo
  `@id` é `TouristAttraction`.** Não é conflito: os dois valem para a mesma
  entidade e o consumidor os soma. O tipo específico mora na página porque é
  ela que descreve o negócio; o genérico mora na lista porque lá ele é um item
  de um guia.
- **`getWhatsLocal` subiu de `painel-detalhes.tsx` para
  `src/lib/mapa-turistico.ts`.** A página do parceiro precisa do mesmo botão, e
  `generateWhatsLink` não serve — aquele é o WhatsApp da pousada, e quem
  pergunta se tem mesa quer falar com quem atende ali.
- **`bg-muted` no painel de fecho, e não `bg-accent`.** O `--accent` deste tema
  é meio tom mais escuro e o endereço em `text-muted-foreground` caía para
  4,4:1 em cima dele — abaixo de AA para os 16 px do celular.
- **A legenda do retrato revelado alinha à esquerda.** Centrada, como vinha no
  bloco, criava um segundo eixo de leitura numa página que lê pela margem
  esquerda inteira (e o validador acusava).

## Uma armadilha que custou um build

Citar uma utilitária de background com URL literal **dentro de um comentário**
quebra o build: o Tailwind varre o arquivo inteiro, gera a classe a partir do
texto do comentário e o Turbopack falha tentando resolver a URL de exemplo.
O comentário de `dobra.tsx` descreve o que o bloco original fazia sem escrever
a classe.
