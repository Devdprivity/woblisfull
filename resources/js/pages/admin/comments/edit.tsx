import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { ArrowLeft, Save, Check, X } from 'lucide-react';

interface Comment {
    id: number;
    content: string;
    author_name: string;
    author_email: string;
    author_ip: string;
    status: 'approved' | 'pending' | 'rejected';
    created_at: string;
    post: {
        id: number;
        title: string;
        slug: string;
    };
}

interface Props {
    comment: Comment;
}

export default function CommentsEdit({ comment }: Props) {
    const [formData, setFormData] = useState({
        content: comment.content,
        author_name: comment.author_name,
        author_email: comment.author_email,
        status: comment.status,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(`/admin/comments/${comment.id}`, formData, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    const hasChanges = () => {
        return (
            formData.content !== comment.content ||
            formData.author_name !== comment.author_name ||
            formData.author_email !== comment.author_email ||
            formData.status !== comment.status
        );
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

    return (
        <AppLayout>
            <Head title={`Editar Comentario: ${comment.author_name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/admin/comments')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Editar Comentario</h1>
                            <p className="text-white">Modifica la información del comentario</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Comentario</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="content">Contenido *</Label>
                                    <textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                        placeholder="Contenido del comentario"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={6}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="author_name">Nombre del Autor *</Label>
                                        <Input
                                            id="author_name"
                                            value={formData.author_name}
                                            onChange={(e) => handleInputChange('author_name', e.target.value)}
                                            placeholder="Nombre del autor"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="author_email">Email del Autor *</Label>
                                        <Input
                                            id="author_email"
                                            type="email"
                                            value={formData.author_email}
                                            onChange={(e) => handleInputChange('author_email', e.target.value)}
                                            placeholder="email@ejemplo.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approved">Aprobado</SelectItem>
                                            <SelectItem value="pending">Pendiente</SelectItem>
                                            <SelectItem value="rejected">Rechazado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Post Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Relacionado</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">{comment.post.title}</h3>
                                    <div className="text-sm text-gray-500 space-y-1">
                                        <p>ID: {comment.post.id}</p>
                                        <p>Slug: {comment.post.slug}</p>
                                    </div>
                                    <div className="mt-2">
                                        <a
                                            href={route('blog.show', comment.post.slug)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Ver post en el blog →
                                        </a>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Estado y Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Estado Actual:</span>
                                    {getStatusBadge(formData.status)}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !hasChanges()}
                                        className="w-full"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSubmitting ? 'Guardando...' : 'Actualizar Comentario'}
                                    </Button>

                                    {!hasChanges() && (
                                        <p className="text-xs text-gray-500 text-center">
                                            No hay cambios para guardar
                                        </p>
                                    )}
                                </div>

                                <hr />

                                <div className="flex flex-col gap-2">
                                    {formData.status !== 'approved' && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                router.post(`/admin/comments/${comment.id}/approve`);
                                            }}
                                        >
                                            <Check className="w-4 h-4 mr-2" />
                                            Aprobar Rápido
                                        </Button>
                                    )}

                                    {formData.status !== 'rejected' && (
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => {
                                                router.post(`/admin/comments/${comment.id}/reject`);
                                            }}
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Rechazar Rápido
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Original</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">ID:</span> {comment.id}
                                </div>
                                <div>
                                    <span className="font-medium">IP:</span> {comment.author_ip}
                                </div>
                                <div>
                                    <span className="font-medium">Creado:</span> {new Date(comment.created_at).toLocaleDateString('es-ES')}
                                </div>
                                <div>
                                    <span className="font-medium">Caracteres:</span> {formData.content.length}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">Palabras:</span> {formData.content && formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
