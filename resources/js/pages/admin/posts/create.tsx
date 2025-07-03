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
import { ArrowLeft, Save, Eye, Plus, X } from 'lucide-react';

export default function PostsCreate() {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image: '',
        status: 'draft',
        author_name: 'Woblis Team',
        author_email: 'team@woblis.com',
        tags: [] as string[],
        published_at: '',
    });

    const [newTag, setNewTag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Auto-generate slug from title
        if (field === 'title' && !formData.slug) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
            setFormData(prev => ({
                ...prev,
                slug: slug
            }));
        }
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/admin/posts', formData, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Crear Post" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.get('/admin/posts')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Post</h1>
                            <p className="text-gray-600">Completa la información para crear un nuevo post</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Título *</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Título del post"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={formData.slug}
                                        onChange={(e) => handleInputChange('slug', e.target.value)}
                                        placeholder="url-amigable-del-post"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="excerpt">Resumen *</Label>
                                    <textarea
                                        id="excerpt"
                                        value={formData.excerpt}
                                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                                        placeholder="Breve descripción del post (máx. 500 caracteres)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                        maxLength={500}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.excerpt.length}/500 caracteres
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="content">Contenido *</Label>
                                    <textarea
                                        id="content"
                                        value={formData.content}
                                        onChange={(e) => handleInputChange('content', e.target.value)}
                                        placeholder="Contenido completo del post"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={15}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="featured_image">Imagen Destacada</Label>
                                    <Input
                                        id="featured_image"
                                        value={formData.featured_image}
                                        onChange={(e) => handleInputChange('featured_image', e.target.value)}
                                        placeholder="URL de la imagen destacada"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Autor</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                        <Label htmlFor="author_email">Email del Autor</Label>
                                        <Input
                                            id="author_email"
                                            type="email"
                                            value={formData.author_email}
                                            onChange={(e) => handleInputChange('author_email', e.target.value)}
                                            placeholder="email@woblis.com"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Agregar tag"
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    />
                                    <Button type="button" onClick={addTag} variant="outline">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Publicación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Borrador</SelectItem>
                                            <SelectItem value="published">Publicado</SelectItem>
                                            <SelectItem value="archived">Archivado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.status === 'published' && (
                                    <div>
                                        <Label htmlFor="published_at">Fecha de Publicación</Label>
                                        <Input
                                            id="published_at"
                                            type="datetime-local"
                                            value={formData.published_at}
                                            onChange={(e) => handleInputChange('published_at', e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSubmitting ? 'Guardando...' : 'Guardar Post'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Vista Previa
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <h3 className="font-semibold">
                                            {formData.title || 'Título del post'}
                                        </h3>
                                        <p className="text-gray-600 text-xs">
                                            Por {formData.author_name}
                                        </p>
                                    </div>

                                    <p className="text-gray-700 text-xs">
                                        {formData.excerpt || 'Resumen del post...'}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={
                                                formData.status === 'published' ? 'bg-green-100 text-green-800' :
                                                formData.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }
                                        >
                                            {formData.status === 'published' ? 'Publicado' :
                                             formData.status === 'draft' ? 'Borrador' : 'Archivado'}
                                        </Badge>
                                    </div>

                                    {formData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {formData.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {formData.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{formData.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
