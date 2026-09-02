#!/usr/bin/env node
/**
 * Gera o tema escopado de uma vitrine a partir de `vitrines/<id>/marca.json`.
 *
 * Lê as cores da marca em hex, deriva os tokens que o projeto usa, converte
 * tudo para OKLCH (o espaço de `globals.css`) e escreve
 * `src/app/mapa-turistico/<id>/tema.css`.
 *
 * A parte que importa não é a conversão: é o teste de contraste. A cor da
 * marca do cliente vem escolhida para fachada e camiseta, não para texto de
 * 16 px em tela de celular no sol da serra. Quando ela não passa em AA, o
 * script não a troca — deriva uma versão escura (`--primary-forte`) para uso
 * em texto e link, do mesmo jeito que este repositório já fez com
 * `--accent-deep` para o âmbar da pousada.
 *
 *   node .agents/skills/pagina-vitrine/scripts/tema.mjs hot-stone
 *   node .agents/skills/pagina-vitrine/scripts/tema.mjs hot-stone --stdout
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');

/* ---------- cor ---------------------------------------------------------- */

const hexParaRgb = (hex) => {
  const limpo = hex.replace('#', '').trim();
  const cheio =
    limpo.length === 3
      ? limpo
          .split('')
          .map((c) => c + c)
          .join('')
      : limpo;
  if (!/^[0-9a-fA-F]{6}$/.test(cheio)) throw new Error(`hex inválido: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(cheio.slice(i, i + 2), 16) / 255);
};

const paraLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const paraSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);

const rgbParaOklab = ([r, g, b]) => {
  const [lr, lg, lb] = [r, g, b].map(paraLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const oklabParaRgb = ([L, a, bb]) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(paraSrgb);
};

const oklabParaOklch = ([L, a, b]) => [
  L,
  Math.hypot(a, b),
  ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
];

const oklchParaOklab = ([L, C, h]) => [
  L,
  C * Math.cos((h * Math.PI) / 180),
  C * Math.sin((h * Math.PI) / 180),
];

/** Puxa a croma para baixo até a cor caber no sRGB — L e matiz ficam de pé. */
const noGamut = ([L, C, h]) => {
  let c = C;
  for (let i = 0; i < 60; i += 1) {
    const rgb = oklabParaRgb(oklchParaOklab([L, c, h]));
    if (rgb.every((v) => v >= -0.0005 && v <= 1.0005)) break;
    c *= 0.94;
  }
  return [L, c, h];
};

const oklchParaHex = (oklch) =>
  '#' +
  oklabParaRgb(oklchParaOklab(noGamut(oklch)))
    .map((v) =>
      Math.round(Math.min(1, Math.max(0, v)) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');

const hexParaOklch = (hex) => oklabParaOklch(rgbParaOklab(hexParaRgb(hex)));

const fmt = ([L, C, h]) => {
  const [l, c, hh] = noGamut([L, C, h]);
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${hh.toFixed(2)})`;
};

const luminancia = (hex) => {
  const [r, g, b] = hexParaRgb(hex).map(paraLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contraste = (a, b) => {
  const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** Mistura em OKLab — sem o cinza sujo que dá misturando em sRGB. */
const misturar = (hexA, hexB, t) => {
  const a = rgbParaOklab(hexParaRgb(hexA));
  const b = rgbParaOklab(hexParaRgb(hexB));
  return oklchParaHex(oklabParaOklch(a.map((v, i) => v + (b[i] - v) * t)));
};

/** Mexe só em L, na direção que aumenta o contraste, até bater o alvo. */
const ajustar = (hex, fundoHex, alvo) => {
  let [L, C, h] = hexParaOklch(hex);
  const escurecer = luminancia(fundoHex) > 0.18;
  for (let i = 0; i < 120; i += 1) {
    if (contraste(oklchParaHex([L, C, h]), fundoHex) >= alvo) break;
    L += escurecer ? -0.01 : 0.01;
    if (L <= 0 || L >= 1) break;
  }
  return oklchParaHex([Math.min(1, Math.max(0, L)), C, h]);
};

/* ---------- entrada ------------------------------------------------------ */

const [, , id, ...flags] = process.argv;
if (!id) {
  console.error('uso: tema.mjs <id-do-ponto> [--stdout]');
  process.exit(2);
}

const caminhoMarca = join(RAIZ, 'vitrines', id, 'marca.json');
if (!existsSync(caminhoMarca)) {
  console.error(`não achei ${caminhoMarca}`);
  console.error('copie templates/marca.json para lá e preencha.');
  process.exit(2);
}

const marca = JSON.parse(readFileSync(caminhoMarca, 'utf8'));
const { primary, secondary, background, foreground } = marca.cores ?? {};
for (const [nome, valor] of Object.entries({ primary, background, foreground })) {
  if (!valor) {
    console.error(`marca.json: cores.${nome} é obrigatório`);
    process.exit(2);
  }
}

/* ---------- derivação ---------------------------------------------------- */

function derivar(cores) {
  const { primary: p, secondary: s, background: bg, foreground: fg } = cores;
  const claroBg = luminancia(bg) > 0.18;
  const mistura = (t) => misturar(bg, fg, t);

  /* O que fica em cima do primary: o extremo que já contrasta mais, empurrado
     até AA se ainda faltar. */
  const candidatos = [mistura(1), mistura(0)];
  const melhor = candidatos.sort((a, b) => contraste(b, p) - contraste(a, p))[0];
  const primaryFg = ajustar(melhor, p, 4.5);

  /* Versão da cor da marca que serve para texto sobre o fundo. Igual ao
     `--accent-deep` que este repositório criou para o âmbar. */
  const primaryForte = ajustar(p, bg, 4.5);

  const mutedFg = ajustar(mistura(0.62), mistura(claroBg ? 0.04 : 0.08), 4.5);
  const sec = s ?? mistura(0.12);

  return {
    background: bg,
    foreground: fg,
    card: bg,
    'card-foreground': fg,
    popover: bg,
    'popover-foreground': fg,
    primary: p,
    'primary-foreground': primaryFg,
    'primary-forte': primaryForte,
    secondary: sec,
    'secondary-foreground': ajustar(
      contraste(mistura(1), sec) > contraste(mistura(0), sec) ? mistura(1) : mistura(0),
      sec,
      4.5,
    ),
    muted: mistura(claroBg ? 0.04 : 0.08),
    'muted-foreground': mutedFg,
    accent: mistura(claroBg ? 0.07 : 0.12),
    'accent-foreground': fg,
    /* O fio pode ser discreto; a borda de um campo, não — ela é a única
       coisa que diz onde o campo começa, e o mínimo para isso é 3:1. */
    border: mistura(claroBg ? 0.14 : 0.2),
    input: ajustar(mistura(0.3), bg, 3),
    ring: p,
  };
}

const tokens = derivar({ primary, secondary, background, foreground });
const tokensEscuro = marca.escuro
  ? derivar({
      primary: marca.escuro.primary ?? primary,
      secondary: marca.escuro.secondary ?? secondary,
      background: marca.escuro.background,
      foreground: marca.escuro.foreground,
    })
  : null;

/* ---------- contraste ---------------------------------------------------- */

function conferir(tokens, rotulo) {
  const provas = [
    ['texto sobre o fundo', tokens.foreground, tokens.background, 4.5],
    ['texto sobre o primary', tokens['primary-foreground'], tokens.primary, 4.5],
    ['texto de apoio sobre o fundo', tokens['muted-foreground'], tokens.background, 4.5],
    ['texto de apoio sobre o muted', tokens['muted-foreground'], tokens.muted, 4.5],
    ['a marca como texto (primary-forte)', tokens['primary-forte'], tokens.background, 4.5],
    ['borda de campo sobre o fundo', tokens.input, tokens.background, 3],
    ['fio visível sobre o fundo', tokens.border, tokens.background, 1.25],
    ['anel de foco sobre o fundo', tokens.ring, tokens.background, 3, 'aviso'],
  ];

  let ruim = false;
  console.log(`
${rotulo}
`);
  for (const [nome, a, b, alvo, nivel] of provas) {
    const razao = contraste(a, b);
    const ok = razao >= alvo;
    if (!ok && nivel !== 'aviso') ruim = true;
    const marcador = ok ? 'ok  ' : nivel === 'aviso' ? 'aviso' : 'FALHA';
    console.log(
      `  ${marcador} ${razao.toFixed(2)}:1 (min ${alvo})  ${nome}  ${a} / ${b}`,
    );
  }
  return ruim;
}

let falhou = conferir(tokens, `tema de ${marca.nome ?? id} — contraste`);

/* A paleta escura passa pelas mesmas provas. Ela existe porque algum bloco da
   página usa faixa `.dark`, e uma faixa ilegível não fica menos ilegível por
   ser curta. */
if (tokensEscuro) {
  falhou = conferir(tokensEscuro, 'faixa escura (.dark) — contraste') || falhou;
}

if (contraste(primary, tokens.background) < 4.5) {
  console.log(
    `
  A cor da marca (${primary}) não passa em AA como texto sobre o fundo.
` +
      `  Ela continua sendo o botão, a faixa e o fio. Para texto e link, use
` +
      `  --primary-forte (${tokens['primary-forte']}) — e diga isso no comentário
` +
      `  do tema.css, senão alguém "corrige" de volta em seis meses.`,
  );
}

/* ---------- saída -------------------------------------------------------- */

const linhas = (t) =>
  Object.entries(t)
    .map(([k, v]) => `  --${k}: ${fmt(hexParaOklch(v))}; /* ${v} */`)
    .join('\n');

const fonteDisplay = marca.fontes?.display
  ? `  --font-display: var(--font-vitrine-display), ui-serif, Georgia, serif;\n`
  : '';
const fonteTexto = marca.fontes?.texto
  ? `  --font-text: var(--font-vitrine-texto), ui-sans-serif, system-ui, sans-serif;\n`
  : '';

const css = `/* Tema da vitrine: ${marca.nome ?? id}
 *
 * Gerado por .agents/skills/pagina-vitrine/scripts/tema.mjs a partir de
 * vitrines/${id}/marca.json. Reescreva pelo script, não à mão — o que está
 * aqui passou por teste de contraste e a edição solta desfaz isso.
 *
 * O escopo para no <main> de propósito: cabeçalho e rodapé são a marca do
 * Refúgio e continuam em âmbar, como no resto do site. O seletor leva \`main\`
 * na frente porque [data-mapa-tema], no globals.css, tem a mesma
 * especificidade e a ordem de carga dos dois arquivos não é contrato.
 */

main[data-vitrine='${id}'] {
${linhas(tokens)}
  --radius: ${marca.radius ?? '0.5rem'};
${fonteDisplay}${fonteTexto}}

${
  tokensEscuro
    ? `
/* Faixa escura dentro da página (bloco com className='dark'). Sem isto ela
   herda o marrom do Refúgio e destoa da marca do parceiro. */
main[data-vitrine='${id}'] .dark {
${linhas(tokensEscuro)}
}
`
    : ''
}`;

if (flags.includes('--stdout')) {
  console.log(`\n${css}`);
} else {
  const destino = join(RAIZ, 'src', 'app', 'mapa-turistico', id);
  mkdirSync(destino, { recursive: true });
  writeFileSync(join(destino, 'tema.css'), css, 'utf8');
  console.log(`\nescrito: src/app/mapa-turistico/${id}/tema.css`);
  console.log(`importe no page.tsx:  import './tema.css';`);
  if (marca.fontes?.display) {
    console.log(
      `carregue a fonte no page.tsx com next/font e variable: '--font-vitrine-display'`,
    );
  }
}

process.exit(falhou ? 1 : 0);
