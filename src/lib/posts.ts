import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src', 'data', 'posts');

export interface FaqAnswer {
  '@type': 'Answer';
  text: string;
}

export interface FaqQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: FaqAnswer;
}

export interface FaqSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: FaqQuestion[];
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
  faq_schema?: FaqSchema;
  date: string;
  // Campos opcionais de frontmatter, ainda não preenchidos nos posts.
  dateModified?: string;
  author?: string;
  image?: string;
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
        content: content.trim(),
        ...(data as Omit<Post, 'slug' | 'content'>),
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
    content: content.trim(),
    ...(data as Omit<Post, 'slug' | 'content'>),
  };
}
