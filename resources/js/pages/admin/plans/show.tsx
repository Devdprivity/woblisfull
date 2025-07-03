import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Plan, User } from '@/types';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Users,
    Clock,
    Package,
    CheckCircle,
    Calendar,
    ToggleLeft,
    ToggleRight,
    Building2,
    Mail
} from 'lucide-react';

interface PlanWithUsers extends Plan {
    users: User[];
}

interface PlanShowProps {
    plan: PlanWithUsers;
}

export default function PlanShow({ plan }: PlanShowProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const toggleStatus = () => {
        router.post(route('admin.plans.toggle-status', plan.id), {}, {
            preserveScroll: true
        });
    };

    const deletePlan = () => {
        if (confirm(`¿Estás seguro de eliminar el plan "${plan.name}"?`)) {
            router.delete(route('admin.plans.destroy', plan.id));
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

    const getUserStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800">Activo</Badge>;
            case 'pending':
                return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
            case 'suspended':
                return <Badge variant="default" className="bg-red-100 text-red-800">Suspendido</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title={`Plan: ${plan.name}`} />

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
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">{plan.name}</h1>
                                {getCategoryBadge(plan.category)}
                                {getStatusBadge(plan.is_active)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Detalles completos del plan
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={toggleStatus}
                            variant="outline"
                            size="sm"
                            className={plan.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        >
                            {plan.is_active ? (
                                <>
                                    <ToggleLeft className="h-4 w-4 mr-2" />
                                    Desactivar
                                </>
                            ) : (
                                <>
                                    <ToggleRight className="h-4 w-4 mr-2" />
                                    Activar
                                </>
                            )}
                        </Button>

                        <Link href={route('admin.plans.edit', plan.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>

                        <Button
                            onClick={deletePlan}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={plan.users.length > 0}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Plan Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Información del Plan
                                </CardTitle>
                                <CardDescription>
                                    Detalles principales y características
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Nombre
                                        </h3>
                                        <p className="text-lg font-semibold">{plan.name}</p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Slug
                                        </h3>
                                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                            {plan.slug}
                                        </code>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Precio
                                        </h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            {formatPrice(plan.price)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Respuestas Incluidas
                                        </h3>
                                        <p className="text-lg font-semibold flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            {plan.responses_included.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Tiempo de Entrega
                                        </h3>
                                        <p className="text-lg font-semibold flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {plan.delivery_time}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Orden de Visualización
                                        </h3>
                                        <p className="text-lg font-semibold">#{plan.sort_order}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        Descripción
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                {plan.features && plan.features.length > 0 && (
                                    <div>
                                        <h3 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            Características ({plan.features.length})
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {plan.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                                                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    <span className="text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Users with this Plan */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Usuarios con este Plan ({plan.users.length})
                                </CardTitle>
                                <CardDescription>
                                    Lista de usuarios que tienen asignado este plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {plan.users.length > 0 ? (
                                    <div className="space-y-3">
                                        {plan.users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                                            <Mail className="h-3 w-3" />
                                                            {user.email}
                                                            {user.company_name && (
                                                                <>
                                                                    <Building2 className="h-3 w-3 ml-2" />
                                                                    {user.company_name}
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getUserStatusBadge(user.status)}
                                                    <Badge variant="outline" className="text-xs">
                                                        {user.account_type === 'company' ? 'Empresa' : 'Cliente'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            Sin usuarios asignados
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Este plan aún no tiene usuarios asignados.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Stats and Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                                <CardDescription>
                                    Información general del plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Estado</span>
                                    {getStatusBadge(plan.is_active)}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Usuarios</span>
                                    <span className="font-semibold">{plan.users.length}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Categoría</span>
                                    {getCategoryBadge(plan.category)}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Características</span>
                                    <span className="font-semibold">{plan.features?.length || 0}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Historial
                                </CardTitle>
                                <CardDescription>
                                    Fechas importantes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Creado</span>
                                        <span className="font-medium">
                                            {new Date(plan.created_at).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Actualizado</span>
                                        <span className="font-medium">
                                            {new Date(plan.updated_at).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                                <CardDescription>
                                    Operaciones disponibles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Link href={route('admin.plans.edit', plan.id)} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar Plan
                                    </Button>
                                </Link>

                                <Button
                                    onClick={toggleStatus}
                                    variant="outline"
                                    className={`w-full justify-start ${plan.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                                >
                                    {plan.is_active ? (
                                        <>
                                            <ToggleLeft className="h-4 w-4 mr-2" />
                                            Desactivar Plan
                                        </>
                                    ) : (
                                        <>
                                            <ToggleRight className="h-4 w-4 mr-2" />
                                            Activar Plan
                                        </>
                                    )}
                                </Button>

                                {plan.users.length === 0 && (
                                    <Button
                                        onClick={deletePlan}
                                        variant="outline"
                                        className="w-full justify-start text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar Plan
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
