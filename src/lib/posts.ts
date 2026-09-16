import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getMapaUrl } from '@/lib/env';

const postsDirectory = path.join(process.cwd(), 'src', 'data', 'posts');

/**
 * Formato cru de `faq_schema` no frontmatter. Não é o nó JSON-LD: é só a fonte
 * das perguntas, lida com cautela porque YAML não tem tipo. O `FAQPage`
 * tipado com schema-dts é montado em `blog/[post]/layout.tsx`, e a seção
 * visível em `blog/[post]/faq.tsx` — os dois a partir de `getPostFaq`, para o
 * markup nunca descrever pergunta que não está na tela.
 */
interface FaqFrontmatter {
  mainEntity?: {
    name?: unknown;
    acceptedAnswer?: { text?: unknown };
  }[];
}

/**
 * Pergunta frequente do post. `resposta` é markdown de uma linha (negrito e
 * links, inclusive `mapa:` já resolvido); o JSON-LD usa `faqTextoPuro`.
 */
export interface PostFaqItem {
  pergunta: string;
  resposta: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  suggested_tags: string[];
  meta_title: string;
  meta_description: string;
  focus_keywords: string[];
  // Opcional: nem todo frontmatter garante a chave, então o consumidor precisa
  // se proteger antes de serializar o JSON-LD.
  faq_schema?: FaqFrontmatter;
  date: string;
  // Campos opcionais de frontmatter, ainda não preenchidos nos posts.
  dateModified?: string;
  image?: string;
  // Sempre presente: resolvido na leitura a partir do `author` do frontmatter
  // (ver `resolvePostAuthor`).
  author: PostAuthor;
}

/**
 * Autor do post já resolvido. `isDefault` indica o autor padrão do blog, que
 * tem nó `Person` próprio e estável no JSON-LD; autor vindo do frontmatter só
 * tem nome.
 */
export interface PostAuthor {
  name: string;
  url?: string;
  isDefault: boolean;
}

/**
 * Autor padrão de todos os posts, definido num lugar só em vez de repetido no
 * frontmatter dos 41 arquivos. Um `author` no frontmatter substitui o nome.
 */
export const DEFAULT_POST_AUTHOR = {
  name: 'João Vitor Carmassi',
  url: 'https://github.com/joao-carmassi',
  sameAs: ['https://github.com/joao-carmassi'],
} as const;

/**
 * Converte o `author` cru do frontmatter (YAML não tem tipo) no autor do post.
 * Ausente, vazio ou igual ao nome padrão cai no autor padrão.
 */
export function resolvePostAuthor(value: unknown): PostAuthor {
  const name = typeof value === 'string' ? value.trim() : '';

  if (!name || name === DEFAULT_POST_AUTHOR.name) {
    return {
      name: DEFAULT_POST_AUTHOR.name,
      url: DEFAULT_POST_AUTHOR.url,
      isDefault: true,
    };
  }

  return { name, isDefault: false };
}

/**
 * Subconjunto de `Post` usado pela listagem do blog. Não inclui `content`:
 * a listagem é um client component e o corpo em markdown dos 41 posts seria
 * serializado no payload RSC embutido no HTML sem nunca ser renderizado.
 */
export type PostListItem = Pick<
  Post,
  'slug' | 'title' | 'description' | 'tags'
>;

/** Imagem padrão para OG tags / schema quando o post não define `image`. */
export const DEFAULT_POST_IMAGE = '/assets/refugio/geral/refugio-1.webp';

/**
 * Lê apenas o frontmatter necessário para a listagem, mantendo o corpo dos
 * posts no servidor.
 */
export function getAllPostsMeta(): PostListItem[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const { title, description, tags } = data as Post;

      return {
        slug,
        title,
        description,
        tags: tags ?? [],
      };
    });
}

/*
  Links para o mapa turístico, que mora em site próprio cujo endereço vem de
  `NEXT_PUBLIC_MAPA_URL`. Como o markdown é estático, os posts escrevem o destino
  com o prefixo `mapa:` e o caminho no site do mapa — `[texto](mapa:/mapa/?ponto=hot-stone)`,
  `[texto](mapa:/lugares/pedra-do-bau/)`, `[texto](mapa:/)` — e a troca pelo
  endereço absoluto acontece aqui, na leitura, antes de qualquer consumidor ver
  o conteúdo. Sem o endereço configurado, o link cai na página de conteúdo
  `/mapa-turistico/` deste site. Nenhum `mapa:` pode chegar cru ao HTML: o
  react-markdown descartaria o href por não reconhecer o protocolo.
*/
const MAPA_LINK = /\]\(mapa:(\/[^)\s]*)\)/g;

export function resolveMapaLinks(markdown: string): string {
  const mapaUrl = getMapaUrl();

  return markdown.replace(
    MAPA_LINK,
    (_, caminho: string) =>
      `](${mapaUrl ? `${mapaUrl}${caminho}` : '/mapa-turistico/'})`,
  );
}

export function getPostFaq(post: Pick<Post, 'faq_schema'>): PostFaqItem[] {
  const itens = post.faq_schema?.mainEntity;
  if (!Array.isArray(itens)) return [];

  return itens.flatMap((item) => {
    const pergunta = item?.name;
    const resposta = item?.acceptedAnswer?.text;
    if (typeof pergunta !== 'string' || typeof resposta !== 'string') return [];

    return [
      { pergunta: pergunta.trim(), resposta: resolveMapaLinks(resposta.trim()) },
    ];
  });
}

/**
 * Texto que o leitor vê na resposta renderizada, sem a sintaxe de markdown:
 * link vira só o rótulo, ênfase perde os asteriscos. É o `text` do `Answer`.
 */
export function faqTextoPuro(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content: resolveMapaLinks(content.trim()),
        ...(data as Omit<Post, 'slug' | 'content' | 'author'>),
        author: resolvePostAuthor(data.author),
      };
    });
}

export function getPostBySlug(slug: string): Post | undefined {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return undefined;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content: resolveMapaLinks(content.trim()),
    ...(data as Omit<Post, 'slug' | 'content' | 'author'>),
    author: resolvePostAuthor(data.author),
  };
}
