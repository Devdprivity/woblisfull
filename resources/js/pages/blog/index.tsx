import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import BlogLayout from '@/layouts/blog-layout';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    featured_image_url: string;
    author_name: string;
    author_email?: string;
    tags?: string[];
    views_count: number;
    likes_count: number;
    comments_count: number;
    published_at: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        prev_page_url?: string;
        next_page_url?: string;
    };
    featuredPost?: Post;
}

export default function BlogIndex({ posts, featuredPost }: Props) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery && searchQuery.trim()) {
            router.get(route('blog.search'), { q: searchQuery });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <BlogLayout>
            <Head title="Woblog - Blog de Woblis" />

            <div className="bg-black min-h-screen pt-20">
                <div className="container mx-auto px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            Wob<span className="text-[#7FFF00]">log</span>
                        </h1>
                        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                            Descubre insights, tendencias y novedades del mundo del transporte y la investigación de mercado
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-md mx-auto mb-12">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar artículos..."
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#7FFF00]"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7FFF00] hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Featured Post */}
                    {featuredPost && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-bold text-white mb-6">Artículo Destacado</h2>
                            <Link href={route('blog.show', featuredPost.slug)}>
                                <div className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors group">
                                    <div className="md:flex">
                                        <div className="md:w-1/2">
                                            <img
                                                src={featuredPost.featured_image_url}
                                                alt={featuredPost.title}
                                                className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="md:w-1/2 p-8">
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {featuredPost.tags?.map((tag, index) => (
                                                    <span key={index} className="bg-[#7FFF00] text-black px-3 py-1 rounded-full text-sm font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#7FFF00] transition-colors">
                                                {featuredPost.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4 leading-relaxed">
                                                {featuredPost.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <span>Por {featuredPost.author_name}</span>
                                                <span>{formatDate(featuredPost.published_at)}</span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-400">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    {featuredPost.views_count}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {featuredPost.likes_count}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {featuredPost.comments_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {posts.data.map((post) => (
                            <Link key={post.id} href={route('blog.show', post.slug)}>
                                <article className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors group h-full">
                                    <img
                                        src={post.featured_image_url}
                                        alt={post.title}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.tags?.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="bg-[#7FFF00] text-black px-2 py-1 rounded-full text-xs font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#7FFF00] transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                            <span>{post.author_name}</span>
                                            <span>{formatDate(post.published_at)}</span>
                                        </div>
                                        <div className="flex items-center space-x-3 text-xs text-gray-400">
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {post.views_count}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                {post.likes_count}
                                            </span>
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                {post.comments_count}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex justify-center items-center space-x-4">
                            {posts.prev_page_url && (
                                <Link
                                    href={posts.prev_page_url}
                                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                                >
                                    ← Anterior
                                </Link>
                            )}
                            <span className="text-gray-300">
                                Página {posts.current_page} de {posts.last_page}
                            </span>
                            {posts.next_page_url && (
                                <Link
                                    href={posts.next_page_url}
                                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                                >
                                    Siguiente →
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {posts.data.length === 0 && (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-xl font-bold text-white mb-2">No hay artículos disponibles</h3>
                            <p className="text-gray-400">Vuelve pronto para ver nuevo contenido</p>
                        </div>
                    )}
                </div>
            </div>
        </BlogLayout>
    );
}
