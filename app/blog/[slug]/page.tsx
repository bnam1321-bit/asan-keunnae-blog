import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';
import Link from 'next/link';
import { CLINIC_NAME, SITE_URL } from '@/lib/constants';

type Props = {
    params: Promise<{ slug: string }>;
};

// 동적 라우트 생성을 위한 함수 (빌드 시점에 페이지 생성)
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// SEO 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: '페이지를 찾을 수 없습니다.',
        };
    }

    return {
        title: `${post.title} | ${CLINIC_NAME}`,
        description: post.description,
        keywords: [
            ...post.tags,
            CLINIC_NAME,
            '인천서구내과',
            '검단신도시내과',
            '검단내과',
            '인천 서구 내과',
            '인천서구건강검진',
            '인천서구위내시경',
            '인천서구대장내시경'
        ],
        alternates: {
            canonical: `${SITE_URL}/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            url: `${SITE_URL}/blog/${post.slug}`,
            siteName: CLINIC_NAME,
            authors: [CLINIC_NAME],
            images: [
                {
                    url: post.coverImage || '/images/og-default.jpg',
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    // JSON-LD 구조화 데이터
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: {
            '@type': 'MedicalClinic',
            name: '아산큰내과',
            url: 'https://asan-keunnae.co.kr'
        },
    };

    return (
        <div className="min-h-screen gradient-bg">
            {/* 구조화 데이터 삽입 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Back Navigation */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/blog" className="inline-flex items-center text-sm text-stone-600 hover:text-amber-700 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        블로그 목록으로
                    </Link>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-2 bg-stone-700 text-white rounded-full text-sm font-bold shadow-md">
                            {post.tags?.[0] || '건강정보'}
                        </span>
                        <time className="text-gray-500 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {post.date}
                        </time>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
                        {post.title}
                    </h1>

                    {post.description && (
                        <p className="text-xl text-stone-600 leading-relaxed border-l-4 border-amber-600 pl-6 py-2">
                            {post.description}
                        </p>
                    )}
                </header>

                {/* Article Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-12">
                    <div className="prose prose-lg prose-amber max-w-none
                        prose-headings:font-bold prose-headings:text-stone-900
                        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-stone-200
                        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:text-stone-700 prose-p:leading-relaxed prose-p:mb-6
                        prose-a:text-amber-700 prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-stone-900 prose-strong:font-bold
                        prose-ul:my-6 prose-li:my-2
                        prose-code:bg-stone-50 prose-code:text-amber-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    ">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-12">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Author & Clinic Info */}
                <div className="bg-stone-50 rounded-3xl p-8 sm:p-10 mb-12 border border-stone-200">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-stone-200 flex items-center justify-center text-3xl font-bold shadow-sm">
                            🏥
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">아산큰내과</h3>
                            <p className="text-gray-600">전문의가 전하는 올바른 건강정보</p>
                        </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6">
                        본 콘텐츠는 의료광고법을 준수하며, 검증된 의학 정보를 바탕으로 작성되었습니다.
                        정확한 진단과 치료를 위해서는 반드시 전문의와 상담하시기 바랍니다.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            인천 서구 검단로 469 4층, 5층
                        </div>
                        <div className="flex items-center text-gray-700">
                            <svg className="w-5 h-5 mr-2 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            032-567-0750
                        </div>
                    </div>

                    <div className="border-t border-stone-200 pt-6 mt-6 flex justify-end">
                        <a
                            href={`https://github.com/bnam1321-bit/cheongna-nanum-blog/edit/main/content/posts/${encodeURIComponent(post.slug)}.md`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-600 text-xs underline decoration-gray-300 underline-offset-4 transition-colors"
                        >
                            수정
                        </a>
                    </div>
                </div>
            </article>
        </div>
    );
}
