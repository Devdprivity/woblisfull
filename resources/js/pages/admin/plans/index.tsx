import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { Plan } from '@/types';
import {
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    DollarSign,
    Users,
    Package,
    Calendar,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';

interface PlansStats {
    total: number;
    active: number;
    inactive: number;
    pyme: number;
    corp: number;
    total_users: number;
    avg_price: number;
}

interface PlanWithUsers extends Plan {
    users_count?: number;
}

interface PlansIndexProps {
    plans: {
        data: PlanWithUsers[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    stats: PlansStats;
    filters: {
        search?: string;
        category?: string;
        status?: string;
    };
}

export default function PlansIndex({ plans, stats, filters }: PlansIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.plans.index'),
            { ...filters, search: searchValue },
            { preserveState: true }
        );
    };

    const handleFilter = (field: string, value: string | null) => {
        const newFilters = { ...filters };
        if (value) {
            newFilters[field as keyof typeof filters] = value;
        } else {
            delete newFilters[field as keyof typeof filters];
        }

        router.get(route('admin.plans.index'), newFilters, {
            preserveState: true,
        });
    };

    const toggleStatus = (plan: Plan) => {
        router.post(
            route('admin.plans.toggle-status', plan.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show a success message
                }
            }
        );
    };

    const deletePlan = (plan: Plan) => {
        if (confirm(`¿Estás seguro de eliminar el plan "${plan.name}"?`)) {
            router.delete(route('admin.plans.destroy', plan.id), {
                preserveScroll: true,
            });
        }
    };

    const getCategoryBadge = (category: string) => {
        if (category === 'pyme') {
            return <Badge variant="default" className="bg-blue-100 text-blue-800">PYME</Badge>;
        } else if (category === 'corp') {
            return <Badge variant="default" className="bg-purple-100 text-purple-800">CORP</Badge>;
        }
        return <Badge variant="secondary">{category.toUpperCase()}</Badge>;
    };

    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>
        ) : (
            <Badge variant="outline" className="text-gray-500 border-gray-300">Inactivo</Badge>
        );
    };

    return (
        <AppLayout>
            <Head title="Gestión de Planes" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Gestión de Planes</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Administra los planes de suscripción disponibles
                        </p>
                    </div>
                    <Link href={route('admin.plans.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Plan
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Planes
                                    </p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <Package className="h-8 w-8 text-gray-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Planes Activos
                                    </p>
                                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                                </div>
                                <ToggleRight className="h-8 w-8 text-green-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Usuarios con Plan
                                    </p>
                                    <p className="text-2xl font-bold">{stats.total_users}</p>
                                </div>
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Precio Promedio
                                    </p>
                                    <p className="text-2xl font-bold">{formatPrice(stats.avg_price)}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-yellow-400" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar planes..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </form>

                            <div className="flex gap-2">
                                <Select value={filters.category || 'all'} onValueChange={(value) => handleFilter('category', value === 'all' ? null : value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas</SelectItem>
                                        <SelectItem value="pyme">PYME</SelectItem>
                                        <SelectItem value="corp">CORP</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filters.status || 'all'} onValueChange={(value) => handleFilter('status', value === 'all' ? null : value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Estado" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="active">Activos</SelectItem>
                                        <SelectItem value="inactive">Inactivos</SelectItem>
                                    </SelectContent>
                                </Select>

                                {(filters.search || filters.category || filters.status) && (
                                    <Button
                                        variant="outline"
                                        onClick={() => router.get(route('admin.plans.index'))}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Plans List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Planes ({plans.total})</CardTitle>
                        <CardDescription>
                            Lista de todos los planes de suscripción
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {plans.data.map((plan) => (
                                <div key={plan.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-lg">{plan.name}</h3>
                                                {getCategoryBadge(plan.category)}
                                                {getStatusBadge(plan.is_active)}
                                                <Badge variant="outline" className="text-xs">
                                                    {plan.users_count || 0} usuarios
                                                </Badge>
                                            </div>

                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                                {plan.description}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    {formatPrice(plan.price)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {plan.responses_included} respuestas
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {plan.delivery_time}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleStatus(plan)}
                                                className={plan.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                                            >
                                                {plan.is_active ? (
                                                    <ToggleLeft className="h-4 w-4" />
                                                ) : (
                                                    <ToggleRight className="h-4 w-4" />
                                                )}
                                            </Button>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.plans.show', plan.id)}>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Ver Detalles
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={route('admin.plans.edit', plan.id)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => deletePlan(plan)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={(plan.users_count || 0) > 0}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {plans.data.length === 0 && (
                                <div className="text-center py-8">
                                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        No hay planes disponibles
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                                        {filters.search || filters.category || filters.status
                                            ? 'No se encontraron planes con los filtros aplicados.'
                                            : 'Comienza creando tu primer plan.'
                                        }
                                    </p>
                                    {!filters.search && !filters.category && !filters.status && (
                                        <Link href={route('admin.plans.create')}>
                                            <Button>
                                                <Plus className="h-4 w-4 mr-2" />
                                                Crear Plan
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {plans.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando {plans.from} a {plans.to} de {plans.total} resultados
                                </div>

                                <div className="flex items-center space-x-2">
                                    {Array.from({ length: plans.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === plans.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => router.get(route('admin.plans.index'),
                                                { ...filters, page },
                                                { preserveState: true }
                                            )}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
