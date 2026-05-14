import Script from 'next/script';
import serialize from 'serialize-javascript';
import type { WithContext, BlogPosting } from 'schema-dts';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { getSiteUrl } from '@/lib/env';
import { redirect } from 'next/navigation';

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

  if (!post) redirect('/blog');

  const siteUrl = getSiteUrl();
  const jsonLdBlogPosting: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description,
    keywords: post.focus_keywords.join(', '),
    url: `${siteUrl}/blog/${postSlug}`,
    author: {
      '@type': 'Organization',
      name: 'Refúgio da Pedra',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Refúgio da Pedra',
      url: siteUrl,
    },
  };

  return (
    <>
      <Script
        id='jsonld-blog-post'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(jsonLdBlogPosting) }}
      />
      <Script
        id='jsonld-blog-post-faq'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faq_schema) }}
      />
      {children}
    </>
  );
}

export default BlogPostLayout;
