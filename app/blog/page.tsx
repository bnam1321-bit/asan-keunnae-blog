import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import TypographicCover from '@/app/components/TypographicCover';


export const metadata = {
    title: '건강정보 | 아산큰내과',
    description: '아산큰내과에서 전하는 올바른 건강 정보입니다.',
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Premium Hero Header */}
            <div className="relative overflow-hidden text-white bg-stone-900 bg-[url('/images/clinic-interior.png')] bg-cover bg-center">
                <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm"></div>
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-lg">
                            <span className="text-sm font-bold text-stone-50 tracking-wide">🏥 전문의가 전하는 의학정보</span>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black mb-6 text-white drop-shadow-lg">
                            건강정보
                        </h1>
                        <p className="text-xl text-stone-200 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow">
                            검증된 의학 지식으로 여러분의 건강한 삶을 지원합니다
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-50 to-transparent"></div>
            </div>

            {/* Blog Posts Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8">
                {posts.length === 0 ? (
                    <div className="text-center py-32">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-100 mb-6 shadow-sm border border-stone-200">
                            <span className="text-3xl">📝</span>
                        </div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-3">준비중입니다</h3>
                        <p className="text-gray-500 text-lg">곧 유익한 건강정보를 만나보실 수 있습니다.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, index) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article
                                    className="h-full bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 hover:scale-[1.02] hover:-translate-y-1"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Typographic Cover */}
                                    <div className="relative h-56 w-full">
                                        <TypographicCover
                                            title={post.title}
                                            tags={post.tags}
                                            slug={post.slug}
                                        />
                                        {/* Date Badge */}
                                        <div className="absolute bottom-4 right-4 z-10">
                                            <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md text-white rounded-full text-xs font-semibold">
                                                {post.date}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-black text-stone-900 mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-tight tracking-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-stone-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                                            {post.description}
                                        </p>

                                        {/* Read More Button */}
                                        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                            <span className="text-accent text-sm font-bold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                                                자세히 보기
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
