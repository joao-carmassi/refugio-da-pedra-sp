import type {
  WithContext,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  ImageObject,
} from 'schema-dts';
import JsonLd from '@/components/json-ld';
import {
  DEFAULT_POST_AUTHOR,
  DEFAULT_POST_IMAGE,
  faqTextoPuro,
  getAllPostsMeta,
  getPostBySlug,
  getPostFaq,
} from '@/lib/posts';
import { getSiteUrl } from '@/lib/env';
import { getPublicImageSize } from '@/lib/image-size';
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
    authors: [
      post.author.url
        ? { name: post.author.name, url: post.author.url }
        : { name: post.author.name },
    ],
    // O Next.js substitui o objeto `openGraph` inteiro do layout pai (ver
    // resolve-metadata.js: `newResolvedMetadata.openGraph = resolveOpenGraph(...)`),
    // então `siteName`, `locale` e `images` precisam ser repetidos aqui.
    openGraph: {
      title: post.meta_title,
      description: post.meta_description,
      siteName: 'Refúgio da Pedra SP',
      locale: 'pt_BR',
      type: 'article',
      url: `${siteUrl}/blog/${postSlug}/`,
      // `article:author` aceita URL ou nome; a URL identifica melhor a pessoa.
      authors: [post.author.url ?? post.author.name],
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

/**
 * `DateTime` do schema.org com hora e fuso. O frontmatter guarda só a data
 * (`2026-05-14`), e data sem hora fica ambígua; 09:00 em Brasília é o horário
 * nominal de publicação. Valor que já traz hora passa intacto. O YAML pode
 * entregar `Date` se a data vier sem aspas, então os dois casos são tratados.
 */
function toDateTime(value: string | Date): string {
  const text =
    value instanceof Date ? value.toISOString().slice(0, 10) : String(value);

  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? `${text}T09:00:00-03:00` : text;
}

async function BlogPostLayout({
  children,
  params,
}: Props): Promise<React.ReactNode> {
  const { post: postSlug } = await params;
  const post = getPostBySlug(postSlug);

  if (!post) notFound();

  const siteUrl = getSiteUrl();
  const postUrl = `${siteUrl}/blog/${postSlug}/`;
  const imagePath = post.image || DEFAULT_POST_IMAGE;
  const imageSize = getPublicImageSize(imagePath);

  // Arquivo estático: servido exatamente assim, sem barra final.
  const image: ImageObject = {
    '@type': 'ImageObject',
    url: `${siteUrl}${imagePath}`,
    // Pelo schema.org `width`/`height` são `Distance` ou `QuantitativeValue`
    // (número puro não tipa): pixels em UN/CEFACT são `E37`.
    ...(imageSize
      ? {
          width: {
            '@type': 'QuantitativeValue',
            value: imageSize.width,
            unitCode: 'E37',
          },
          height: {
            '@type': 'QuantitativeValue',
            value: imageSize.height,
            unitCode: 'E37',
          },
        }
      : {}),
  };

  const jsonLdBlogPosting: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.meta_description,
    keywords: post.focus_keywords.join(', '),
    url: postUrl,
    inLanguage: 'pt-BR',
    image,
    // Nó da página, com `@id` próprio: é a ele que o `FAQPage` se liga.
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${postUrl}#webpage`,
      url: postUrl,
      isPartOf: { '@id': `${siteUrl}/#website` },
    },
    ...(post.date
      ? {
          datePublished: toDateTime(post.date),
          dateModified: toDateTime(post.dateModified || post.date),
        }
      : {}),
    // Todo post tem autor pessoa (resolvido em `lib/posts.ts`). O autor padrão
    // ganha nó `Person` com `@id` estável (`/#autor`), igual em todos os posts,
    // para os buscadores ligarem a autoria à mesma pessoa; um `author` no
    // frontmatter vira `Person` só com nome. Quem publica continua sendo o
    // negócio (`/#business`, definido no layout raiz).
    author: post.author.isDefault
      ? {
          '@type': 'Person',
          '@id': `${siteUrl}/#autor`,
          name: DEFAULT_POST_AUTHOR.name,
          url: DEFAULT_POST_AUTHOR.url,
          sameAs: [...DEFAULT_POST_AUTHOR.sameAs],
        }
      : {
          '@type': 'Person',
          name: post.author.name,
        },
    publisher: { '@id': `${siteUrl}/#business` },
    // O post pertence ao Blog, e o Blog pertence ao WebSite (ver
    // src/app/blog/layout.tsx).
    isPartOf: { '@id': `${siteUrl}/blog/#blog` },
  };

  // Mesma fonte da seção "Perguntas frequentes" renderizada em `page.tsx`: o
  // markup só descreve perguntas que estão na tela, e só existe se houver alguma.
  const faq = getPostFaq(post);
  const faqJsonLd: WithContext<FAQPage> | null = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': `${postUrl}#faq`,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${postUrl}#webpage` },
        mainEntity: faq.map(({ pergunta, resposta }) => ({
          '@type': 'Question' as const,
          name: pergunta,
          acceptedAnswer: {
            '@type': 'Answer' as const,
            text: faqTextoPuro(resposta),
          },
        })),
      }
    : null;

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
        item: postUrl,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLdBlogPosting} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  );
}

export default BlogPostLayout;
