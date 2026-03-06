import { getSiteUrl } from '@/lib/env';

// TODO: Import and activate when blog post content is implemented
// import Script from 'next/script';
// import serialize from 'serialize-javascript';
// import type { WithContext, BlogPosting } from 'schema-dts';

interface Props {
  children: React.ReactNode;
}

interface MetadataProps {
  params: Promise<{ post: string }>;
}

export async function generateMetadata({ params }: MetadataProps) {
  const { post } = await params;
  const siteUrl = getSiteUrl();
  return {
    title: 'Post - Blog | Refúgio da Pedra',
    description:
      'Leia este artigo do Blog do Refúgio da Pedra sobre natureza, ecoturismo e a região de São Bento do Sapucaí.',
    openGraph: {
      title: 'Post - Blog | Refúgio da Pedra',
      description:
        'Leia este artigo do Blog do Refúgio da Pedra sobre natureza, ecoturismo e a região de São Bento do Sapucaí.',
      type: 'article',
      url: `${siteUrl}/blog/${post}`,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post}`,
    },
  };
}

// TODO: Populate and activate when blog post content is implemented
// const jsonLd: WithContext<BlogPosting> = {
//   '@context': 'https://schema.org',
//   '@type': 'BlogPosting',
//   headline: '', // post.title
//   description: '', // post.excerpt
//   datePublished: '', // post.publishedAt
//   dateModified: '', // post.updatedAt
//   image: '', // post.coverImage
//   url: `${getSiteUrl()}/blog/`, // + post.slug
//   author: {
//     '@type': 'Organization',
//     name: 'Refúgio da Pedra',
//     url: getSiteUrl(),
//   },
//   publisher: {
//     '@type': 'Organization',
//     name: 'Refúgio da Pedra',
//     url: getSiteUrl(),
//   },
// };

function BlogPostLayout({ children }: Props): React.ReactNode {
  return (
    <>
      {/* TODO: Uncomment when blog post JSON-LD is populated */}
      {/* <Script
        id='jsonld-blog-post'
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      /> */}
      {children}
    </>
  );
}

export default BlogPostLayout;
