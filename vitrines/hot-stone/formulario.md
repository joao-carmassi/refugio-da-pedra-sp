# Hot Stone — respostas do formulário

**O cliente não respondeu o formulário.** Estas respostas foram lidas do site
que a própria casa publica (`https://www.hotstonepizzaria.com.br`, código em
`D:\vs-programs\hotstone\hot-stone`) e do cadastro do pino em
`src/data/mapa-turistico.json`. Cada campo diz de onde veio.

Enquanto o cliente não confirmar, o que está marcado **PENDENTE** não aparece
na página — nada foi completado de cabeça. Ver `dossie.md` para o que a página
deixa de mostrar por causa disso.

---

## 1. Em uma frase, o que é o seu negócio?

> Pizzaria, hamburgueria e choperia na avenida que corta o centro de São Bento
> do Sapucaí. Abre todas as noites, a partir das 18h.

*Fonte: `resumo` e `descricao` do cadastro do pino, escritos contra a ficha
federal (CNAE principal restaurante; secundários bar, bufê e comida para
consumo em casa).*

## 2. O que faz alguém escolher você e não o do lado?

> Faz as quatro coisas no mesmo endereço — pizza, hambúrguer, chope e entrega —
> e é o único do centro que abre as sete noites da semana. O salão tem balcão
> de bar com chope na torneira, boxes de capitonê e vitrola tocando disco.

*Fonte: cadastro (horário, atividades) + fotos do salão no site da casa
(`home/vibe/salao-vitrola.jpg`, `home/vibe/balcao-bar.jpg`).*

**Não é forno a lenha.** A foto de preparo que a casa publica
(`home/socials/preparo-forno-1.jpg`) mostra forno de esteira. A página fala em
"assada na hora", que é o que a foto sustenta, e em nenhum momento em lenha ou
pedra. Confirmar com a casa antes de escrever qualquer coisa sobre o forno.

## 3. O que você vende, com preço

> **PENDENTE — não há um preço sequer.** O site da própria casa registra, em
> `src/lib/menu.ts`: *"o PDF do cardápio ainda não chegou. Só as pizzas
> salgadas têm nome (vieram das pastas de foto) e nenhum item tem preço."*
>
> O que existe é a lista de seções do cardápio, sem valor:
> pizzas salgadas (34 sabores fotografados), pizzas doces, hambúrgueres
> gourmet, porções, parmegianas, pratos executivos, panquecas, batata cremosa,
> chope e cervejas, vinhos, sucos naturais, drinks e bebidas, guloseimas.

A seção de oferta da página existe assim mesmo — é uma das três vagas que não
caem —, mas mostra **categoria e foto**, não preço. Quando o cardápio chegar,
é ali que os valores entram.

## 4. Fotos

> Vieram do acervo do site da casa. Seis já estavam no cadastro do pino
> (`hot-stone-1` a `-6`); mais seis foram convertidas para esta página
> (`hot-stone-7` a `-12`).

Escolhidas para a página:

| Arquivo | O que é | Onde entra |
| --- | --- | --- |
| `hot-stone-7` | seis mãos tirando fatia da mesma pizza | dobra + cartão social |
| `hot-stone-12` | a pizza Hot Stone, da casa | oferta |
| `hot-stone-4` | hambúrguer no papel da casa | oferta |
| `hot-stone-5` | tábua com carne, fritas e chope Sapucaí | oferta |
| `hot-stone-6` | fileira de drinques no balcão | oferta |
| `hot-stone-1` | fachada à noite | ambiente |
| `hot-stone-2` | salão com balcão e prateleiras | ambiente |
| `hot-stone-10` | balcão do bar visto do corredor | ambiente |
| `hot-stone-11` | boxes de capitonê na parede vermelha | ambiente |
| `hot-stone-9` | vitrola tocando disco | ambiente |
| `hot-stone-8` | pizza saindo na esteira do forno | ambiente |

