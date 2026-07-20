import { getAllPosts } from '@/lib/posts';
import BlogContent from './content';

const Blog = () => {
  const blogPosts = getAllPosts();

  return <BlogContent blogPosts={blogPosts} />;
};

export default Blog;
