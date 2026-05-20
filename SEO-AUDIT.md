# Auditoria SEO — Canibalização e Melhorias

> Gerado em 20/05/2026. Já aplicados: Toscana Brasileira, Suíça Brasileira, "O que fazer em 1 dia" e "O que fazer à noite".

---

## 1. Casos de Canibalização Confirmados

### 1.1 "o que fazer em São Bento do Sapucaí" — 3 posts em conflito

| Post | focus_keywords problemáticas |
|------|------------------------------|
| `sao-bento-do-sapucai.md` | "o que fazer São Bento do Sapucaí", "guia São Bento do Sapucaí" |
| `o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos.md` | "o que fazer em São Bento do Sapucaí", "pontos turísticos", "roteiro 1 dia" |
| `festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-guia-completo.md` | **"o que fazer São Bento do Sapucaí"** (conflito direto) |

**Fix:** Remover "o que fazer São Bento do Sapucaí" dos focus_keywords de `festas-e-eventos-tradicionais`. Manter `sao-bento-do-sapucai.md` como pillar/hub e `o-que-fazer` como deep-dive, diferenciando focus_keywords: o pillar usa apenas "São Bento do Sapucaí" e "turismo São Bento do Sapucaí".

---

### 1.2 "Toscana Brasileira" — 2 posts em conflito

| Post | focus_keywords problemáticas |
|------|------------------------------|
| `toscana-brasileira-sao-bento-do-sapucai.md` | "Toscana Brasileira", "enoturismo São Bento do Sapucaí" |
| `por-que-sao-bento-do-sapucai-produz-vinho-e-azeite-o-segredo-esta-na-serra.md` | **"Toscana brasileira São Bento"** (conflito direto) |

**Fix:** Remover "Toscana brasileira São Bento" de `por-que-produz-vinho-e-azeite`. Diferenciar: `toscana-brasileira` = conceito/apelido; `produz-vinho-e-azeite` = técnico/terroir.

---

### 1.3 "o que fazer em Campos do Jordão" — 2 posts em conflito

| Post | focus_keywords |
|------|----------------|
| `o-que-fazer-em-campos-do-jordao-guia-completo-de-atividades.md` | "o que fazer em Campos do Jordão", "atividades", "passeios" |
| `pontos-turisticos-de-campos-do-jordao-os-12-lugares-imperdiveis.md` | "pontos turísticos Campos do Jordão", **"o que visitar Campos do Jordão"** |

**Fix:** Remover "o que visitar" de `pontos-turisticos` e "atrações" de `o-que-fazer`. Diferenciar: `o-que-fazer` = experiências/atividades; `pontos-turisticos` = atrações físicas concretas.

---

### 1.4 "hospedagem / pousada Refúgio da Pedra" — 2 posts sobrepostos

| Post | focus_keywords |
|------|----------------|
| `refugio-da-pedra-a-pousada-mais-proxima-da-pedra-do-bau.md` | "pousada perto da Pedra do Baú", "chalés Pedra do Baú" |
| `serra-da-mantiqueira-hospedagem-no-refugio-da-pedra-em-sao-bento-do-sapucai.md` | "hospedagem Serra da Mantiqueira", **"Refúgio da Pedra"**, **"chalé Serra da Mantiqueira"** |

**Fix:** Consolidar em um único post ou diferenciar claramente — `refugio-da-pedra` = busca específica; `hospedagem-serra-da-mantiqueira` = busca ampla. Se mantiver dois, o segundo deve linkar para o primeiro com texto âncora claro

**Joao:** Consolidar em um Unico post

---

### 1.5 "cidades Serra da Mantiqueira" — keyword idêntica em 2 posts

| Post | focus_keywords conflitantes |
|------|----------------------------|
| `serra-da-mantiqueira-extensao-cidades-e-picos-mais-altos.md` | "extensão Serra da Mantiqueira", **"cidades Serra da Mantiqueira"** |
| `serra-da-mantiqueira-quantos-habitantes-e-quais-as-principais-cidades.md` | "população Serra da Mantiqueira", **"cidades Serra da Mantiqueira"** |

**Fix:** Remover "cidades Serra da Mantiqueira" de `quantos-habitantes`. Focar exclusivamente em dados demográficos ("população", "habitantes", "quantas pessoas").

---

### 1.6 "clima / melhor época Campos do Jordão" — 2 posts parcialmente sobrepostos

| Post | focus_keywords |
|------|----------------|
| `qual-e-a-melhor-epoca-para-visitar-campos-do-jordao.md` | "melhor época Campos do Jordão", **"clima Campos do Jordão"** |
| `quando-faz-frio-em-campos-do-jordao-temperaturas-mes-a-mes.md` | "temperatura Campos do Jordão", "frio Campos do Jordão", "geada" |

