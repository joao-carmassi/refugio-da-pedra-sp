/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { ArrowUp, Home } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { useParams } from 'next/navigation';
import blogPosts from '@/data/posts.json';
import slugify from 'slugify';

const BlogPost = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});
  const params = useParams();
  const postSlug = params?.post;

  const post = blogPosts.find(
    (p) => slugify(p.title, { lower: true, strict: true }) === postSlug,
  );

  useEffect(() => {
    const sections = Object.keys(sectionRefs.current);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    let observer: IntersectionObserver | null = new IntersectionObserver(
      observerCallback,
      {
        root: null,
        rootMargin: '0px',
        threshold: 1,
      },
    );

    sections.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        observer?.observe(element);
      }
    });

    return () => {
      observer?.disconnect();
      observer = null;
    };
  }, []);

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref;
    }
  };

  if (!post) return null;

  return (
    <main className='py-6 md:py-12 min-h-container'>
      <div className='container'>
        <Breadcrumb>
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
        <h1 className='mb-3 mt-6 md:my-6 max-w-3xl text-2xl tracking-tight md:text-4xl lg:text-5xl'>
          {post.title}
        </h1>
        <p className='mb-6 text-muted-foreground'>{post.description}</p>
        <Separator className='my-3 md:my-6 lg:my-8' />
        <div className='relative grid grid-cols-12 gap-6 lg:grid'>
          <div className='col-span-12 lg:col-span-9'>{post.content}</div>
          <div className='sticky top-8 col-span-3 col-start-10 hidden h-fit lg:block'>
            <span className='text-lg font-medium'>Nesta página</span>
            <nav className='mt-4 text-sm'>
              <ul className='space-y-1'>
                <li>
                  <a
                    href='#section1'
                    className={cn(
                      'block py-1 transition-colors duration-200',
                      activeSection === 'section1'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary',
                    )}
                  >
                    How Taxes Work and Why They Matter
                  </a>
                </li>
                <li>
                  <a
                    href='#section2'
                    className={cn(
                      'block py-1 transition-colors duration-200',
                      activeSection === 'section2'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary',
                    )}
                  >
                    The Great People&apos;s Rebellion
                  </a>
                </li>
                <li>
                  <a
                    href='#section3'
                    className={cn(
                      'block py-1 transition-colors duration-200',
                      activeSection === 'section3'
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary',
                    )}
                  >
                    The King&apos;s Plan
                  </a>
                </li>
              </ul>
            </nav>

            <Separator className='my-6' />

            <div className='mt-6'>
              <Button
                variant='outline'
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              >
                <ArrowUp className='h-4 w-4' />
                Volte ao topo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPost;
