#!/usr/bin/env node
/**
 * Confere o que é mecânico numa página de vitrine.
 *
 * Não julga se a página está bonita nem se a copy vende — isso é olho. Ele
 * pega o que passa despercebido e só aparece em produção: a foto do
 * CloudFront do shadcnblocks que ficou no meio do bloco, o telefone digitado
 * à mão que vai divergir do cadastro na primeira mudança, o href sem barra
 * final que vira um 308, a sexta seção que entrou "só dessa vez".
 *
 *   node .agents/skills/pagina-vitrine/scripts/validar-vitrine.mjs hot-stone
 *
 * `--sem-plano` para a página de ponto que não tem assinatura por trás (a
 * Pedra do Baú, atrativo público): `vitrine` e `destaque` deixam de ser
 * exigidos, e o resto — sitemap, JSON-LD, medidas, restos de bloco — continua
 * valendo igual. Página publicada é página publicada.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

const args = process.argv.slice(2);
const semPlano = args.includes('--sem-plano');
const id = args.find((a) => !a.startsWith('--'));
if (!id) {
  console.error('uso: validar-vitrine.mjs <id-do-ponto> [--sem-plano]');
  process.exit(2);
}

const erros = [];
const avisos = [];
const erro = (m) => erros.push(m);
const aviso = (m) => avisos.push(m);

const dir = join(RAIZ, 'src', 'app', 'mapa-turistico', id);
if (!existsSync(dir)) {
  console.error(`não achei src/app/mapa-turistico/${id}/`);
  process.exit(2);
}

/**
 * Comentário não é código.
 *
 * Este repositório documenta decisão em prosa longa, e a skill ainda manda
 * cada seção abrir com um cabeçalho `Origem: @shadcnblocks/<bloco>`. Rodar as
 * buscas sobre o arquivo cru reprovava justamente o que a skill exige: o
 * cabeçalho de origem virava "resto do bloco de exemplo", e a frase "o bloco
 * original punha um <img> de fundo" virava uso de `<img>`. Tudo o que procura
 * vestígio de bloco corre sobre o código sem comentário.
 *
 * O `//` só vira comentário de linha quando não é o de `https://`.
 */
const semComentarios = (fonte) =>
  fonte.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

const arquivos = readdirSync(dir).filter((f) => f.endsWith('.tsx'));
const ler = (f) => readFileSync(join(dir, f), 'utf8');
const codigo = Object.fromEntries(
  arquivos.map((f) => [f, semComentarios(ler(f))]),
);
const tudo = Object.values(codigo).join('\n');

/* ---------- 1. cadastro -------------------------------------------------- */

const cadastro = JSON.parse(
  readFileSync(join(RAIZ, 'src', 'data', 'mapa-turistico.json'), 'utf8'),
);
const ponto = cadastro.find((p) => p.id === id);

if (!ponto) {
  erro(`o ponto "${id}" não existe em src/data/mapa-turistico.json — cadastre o pino antes (skill cadastrar-ponto-mapa)`);
} else {
  /* O sitemap não depende mais deste campo (ver seção 6): `vitrine` é o que
     faz o cartão do mapa linkar a página e o `ItemList` dar `url` ao ponto. */
  const planoFalta = semPlano ? aviso : erro;
  if (!ponto.vitrine) planoFalta(`o ponto não tem "vitrine": true — sem isso o cartão do mapa não linka a página e o nó do ponto no ItemList fica sem "url"`);
  if (!ponto.destaque) planoFalta(`o ponto não tem "destaque": true — Vitrine inclui Destaque`);
  if (!ponto.horario) aviso('o ponto não tem "horario" conferido: a seção de visita não mostra aberto/fechado (é de propósito, mas entra na lista de pendências do cliente)');

  /* NAP digitado à mão vira segunda verdade. */
  for (const [campo, valor] of Object.entries({
    tel: ponto.tel,
    endereco: ponto.endereco,
    horario: ponto.horario,
  })) {
    if (valor && tudo.includes(valor)) {
      erro(`"${valor}" está escrito à mão no JSX — use getLocal('${id}').${campo}`);
    }
  }
}