**Fix:** Remover "clima Campos do Jordão" de `quando-faz-frio`. Diferenciar: `melhor-epoca` = planejamento de viagem; `quando-faz-frio` = dados climáticos técnicos mês a mês.

---

### 1.7 Canibalização secundária: "enoturismo São Bento" em 3 posts

- `toscana-brasileira-sao-bento-do-sapucai.md` → "enoturismo São Bento do Sapucaí"
- `bebidas-artesanais-de-sao-bento-do-sapucai-...` → "vinícola São Bento do Sapucaí", "rota dos vinhos"
- `por-que-sao-bento-do-sapucai-produz-vinho-e-azeite-...` → "vinho de altitude Mantiqueira"

**Fix:** Designar `bebidas-artesanais` como hub de enoturismo prático. Remover "enoturismo São Bento do Sapucaí" de `toscana-brasileira` (que deve focar no apelido/conceito), e "Toscana brasileira" de `produz-vinho-e-azeite`.

---

## 2. Slugs para Renomear (keyword-first)

> Padrão: o slug deve começar pelo termo temático principal, não pelo nome da cidade.

| # | Slug atual | Slug sugerido | Ação necessária |
|---|-----------|---------------|-----------------|
| 1 | `sao-bento-do-sapucai-a-campos-do-jordao-distancia-rota-e-dicas` | `distancia-sao-bento-do-sapucai-campos-do-jordao` | Renomear arquivo + atualizar title/meta_title + redirect |
| 2 | `sao-bento-do-sapucai-e-a-revolucao-de-1932-historia-trincheiras-e-museu` | `revolucao-de-1932-sao-bento-do-sapucai` | Renomear + title + redirect |
| 3 | `serra-da-mantiqueira-extensao-cidades-e-picos-mais-altos` | `extensao-da-serra-da-mantiqueira-cidades-e-picos` | Renomear + title + redirect |
| 4 | `serra-da-mantiqueira-historia-origem-e-a-lenda-da-montanha-que-chora` | `historia-da-serra-da-mantiqueira-origem-e-lenda` | Renomear + title + redirect |
| 5 | `serra-da-mantiqueira-hospedagem-no-refugio-da-pedra-em-sao-bento-do-sapucai` | `hospedagem-serra-da-mantiqueira-refugio-da-pedra` | Renomear + redirect (meta_title já ok) |
| 6 | `serra-da-mantiqueira-quantos-habitantes-e-quais-as-principais-cidades` | `habitantes-da-serra-da-mantiqueira-cidades-principais` | Renomear + title + redirect |
| 7 | `refugio-da-pedra-a-pousada-mais-proxima-da-pedra-do-bau` | `pousada-perto-da-pedra-do-bau-refugio-da-pedra` | Renomear + redirect (meta_title já ok) |
| 8 | `quantos-quilometros-tem-de-sao-paulo-a-sao-bento-do-sapucai-rotas-e-dicas` | `distancia-sao-paulo-sao-bento-do-sapucai-rotas-e-dicas` | Renomear + redirect (meta_title já ok) |
| 9 | `artesanato-em-sao-bento-do-sapucai-guia-completo-ditinho-joana-arte-no-quilombo-arteben-e-mais` | `artesanato-em-sao-bento-do-sapucai-guia-completo` | Slug muito longo (97 chars) — encurtar + redirect |

---

## 3. Links de Rodapé Quebrados (`#ancora` → URL real)

> 39 dos 42 posts têm ao menos um link `#ancora` quebrado. Apenas `o-que-fazer-em-sao-bento-do-sapucai`, `toscana-brasileira-sao-bento-do-sapucai` e `suica-brasileira-campos-do-jordao` já estão corretos.

