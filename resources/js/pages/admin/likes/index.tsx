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
    Heart,
    Eye,
    Trash2,
    Search,
    FileText,
    MessageCircle,
    Shield,
    CheckSquare
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
    };
}

interface PaginatedLikes {
    data: Like[];
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
    posts: number;
    comments: number;
    unique_ips: number;
    recent: number;
}

interface Props {
    likes: PaginatedLikes;
    stats: Stats;
    filters: {
        search?: string;
        type?: string;
    };
}

export default function LikesIndex({ likes, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');
    const [selectedLikes, setSelectedLikes] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = () => {
        router.get('/admin/likes', {
            search: search || undefined,
            type: type !== 'all' ? type : undefined,
        });
    };

    const handleClearFilters = () => {
        setSearch('');
        setType('all');
        router.get('/admin/likes');
    };

    const handleSelectLike = (likeId: number) => {
        setSelectedLikes(prev =>
            prev.includes(likeId)
                ? prev.filter(id => id !== likeId)
                : [...prev, likeId]
        );
    };

    const handleSelectAll = () => {
        if (selectedLikes.length === likes.data.length) {
            setSelectedLikes([]);
        } else {
            setSelectedLikes(likes.data.map(like => like.id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedLikes.length === 0) {
            alert('Selecciona al menos un like');
            return;
        }

        if (confirm(`¿Eliminar ${selectedLikes.length} like(s)? Esta acción no se puede deshacer.`)) {
            setIsLoading(true);
            router.post('/admin/likes/bulk-delete', {
                like_ids: selectedLikes,
            }, {
                onFinish: () => {
                    setIsLoading(false);
                    setSelectedLikes([]);
                }
            });
        }
    };

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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout>
            <Head title="Gestión de Likes" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestión de Likes</h1>
                        <p className="text-white">Administra y modera los likes del sistema</p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.unique_ips} IPs únicas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Likes en Posts</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.posts}</div>
                            <p className="text-xs text-muted-foreground">
                                {(stats.posts / stats.total * 100).toFixed(1)}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Likes en Comentarios</CardTitle>
                            <MessageCircle className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats.comments}</div>
                            <p className="text-xs text-muted-foreground">
                                {(stats.comments / stats.total * 100).toFixed(1)}% del total
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Actividad Reciente</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recent}</div>
                            <p className="text-xs text-muted-foreground">
                                Últimas 24 horas
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
                                    placeholder="Buscar por IP..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <div className="w-full md:w-48">
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="posts">Posts</SelectItem>
                                        <SelectItem value="comments">Comentarios</SelectItem>
                                    </SelectContent>
                                </Select>
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
                {selectedLikes.length > 0 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    <span className="text-sm font-medium">
                                        {selectedLikes.length} like(s) seleccionado(s)
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={handleBulkDelete}
                                        disabled={isLoading}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar Seleccionados
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Likes List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Likes ({likes.total})</CardTitle>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={selectedLikes.length === likes.data.length && likes.data.length > 0}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm text-gray-500">Seleccionar todos</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {likes.data.map((like) => (
                                <div key={like.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start gap-3">
                                        <Checkbox
                                            checked={selectedLikes.includes(like.id)}
                                            onCheckedChange={() => handleSelectLike(like.id)}
                                        />

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-sm">{like.ip_address}</span>
                                                    {getTypeBadge(like.likeable_type)}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/likes/${like.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (confirm('¿Eliminar este like?')) {
                                                                router.delete(`/admin/likes/${like.id}`);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="text-sm text-gray-700 mb-2">
                                                <span className="font-medium">
                                                    {like.likeable.title || `Comentario de ${like.likeable.author_name}`}
                                                </span>
                                                {like.likeable.content && !like.likeable.title && (
                                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                                        {like.likeable.content.substring(0, 100)}...
                                                    </p>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                <span>Creado: {formatDate(like.created_at)}</span>
                                                <span className="ml-4">ID: {like.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {likes.data.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron likes.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {likes.last_page > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {likes.links.map((link, index) => (
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
