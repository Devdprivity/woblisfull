import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AppLayout from '@/layouts/app-layout';
import InputError from '@/components/input-error';
import { ArrowLeft, Plus, Trash2, Eye, DollarSign, Users, Clock } from 'lucide-react';

interface PlanData {
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    responses_included: number;
    delivery_time: string;
    features: string[];
    is_active: boolean;
    sort_order: number;
    [key: string]: string | number | boolean | string[];
}

export default function PlanCreate() {
    const { data, setData, post, processing, errors } = useForm<PlanData>({
        name: '',
        slug: '',
        category: 'pyme',
        price: 0,
        description: '',
        responses_included: 100,
        delivery_time: '48 horas hábiles',
        features: [],
        is_active: true,
        sort_order: 1,
    });

    const [newFeature, setNewFeature] = useState('');

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    };

    const handleNameChange = (name: string) => {
        setData('name', name);
        if (!data.slug || data.slug === generateSlug(data.name)) {
            setData('slug', generateSlug(name));
        }
    };

    const addFeature = () => {
        if (newFeature.trim() && !data.features.includes(newFeature.trim())) {
            setData('features', [...data.features, newFeature.trim()]);
            setNewFeature('');
        }
    };

    const removeFeature = (index: number) => {
        const newFeatures = data.features.filter((_, i) => i !== index);
        setData('features', newFeatures);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.plans.store'));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const getCategoryBadge = (category: string) => {
        if (category === 'pyme') {
            return <Badge variant="default" className="bg-blue-100 text-blue-800">PYME</Badge>;
        } else if (category === 'corp') {
            return <Badge variant="default" className="bg-purple-100 text-purple-800">CORP</Badge>;
        }
        return <Badge variant="secondary">{category.toUpperCase()}</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Crear Plan" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.plans.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Crear Plan</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Crear un nuevo plan de suscripción
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Básica</CardTitle>
                                    <CardDescription>
                                        Detalles principales del plan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Nombre del Plan</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                placeholder="Ej: Plan Pro"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div>
                                            <Label htmlFor="slug">Slug (URL)</Label>
                                            <Input
                                                id="slug"
                                                type="text"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                placeholder="plan-pro"
                                                required
                                            />
                                            <InputError message={errors.slug} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="category">Categoría</Label>
                                            <Select
                                                value={data.category}
                                                onValueChange={(value) => setData('category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar categoría" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pyme">PYME</SelectItem>
                                                    <SelectItem value="corp">CORP</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category} />
                                        </div>

                                        <div>
                                            <Label htmlFor="price">Precio (CLP)</Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', parseInt(e.target.value) || 0)}
                                                placeholder="120000"
                                                min="0"
                                                required
                                            />
                                            <InputError message={errors.price} />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descripción</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe las características principales del plan..."
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="responses_included">Respuestas Incluidas</Label>
                                            <Input
                                                id="responses_included"
                                                type="number"
                                                value={data.responses_included}
                                                onChange={(e) => setData('responses_included', parseInt(e.target.value) || 0)}
                                                placeholder="100"
                                                min="1"
                                                required
                                            />
                                            <InputError message={errors.responses_included} />
                                        </div>

                                        <div>
                                            <Label htmlFor="delivery_time">Tiempo de Entrega</Label>
                                            <Input
                                                id="delivery_time"
                                                type="text"
                                                value={data.delivery_time}
                                                onChange={(e) => setData('delivery_time', e.target.value)}
                                                placeholder="48 horas hábiles"
                                                required
                                            />
                                            <InputError message={errors.delivery_time} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="sort_order">Orden de Visualización</Label>
                                            <Input
                                                id="sort_order"
                                                type="number"
                                                value={data.sort_order}
                                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                                placeholder="1"
                                                min="0"
                                                required
                                            />
                                            <InputError message={errors.sort_order} />
                                        </div>

                                        <div className="flex items-center space-x-2 pt-6">
                                            <Checkbox
                                                id="is_active"
                                                checked={data.is_active}
                                                onCheckedChange={(checked) => setData('is_active', checked as boolean)}
                                            />
                                            <Label htmlFor="is_active">Plan Activo</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Características</CardTitle>
                                    <CardDescription>
                                        Lista de características y beneficios del plan
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            type="text"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            placeholder="Agregar nueva característica..."
                                            className="flex-1"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addFeature();
                                                }
                                            }}
                                        />
                                        <Button type="button" onClick={addFeature} variant="outline">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {data.features.length > 0 && (
                                        <div className="space-y-2">
                                            {data.features.map((feature, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                    <span className="text-sm">{feature}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFeature(index)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <InputError message={errors.features} />
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('admin.plans.index')}>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creando...' : 'Crear Plan'}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Preview */}
                    <div>
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="h-5 w-5" />
                                    Vista Previa
                                </CardTitle>
                                <CardDescription>
                                    Cómo se verá el plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold text-lg">
                                            {data.name || 'Nombre del Plan'}
                                        </h3>
                                        {getCategoryBadge(data.category)}
                                        <Badge variant={data.is_active ? 'default' : 'outline'} className={data.is_active ? 'bg-green-100 text-green-800' : 'text-gray-500 border-gray-300'}>
                                            {data.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                        {data.description || 'Descripción del plan...'}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            {formatPrice(data.price)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            {data.responses_included} respuestas
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {data.delivery_time}
                                        </span>
                                    </div>

                                    {data.features.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Características:</h4>
                                            <ul className="text-xs space-y-1">
                                                {data.features.map((feature, index) => (
                                                    <li key={index} className="text-gray-600 dark:text-gray-400">
                                                        • {feature}
                                                    </li>
                                                ))}
                                            </ul>
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