| Arquivo | Link quebrado | URL correta |
|---------|--------------|-------------|
| `artesanato-em-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `artesanato-em-sao-bento-do-sapucai-...` | `#quilombo` | `/blog/sao-bento-do-sapucai-e-a-revolucao-de-1932-historia-trincheiras-e-museu/` |
| `bebidas-artesanais-de-sao-bento-do-sapucai-...` | `#gastronomia` | `/blog/gastronomia-em-sao-bento-do-sapucai-os-melhores-restaurantes-da-serra/` |
| `bebidas-artesanais-de-sao-bento-do-sapucai-...` | `#pontos-turisticos` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `carnaval-em-sao-bento-do-sapucai-...` | `#eventos` | `/blog/festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-guia-completo/` |
| `carnaval-em-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `cervejas-e-bebidas-artesanais-de-campos-do-jordao-...` | `#bebidas-sbs` | `/blog/bebidas-artesanais-de-sao-bento-do-sapucai-vinhos-cervejas-e-mais-da-mantiqueira/` |
| `cervejas-e-bebidas-artesanais-de-campos-do-jordao-...` | `#restaurantes-cj` | `/blog/restaurantes-em-campos-do-jordao-onde-comer-na-serra-da-mantiqueira/` |
| `chocolate-e-chocolate-quente-em-campos-do-jordao-...` | `#restaurantes-cj` | `/blog/restaurantes-em-campos-do-jordao-onde-comer-na-serra-da-mantiqueira/` |
| `chocolate-e-chocolate-quente-em-campos-do-jordao-...` | `#suica-brasileira` | `/blog/suica-brasileira-campos-do-jordao/` |
| `cidades-vizinhas-de-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `cidades-vizinhas-de-sao-bento-do-sapucai-...` | `#como-chegar` | `/blog/quantos-quilometros-tem-de-sao-paulo-a-sao-bento-do-sapucai-rotas-e-dicas/` |
| `como-reservar-passeios-guiados-em-sao-bento-do-sapucai` | `#equipamento` | `/blog/onde-alugar-equipamento-para-trilha-em-sao-bento-do-sapucai/` |
| `como-reservar-passeios-guiados-em-sao-bento-do-sapucai` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `festas-e-eventos-em-campos-do-jordao-...` | `#eventos-sbs` | `/blog/festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-guia-completo/` |
| `festas-e-eventos-em-campos-do-jordao-...` | `#o-que-fazer-cj` | `/blog/o-que-fazer-em-campos-do-jordao-guia-completo-de-atividades/` |
| `festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `gastronomia-em-sao-bento-do-sapucai-...` | `#bebidas` | `/blog/bebidas-artesanais-de-sao-bento-do-sapucai-vinhos-cervejas-e-mais-da-mantiqueira/` |
| `gastronomia-em-sao-bento-do-sapucai-...` | `#refugio` | `/blog/refugio-da-pedra-a-pousada-mais-proxima-da-pedra-do-bau/` |
| `historia-da-pedra-do-bau-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `historia-da-pedra-do-bau-...` | `#equipamento` | `/blog/onde-alugar-equipamento-para-trilha-em-sao-bento-do-sapucai/` |
| `igreja-matriz-de-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `igreja-matriz-de-sao-bento-do-sapucai-...` | `#revolucao-1932` | `/blog/sao-bento-do-sapucai-e-a-revolucao-de-1932-historia-trincheiras-e-museu/` |
| `o-que-fazer-em-campos-do-jordao-...` | `#pontos-turisticos-cj` | `/blog/pontos-turisticos-de-campos-do-jordao-os-12-lugares-imperdiveis/` |
| `o-que-fazer-em-campos-do-jordao-...` | `#restaurantes-cj` | `/blog/restaurantes-em-campos-do-jordao-onde-comer-na-serra-da-mantiqueira/` |
| `o-que-fazer-na-serra-da-mantiqueira-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `o-que-fazer-na-serra-da-mantiqueira-...` | `#toscana-brasileira` | `/blog/toscana-brasileira-sao-bento-do-sapucai/` |
| `o-que-fazer-na-serra-da-mantiqueira-...` | `#hospedagem` | `/blog/serra-da-mantiqueira-hospedagem-no-refugio-da-pedra-em-sao-bento-do-sapucai/` |
| `onde-alugar-equipamento-para-trilha-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `onde-alugar-equipamento-para-trilha-...` | `#passeios-guiados` | `/blog/como-reservar-passeios-guiados-em-sao-bento-do-sapucai/` |
| `onde-fica-a-serra-da-mantiqueira-...` | `#extensao` | `/blog/serra-da-mantiqueira-extensao-cidades-e-picos-mais-altos/` |
| `onde-fica-a-serra-da-mantiqueira-...` | `#o-que-fazer` | `/blog/o-que-fazer-na-serra-da-mantiqueira-guia-completo-de-experiencias/` |
| `pontos-turisticos-de-campos-do-jordao-...` | `#o-que-fazer-cj` | `/blog/o-que-fazer-em-campos-do-jordao-guia-completo-de-atividades/` |
| `pontos-turisticos-de-campos-do-jordao-...` | `#trilhas-cj` | `/blog/trilhas-em-campos-do-jordao-guia-completo-para-caminhadas-na-serra/` |
| `por-que-sao-bento-do-sapucai-produz-vinho-...` | `#bebidas` | `/blog/bebidas-artesanais-de-sao-bento-do-sapucai-vinhos-cervejas-e-mais-da-mantiqueira/` |
| `por-que-sao-bento-do-sapucai-produz-vinho-...` | `#gastronomia` | `/blog/gastronomia-em-sao-bento-do-sapucai-os-melhores-restaurantes-da-serra/` |
| `qual-a-altitude-da-pedra-do-bau-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `qual-a-altitude-da-pedra-do-bau-...` | `#historia` | `/blog/historia-da-pedra-do-bau-da-primeira-escalada-a-via-ferrata/` |
| `qual-a-altitude-de-campos-do-jordao-...` | `#frio-cj` | `/blog/quando-faz-frio-em-campos-do-jordao-temperaturas-mes-a-mes/` |
| `qual-a-altitude-de-campos-do-jordao-...` | `#altitude-bau` | `/blog/qual-a-altitude-da-pedra-do-bau-e-de-sao-bento-do-sapucai/` |
| `qual-a-populacao-de-sao-bento-do-sapucai-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `qual-a-populacao-de-sao-bento-do-sapucai-...` | `#historia-pedra-do-bau` | `/blog/historia-da-pedra-do-bau-da-primeira-escalada-a-via-ferrata/` |
| `qual-e-a-melhor-epoca-para-visitar-campos-do-jordao` | `#frio-cj` | `/blog/quando-faz-frio-em-campos-do-jordao-temperaturas-mes-a-mes/` |
| `qual-e-a-melhor-epoca-para-visitar-campos-do-jordao` | `#altitude-cj` | `/blog/qual-a-altitude-de-campos-do-jordao-dados-e-curiosidades/` |
| `qual-o-lugar-mais-bonito-da-serra-da-mantiqueira-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `qual-o-lugar-mais-bonito-da-serra-da-mantiqueira-...` | `#toscana-brasileira` | `/blog/toscana-brasileira-sao-bento-do-sapucai/` |
| `quando-faz-frio-em-campos-do-jordao-...` | `#melhor-epoca-cj` | `/blog/qual-e-a-melhor-epoca-para-visitar-campos-do-jordao/` |
| `quando-faz-frio-em-campos-do-jordao-...` | `#altitude-cj` | `/blog/qual-a-altitude-de-campos-do-jordao-dados-e-curiosidades/` |
| `quantos-habitantes-tem-campos-do-jordao-...` | `#o-que-fazer-cj` | `/blog/o-que-fazer-em-campos-do-jordao-guia-completo-de-atividades/` |
| `quantos-habitantes-tem-campos-do-jordao-...` | `#altitude-cj` | `/blog/qual-a-altitude-de-campos-do-jordao-dados-e-curiosidades/` |
| `quantos-quilometros-tem-de-sao-paulo-a-sao-bento-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `quantos-quilometros-tem-de-sao-paulo-a-sao-bento-...` | `#distancia-campos` | `/blog/sao-bento-do-sapucai-a-campos-do-jordao-distancia-rota-e-dicas/` |
| `refugio-da-pedra-a-pousada-mais-proxima-...` | `#trilhas` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `refugio-da-pedra-a-pousada-mais-proxima-...` | `#pontos-turisticos` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `restaurantes-em-campos-do-jordao-...` | `#chocolate-cj` | `/blog/chocolate-e-chocolate-quente-em-campos-do-jordao-guia-completo/` |
| `restaurantes-em-campos-do-jordao-...` | `#gastronomia-sbs` | `/blog/gastronomia-em-sao-bento-do-sapucai-os-melhores-restaurantes-da-serra/` |
| `sao-bento-do-sapucai-a-campos-do-jordao-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `sao-bento-do-sapucai-a-campos-do-jordao-...` | `#cidades-vizinhas` | `/blog/cidades-vizinhas-de-sao-bento-do-sapucai-o-que-visitar-na-regiao/` |
| `sao-bento-do-sapucai-e-a-revolucao-de-1932-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `sao-bento-do-sapucai-e-a-revolucao-de-1932-...` | `#eventos` | `/blog/festas-e-eventos-tradicionais-em-sao-bento-do-sapucai-guia-completo/` |
| `sao-bento-do-sapucai-ou-santo-antonio-do-pinhal-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `sao-bento-do-sapucai-ou-santo-antonio-do-pinhal-...` | `#cidades-vizinhas` | `/blog/cidades-vizinhas-de-sao-bento-do-sapucai-o-que-visitar-na-regiao/` |
| `serra-da-canastra-ou-mantiqueira-...` | `#o-que-fazer` | `/blog/o-que-fazer-na-serra-da-mantiqueira-guia-completo-de-experiencias/` |
| `serra-da-canastra-ou-mantiqueira-...` | `#toscana-brasileira` | `/blog/toscana-brasileira-sao-bento-do-sapucai/` |
| `serra-da-mantiqueira-extensao-cidades-...` | `#onde-fica` | `/blog/onde-fica-a-serra-da-mantiqueira-localizacao-estados-e-como-chegar/` |
| `serra-da-mantiqueira-extensao-cidades-...` | `#historia` | `/blog/serra-da-mantiqueira-historia-origem-e-a-lenda-da-montanha-que-chora/` |
| `serra-da-mantiqueira-historia-origem-...` | `#onde-fica` | `/blog/onde-fica-a-serra-da-mantiqueira-localizacao-estados-e-como-chegar/` |
| `serra-da-mantiqueira-historia-origem-...` | `#o-que-fazer` | `/blog/o-que-fazer-na-serra-da-mantiqueira-guia-completo-de-experiencias/` |
| `serra-da-mantiqueira-hospedagem-...` | `#o-que-fazer` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `serra-da-mantiqueira-hospedagem-...` | `#toscana-brasileira` | `/blog/toscana-brasileira-sao-bento-do-sapucai/` |
| `serra-da-mantiqueira-quantos-habitantes-...` | `#extensao` | `/blog/serra-da-mantiqueira-extensao-cidades-e-picos-mais-altos/` |
| `serra-da-mantiqueira-quantos-habitantes-...` | `#onde-fica` | `/blog/onde-fica-a-serra-da-mantiqueira-localizacao-estados-e-como-chegar/` |
| `trilhas-em-campos-do-jordao-...` | `#trilhas-sbs` | `/blog/trilhas-em-sao-bento-do-sapucai-guia-completo-do-complexo-da-pedra-do-bau/` |
| `trilhas-em-campos-do-jordao-...` | `#pontos-turisticos-cj` | `/blog/pontos-turisticos-de-campos-do-jordao-os-12-lugares-imperdiveis/` |
| `trilhas-em-sao-bento-do-sapucai-...` | `#pontos-turisticos` | `/blog/o-que-fazer-em-sao-bento-do-sapucai-guia-completo-de-pontos-turisticos/` |
| `trilhas-em-sao-bento-do-sapucai-...` | `#refugio` | `/blog/refugio-da-pedra-a-pousada-mais-proxima-da-pedra-do-bau/` |

