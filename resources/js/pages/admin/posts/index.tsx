import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    FileText,
    TrendingUp,
    Heart,
    MessageCircle
} from 'lucide-react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    status: 'published' | 'draft' | 'archived';
    author_name: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    published_at: string;
    created_at: string;
    all_comments_count: number;
}

interface PaginatedPosts {
    data: Post[];
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
    published: number;
    draft: number;
    archived: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    avg_engagement: number;
}

interface Props {
    posts: PaginatedPosts;
    stats: Stats;
    filters: {
        search?: string;
        status?: string;
        author?: string;
    };
}

export default function PostsIndex({ posts, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [author, setAuthor] = useState(filters.author || '');

    const handleSearch = () => {
        router.get('/admin/posts', {
            search: search || undefined,
            status: status !== 'all' ? status : undefined,
            author: author || undefined,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setStatus('all');
        setAuthor('');
        router.get('/admin/posts');
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            published: 'bg-green-100 text-green-800 hover:bg-green-200',
            draft: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
            archived: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
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

    return (
        <AppLayout>
            <Head title="Gestión de Posts" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestión de Posts</h1>
                        <p className="text-white">Administra todos los posts del blog</p>
                    </div>
                    <Link href="/admin/posts/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Post
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {((stats.published / stats.total) * 100).toFixed(1)}% publicados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Vistas</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                {(stats.total_views / stats.total).toFixed(0)} promedio por post
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_likes}</div>
                            <p className="text-xs text-muted-foreground">
                                {typeof stats.avg_engagement === 'number' ? stats.avg_engagement.toFixed(1) : '0.0'} promedio por post
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Comentarios</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_comments}</div>
                            <p className="text-xs text-muted-foreground">
                                {(stats.total_comments / stats.total).toFixed(1)} promedio por post
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar posts..."
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
                                        <SelectItem value="published">Publicados</SelectItem>
                                        <SelectItem value="draft">Borradores</SelectItem>
                                        <SelectItem value="archived">Archivados</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full md:w-48">
                                <Input
                                    placeholder="Filtrar por autor..."
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
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

                {/* Posts Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Posts ({posts.total})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {posts.data.map((post) => (
                                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{post.title}</h3>
                                                {getStatusBadge(post.status)}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                                            <div className="text-xs text-gray-500">
                                                Por {post.author_name} •
                                                {post.status === 'published' && post.published_at ?
                                                    ` Publicado ${new Date(post.published_at).toLocaleDateString('es-ES')}` :
                                                    ` Creado ${new Date(post.created_at).toLocaleDateString('es-ES')}`
                                                }
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/admin/posts/${post.slug}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/posts/${post.slug}/edit`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    if (confirm('¿Estás seguro de que quieres eliminar este post?')) {
                                                        router.delete(`/admin/posts/${post.slug}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {post.views_count} vistas
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Heart className="w-4 h-4" />
                                            {post.likes_count} likes
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="w-4 h-4" />
                                            {post.all_comments_count} comentarios
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {posts.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron posts.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {posts.last_page > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {posts.links.map((link, index) => (
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
