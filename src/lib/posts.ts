import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
// import { MDXRemoteSerializeResult } from 'next-mdx-remote' // Only if using next-mdx-remote

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  excerpt: string;
  featured?: boolean;
  image?: string;
}

export interface Post extends PostMetadata {
  content: string;
  // mdxSource?: MDXRemoteSerializeResult; // For next-mdx-remote
}

// Sample blog posts data for ABQ Hotspot
const samplePosts: PostMetadata[] = [
  {
    slug: 'breaking-downtown-development',
    title: 'Major Downtown Albuquerque Development Breaks Ground',
    date: 'December 15, 2024',
    author: 'Maria Rodriguez',
    excerpt: 'A new mixed-use development in downtown ABQ promises to bring 200 jobs and revitalize the historic district with modern amenities while preserving the area\'s cultural heritage.',
    tags: ['Breaking News', 'Development', 'Downtown'],
    featured: true
  },
  {
    slug: 'green-chile-festival-record',
    title: 'Hatch Green Chile Festival Sets New Attendance Record',
    date: 'December 14, 2024',
    author: 'Carlos Mendoza',
    excerpt: 'This year\'s festival drew over 50,000 visitors from across the Southwest, celebrating New Mexico\'s signature crop with record-breaking crowds and sales.',
    tags: ['Events', 'Culture', 'Food'],
  },
  {
    slug: 'sandia-peak-winter-activities',
    title: 'Sandia Peak Opens New Winter Recreation Trails',
    date: 'December 13, 2024',
    author: 'Jennifer Chen',
    excerpt: 'The Sandia Mountains now offer expanded winter activities including snowshoeing trails and a new sledding area, making outdoor winter fun more accessible to ABQ families.',
    tags: ['Recreation', 'Outdoors', 'Family'],
  },
  {
    slug: 'local-startup-success',
    title: 'ABQ Tech Startup Secures $2M in Funding',
    date: 'December 12, 2024',
    author: 'David Thompson',
    excerpt: 'A local clean energy startup has secured major funding to expand their solar technology manufacturing, bringing high-tech jobs to Albuquerque.',
    tags: ['Business', 'Technology', 'Innovation'],
  },
  {
    slug: 'old-town-art-walk',
    title: 'Old Town Art Walk Features Local Hispanic Artists',
    date: 'December 11, 2024',
    author: 'Sofia Gutierrez',
    excerpt: 'This month\'s Old Town Art Walk showcases the work of 25 local Hispanic artists, celebrating the rich cultural traditions that make Albuquerque unique.',
    tags: ['Art', 'Culture', 'Old Town'],
  },
  {
    slug: 'balloon-fiesta-economic-impact',
    title: 'Balloon Fiesta\'s Economic Impact Reaches Record High',
    date: 'December 10, 2024',
    author: 'Michael Johnson',
    excerpt: 'The latest economic study shows the Albuquerque International Balloon Fiesta generated $200 million in economic activity, the highest in the event\'s history.',
    tags: ['Economy', 'Events', 'Tourism'],
  }
]

export function getAllPostSlugs() {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => ({
        params: {
          slug: fileName.replace(/\.mdx$/, ''),
        }
      }));
  } catch (error) {
    console.error(`Error reading directory ${postsDirectory}:`, error);
    return []; // Return empty array if directory doesn't exist or has errors
  }
}

export function getSortedPostsData(): PostMetadata[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => {
        const slug = fileName.replace(/\.mdx$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
          slug,
          title: data.title || 'Untitled Post',
          date: data.date || new Date().toISOString().split('T')[0],
          author: data.author || 'Unknown Author',
          tags: data.tags || [],
          excerpt: data.excerpt || '',
          featured: data.featured || false,
          image: data.image || '',
        } as PostMetadata;
      });

    return allPostsData.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error(`Error reading posts:`, error);
    // Return sample data as fallback
    return samplePosts;
  }
}

export function getPostData(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Post with slug "${slug}" not found at ${fullPath}.`);
      // Try to find in sample data as fallback
      const samplePost = samplePosts.find(p => p.slug === slug);
      if (samplePost) {
        return {
          ...samplePost,
          content: generateSampleContent(samplePost)
        };
      }
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      title: data.title || 'Untitled Post',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || 'Unknown Author',
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      featured: data.featured || false,
      image: data.image || '',
      content: content, // Raw markdown content
    } as Post;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

function generateSampleContent(post: PostMetadata): string {
  const contentMap: { [key: string]: string } = {
    'sandia-peak-winter-activities': `
# Sandia Peak Opens New Winter Recreation Trails

The Sandia Mountains are welcoming winter enthusiasts with expanded recreational opportunities, making outdoor winter activities more accessible to Albuquerque families than ever before.

## New Winter Offerings

Sandia Peak now features:

### Snowshoeing Trails
- **5 miles of groomed trails** for all skill levels
- **Equipment rental** available on-site
- **Guided tours** every weekend
- **Family-friendly routes** suitable for children

### Sledding Area
- **Dedicated sledding hill** with safety barriers
- **Warming hut** with hot cocoa and snacks
- **Sled rentals** available
- **Designated parking area**

### Cross-Country Skiing
- **8 miles of Nordic skiing trails**
- **Equipment rental and lessons**
- **Trail maps and difficulty ratings**

## Getting There

The winter recreation area is accessible via the Sandia Peak Tramway or by driving to the top via the scenic byway. Special winter shuttle service is available on weekends.

Operating hours are 9 AM to 4 PM daily, with extended hours until 6 PM on weekends.
    `,
    'local-startup-success': `
# ABQ Tech Startup Secures $2M in Funding

A local clean energy startup has secured major funding to expand their solar technology manufacturing, bringing high-tech jobs to Albuquerque.

## About the Company

SolarTech ABQ, founded in 2022, develops innovative solar panel technology optimized for New Mexico's high-altitude desert environment.

## The Investment

The $2 million Series A funding round was led by Southwest Venture Partners, with participation from New Mexico Angels and individual investors.

## Future Plans

- Expand manufacturing facility in Westside Albuquerque
- Hire 50 new employees over the next 18 months  
- Develop partnerships with local contractors
- Launch pilot program with Albuquerque Public Schools

This investment represents the growing tech sector in Albuquerque and the city's commitment to renewable energy innovation.
    `
  }

  return contentMap[post.slug] || `
# ${post.title}

${post.excerpt}

This is a sample blog post for the Albuquerque Hotspot News blog. In a real implementation, this content would be loaded from MDX files.

## About This Story

This story represents the kind of local news and community coverage that makes Albuquerque special.

## Stay Connected

Follow us for more local news, events, and stories that matter to the ABQ community.
  `
} 