---

## 4. Outros Problemas

### 4.1 Slug excessivamente longo (97 caracteres)

`artesanato-em-sao-bento-do-sapucai-guia-completo-ditinho-joana-arte-no-quilombo-arteben-e-mais`

**Sugestão:** `artesanato-em-sao-bento-do-sapucai-guia-completo` + redirect.

---

### 4.2 Pillar page `sao-bento-do-sapucai.md` sem diferenciação clara

Compartilha "o que fazer São Bento do Sapucaí" e "guia São Bento do Sapucaí" com `o-que-fazer-guia-completo`. O pillar deve funcionar como **sumário/hub** com links internos para todos os sub-posts, sem duplicar conteúdo de atividades. focus_keywords do pillar devem ser restritas a "São Bento do Sapucaí" e "turismo São Bento do Sapucaí".

---

### 4.3 `suica-brasileira-campos-do-jordao.md` — inconsistência em focus_keywords

- `focus_keywords[0]`: "Campos do Jordão Suíça Brasileira" (cidade primeiro — inconsistente com slug e meta_title)
- slug e meta_title: keyword-first ✅

**Fix:** Alterar para "Suíça Brasileira Campos do Jordão" no `focus_keywords`.

---

## 5. Status das Correções

| Ação | Status |
|------|--------|
| Toscana Brasileira → keyword-first slug/title | ✅ Aplicado |
| Suíça Brasileira → keyword-first slug/title | ✅ Aplicado |
| "O que fazer em 1 dia" → consolidado + redirect | ✅ Aplicado |
| "O que fazer à noite" → consolidado + redirect | ✅ Aplicado |
| Links de rodapé quebrados (39 posts) | ✅ Aplicado |
| Slugs para renomear (9 posts, 1 consolidado) | ✅ Aplicado |
| Canibalização de focus_keywords (7 clusters) | ✅ Aplicado |
| Slug longo artesanato | ✅ Aplicado |
| Pillar page sao-bento-do-sapucai diferenciação | ✅ Aplicado |
| Hospedagem consolidado em pousada-perto-da-pedra-do-bau | ✅ Aplicado |
| suica-brasileira focus_keywords[0] corrigido | ✅ Aplicado |
