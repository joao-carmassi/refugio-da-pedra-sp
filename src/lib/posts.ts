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
  faq_schema: FaqSchema;
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
