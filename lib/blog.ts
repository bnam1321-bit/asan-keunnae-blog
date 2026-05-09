import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export type Post = {
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    content: string;
    coverImage?: string;
};

export function getAllPosts(): Post[] {
    // 디렉토리가 없으면 빈 배열 반환
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title || '제목 없음',
            date: data.date || new Date().toISOString(),
            description: data.description || '',
            tags: data.tags || [],
            ...data,
        } as Post;
    });

    // 날짜순 정렬 (최신순)
    return allPostsData.sort((a, b) => {
        return a.date < b.date ? 1 : -1;
    });
}

export function getPostBySlug(slug: string): Post | null {
    try {
        const decodedSlug = decodeURIComponent(slug);
        const fullPath = path.join(postsDirectory, `${decodedSlug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            content,
            title: data.title,
            date: data.date,
            description: data.description,
            tags: data.tags,
            ...data,
        } as Post;
    } catch (_err) {
        return null;
    }
}