Ficaram de fora, do acervo da casa: as 33 fotos de pizza restantes (uma por
sabor — servem a um cardápio, não a uma página de cinco seções), as de drinque
isolado, as de delivery e as da equipe.

## 5. Sua marca

> Vermelho e preto, com fundo de papel quente. Os valores saem do
> `globals.css` do site da casa, que é a fonte mais próxima de um manual de
> marca que existe hoje: `--primary: oklch(0.53 0.215 27)` ("vermelho Hot
> Stone", no comentário do próprio arquivo), `--foreground: oklch(0.29 0.075 26)`
> ("preto avermelhado do letreiro"), `--background: oklch(0.97 0.008 80)`
> ("papel quente"). A parede vermelha de `hot-stone-11` e o painel canelado da
> fachada confirmam o tom.

> **Logo:** PENDENTE. O site desenha o logotipo em componente
> (`src/components/icons/logo.tsx`), não há arquivo vetorial na pasta. A página
> não usa logo — o nome aparece como texto.

> **Fonte:** o site da casa usa Bricolage Grotesque no corpo, Anton condensada
> e Instrument Serif nos títulos. A vitrine leva **Anton** no display, que é a
> voz de letreiro da fachada, e mantém o Archivo do Refúgio no corpo — duas
> famílias bastam.

## 6. Prova de quem já foi

> **4,7 de 5, com 169 avaliações no Google** — é o que a casa publica no
> próprio site (`src/lib/site.ts`, `rating: { score: "4,7", count: "169" }`).

> **Depoimentos: PENDENTE.** O site da casa tem um `TODO cliente` exatamente
> aqui: *"depoimentos reais do Google — texto, primeiro nome e data de cada
> avaliação que a casa quiser destacar"*. Nenhum foi escrito, e nenhum foi
> inventado aqui.

> Ano de abertura: PENDENTE. 2020 é a data do CNPJ, e o próprio site marca que
> pode não ser a data em que a pizzaria abriu.

## 7. Horário de funcionamento

> Seg a qui, 18h às 23h30 · sex a dom, 18h às 0h.

*Fonte: cadastro do pino, que confere com o que a casa publica. É o que faz o
selo de aberto/fechado funcionar.*

> A **entrega tem grade própria** e nem sempre acompanha a do salão — está na
> `descricao` do cadastro. A página não publica horário de entrega por isso.

## 8. Onde você quer que a pessoa vá parar

> **PENDENTE — decisão do cliente.** A página assume WhatsApp como botão
> principal e rota no Google Maps como secundário: quem abre a página do mapa
> está na cidade, à noite, decidindo onde comer, e as duas perguntas dele são
> "tem mesa?" e "onde é?".
>
> O pedido online **não** virou botão de propósito: o link de delivery que o
> site da casa usa está marcado lá como `TODO cliente — o domínio principal
> ainda aponta para a loja antiga`. Botão que leva a loja errada é pior que
> botão nenhum.

## 9. Contatos e redes

- WhatsApp: (12) 99733-6413 — *do cadastro do pino; o site da casa confirma*
- Segundo número: (12) 99786-3282 — *só no site da casa; não entra na página,
  que usa o número do cadastro*
- Instagram: @hotstone.pizzaria
- Facebook: facebook.com/hotstonepizzariaa
- TikTok: @hotstonefoodservice
- Site: https://www.hotstonepizzaria.com.br

## 10. Tem algo que a página não pode dizer?

> **PENDENTE.** Ninguém perguntou ainda. Os riscos conhecidos, e o que a página
> fez com cada um:
>
> - preço: não diz nenhum;
> - forno a lenha: não afirma;
> - depoimento de cliente: não publica nenhum;
> - link de delivery: não linka, porque o da casa aponta para a loja antiga;
> - CEP 12490-000 aparece no site da casa e **não** no cadastro do pino — a
>   página usa o endereço do cadastro, sem CEP.
