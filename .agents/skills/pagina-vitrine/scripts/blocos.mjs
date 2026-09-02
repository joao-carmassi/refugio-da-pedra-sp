#!/usr/bin/env node
/**
 * Procura bloco no registry @shadcnblocks sem gastar contexto.
 *
 * São 4.161 itens. Ler a lista pelo MCP custa dezenas de milhares de tokens e
 * a busca difusa dele erra bastante ("hero fullscreen image overlay" devolve
 * background-pattern). O índice do registry é público e pequeno o bastante
 * para ficar em disco: este script filtra localmente e só vai à rede para
 * abrir a ficha de um finalista.
 *
 *   blocos.mjs --vaga dobra --palavras "restaurante noite forno"
 *   blocos.mjs --categoria gallery --palavras "carrossel" --limite 12
 *   blocos.mjs --ver hero12
 *   blocos.mjs --atualizar          (força recarregar o índice)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..', '..');
const CACHE = join(AQUI, '..', 'cache');
const INDICE = join(CACHE, 'registry.json');
const VALIDADE = 7 * 24 * 60 * 60 * 1000;

/** As categorias que servem a cada vaga da página. Ver references/blocos.md. */
const VAGAS = {
  dobra: ['hero', 'banner'],
  oferta: ['pricing', 'feature', 'services', 'product-list', 'product-card', 'compare'],
  ambiente: ['gallery', 'about', 'bento', 'our-story', 'projects'],
  prova: ['testimonial', 'reviews', 'stats', 'logos', 'faq', 'awards'],
  visita: ['contact', 'cta', 'banner'],
};

/**
 * As descrições do registry são em inglês. Quem escreve a busca pensa em
 * português — e uma busca por "cardápio preço pizza" casaria zero item, o que
 * devolve a lista em ordem alfabética fingindo ser um resultado. Cada palavra
 * entra na pontuação junto com o que ela quer dizer lá.
 */
const DICIONARIO = {
  cardapio: ['menu', 'pricing', 'price', 'dish'],
  preco: ['price', 'pricing', 'cost'],
  precos: ['price', 'pricing', 'cost'],
  foto: ['photo', 'image', 'picture'],
  fotos: ['photo', 'image', 'gallery'],
  galeria: ['gallery', 'carousel', 'masonry', 'grid'],
  carrossel: ['carousel', 'slider'],
  depoimento: ['testimonial', 'quote', 'review'],
  avaliacao: ['review', 'rating', 'star'],
  nota: ['rating', 'star', 'score'],
  horario: ['hours', 'opening', 'schedule'],
  contato: ['contact', 'form', 'address'],
  endereco: ['address', 'location', 'map'],
  mapa: ['map', 'location'],
  restaurante: ['restaurant', 'food', 'dining', 'menu'],
  pizzaria: ['restaurant', 'food', 'pizza'],
  comida: ['food', 'dish', 'menu'],
  bebida: ['drink', 'beverage', 'bar'],
  pousada: ['hotel', 'stay', 'room', 'booking'],
  hotel: ['hotel', 'room', 'booking'],
  quarto: ['room', 'suite'],
  loja: ['store', 'shop', 'product'],
  produto: ['product', 'item', 'shop'],
  servico: ['service', 'offering'],
  servicos: ['service', 'offering'],
  equipe: ['team', 'staff', 'people'],
  sobre: ['about', 'story'],
  historia: ['story', 'about', 'timeline'],
  reserva: ['booking', 'reserve', 'cta'],
  botao: ['button', 'cta'],
  destaque: ['highlight', 'feature', 'spotlight'],
  video: ['video'],
  escuro: ['dark'],
  claro: ['light'],
  simples: ['simple', 'minimal', 'clean'],
  grande: ['large', 'big', 'full'],
  centralizado: ['centered', 'center'],
  colunas: ['column', 'grid'],
  cartao: ['card'],
  cartoes: ['card'],
  lista: ['list'],
  numerado: ['numbered', 'step'],
  passos: ['step', 'process'],
  perguntas: ['faq', 'question', 'accordion'],
  noite: ['night', 'dark', 'evening'],
  forno: ['oven', 'kitchen'],
};

