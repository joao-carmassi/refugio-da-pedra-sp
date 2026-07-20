'use client';
import { ArrowUp, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Cta from '@/components/cta';
import type { Post } from '@/lib/posts';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Props {
  post: Post;
  intro: string;
  sections: Section[];
}

const BlogPostContent = ({ post, intro, sections }: Props): React.ReactNode => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline();
    tl.set('.gsap-reveal-post-header', { y: 40, opacity: 0 });
    tl.to(
      '.gsap-reveal-post-header',
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'expo.out', stagger: 0.08 },
      0,
    );

    gsap.fromTo(
      '.gsap-reveal-post-body',
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#post-body-anchor', start: 'top 85%' },
      },
    );
  }, []);

  return (
    <main className='py-6 md:py-12 min-h-container space-y-6 md:space-y-12'>
      <div className='container'>
        <Breadcrumb className='gsap-reveal-post-header opacity-0'>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink aria-label='Homepage' href='/'>
                <Home className='h-4 w-4' />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/blog'>Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className='gsap-reveal-post-header opacity-0 mb-3 mt-6 md:my-6 max-w-3xl text-2xl tracking-tight md:text-4xl lg:text-5xl'>
          {post.title}
        </h1>
        <div className='gsap-reveal-post-header opacity-0 mb-6 text-muted-foreground'>
          {post.description}
        </div>
        <Separator className='my-3 md:my-6 lg:my-8' />
        <div className='relative grid grid-cols-12 gap-6 lg:grid'>
          <article
            id='post-body-anchor'
            className='gsap-reveal-post-body opacity-0 col-span-12 lg:col-span-9 prose dark:prose-invert w-full! max-w-none!'
          >
            <Markdown remarkPlugins={[remarkGfm]}>{intro}</Markdown>
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className='my-8'
              >
                <h2>{section.title}</h2>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {section.content}
                </Markdown>
              </section>
            ))}
          </article>

          <aside className='sticky top-24 col-span-3 col-start-10 hidden h-fit lg:block'>
            <span className='text-lg font-medium'>Nesta página</span>
            <nav className='mt-4 text-sm'>
              <ul className='space-y-1'>
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link
                      href={`#${section.id}`}
                      className={cn(
                        'block py-1 transition-colors duration-200',
                        activeSection === section.id
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-primary',
                      )}
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Separator className='my-6' />

            <Button
              variant='outline'
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowUp className='h-4 w-4' />
              Volte ao topo
            </Button>
          </aside>
        </div>
      </div>
      <Cta />
    </main>
  );
};

export default BlogPostContent;
