import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type Plan, type Role, type User } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Building2, Calendar, CheckCircle, Mail, MapPin, Pause, Phone, Play, User as UserIcon, XCircle } from 'lucide-react';

interface CompanyShowProps {
    company: User & { role: Role; plan?: Plan };
}

const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        active: 'bg-green-100 text-green-800 border-green-200',
        suspended: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
        pending: 'Pendiente',
        active: 'Activa',
        suspended: 'Suspendida',
    };

    const icons = {
        pending: XCircle,
        active: CheckCircle,
        suspended: Pause,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
        <Badge variant="outline" className={variants[status as keyof typeof variants]}>
            <Icon className="w-3 h-3 mr-1" />
            {labels[status as keyof typeof labels]}
        </Badge>
    );
};

export default function CompanyShow({ company }: CompanyShowProps) {
    const { post } = useForm();

    const handleActivateCompany = () => {
        post(route('admin.companies.activate', company.id));
    };

    const handleSuspendCompany = () => {
        post(route('admin.companies.suspend', company.id));
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    const formatDate = (date: string | null | undefined) => {
        if (!date) return 'No disponible';
        return new Date(date).toLocaleDateString('es-CL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Gestión de Empresas', href: '/admin/companies' },
                { title: company.company_name || 'Empresa', href: '#' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.companies.index')}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Link>
                        </Button>
                        <div>
                            <Heading
                                title={company.company_name || 'Empresa sin nombre'}
                                description="Detalles completos de la empresa"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {company.status === 'pending' && (
                            <Button
                                onClick={handleActivateCompany}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Activar Empresa
                            </Button>
                        )}
                        {company.status === 'active' && (
                            <Button
                                onClick={handleSuspendCompany}
                                variant="destructive"
                            >
                                <Pause className="h-4 w-4 mr-2" />
                                Suspender Empresa
                            </Button>
                        )}
                        {company.status === 'suspended' && (
                            <Button
                                onClick={handleActivateCompany}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Play className="h-4 w-4 mr-2" />
                                Reactivar Empresa
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información de la Empresa */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building2 className="h-5 w-5 mr-2" />
                                    Información de la Empresa
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={company.avatar} />
                                        <AvatarFallback className="text-lg">
                                            {getInitials(company.company_name || company.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">{company.company_name}</h3>
                                        <p className="text-muted-foreground">RUT: {company.company_rut}</p>
                                        <StatusBadge status={company.status} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Dirección</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground ml-6">
                                            {company.company_address || 'No especificada'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Teléfono</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground ml-6">
                                            {company.company_phone || 'No especificado'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información del Contacto */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <UserIcon className="h-5 w-5 mr-2" />
                                    Información del Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Nombre del Responsable</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground ml-6">{company.name}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Email</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground ml-6">{company.email}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fechas y Activación */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Fechas Importantes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Fecha de Registro</span>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(company.created_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Fecha de Activación</span>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(company.activated_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Última Actualización</span>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(company.updated_at)}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Verificación de Email</span>
                                        <p className="text-sm text-muted-foreground">
                                            {company.email_verified_at ? 'Verificado' : 'Pendiente'}
                                        </p>
                                    </div>
                                </div>

                                {company.activation_notes && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Notas de Activación</span>
                                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                            {company.activation_notes}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Plan y Rol */}
                    <div className="space-y-6">
                        {/* Plan Actual */}
                        {company.plan && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Plan Actual</CardTitle>
                                    <CardDescription>
                                        Información del plan contratado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold">{company.plan.name}</h3>
                                        <p className="text-2xl font-bold text-primary">
                                            ${company.plan.price.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-muted-foreground">por mes</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Respuestas incluidas:</span>
                                            <span className="font-medium">{company.plan.responses_included.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Tiempo de entrega:</span>
                                            <span className="font-medium">{company.plan.delivery_time}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Categoría:</span>
                                            <span className="font-medium capitalize">{company.plan.category}</span>
                                        </div>
                                    </div>

                                    {company.plan.features && company.plan.features.length > 0 && (
                                        <div className="space-y-2">
                                            <span className="text-sm font-medium">Características:</span>
                                            <ul className="text-sm text-muted-foreground space-y-1">
                                                {company.plan.features.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <Button variant="outline" className="w-full">
                                        Cambiar Plan
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {/* Información del Rol */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Rol y Permisos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium">{company.role?.display_name}</h4>
                                    <p className="text-sm text-muted-foreground">{company.role?.description}</p>
                                </div>

                                {company.role?.permissions && company.role.permissions.length > 0 && (
                                    <div className="space-y-2">
                                        <span className="text-sm font-medium">Permisos:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {company.role.permissions.map((permission, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {permission}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Acciones Rápidas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link href={`mailto:${company.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Enviar Email
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <UserIcon className="h-4 w-4 mr-2" />
                                    Ver Historial
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Building2 className="h-4 w-4 mr-2" />
                                    Generar Reporte
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