/* ---------- 2. página e tema --------------------------------------------- */

if (!codigo['page.tsx']) {
  erro('falta page.tsx');
} else {
  const page = codigo['page.tsx'];
  if (!/import\s+['"]\.\/tema\.css['"]/.test(page)) erro("page.tsx não importa './tema.css'");
  if (!new RegExp(`data-vitrine=['"]${id}['"]`).test(page))
    erro(`o <main> não tem data-vitrine='${id}' — sem isso o tema não pega`);
  if (/data-mapa-tema/.test(page))
    erro('a página usa data-mapa-tema junto do tema do parceiro: os dois disputam os mesmos tokens');
  if (!/generateMetadata/.test(page)) erro('page.tsx não declara generateMetadata');
  if (!/ld\+json/.test(page)) erro('page.tsx não publica JSON-LD do negócio');

  /* Uma seção por import local. tema.css não conta. */
  const secoes = [...page.matchAll(/from\s+['"]\.\/([a-z0-9-]+)['"]/g)].map((m) => m[1]);
  if (secoes.length > 5)
    erro(`${secoes.length} seções (${secoes.join(', ')}) — o plano Vitrine é de cinco no máximo`);
  if (secoes.length < 3)
    aviso(`só ${secoes.length} seções: dobra, oferta e visita são o mínimo que o cliente comprou`);
}

const tema = join(dir, 'tema.css');
if (!existsSync(tema)) {
  erro('falta tema.css — rode scripts/tema.mjs');
} else {
  const css = readFileSync(tema, 'utf8');
  if (!new RegExp(`main\\[data-vitrine=['"]${id}['"]\\]`).test(css))
    erro(`tema.css não está escopado em main[data-vitrine='${id}'] — sem o "main" ele empata com [data-mapa-tema]`);
  if (/^\s*:root\s*\{/m.test(css)) erro('tema.css declara :root — isso repinta o site inteiro');
}

/* ---------- 3. imagens --------------------------------------------------- */

for (const [arquivo, conteudo] of Object.entries(codigo)) {
  for (const m of conteudo.matchAll(/https?:\/\/[^"'`\s]+\.(?:jpg|jpeg|png|webp|avif|svg)/gi)) {
    erro(`${arquivo}: imagem externa ${m[0]} — baixe, converta para .webp e sirva de public/assets/`);
  }
  if (/<img[\s>]/.test(conteudo)) erro(`${arquivo}: usa <img> — este projeto usa next/image`);
  for (const m of conteudo.matchAll(/<Image\b(?![^>]*\balt=)[^>]*>/g)) {
    erro(`${arquivo}: <Image> sem alt (${m[0].slice(0, 60)}…)`);
  }
}

const altMap = JSON.parse(
  readFileSync(join(RAIZ, 'src', 'data', 'image-alt.json'), 'utf8'),
);

const usadas = new Set(
  [...tudo.matchAll(/['"`](\/assets\/[^'"`]+)['"`]/g)].map((m) => m[1]),
);
for (const src of usadas) {
  const disco = join(RAIZ, 'public', src);
  if (!existsSync(disco)) {
    erro(`${src} não existe em public/`);
    continue;
  }
  if (!src.endsWith('.webp')) erro(`${src} não é .webp`);
  if (statSync(disco).size > 900 * 1024)
    aviso(`${src} tem ${Math.round(statSync(disco).size / 1024)} KB — baixe a qualidade do ffmpeg para 75 e refaça`);
  if (!altMap[src]) aviso(`${src} não tem alt em src/data/image-alt.json`);
}

/* Fotos montadas por índice (`${pasta}/${id}-${i}.webp`) não caem no regex
   acima; avisa para conferir à mão em vez de dar falso "tudo certo". */
if (/\$\{[^}]*\}\/[^'"`]*\.webp/.test(tudo) || /-\$\{[^}]*\}\.webp/.test(tudo)) {
  aviso('há src de imagem montado por template string: confira à mão se todos os arquivos existem e têm alt');
}

/* A foto do cartão social é a foto que abre a página.

   Quem recebe o link no WhatsApp vê o cartão antes de ver a página: se as duas
   imagens forem diferentes, a promessa do cartão não é a que o site cumpre — e
   é a primeira coisa que o cliente do Vitrine nota, porque o cartão é o que
   ele vai mandar para os clientes dele. A dobra manda; a OG copia. */

const dobra = codigo['dobra.tsx'] ?? '';
const fotoDaDobra = dobra.match(/['"`](\/assets\/[^'"`]+\.webp)['"`]/)?.[1];
const fotoDaOg = (codigo['page.tsx'] ?? '').match(
  /ogImage\s*=\s*\{[\s\S]*?url:\s*['"`](\/assets\/[^'"`]+\.webp)['"`]/,
)?.[1];

if (!fotoDaOg) {
  erro('page.tsx não declara `ogImage` com uma foto de /assets/ — o cartão social cai no da pousada, que não é o negócio do cliente');
} else if (!fotoDaDobra) {
  aviso(`não achei a foto da dobra em dobra.tsx para comparar com a OG (${fotoDaOg}): confira à mão se são a mesma`);
} else if (fotoDaDobra !== fotoDaOg) {
  erro(`a OG é ${fotoDaOg} e a dobra abre com ${fotoDaDobra} — o cartão social tem de ser a imagem principal da página`);
}

/* ---------- 4. restos do bloco ------------------------------------------- */

const restos = [
  /lorem ipsum/i,
  /shadcnblocks/i,
  /ui\.shadcn\.com/i,
  /example\.com/i,
  /John Doe|Jane Doe|Acme|Company Name|Your Company/i,
  /placeholder/i,
  /interface\s+\w*Props\b/,
];
for (const [arquivo, conteudo] of Object.entries(codigo)) {
  for (const padrao of restos) {
    const m = conteudo.match(padrao);
    if (m) {
      const qual = padrao.source.startsWith('interface')
        ? 'interface de props do bloco (a seção tem um uso só: apague)'
        : `resto do bloco de exemplo: "${m[0]}"`;
      erro(`${arquivo}: ${qual}`);
    }
  }
}

/* ---------- 5. links ----------------------------------------------------- */

for (const [arquivo, conteudo] of Object.entries(codigo)) {
  for (const m of conteudo.matchAll(/href=['"](\/[^'"#?]*)['"]/g)) {
    const href = m[1];
    if (!href.endsWith('/') && !/\.[a-z0-9]{2,4}$/i.test(href)) {
      erro(`${arquivo}: href="${href}" sem barra final — trailingSlash: true faz isso virar um 308`);
    }
  }
  if (/href=['"]#['"]/.test(conteudo)) erro(`${arquivo}: botão com href="#" — link que não leva a lugar nenhum sai`);
}

/* ---------- 6. sitemap --------------------------------------------------- */

/* Rota publicada e fora do sitemap é rota que ninguém acha. A checagem procura
   a linha do ponto no mapa de datas do `sitemap.ts` — e não a palavra
   "vitrine", que estava lá antes e passava sempre, porque o arquivo cita o
   plano por outros motivos. Foi assim que /mapa-turistico/pedra-do-bau/ ficou
   meses fora do índice. */

const sitemap = readFileSync(join(RAIZ, 'src', 'app', 'sitemap.ts'), 'utf8');
const temLinhaNoSitemap = new RegExp(`['"\`]${id}['"\`]\s*:`).test(sitemap);

if (!temLinhaNoSitemap) {
  if (ponto?.vitrine) {
    aviso(`src/app/sitemap.ts não tem a linha "${id}" em LAST_MODIFIED_PAGINA_DE_PONTO: a rota entra pelo "vitrine": true, mas com a data da landing do mapa em vez da data da página`);
  } else {
    erro(`src/app/sitemap.ts não publica /mapa-turistico/${id}/ — acrescente "${id}": "AAAA-MM-DD" em LAST_MODIFIED_PAGINA_DE_PONTO, no mesmo commit da página`);
  }
}

/* ---------- 7. JSON-LD ---------------------------------------------------- */

/* Toda rota sob /mapa-turistico/ publica três nós, sem exceção: a entidade
   (o negócio ou a atração), o `WebPage` que amarra a página ao site, e o
   `BreadcrumbList` de três níveis. Página sem eles é página que o buscador lê
   como texto solto — e é o que o cliente do Vitrine está pagando para não
   ser. */

const pagina = codigo['page.tsx'] ?? '';

const nosObrigatorios = [
  ['WebPage', /'@type':\s*'WebPage'|"@type":\s*"WebPage"/],
  ['BreadcrumbList', /'@type':\s*'BreadcrumbList'|"@type":\s*"BreadcrumbList"/],
];
for (const [nome, padrao] of nosObrigatorios) {
  if (!padrao.test(pagina)) erro(`page.tsx não declara um nó ${nome} em JSON-LD`);
}

const TIPOS_ENTIDADE = /'@type':\s*'(Restaurant|CafeOrCoffeeShop|Store|LodgingBusiness|TouristAttraction|HealthAndBeautyBusiness|LocalBusiness|ProfessionalService|BarOrPub|Bakery|ArtGallery)'/;
if (!TIPOS_ENTIDADE.test(pagina.replace(/"/g, "'"))) {
  erro('page.tsx não declara o nó do negócio (Restaurant, Store, LodgingBusiness, TouristAttraction…) em JSON-LD');
}

const scripts = (pagina.match(/application\/ld\+json/g) ?? []).length;
if (scripts < 3) {
  erro(`page.tsx tem ${scripts} <script type="application/ld+json"> — os três nós precisam ir para o HTML, não só existir como objeto`);
}
if (pagina.includes('ld+json') && !pagina.includes('serialize(')) {
  erro('page.tsx injeta JSON-LD sem serialize-javascript — é como o resto do repositório escapa o conteúdo');
}

/* ---------- 8. costura --------------------------------------------------- */

/* O defeito que mais denuncia página montada com bloco baixado não é cor nem
   fonte: é medida. Cada bloco do registry vem com o `max-w-` que o autor
   escolheu, e cinco blocos empilhados dão cinco larguras diferentes — o
   visitante não sabe nomear, mas vê que as seções não se encostam.
   As duas checagens abaixo pegam as duas formas em que isso aparece. */

const secoesTsx = arquivos.filter((f) => f !== 'page.tsx');

for (const f of secoesTsx) {
  const conteudo = codigo[f];

  if (!/\bcontainer\b/.test(conteudo))
    erro(`${f}: não usa .container — é a régua que alinha a página inteira`);

  /* `mx-auto` junto de `max-w-` na mesma className é o invólucro centrado que
     o bloco trouxe: ele centra o conteúdo numa largura própria, mais estreita
     que a das seções vizinhas. Texto corrido (`max-w-prose` num <p>, `max-w-3xl`
     num <header>) não leva `mx-auto` e não é acusado. */
  for (const m of conteudo.matchAll(/className=(?:'([^']*)'|"([^"]*)"|\{`([^`]*)`\})/g)) {
    const classes = m[1] ?? m[2] ?? m[3] ?? '';
    if (/\bmx-auto\b/.test(classes) && /\bmax-w-(?:xl|[2-7]xl|screen-|\[)/.test(classes))
      aviso(`${f}: "${classes.trim().slice(0, 70)}" centra um invólucro numa largura própria — é a largura do bloco, não a da página`);
  }
}

const centradas = secoesTsx.filter((f) => /\btext-center\b/.test(codigo[f]));
if (centradas.length && centradas.length !== secoesTsx.length) {
  aviso(
    `alinhamento misto: ${centradas.join(', ')} centraliza(m) e o resto alinha à esquerda — ` +
      'escolha um eixo para a página inteira',
  );
}

/* ---------- relatório ---------------------------------------------------- */

console.log(`\nvitrine ${id} — ${arquivos.length} arquivos em src/app/mapa-turistico/${id}/\n`);
for (const a of avisos) console.log(`  aviso  ${a}`);
for (const e of erros) console.log(`  ERRO   ${e}`);
console.log(
  `\n${erros.length} erro(s), ${avisos.length} aviso(s).` +
    (erros.length ? '' : ' Falta o olho: 390 px e 1440 px, e se a página parece do cliente.'),
);
console.log('');

process.exit(erros.length ? 1 : 0);
