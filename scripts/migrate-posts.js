// @ts-check
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');

const posts = require('../src/data/posts.json');
const outputDir = path.join(__dirname, '..', 'src', 'data', 'posts');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const post of posts) {
  const slug = slugify(post.title, { lower: true, strict: true });
  const { content, ...frontmatterData } = post;

  const fileContent = matter.stringify(content, frontmatterData);

  fs.writeFileSync(path.join(outputDir, `${slug}.md`), fileContent, 'utf8');
  console.log(`Created: ${slug}.md`);
}

console.log(`\nDone! Created ${posts.length} markdown files in ${outputDir}`);
