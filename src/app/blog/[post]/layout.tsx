import serialize from 'serialize-javascript';
import type { WithContext, BlogPosting, BreadcrumbList } from 'schema-dts';
import {
  DEFAULT_POST_IMAGE,
  getAllPostsMeta,
  getPostBySlug,
} from '@/lib/posts';
import { getSiteUrl } from '@/lib/env';
import { notFound } from 'next/navigation';

interface Props {
  children: React.ReactNode;
  params: Promise<{ post: string }>;
}

interface MetadataProps {
  params: Promise<{ post: string }>;
}

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ post: post.slug }));
}

export async function generateMetadata({ params }: MetadataProps) {
  const { post: postSlug } = await params;
  const post = getPostBySlug(postSlug);

  if (!post) return {};

  const siteUrl = getSiteUrl();
  return {
    title: post.meta_title,
    description: post.meta_description,
    keywords: [...post.focus_keywords, ...post.tags],
    ...(post.author ? { authors: [{ name: post.author }] } : {}),
    // O Next.js substitui o objeto `openGraph` inteiro do layout pai (ver
    // resolve-metadata.js: `newResolvedMetadata.openGraph = resolveOpenGraph(...)`),
    // então `siteName`, `locale` e `images` precisam ser repetidos aqui.
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      siteName: 'Refúgio da Pedra',
      locale: 'pt_BR',
      type: 'article',
      url: `${siteUrl}/blog/${postSlug}/`,
      // Sem `width`/`height`: um `image` futuro no frontmatter pode ter outras
      // dimensões, e valores errados são piores que ausentes.
      images: [
        {
          url: `${siteUrl}${post.image || DEFAULT_POST_IMAGE}`,
          alt: post.title,
        },
      ],
    },
    alternates: {
      canonical: `${siteUrl}/blog/${postSlug}/`,
    },
  };
}

async function BlogPostLayout({
  children,
  params,
}: Props): Promise<React.ReactNode> {
  const { post: postSlug } = await params;
  const post = getPostBySlug(postSlug);

  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const jsonLdBlogPosting: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description,
    keywords: post.focus_keywords.join(', '),
    url: `${siteUrl}/blog/${postSlug}/`,
    image: `${siteUrl}${post.image || DEFAULT_POST_IMAGE}`,
    ...(post.date
      ? {
          datePublished: post.date,
          dateModified: post.dateModified || post.date,
        }
      : {}),
    // `author` no frontmatter tem prioridade; sem ele, a autoria recai sobre o
    // nó canônico do negócio (`/#business`, definido no layout raiz).
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author,
        }
      : { '@id': `${siteUrl}/#business` },
    publisher: { '@id': `${siteUrl}/#business` },
    // O post pertence ao Blog, e o Blog pertence ao WebSite (ver
    // src/app/blog/layout.tsx).
    isPartOf: { '@id': `${siteUrl}/blog/#blog` },
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${postSlug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(jsonLdBlogPosting) }}
      />
      {post.faq_schema?.mainEntity?.length ? (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq_schema) }}
        />
      ) : null}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

export default BlogPostLayout;
