import { getAllPostsMeta } from '@/lib/posts';
import BlogContent from './content';

const Blog = () => {
  const blogPosts = getAllPostsMeta();

  return <BlogContent blogPosts={blogPosts} />;
};

export default Blog;
