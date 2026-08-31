---
name: cadastrar-ponto-mapa
description: Cadastra um ponto (pin) no mapa turístico de São Bento do Sapucaí — atrativo público ou comércio cliente —, aplicando os limites de pin e de foto dos planos Mapa, Destaque e Vitrine, gravando em src/data/mapa-turistico.json, convertendo as fotos e rodando as rotas. Use sempre que pedirem para adicionar, criar, cadastrar, editar ou remover um ponto, pin, lugar, estabelecimento, atrativo, cachoeira, restaurante ou pousada no mapa; quando um cliente fechar plano e precisar entrar no mapa; quando pedirem um segundo pin do mesmo estabelecimento; ou quando forem adicionar, trocar ou tirar fotos de um ponto. Vale mesmo sem citar "mapa-turistico.json" nem a palavra "pin" — "põe a padaria do centro no mapa", "o cliente fechou o Destaque", "coloca mais uma foto na cachoeira do Toldi", "esse restaurante fechou, tira do mapa" são todos casos desta skill.
---

# Cadastrar ponto no mapa turístico

O mapa é o produto vendido: quem paga assinatura aparece nele, e quem não paga
também — os atrativos públicos são o que faz o mapa valer a pena abrir. As duas
coisas moram no mesmo arquivo e seguem regras diferentes. Esta skill existe para
que essa diferença não se perca na hora de cadastrar.

## O que esta skill toca

| Arquivo | O que muda |
| --- | --- |
| `src/data/mapa-turistico.json` | a entrada do ponto — é a fonte de tudo |
| `public/assets/mapa/<id>/` | as fotos, já em `.webp` |
| `src/data/image-alt.json` | o alt de cada foto nova |
| `src/data/rotas.json` | gerado por `npm run rotas`, nunca à mão |

A landing (`src/app/mapa-turistico/`) conta pontos e categorias a partir do
cadastro, então ela se atualiza sozinha — não edite número nenhum no JSX.

A página própria do plano Vitrine **não** é feita aqui. Não existe rota de
parceiro no app ainda; cadastre o pin normalmente e diga ao usuário, no fim,
que a página segue pendente.

## Passo 1 — classificar o ponto

Tudo depende disto, então resolva antes de perguntar qualquer outra coisa:

- **Atrativo público** — cachoeira, pedra, mirante, praça, igreja, museu, portal,
  monumento. Não tem dono cobrando e não tem plano. Fotos **à vontade** (a
  Capelinhas de Mosaico tem 13, a Pedra do Baú tem 6). Nunca leva `destaque`.
- **Comércio** — restaurante, pousada, loja, ateliê, agência, prestador de
  serviço. Segue a tabela de planos abaixo, **seja cliente ou não**. Comércio sem
  assinatura entra como pin normal: no máximo 3 fotos e sem `destaque`.

Se não estiver claro de que lado o ponto cai, pergunte. Um ateliê que vende peça
é comércio; a igreja de adobe ao lado dele não é.

Pins antigos que estouram esses limites (`arte-no-quilombo` e
`atelie-ditinho-joana` têm 6 fotos cada) são anteriores à tabela. Não corte foto
de ponto existente por causa desta skill — mencione, e deixe a decisão com o
usuário.

## Passo 2 — os planos

| Plano | Pins inclusos | Fotos | `destaque` |
| --- | --- | --- | --- |
| **Mapa** — R$ 29,90/mês | até 3, todos normais | 3 por pin | nenhum pin |
| **Destaque** — R$ 49,90/mês | até 3: 1 com destaque + 2 normais | 6 no pin com destaque, 3 em cada normal | só no pin principal |
| **Vitrine** — R$ 89,90/mês | igual ao Destaque | igual ao Destaque | só no pin principal |

Pin avulso, fora dos inclusos: normal R$ 7,90/mês, com destaque R$ 12,90/mês. Ou
seja, mais de 3 pins é possível — só não é de graça. Ao cadastrar o 4º pin de um
mesmo assinante, avise que ele é cobrado à parte e confirme se foi contratado
antes de gravar.

O que o Vitrine tem a mais é a página própria, não pin nem foto. Para o mapa em
si, Destaque e Vitrine são idênticos.

**Regra dos múltiplos pins.** Os pins de uma assinatura têm de ser do mesmo dono
e ficar na mesma propriedade ou numa área vizinha — a pousada que cadastra
piscina, pesque-pague e fogueira do próprio terreno. Se o segundo pin pedido for
outro negócio, ou o mesmo negócio noutro lugar da cidade, isso é assinatura nova:
diga isso ao usuário em vez de cadastrar. O mapa não tem campo para amarrar pins
a um dono, então essa checagem é sua e some se você não a fizer.

Nada disso é gravado no repositório — quem assina o quê fica com o usuário. Você
aplica o limite no momento do cadastro e reporta o que aplicou.

## Passo 3 — juntar os dados

