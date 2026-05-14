import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/posts';
import BlogPostContent from './blog-post-content';

interface Props {
  params: Promise<{ post: string }>;
}

const BlogPost = async ({ params }: Props): Promise<React.ReactNode> => {
  const { post: slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const contentParts = post.content.split(/\n(?=## )/);
  const intro = contentParts[0];
  const sections = contentParts.slice(1).map((part, index) => {
    const lines = part.split('\n');
    const title = lines[0].replace(/^##\s*/, '');
    const content = lines.slice(1).join('\n').trim();
    return { id: `section${index + 1}`, title, content };
  });

  return <BlogPostContent post={post} intro={intro} sections={sections} />;
};

export default BlogPost;
