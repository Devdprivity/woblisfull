import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Eye,
    Heart,
    MessageCircle,
    Calendar,
    User,
    Tag
} from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image: string | null;
    status: 'published' | 'draft' | 'archived';
    author_name: string;
    author_email: string | null;
    tags: string[] | null;
    views_count: number;
    likes_count: number;
    comments_count: number;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    all_comments: Array<{
        id: number;
        author_name: string;
        author_email: string;
        content: string;
        status: string;
        likes_count: number;
        created_at: string;
    }>;
    likes: Array<{
        id: number;
        ip_address: string;
        created_at: string;
    }>;
}

interface Props {
    post: Post;
}

export default function PostsShow({ post }: Props) {
    const getStatusBadge = (status: string) => {
        const variants = {
            published: 'bg-green-100 text-green-800',
            draft: 'bg-yellow-100 text-yellow-800',
            archived: 'bg-gray-100 text-gray-800',
        };

        const labels = {
            published: 'Publicado',
            draft: 'Borrador',
            archived: 'Archivado',
        };

        return (
            <Badge className={variants[status as keyof typeof variants]}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title={`Post: ${post.title}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/posts">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a Posts
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Detalles del Post</h1>
                            <p className="text-white">Información completa del post</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/posts/${post.slug}/edit`}>
                            <Button>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        {post.status === 'published' && (
                            <a href={`/woblog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver en Blog
                                </Button>
                            </a>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">{post.title}</CardTitle>
                                    {getStatusBadge(post.status)}
                                </div>
                                <p className="text-gray-600">{post.excerpt}</p>
                            </CardHeader>
                            <CardContent>
                                {post.featured_image && (
                                    <div className="mb-4">
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-full h-64 object-cover rounded-lg"
                                        />
                                    </div>
                                )}

                                <div className="prose max-w-none">
                                    <div className="whitespace-pre-wrap text-gray-700">
                                        {post.content}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5" />
                                    Comentarios ({post.all_comments.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {post.all_comments.length > 0 ? (
                                    <div className="space-y-4">
                                        {post.all_comments.slice(0, 5).map((comment) => (
                                            <div key={comment.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-sm">{comment.author_name}</h4>
                                                        <p className="text-xs text-gray-500">{comment.author_email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={comment.status === 'approved' ? 'default' : 'outline'}>
                                                            {comment.status}
                                                        </Badge>
                                                        <span className="text-xs text-gray-500">
                                                            {comment.likes_count} ❤️
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700">{comment.content}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDate(comment.created_at)}
                                                </p>
                                            </div>
                                        ))}
                                        {post.all_comments.length > 5 && (
                                            <div className="text-center">
                                                <Link href="/admin/comments" className="text-blue-600 hover:underline">
                                                    Ver todos los comentarios →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">
                                        No hay comentarios aún
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">Vistas</span>
                                    </div>
                                    <span className="font-semibold">{post.views_count}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">Likes</span>
                                    </div>
                                    <span className="font-semibold">{post.likes_count}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">Comentarios</span>
                                    </div>
                                    <span className="font-semibold">{post.comments_count}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Post Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Post</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Autor</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{post.author_name}</p>
                                    {post.author_email && (
                                        <p className="text-xs text-gray-500">{post.author_email}</p>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Fechas</span>
                                    </div>
                                    <div className="space-y-1 text-sm text-gray-700">
                                        <p>Creado: {formatDate(post.created_at)}</p>
                                        <p>Actualizado: {formatDate(post.updated_at)}</p>
                                        {post.published_at && (
                                            <p>Publicado: {formatDate(post.published_at)}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium mb-1">Slug</p>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {post.slug}
                                    </code>
                                </div>

                                {post.tags && post.tags.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Tag className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm font-medium">Tags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Likes */}
                        {post.likes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Likes Recientes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {post.likes.slice(0, 5).map((like) => (
                                            <div key={like.id} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{like.ip_address}</span>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(like.created_at)}
                                                </span>
                                            </div>
                                        ))}
                                        {post.likes.length > 5 && (
                                            <div className="text-center pt-2">
                                                <Link href="/admin/likes" className="text-blue-600 hover:underline text-xs">
                                                    Ver todos los likes →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
