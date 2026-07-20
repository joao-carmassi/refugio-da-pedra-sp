import serialize from 'serialize-javascript';
import type { WithContext, BlogPosting, BreadcrumbList } from 'schema-dts';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
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
  return getAllPosts().map((post) => ({ post: post.slug }));
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
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      type: 'article',
      url: `${siteUrl}/blog/${postSlug}`,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${postSlug}`,
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
    url: `${siteUrl}/blog/${postSlug}`,
    ...(post.date
      ? {
          datePublished: post.date,
          dateModified: post.dateModified || post.date,
        }
      : {}),
    author: {
      '@type': 'Organization',
      name: 'Refúgio da Pedra SP',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Refúgio da Pedra SP',
      url: siteUrl,
    },
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteUrl}/blog/${postSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(jsonLdBlogPosting) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq_schema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}

export default BlogPostLayout;
