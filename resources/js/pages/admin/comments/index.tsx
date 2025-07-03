import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    MessageCircle,
    Eye,
    Check,
    X,
    Trash2,
    Search,
    Heart,
    ThumbsUp,
    ThumbsDown,
    CheckSquare
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
    post: {
        id: number;
        title: string;
        slug: string;
    };
}

interface PaginatedComments {
    data: Comment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Stats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    avg_likes: number;
}

interface Props {
    comments: PaginatedComments;
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
        post_id?: string;
    };
}

export default function CommentsIndex({ comments, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [postId, setPostId] = useState(filters.post_id || '');
    const [selectedComments, setSelectedComments] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        router.get('/admin/comments', {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            post_id: postId || undefined,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setPostId('');
        router.get('/admin/comments');
    };

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

    const handleSelectComment = (commentId: number) => {
        setSelectedComments(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };

    const handleSelectAll = () => {
        if (selectedComments.length === comments.data.length) {
            setSelectedComments([]);
        } else {
            setSelectedComments(comments.data.map(comment => comment.id));
        }
    };

    const handleBulkAction = (action: 'approve' | 'reject' | 'delete') => {
        if (selectedComments.length === 0) {
            alert('Selecciona al menos un comentario');
            return;
        }

        let confirmMessage = '';
        switch (action) {
            case 'approve':
                confirmMessage = `¿Aprobar ${selectedComments.length} comentario(s)?`;
                break;
            case 'reject':
                confirmMessage = `¿Rechazar ${selectedComments.length} comentario(s)?`;
                break;
            case 'delete':
                confirmMessage = `¿Eliminar ${selectedComments.length} comentario(s)? Esta acción no se puede deshacer.`;
                break;
        }

        if (confirm(confirmMessage)) {
            setIsLoading(true);
            router.post(`/admin/comments/bulk-${action}`, {
                comment_ids: selectedComments,
            }, {
                onFinish: () => {
                    setIsLoading(false);
                    setSelectedComments([]);
                }
            });
        }
    };

    const handleSingleAction = (commentId: number, action: 'approve' | 'reject') => {
        setIsLoading(true);
        router.post(`/admin/comments/${commentId}/${action}`, {}, {
            onFinish: () => setIsLoading(false)
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Gestión de Comentarios" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestión de Comentarios</h1>
                        <p className="text-white">Modera y administra todos los comentarios</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Comentarios</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {((stats.approved / stats.total) * 100).toFixed(1)}% aprobados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Aprobados</CardTitle>
                            <ThumbsUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            <p className="text-xs text-muted-foreground">
                                {(stats.approved / stats.total * 100).toFixed(1)}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <ThumbsDown className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                Requieren moderación
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Likes Promedio</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avg_likes.toFixed(1)}</div>
                            <p className="text-xs text-muted-foreground">
                                Por comentario
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar comentarios..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="approved">Aprobados</SelectItem>
                                        <SelectItem value="pending">Pendientes</SelectItem>
                                        <SelectItem value="rejected">Rechazados</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-48">
                                <Input
                                    placeholder="ID del Post"
                                    value={postId}
                                    onChange={(e) => setPostId(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSearch}>
                                    <Search className="w-4 h-4 mr-2" />
                                    Buscar
                                </Button>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedComments.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {selectedComments.length} comentario(s) seleccionado(s)
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleBulkAction('approve')}
                                        disabled={isLoading}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Aprobar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleBulkAction('reject')}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Rechazar
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleBulkAction('delete')}
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Comments List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Comentarios ({comments.total})</CardTitle>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedComments.length === comments.data.length && comments.data.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-500">Seleccionar todos</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {comments.data.map((comment) => (
                                <div key={comment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={selectedComments.includes(comment.id)}
                                            onCheckedChange={() => handleSelectComment(comment.id)}
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-sm">{comment.author_name}</h4>
                                                    {getStatusBadge(comment.status)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/comments/${comment.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    {comment.status !== 'approved' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSingleAction(comment.id, 'approve')}
                                                            disabled={isLoading}
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {comment.status !== 'rejected' && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSingleAction(comment.id, 'reject')}
                                                            disabled={isLoading}
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-700 mb-2">{comment.content}</p>

                                            <div className="text-xs text-gray-500 space-y-1">
                                                <p>Email: {comment.author_email} • IP: {comment.author_ip}</p>
                                                <p>
                                                    Post:
                                                    <Link
                                                        href={`/admin/posts/${comment.post.id}`}
                                                        className="text-blue-600 hover:underline ml-1"
                                                    >
                                                        {comment.post.title}
                                                    </Link>
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <span>{formatDate(comment.created_at)}</span>
                                                    <div className="flex items-center gap-1">
                                                        <Heart className="w-3 h-3" />
                                                        {comment.likes_count} likes
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {comments.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron comentarios.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {comments.last_page > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {comments.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => link.url && router.get(link.url)}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
