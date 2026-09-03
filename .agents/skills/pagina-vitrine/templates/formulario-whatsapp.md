# Formulário da vitrine — texto para WhatsApp

Versão do `formulario.md` para mandar direto na conversa, em mensagem única. Não
existe página de formulário no site: o cliente responde no WhatsApp, e quem
organiza as respostas em `vitrines/<id>/formulario.md` é você.

## Como usar

1. Mande **depois** que o pino já estiver no mapa. Este formulário não repete o
   que o cadastro já tem — endereço, telefone, horário e nota do Google saem de
   `mapa-turistico.json`. Perguntar duas vezes cansa o cliente e cria duas
   versões do mesmo dado.
2. Troque `[NEGÓCIO]` e `[id]` (o slug do ponto, que vira a URL).
3. Áudio serve para os itens de texto. Fotos e logo vêm por link de pasta ou
   pelo próprio WhatsApp — as originais ficam em `vitrines/<id>/originais/`.
4. Resposta pela metade **não** começa página. Ver Passo 2 do SKILL.md.
5. O formulário **não** pergunta depoimento nem prêmio. A seção de prova sai da
   nota e das avaliações do Google, que já estão no cadastro. Se a seção 4 da
   página ficar magra, pergunte pontualmente — uma pergunta solta na conversa
   volta respondida; um item de formulário volta em branco.

Formatação nos marcadores do WhatsApp (`*negrito*`). Markdown de verdade — `#`,
`[]()`, tabela — aparece cru na conversa. Asterisco solto no meio de uma linha
que já tem negrito fecha errado: não use.

## O texto

```
*Sua página no Mapa de São Bento do Sapucaí*

É a página que vem com o plano Vitrine: um endereço só seu, refugiodapedra.com.br/mapa-turistico/[id]/, ligado ao mapa da cidade. Serve pra mandar no WhatsApp, colocar na bio do Instagram e aparecer no Google.

São 8 perguntas. Pode responder por áudio, eu transcrevo.

*O que você não responder, a página não mostra*: nada é inventado, nem preço, nem elogio de cliente. Endereço, telefone e horário eu já tenho do seu pino — mudou num lugar, muda no outro.

*1. Em uma frase, o que é [NEGÓCIO]?*
Como você explicaria pra alguém que acabou de chegar na cidade. É a primeira linha que a pessoa lê.

*2. O que faz alguém escolher você e não o do lado?*
O concreto, não o adjetivo. "Forno a lenha desde 1998" vale. "Qualidade e bom atendimento" não diz nada — todo mundo escreve isso.

*3. O que você vende, com preço*
De 4 a 8 itens: o carro-chefe, o mais pedido, o mais caro, o mais barato.
Tem cardápio ou catálogo em PDF ou imagem? Manda que eu monto a partir dele.

*4. Fotos: de 8 a 15*
Manda mais do que precisa e a gente escolhe as melhores juntos — na página entram só as boas.
Em ordem de importância:
1. uma foto forte do lugar — é a que abre a página e a que aparece quando o link é compartilhado no WhatsApp
2. 3 ou 4 do ambiente: fachada, salão, vitrine, área externa
3. 3 ou 4 do produto: prato, peça, quarto, o serviço sendo feito
4. uma sua ou da equipe trabalhando, se você topar
Foto de celular serve, desde que *na horizontal, com luz e sem filtro*. Print de story e foto com data queimada no canto, não. Se você tem foto de fotógrafo, é a hora de usar.
Manda por link de pasta (Drive, WeTransfer) ou aqui mesmo.

*5. Sua marca*
- Logo: o arquivo original se você tiver (.ai, .svg, .pdf) ou o PNG maior que achar
- Cores: os códigos, se você souber. Se não, diga o nome ou aponte o que já usa ("o vermelho da fachada", "o mesmo do Instagram")
- Alguma referência? Um site ou perfil cuja aparência você gosta

*6. Onde você quer que a pessoa vá parar*
Escolha *uma* — é o botão grande da página:
- chamar no WhatsApp
- ligar
- traçar a rota até você
- pedir pelo iFood ou pelo seu site (manda o link)
- seguir no Instagram
- outra coisa: qual?

*7. Redes e links*
Instagram, Facebook, site e e-mail — os que existirem e que você quer na página.

*8. Tem algo que a página não pode dizer?*
Preço que mudou e ainda circula, item que saiu do cardápio, sócio que não aparece mais, endereço antigo que está no Google, foto antiga rodando por aí. Fala agora.

Com tudo isso em mãos a página fica pronta em alguns dias, e você recebe o link pra aprovar antes de ir pro ar. Trocar foto ou preço depois é só me avisar.
```

## Quando faltar coisa

Não monte com buraco. Cobre o que falta nomeando a consequência, que é o que
faz o cliente responder:

```
Chegaram as fotos e os preços, faltam a logo e as cores. Sem elas a página sai com o cinza padrão em vez da sua identidade — que é justamente o que o Vitrine tem a mais. Consegue me mandar até [dia]?
```

```
Sem pelo menos 8 arquivos a galeria não entra e a página fica com 4 seções em vez de 5. Prefiro 4 seções honestas a uma galeria com foto ruim, então me diz: dá pra tirar fotos novas ou eu monto sem a galeria?
```