Peça o que faltar antes de escrever. Os campos, na ordem em que entram no JSON:

- **`id`** — slug em kebab-case, sem acento, único. É a chave de tudo: nome da
  pasta de fotos, chave em `rotas.json`, alvo de `acesso.ponto`. Trocar depois
  quebra os três.
- **`nome`** — como o lugar se chama, do jeito que ele se anuncia.
- **`cat`** — uma de: `turismo`, `cultura`, `restaurantes`, `cafes`,
  `hospedagem`, `compras`, `aventura`, `experiencias`, `servicos`. Igreja, museu
  e casa de cultura vão em `cultura`, não em `turismo` — `turismo` é cachoeira,
  mirante e praça. `compras` é artesanato; corretor e prestador vão em
  `servicos`. `hospedagem` hoje é só o Refúgio.
- **`zona`** — `bau` (Vale do Baú), `centro` ou `vale` (rota rural). É o trecho
  do vale, usado para descrever o lugar por perto.
- **`lat` / `lng`** — nunca estime no olho. Fonte primária: OpenStreetMap, site
  oficial do lugar, cadastro do município, GPS com waypoint nomeado. Se a
  coordenada for a rua certa mas não o imóvel, grave assim mesmo e marque
  `aConferir: true` — o mapa prefere o pino aproximado admitido ao pino exato
  inventado.
- **`aConferir`** — `true` enquanto nome, horário ou coordenada não foram
  confirmados. Existe um bloco `TODO(proprietário)` no topo de
  `src/lib/mapa-turistico.ts` que lista o que está pendente; acrescente uma linha
  lá quando marcar um ponto novo, e apague a linha quando o `aConferir` cair.
- **`horario`** — **só** com horário publicado por fonte oficial ou confirmado
  com o estabelecimento. O cartão calcula "Aberto agora" a partir daqui; com
  palpite, ele manda o hóspede subir a serra à toa. Sem confirmação, deixe o
  campo fora — o cartão simplesmente não mostra funcionamento, e isso é de
  propósito. Formato do cadastro: `"Seg a sex, 10h às 12h e 13h às 18h · sáb e
  dom, 10h às 18h"`, `"Todos os dias, 9h às 18h"`.
- **`resumo`** — uma ou duas frases: o que o lugar é e por que alguém iria. É o
  que aparece no cartão.
- **`descricao`** — um parágrafo com o concreto: preço, tempo de trilha, o que é
  obrigatório, o que fecha em que horário, o que a fonte diverge. Opcional, mas
  é o que faz a ficha valer.
- **`endereco`** — logradouro, número, bairro — cidade. Sempre.
- **`tel`**, **`site`** — no formato `(12) 99999-9999` e URL com `https://`.
- **`nota`**, **`avaliacoes`** — nota do Google como string (`"4,7"`) e número de
  avaliações, só quando conferidos na hora.
- **`destaque`** — só onde o plano paga por ele.
- **`refugio`** — nunca. É só da pousada.
- **`acesso`** — só quando o carro não para no pino. Ver abaixo.
- **`fotos`** — ver Passo 5.

Grave nessa ordem; o arquivo inteiro segue ela.

### `acesso`, e por que ele existe

O pino fica na atração — no cume, na queda. O botão "Como chegar" e a distância,
não: eles vão para onde o carro efetivamente para. `acesso` é o que separa as
duas coisas, e só existe onde a ficha mentiria sem ele.

```jsonc
"acesso": {
  "ponto": "mona-pedra-bau",              // ou "lat"/"lng", nunca os dois
  "nome": "a portaria do Monumento Natural", // minúscula, com artigo
  "aPe": "De lá são cerca de 30 minutos de caminhada, nível fácil e sem via ferrata."
}
```

`aPe` é o único campo obrigatório e é prosa escrita por quem conhece o caminho —
distância, tempo, dificuldade, exigências. Não invente número: se ninguém sabe
quanto é a pé, pergunte antes de gravar.

## Passo 4 — escrever a entrada

