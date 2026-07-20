'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Post } from '@/lib/posts';

interface Props {
  blogPosts: Post[];
}

const BlogContent = ({ blogPosts }: Props) => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    // header/breadcrumb/título (acima da dobra, sem scroll)
    const tl = gsap.timeline();
    tl.set('.gsap-reveal-blog-header', { y: 40, opacity: 0 });
    tl.to(
      '.gsap-reveal-blog-header',
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: 'expo.out',
        stagger: 0.08,
      },
      0,
    );

    // grid de cards de posts (com scroll)
    gsap.fromTo(
      '.gsap-reveal-blog-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '#blog-grid-anchor', start: 'top 85%' },
      },
    );
  }, []);

  return (
    <section className='min-h-container py-6 md:py-12 container space-y-6'>
      <Breadcrumb className='gsap-reveal-blog-header opacity-0'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink aria-label='Homepage' href='/'>
              <Home className='h-4 w-4' />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className='gsap-reveal-blog-header opacity-0 tracking-tight text-center text-4xl md:text-start lg:text-5xl'>
        Blog
      </h1>
      <section id='blog-grid-anchor' className='space-y-6'>
        {blogPosts.map((post, index) => (
          <Link
            key={index}
            className='block gsap-reveal-blog-card opacity-0'
            href={`/blog/${post.slug}`}
          >
            <Card className='shadow-lg'>
              <CardContent>
                <div className='relative w-full space-y-3'>
                  <h2 className='text-lg font-medium tracking-tight text-foreground md:text-2xl'>
                    {post.title}
                  </h2>
                  <p className='md:text-md text-sm text-muted-foreground md:pr-24 xl:pr-32'>
                    {post.description}
                  </p>
                  <div className='flex w-9/10 flex-wrap items-center gap-2'>
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} className='h-6 rounded-md'>
                        <span className='text-md font-medium'>{tag}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </section>
  );
};

export default BlogContent;
