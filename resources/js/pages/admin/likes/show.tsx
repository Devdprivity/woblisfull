import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Trash2,
    Heart,
    Globe,
    Calendar,
    FileText,
    MessageCircle,
    User
} from 'lucide-react';

interface Like {
    id: number;
    ip_address: string;
    created_at: string;
    likeable_type: string;
    likeable: {
        id: number;
        title?: string;
        content?: string;
        author_name: string;
        slug?: string;
        excerpt?: string;
        created_at: string;
    };
}

interface Props {
    like: Like;
}

export default function LikesShow({ like }: Props) {
    const getTypeBadge = (type: string) => {
        const isPost = type.includes('Post');
        return (
            <Badge className={isPost ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                {isPost ? 'Post' : 'Comentario'}
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

    const handleDelete = () => {
        if (confirm('¿Eliminar este like? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/likes/${like.id}`);
        }
    };

    const isPost = like.likeable_type.includes('Post');

    return (
        <AppLayout>
            <Head title={`Like: ${like.ip_address}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/likes">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a Likes
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Detalles del Like</h1>
                            <p className="text-white">Información completa del like</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Like #{like.id}
                                    </CardTitle>
                                    {getTypeBadge(like.likeable_type)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Contenido Liked</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            {isPost ? (
                                                <div>
                                                    <h4 className="font-semibold text-lg mb-2">{like.likeable.title}</h4>
                                                    {like.likeable.excerpt && (
                                                        <p className="text-gray-600 text-sm mb-3">{like.likeable.excerpt}</p>
                                                    )}
                                                    <div className="text-xs text-gray-500">
                                                        Por {like.likeable.author_name} •
                                                        Creado {formatDate(like.likeable.created_at)}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-2">
                                                        Comentario de {like.likeable.author_name}
                                                    </h4>
                                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                                        {like.likeable.content}
                                                    </p>
                                                    <div className="text-xs text-gray-500">
                                                        Creado {formatDate(like.likeable.created_at)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isPost && like.likeable.slug && (
                                        <div>
                                            <h3 className="font-medium text-gray-900 mb-2">Enlaces</h3>
                                            <div className="space-y-2">
                                                <div>
                                                    <a
                                                        href={route('blog.show', like.likeable.slug)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        Ver post en el blog →
                                                    </a>
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/admin/posts/${like.likeable.slug}`}
                                                        className="text-blue-600 hover:underline text-sm"
                                                    >
                                                        Ver post en admin →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Like Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Like</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">IP Address</span>
                                    </div>
                                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                        {like.ip_address}
                                    </code>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Fecha</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{formatDate(like.created_at)}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {isPost ? (
                                            <FileText className="w-4 h-4 text-gray-500" />
                                        ) : (
                                            <MessageCircle className="w-4 h-4 text-gray-500" />
                                        )}
                                        <span className="text-sm font-medium">Tipo</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {isPost ? 'Like en Post' : 'Like en Comentario'}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Autor del Contenido</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{like.likeable.author_name}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Content Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles del Contenido</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium">ID del Contenido:</span>
                                    <p className="text-sm text-gray-700">{like.likeable.id}</p>
                                </div>

                                {isPost && like.likeable.slug && (
                                    <div>
                                        <span className="text-sm font-medium">Slug:</span>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                                            {like.likeable.slug}
                                        </code>
                                    </div>
                                )}

                                <div>
                                    <span className="text-sm font-medium">Tipo de Contenido:</span>
                                    <p className="text-sm text-gray-700">{like.likeable_type}</p>
                                </div>

                                {like.likeable.content && (
                                    <div>
                                        <span className="text-sm font-medium">Caracteres:</span>
                                        <p className="text-sm text-gray-700">{like.likeable.content.length}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar Like
                                </Button>

                                {isPost && like.likeable.slug && (
                                    <Link href={`/admin/posts/${like.likeable.slug}`}>
                                        <Button variant="outline" className="w-full">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Ver Post Completo
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
