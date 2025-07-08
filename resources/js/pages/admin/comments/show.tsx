import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Edit,
    Check,
    X,
    Trash2,
    MessageCircle,
    User,
    Mail,
    Globe,
    Calendar,
    FileText,
    Heart
} from 'lucide-react';

interface Comment {
    id: number;
    content: string;
    author_name: string;
    author_email: string;
    author_ip: string;
    status: 'approved' | 'pending' | 'rejected';
    likes_count: number;
    created_at: string;
    updated_at: string;
    post: {
        id: number;
        title: string;
        slug: string;
    };
    likes: Array<{
        id: number;
        ip_address: string;
        created_at: string;
    }>;
}

interface Props {
    comment: Comment;
}

export default function CommentsShow({ comment }: Props) {
    const getStatusBadge = (status: string) => {
        const variants = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            rejected: 'bg-red-100 text-red-800',
        };

        const labels = {
            approved: 'Aprobado',
            pending: 'Pendiente',
            rejected: 'Rechazado',
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

    const handleAction = (action: 'approve' | 'reject' | 'delete') => {
        let confirmMessage = '';
        switch (action) {
            case 'approve':
                confirmMessage = '¿Aprobar este comentario?';
                break;
            case 'reject':
                confirmMessage = '¿Rechazar este comentario?';
                break;
            case 'delete':
                confirmMessage = '¿Eliminar este comentario? Esta acción no se puede deshacer.';
                break;
        }

        if (confirm(confirmMessage)) {
            if (action === 'delete') {
                router.delete(`/admin/comments/${comment.id}`);
            } else {
                router.post(`/admin/comments/${comment.id}/${action}`);
            }
        }
    };

    return (
        <AppLayout>
            <Head title={`Comentario: ${comment.author_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/comments">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver a Comentarios
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Detalles del Comentario</h1>
                            <p className="text-white">Información completa del comentario</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/admin/comments/${comment.id}/edit`}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        {comment.status !== 'approved' && (
                            <Button onClick={() => handleAction('approve')}>
                                <Check className="w-4 h-4 mr-2" />
                                Aprobar
                            </Button>
                        )}
                        {comment.status !== 'rejected' && (
                            <Button
                                variant="outline"
                                onClick={() => handleAction('reject')}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Rechazar
                            </Button>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => handleAction('delete')}
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
                                        <MessageCircle className="w-5 h-5" />
                                        Comentario #{comment.id}
                                    </CardTitle>
                                    {getStatusBadge(comment.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Contenido</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-2">Post Relacionado</h3>
                                        <div className="border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                <Link
                                                    href={`/admin/posts/${comment.post.slug}`}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    {comment.post.title}
                                                </Link>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                ID: {comment.post.id} • Slug: {comment.post.slug}
                                            </p>
                                            <div className="mt-2">
                                                <a
                                                    href={`/woblog/${comment.post.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:underline"
                                                >
                                                    Ver post en el blog →
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Likes Section */}
                        {comment.likes.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Likes ({comment.likes.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {comment.likes.map((like) => (
                                            <div key={like.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    <span className="text-sm font-mono">{like.ip_address}</span>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(like.created_at)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Author Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Autor</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Nombre</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.author_name}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Email</span>
                                    </div>
                                    <p className="text-sm text-gray-700 break-all">{comment.author_email}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Globe className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">IP Address</span>
                                    </div>
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                        {comment.author_ip}
                                    </code>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comment Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Heart className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm">Likes</span>
                                    </div>
                                    <span className="font-semibold">{comment.likes_count}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Caracteres</span>
                                    <span className="font-semibold">{comment.content.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Palabras</span>
                                    <span className="font-semibold">
                                        {comment.content.trim() ? comment.content.trim().split(/\s+/).length : 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fechas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Creado</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{formatDate(comment.created_at)}</p>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium">Actualizado</span>
                                    </div>
                                    <p className="text-sm text-gray-700">{formatDate(comment.updated_at)}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {comment.status !== 'approved' && (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleAction('approve')}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Aprobar Comentario
                                    </Button>
                                )}

                                {comment.status !== 'rejected' && (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleAction('reject')}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Rechazar Comentario
                                    </Button>
                                )}

                                <Button
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => handleAction('delete')}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar Comentario
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
