import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';
import {
    ArrowLeft,
    Edit,
    Trash2,
    User as UserIcon,
    Mail,
    Building2,
    Calendar,
    IdCard,
    Phone,
    MapPin,
    Shield,
    CreditCard,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';

interface UserShowProps {
    user: User;
}

export default function UserShow({ user }: UserShowProps) {
    const toggleStatus = () => {
        router.post(route('admin.users.toggle-status', user.id), {}, {
            preserveScroll: true
        });
    };

    const deleteUser = () => {
        if (confirm(`¿Estás seguro de eliminar el usuario "${user.name}"?`)) {
            router.delete(route('admin.users.destroy', user.id));
        }
    };

    const getAccountTypeBadge = (type: string) => {
        if (type === 'company') {
            return <Badge variant="default" className="bg-blue-100 text-blue-800">Empresa</Badge>;
        }
        return <Badge variant="default" className="bg-gray-100 text-gray-800">Cliente</Badge>;
    };

    const getStatusBadge = (status: string) => {
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AppLayout>
            <Head title={`Usuario: ${user.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('admin.users.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">{user.name}</h1>
                                {getAccountTypeBadge(user.account_type)}
                                {getStatusBadge(user.status)}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Detalles completos del usuario
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            onClick={toggleStatus}
                            variant="outline"
                            size="sm"
                            className={user.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        >
                            {user.status === 'active' ? (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Suspender
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Activar
                                </>
                            )}
                        </Button>

                        <Link href={route('admin.users.edit', user.id)}>
                            <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>

                        <Button
                            onClick={deleteUser}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* User Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription>
                                    Datos básicos del usuario
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-16 h-16 rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-medium text-gray-500">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold">{user.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <Mail className="h-4 w-4" />
                                            {user.email}
                                        </p>
                                        {user.provider && (
                                            <p className="text-sm text-gray-500">
                                                Registrado vía {user.provider === 'google' ? 'Google' : user.provider}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Tipo de Cuenta
                                        </h4>
                                        {getAccountTypeBadge(user.account_type)}
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            Estado
                                        </h4>
                                        {getStatusBadge(user.status)}
                                    </div>

                                    {user.role && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Rol
                                            </h4>
                                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                                <Shield className="h-3 w-3" />
                                                {user.role.display_name}
                                            </Badge>
                                        </div>
                                    )}

                                    {user.email_verified_at && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Email Verificado
                                            </h4>
                                            <Badge variant="default" className="bg-green-100 text-green-800">
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verificado
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Company Information - Only if account_type is company */}
                        {user.account_type === 'company' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5" />
                                        Información Empresarial
                                    </CardTitle>
                                    <CardDescription>
                                        Datos de la empresa
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {user.company_name && (
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Nombre de la Empresa
                                                </h4>
                                                <p className="font-semibold">{user.company_name}</p>
                                            </div>
                                        )}

                                        {user.company_rut && (
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    RUT
                                                </h4>
                                                <p className="font-semibold flex items-center gap-1">
                                                    <IdCard className="h-4 w-4" />
                                                    {user.company_rut}
                                                </p>
                                            </div>
                                        )}

                                        {user.company_phone && (
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Teléfono
                                                </h4>
                                                <p className="font-semibold flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    {user.company_phone}
                                                </p>
                                            </div>
                                        )}

                                        {user.company_address && (
                                            <div>
                                                <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                    Dirección
                                                </h4>
                                                <p className="font-semibold flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {user.company_address}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {user.plan && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                Plan Contratado
                                            </h4>
                                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-semibold text-lg">{user.plan.name}</h5>
                                                    <Badge variant="outline" className="text-green-600">
                                                        {formatPrice(user.plan.price)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {user.plan.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{user.plan.responses_included} respuestas</span>
                                                    <span>{user.plan.delivery_time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {user.activated_at && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Fecha de Activación
                                            </h4>
                                            <p className="text-sm">
                                                {new Date(user.activated_at).toLocaleDateString('es-CL', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {user.activation_notes && (
                                                <div className="mt-2">
                                                    <h5 className="font-medium text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Notas de Activación
                                                    </h5>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {user.activation_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Stats and Actions */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                                <CardDescription>
                                    Información general
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Estado</span>
                                    {getStatusBadge(user.status)}
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Tipo</span>
                                    {getAccountTypeBadge(user.account_type)}
                                </div>

                                {user.role && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Rol</span>
                                        <Badge variant="outline" className="text-xs">
                                            {user.role.display_name}
                                        </Badge>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Email</span>
                                    {user.email_verified_at ? (
                                        <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                            Verificado
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-600 text-xs">
                                            No verificado
                                        </Badge>
                                    )}
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
                                        <span className="text-gray-500">Registrado</span>
                                        <span className="font-medium">
                                            {new Date(user.created_at).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Actualizado</span>
                                        <span className="font-medium">
                                            {new Date(user.updated_at).toLocaleDateString('es-CL')}
                                        </span>
                                    </div>
                                    {user.email_verified_at && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Email verificado</span>
                                            <span className="font-medium">
                                                {new Date(user.email_verified_at).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                    )}
                                    {user.activated_at && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">Activado</span>
                                            <span className="font-medium">
                                                {new Date(user.activated_at).toLocaleDateString('es-CL')}
                                            </span>
                                        </div>
                                    )}
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
                                <Link href={route('admin.users.edit', user.id)} className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar Usuario
                                    </Button>
                                </Link>

                                <Button
                                    onClick={toggleStatus}
                                    variant="outline"
                                    className={`w-full justify-start ${user.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}`}
                                >
                                    {user.status === 'active' ? (
                                        <>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Suspender Usuario
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Activar Usuario
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={deleteUser}
                                    variant="outline"
                                    className="w-full justify-start text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar Usuario
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
