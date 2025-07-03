import { Head, Link } from '@inertiajs/react';
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

interface Comment {
    id: number;
    post_id: number;
    author_name: string;
    author_email: string;
    content: string;
    likes_count: number;
    is_liked: boolean;
    created_at: string;
    time_ago: string;
}

interface Props {
    post: Post;
    isLiked: boolean;
    relatedPosts: Post[];
    commentsWithLikes: Comment[];
}

export default function BlogShow({ post, isLiked, relatedPosts, commentsWithLikes }: Props) {
    const [liked, setLiked] = useState(isLiked);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [comments, setComments] = useState<Comment[]>(commentsWithLikes);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [commentForm, setCommentForm] = useState({
        author_name: '',
        author_email: '',
        content: ''
    });

    const handleLike = async () => {
        try {
            const response = await fetch(route('blog.like', post.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();
            setLiked(data.liked);
            setLikesCount(data.count);
        } catch (error) {
            console.error('Error al dar like:', error);
        }
    };

    const handleCommentLike = async (commentId: number) => {
        try {
            const response = await fetch(route('comments.like', commentId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            const data = await response.json();

            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.id === commentId
                        ? { ...comment, is_liked: data.liked, likes_count: data.count }
                        : comment
                )
            );
        } catch (error) {
            console.error('Error al dar like al comentario:', error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingComment(true);

        try {
            const response = await fetch(route('comments.store'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({
                    post_id: post.id,
                    ...commentForm
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Refresh comments
                const commentsResponse = await fetch(route('comments.by-post', post.id));
                const newComments = await commentsResponse.json();
                setComments(newComments);

                // Reset form
                setCommentForm({
                    author_name: '',
                    author_email: '',
                    content: ''
                });
            } else {
                console.error('Error al enviar comentario:', data);
            }
        } catch (error) {
            console.error('Error al enviar comentario:', error);
        } finally {
            setIsSubmittingComment(false);
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
            <Head title={`${post.title} - Woblog`} />

            <div className="bg-black min-h-screen pt-20">
                <div className="container mx-auto px-8 py-12">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center space-x-2 text-sm text-gray-400">
                            <li>
                                <Link href={route('blog.index')} className="hover:text-[#7FFF00] transition-colors">
                                    Woblog
                                </Link>
                            </li>
                            <li>/</li>
                            <li className="text-white">{post.title}</li>
                        </ol>
                    </nav>

                    <div className="max-w-4xl mx-auto">
                        {/* Post Header */}
                        <header className="mb-8">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags?.map((tag, index) => (
                                    <span key={index} className="bg-[#7FFF00] text-black px-3 py-1 rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {post.title}
                            </h1>

                            <div className="flex items-center justify-between mb-6 text-gray-400">
                                <div className="flex items-center space-x-4">
                                    <span>Por {post.author_name}</span>
                                    <span>•</span>
                                    <span>{formatDate(post.published_at)}</span>
                                </div>

                                <div className="flex items-center space-x-4 text-sm">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {post.views_count}
                                    </span>
                                    <button
                                        onClick={handleLike}
                                        className={`flex items-center transition-colors ${
                                            liked ? 'text-[#7FFF00]' : 'hover:text-[#7FFF00]'
                                        }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {likesCount}
                                    </button>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        {comments.length}
                                    </span>
                                </div>
                            </div>
                        </header>

                        {/* Featured Image */}
                        <div className="mb-8">
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="w-full h-64 md:h-96 object-cover rounded-xl"
                            />
                        </div>

                        {/* Post Content */}
                        <div className="prose prose-invert prose-lg max-w-none mb-16">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {post.content}
                            </div>
                        </div>

                        {/* Comments Section */}
                        <section className="mb-16">
                            <h2 className="text-2xl font-bold text-white mb-8">
                                Comentarios ({comments.length})
                            </h2>

                            {/* Comment Form */}
                            <form onSubmit={handleCommentSubmit} className="bg-gray-900 rounded-xl p-6 mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4">Deja tu comentario</h3>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={commentForm.author_name}
                                        onChange={(e) => setCommentForm({...commentForm, author_name: e.target.value})}
                                        required
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#7FFF00]"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Tu email"
                                        value={commentForm.author_email}
                                        onChange={(e) => setCommentForm({...commentForm, author_email: e.target.value})}
                                        required
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#7FFF00]"
                                    />
                                </div>

                                <textarea
                                    placeholder="Escribe tu comentario..."
                                    value={commentForm.content}
                                    onChange={(e) => setCommentForm({...commentForm, content: e.target.value})}
                                    required
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#7FFF00] mb-4"
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmittingComment}
                                    className="bg-[#7FFF00] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#6FEF00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingComment ? 'Enviando...' : 'Enviar Comentario'}
                                </button>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="bg-gray-900 rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-[#7FFF00] rounded-full flex items-center justify-center text-black font-bold">
                                                    {comment.author_name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-white">{comment.author_name}</h4>
                                                    <p className="text-sm text-gray-400">{comment.time_ago}</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleCommentLike(comment.id)}
                                                className={`flex items-center space-x-1 transition-colors ${
                                                    comment.is_liked ? 'text-[#7FFF00]' : 'text-gray-400 hover:text-[#7FFF00]'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill={comment.is_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span>{comment.likes_count}</span>
                                            </button>
                                        </div>

                                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                ))}

                                {comments.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-8">Artículos Relacionados</h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link key={relatedPost.id} href={route('blog.show', relatedPost.slug)}>
                                            <article className="bg-gray-900 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors group">
                                                <img
                                                    src={relatedPost.featured_image_url}
                                                    alt={relatedPost.title}
                                                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="p-4">
                                                    <h3 className="font-semibold text-white mb-2 group-hover:text-[#7FFF00] transition-colors line-clamp-2">
                                                        {relatedPost.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-400">
                                                        {formatDate(relatedPost.published_at)}
                                                    </p>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </BlogLayout>
    );
}