O cadastro tem um tom, e ele é o oposto de anúncio: prosa seca, informação
verificável, o que se sabe e como se sabe. "Cascata com salto de mais de 70
metros, a maior do município, vista de um deck na estrada" — não "uma
experiência inesquecível em meio à natureza". Onde as fontes divergem, o texto
diz que divergem ("as fontes públicas divergem sobre quais dias, então ligue
antes de descer"). Onde o pino é aproximado, o texto avisa ("fica a uns 80
metros do endereço declarado no cadastro federal").

Isso vale inclusive para cliente pagante. O que o dinheiro compra é posição,
tamanho de cartão e selo — não adjetivo.

Exemplo do formato final, um comércio no plano Destaque:

```json
{
  "id": "hot-stone",
  "nome": "Hot Stone Pizzaria & Hamburgueria",
  "cat": "restaurantes",
  "zona": "centro",
  "lat": -22.691488,
  "lng": -45.7326,
  "resumo": "Pizza, hambúrguer e chope na avenida que corta o centro. Come-se no salão ou pede-se em casa; abre à noite, e não todo dia.",
  "descricao": "Fica na Avenida Conselheiro Rodrigues Alves, a via que atravessa o centro de ponta a ponta. …",
  "endereco": "Avenida Conselheiro Rodrigues Alves, 32, Centro — São Bento do Sapucaí",
  "tel": "(12) 99733-6413",
  "site": "https://www.hotstonepizzaria.com.br",
  "destaque": true,
  "fotos": {
    "pasta": "mapa/hot-stone",
    "arquivos": ["hot-stone-1.webp", "hot-stone-2.webp", "hot-stone-3.webp"]
  }
}
```

Onde inserir no array: junto dos vizinhos de zona e assunto, e não no fim por
preguiça. O arquivo hoje vai do Baú para o Centro e fecha com a rota rural.

## Passo 5 — as fotos

Convenção, sem exceção: pasta `public/assets/mapa/<id>/`, arquivos
`<id>-1.webp`, `<id>-2.webp`, … numerados de 1 em diante e listados em `fotos.arquivos`
na ordem em que devem aparecer. **A primeira é a capa** — é ela que vai no cartão
e no card da landing (`getFotoPrincipal`). A galeria só aparece a partir de 2
fotos.

`fotos.pasta` é o caminho **sem** `/assets/` e sem barra no fim: `"mapa/hot-stone"`.

Quantidade: o limite do plano do Passo 2 para comércio; livre para atrativo
público. Escolha por qualidade, não por quantidade — três fotos boas valem mais
que seis com duas ruins.

### Converter

Originais chegam em jpg/png e vão para `.webp` com o maior lado em 1620 px, que
é o padrão de todo o acervo. `ffmpeg` está instalado e resolve:

```bash
ffmpeg -hide_banner -loglevel error \
  -i "<origem>" \
  -vf "scale='min(1620,iw)':'min(1620,ih)':force_original_aspect_ratio=decrease" \
  -c:v libwebp -quality 82 \
  -y "public/assets/mapa/<id>/<id>-1.webp"
```

O `min()` impede aumento: foto que já é menor que 1620 fica do tamanho que é —
esticar não cria detalhe, só peso. Se o arquivo passar de ~800 KB, baixe a
`-quality` para 75 e refaça.

### Alt

Cada foto nova ganha uma linha em `src/data/image-alt.json`, chaveada pelo
caminho público completo:

```json
"/assets/mapa/hot-stone/hot-stone-1.webp": "Salão de mesas altas com o forno de pizza aceso ao fundo"
```

Abra a foto e descreva **o que está no quadro**, em uma linha, sem ponto final,
sem "imagem de". A regra que o acervo já segue: se o enquadramento não prova que
aquilo é o lugar do cadastro, não afirme o nome — descreva o que se vê e
registre a dúvida num `TODO(proprietário)` em `src/lib/image-alt.ts`, como está
feito para `ana-chata-1.webp`. Alt inventado é pior que alt genérico.

## Passo 6 — rotas

**Obrigatório depois de gravar coordenada nova ou mudar `acesso`:**

```bash
npm run rotas
```

Sem isso o ponto não tem distância, não tem tempo de carro e o botão "Como
chegar" não sabe para onde mandar — o cadastro fica pela metade e a falha só
aparece na tela. O script recalcula as duas origens (Refúgio e Centro) contra o
OSRM público, leva alguns minutos e pede rede. `src/data/rotas.json` é saída de
máquina: não edite à mão.

`npm run base` **não** é preciso — a base offline depende da cerca de
`regiao.json`, não dos pontos. O que importa é o pino cair dentro dessa cerca
(longitude entre −45,92 e −45,5; latitude entre −22,85 e −22,5): fora dela o
mapa não deixa arrastar até o ponto.

## Passo 7 — conferir

Rode o validador da skill, que checa o que dá para checar por máquina — campos,
categoria, zona, cerca, `acesso`, nomes e dimensões de foto, alt faltando,
limite do plano e presença nas rotas:

```bash
node .agents/skills/cadastrar-ponto-mapa/scripts/validar-ponto.mjs <id> --plano destaque
```

Planos aceitos: `--plano mapa|destaque|vitrine`, `--publico` para atrativo
público, `--todos` para varrer o cadastro inteiro. Sem `--plano` nem `--publico`
ele pula só a checagem de limite de foto.

Depois disso, `npx tsc --noEmit` se você mexeu em algum `.ts`.

## O que reportar no fim

Diga, em poucas linhas: qual pin entrou, sob qual plano e com quantas fotos;
quantos pins aquele assinante passa a ter e se algum é cobrado à parte; o que
ficou com `aConferir` e por quê; se o `horario` ficou em branco e o que falta
para preenchê-lo; e — quando o cliente for Vitrine — que a página própria ainda
não existe.
