import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import blogPosts from '@/data/posts.json';

const Blog = () => {
  return (
    <section className='min-h-container py-6 md:py-12 container space-y-6'>
      <h1 className='tracking-tight text-center text-4xl md:text-start lg:text-5xl'>
        Blog
      </h1>
      <section className='space-y-6'>
        {blogPosts.map((post, index) => (
          <React.Fragment key={index}>
            <Link className='block' href='#'>
              <Card className='border-t border-border shadow-lg'>
                <CardContent>
                  <div className='relative w-full space-y-3'>
                    <h2 className='text-lg font-medium tracking-tight text-foreground md:text-2xl'>
                      {post.title}
                    </h2>
                    <p className='md:text-md text-sm text-muted-foreground md:pr-24 xl:pr-32'>
                      {post.content}
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

            {index < blogPosts.length - 1 && (
              <Separator className='h-px w-full' />
            )}
          </React.Fragment>
        ))}
      </section>
    </section>
  );
};

export default Blog;