/** Dependência que este projeto não tem e não vai ganhar por causa de um bloco. */
const VETADAS = ['framer-motion', 'motion', 'recharts', 'three', '@react-three/fiber', 'cobe', 'gsap-trial'];

const args = process.argv.slice(2);
const pegar = (flag) => {
  const i = args.indexOf(flag);
  return i === -1 ? null : args[i + 1];
};
const tem = (flag) => args.includes(flag);

/**
 * O registry responde sem autenticação nas primeiras chamadas e passa a
 * devolver 401 em rajada — abrir a ficha de cinco finalistas seguidos já
 * derruba. A chave está em `.env.local` (SHADCNBLOCKS_API_KEY), a mesma que
 * `components.json` declara para o `shadcn add`; mandá-la sempre evita
 * descobrir o limite no meio de uma escolha.
 */
function chave() {
  if (process.env.SHADCNBLOCKS_API_KEY) return process.env.SHADCNBLOCKS_API_KEY;
  const env = join(RAIZ, '.env.local');
  if (!existsSync(env)) return null;
  const achado = readFileSync(env, 'utf8').match(/^SHADCNBLOCKS_API_KEY\s*=\s*(.+)$/m);
  return achado ? achado[1].trim().replace(/^["']|["']$/g, '') : null;
}

const buscarNoRegistry = (url) => {
  const k = chave();
  return fetch(url, k ? { headers: { Authorization: `Bearer ${k}` } } : undefined);
};

const semAcento = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

async function indice() {
  const velho =
    !existsSync(INDICE) || Date.now() - statSync(INDICE).mtimeMs > VALIDADE;
  if (velho || tem('--atualizar')) {
    process.stderr.write('baixando registry.json…\n');
    const r = await buscarNoRegistry('https://www.shadcnblocks.com/r/registry.json');
    if (!r.ok) throw new Error(`registry respondeu ${r.status}`);
    mkdirSync(CACHE, { recursive: true });
    writeFileSync(INDICE, await r.text(), 'utf8');
  }
  return JSON.parse(readFileSync(INDICE, 'utf8')).items;
}

const categoriaDe = (nome) => nome.replace(/\d+$/, '').replace(/-$/, '');

/* ---------- ficha de um bloco -------------------------------------------- */

async function ver(nome) {
  const r = await buscarNoRegistry(`https://www.shadcnblocks.com/r/${nome}`);
  if (!r.ok) {
    console.error(`${nome}: registry respondeu ${r.status}`);
    if (r.status === 401) {
      console.error('401 é limite de rajada: confira SHADCNBLOCKS_API_KEY em .env.local.');
    }
    process.exit(1);
  }
  const item = await r.json();
  const codigo = (item.files ?? []).map((f) => f.content ?? '').join('\n');

  const imagens = [...codigo.matchAll(/https?:\/\/[^"'`\s]+\.(?:jpg|jpeg|png|webp|avif|svg)/gi)];
  const externas = new Set(imagens.map((m) => new URL(m[0]).host));
  const deps = item.dependencies ?? [];
  const regDeps = item.registryDependencies ?? [];

  const dirUi = join(RAIZ, 'src', 'components', 'ui');
  const instaladas = existsSync(dirUi)
    ? new Set(readdirSync(dirUi).map((f) => f.replace(/\.tsx?$/, '')))
    : new Set();
  const faltando = regDeps.filter((d) => d !== 'utils' && !instaladas.has(d));
  const vetadas = deps.filter((d) => VETADAS.includes(d));

  console.log(`\n${item.name} — ${item.title ?? ''}`);
  console.log(`${item.description ?? ''}\n`);
  console.log(`  linhas          ${codigo.split('\n').length}`);
  console.log(`  use client      ${/^["']use client["']/m.test(codigo) ? 'sim' : 'não'}`);
  console.log(`  dependências    ${deps.length ? deps.join(', ') : '—'}`);
  console.log(`  primitivas      ${regDeps.length ? regDeps.join(', ') : '—'}`);
  console.log(`  faltando aqui   ${faltando.length ? faltando.join(', ') : 'nenhuma'}`);
  console.log(`  imagens         ${imagens.length} (hosts: ${[...externas].join(', ') || '—'})`);
  console.log(`  arquivos        ${(item.files ?? []).map((f) => f.path).join(', ')}`);

  if (vetadas.length) {
    console.log(`\n  RECUSE: pede ${vetadas.join(', ')}.`);
    console.log('  Este repositório anima com GSAP (src/hooks/use-reveal.ts) e não');
    console.log('  ganha uma segunda biblioteca de animação por causa de uma seção.');
  }
  if (imagens.length) {
    console.log(`\n  ${imagens.length} imagens de exemplo vêm de fora e TODAS têm de virar`);
    console.log('  next/image com arquivo em public/assets/. Se o cliente não mandou');
    console.log(`  ${imagens.length} fotos boas, escolha outro bloco — não invente foto.`);
  }
  console.log('');
}

/* ---------- busca -------------------------------------------------------- */

async function buscar() {
  const vaga = pegar('--vaga');
  const categoria = pegar('--categoria');
  const palavras = semAcento(pegar('--palavras') ?? '')
    .split(/\s+/)
    .filter(Boolean);
  const limite = Number(pegar('--limite') ?? 8);

  if (!vaga && !categoria) {
    console.error('uso: blocos.mjs --vaga <dobra|oferta|ambiente|prova|visita> [--palavras "…"]');
    console.error('     blocos.mjs --categoria <nome> [--palavras "…"] [--limite 8]');
    console.error('     blocos.mjs --ver <nome>');
    process.exit(2);
  }

  const cats = categoria ? [categoria] : VAGAS[vaga];
  if (!cats) {
    console.error(`vaga desconhecida: ${vaga}. Use ${Object.keys(VAGAS).join(', ')}.`);
    process.exit(2);
  }

  const itens = (await indice()).filter(
    (i) => i.type === 'registry:block' && cats.includes(categoriaDe(i.name)),
  );

  /* Cada termo digitado vale por si e pelo que ele quer dizer em inglês. */
  const termos = palavras.flatMap((p) => [p, ...(DICIONARIO[p] ?? [])]);

  const pontuados = itens
    .map((i) => {
      const titulo = semAcento(i.title ?? '');
      const desc = semAcento(i.description ?? '');
      let pontos = 0;
      for (const p of termos) {
        if (titulo.includes(p)) pontos += 2;
        if (desc.includes(p)) pontos += 1;
      }
      return { ...i, pontos };
    })
    .sort((a, b) => b.pontos - a.pontos || a.name.localeCompare(b.name))
    .slice(0, limite);

  console.log(
    `\n${itens.length} blocos em ${cats.join(', ')}${palavras.length ? ` · ordenados por "${palavras.join(' ')}"` : ''}\n`,
  );

  if (palavras.length && pontuados.every((i) => i.pontos === 0)) {
    console.log(
      '  Nenhuma palavra casou — o que vem abaixo é ordem alfabética, não\n' +
        '  resultado. As descrições do registry são em inglês: tente os termos\n' +
        '  de lá (menu, gallery, testimonial, opening hours, booking).\n',
    );
  }
  for (const i of pontuados) {
    console.log(`  ${i.name}${i.pontos ? ` (${i.pontos})` : ''} — ${i.title ?? ''}`);
    console.log(`    ${i.description ?? ''}\n`);
  }
  console.log('  ficha de um deles:  blocos.mjs --ver <nome>\n');
}

const alvo = pegar('--ver');
try {
  await (alvo ? ver(alvo) : buscar());
} catch (erro) {
  console.error(erro.message);
  process.exit(1);
}
