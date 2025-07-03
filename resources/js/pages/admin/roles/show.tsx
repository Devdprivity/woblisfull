import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type Role, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Edit, Shield, Users, Calendar, UserCog } from 'lucide-react';

interface RoleWithUsers extends Role {
    users?: User[];
}

interface RoleShowProps {
    role: RoleWithUsers;
}

export default function RoleShow({ role }: RoleShowProps) {
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

    const formatPermissionName = (permission: string) => {
        return permission
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getPermissionColor = (permission: string) => {
        if (permission.includes('admin') || permission.includes('manage')) return 'destructive';
        if (permission.includes('create') || permission.includes('update')) return 'default';
        if (permission.includes('read') || permission.includes('view')) return 'secondary';
        return 'outline';
    };

    const getSystemRoleBadge = (roleName: string) => {
        const systemRoles = ['admin', 'client', 'company_pending', 'company_active'];
        return systemRoles.includes(roleName);
    };

    const getStatusBadge = (user: User) => {
        switch (user.status) {
            case 'active':
                return <Badge variant="default" className="text-xs">Activo</Badge>;
            case 'pending':
                return <Badge variant="secondary" className="text-xs">Pendiente</Badge>;
            case 'suspended':
                return <Badge variant="destructive" className="text-xs">Suspendido</Badge>;
            default:
                return <Badge variant="outline" className="text-xs">Desconocido</Badge>;
        }
    };

    const groupPermissionsByCategory = (permissions: string[]) => {
        const groups: { [key: string]: string[] } = {};

        permissions.forEach(permission => {
            const parts = permission.split('_');
            const category = parts.length > 1 ? parts[parts.length - 1] : 'general';

            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(permission);
        });

        return groups;
    };

    const permissionGroups = role.permissions ? groupPermissionsByCategory(role.permissions) : {};

    return (
        <AppLayout>
            <Head title={`Rol: ${role.display_name}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={route('admin.roles.index')}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <Heading title={role.display_name} />
                                {getSystemRoleBadge(role.name) && (
                                    <Badge variant="outline">Sistema</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Rol: {role.name}
                            </p>
                        </div>
                    </div>

                    <Button asChild>
                        <Link href={route('admin.roles.edit', role.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar Rol
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Role Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCog className="h-5 w-5" />
                                    Información del Rol
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Nombre</Label>
                                        <p className="font-mono text-sm bg-muted p-2 rounded">
                                            {role.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label>Nombre de Visualización</Label>
                                        <p className="font-medium">{role.display_name}</p>
                                    </div>
                                </div>

                                {role.description && (
                                    <div>
                                        <Label>Descripción</Label>
                                        <p className="text-muted-foreground">{role.description}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label>Fecha de Creación</Label>
                                        <p className="text-sm">{formatDate(role.created_at)}</p>
                                    </div>
                                    <div>
                                        <Label>Última Actualización</Label>
                                        <p className="text-sm">{formatDate(role.updated_at)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Permisos ({role.permissions?.length || 0})
                                </CardTitle>
                                <CardDescription>
                                    Permisos asignados a este rol
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {role.permissions && role.permissions.length > 0 ? (
                                    <div className="space-y-6">
                                        {Object.entries(permissionGroups).map(([category, permissions]) => (
                                            <div key={category} className="space-y-3">
                                                <h4 className="font-medium capitalize text-sm">
                                                    {category === 'general' ? 'Permisos Generales' : `Permisos de ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {permissions.map((permission, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant={getPermissionColor(permission)}
                                                            className="text-xs"
                                                        >
                                                            {formatPermissionName(permission)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>Este rol no tiene permisos asignados</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Users with this role */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Usuarios con este Rol ({role.users?.length || 0})
                                </CardTitle>
                                <CardDescription>
                                    Lista de usuarios que tienen asignado este rol
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {role.users && role.users.length > 0 ? (
                                    <div className="space-y-3">
                                        {role.users.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback>
                                                            {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-sm">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {user.account_type === 'client' ? 'Cliente' : 'Empresa'}
                                                    </Badge>
                                                    {getStatusBadge(user)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No hay usuarios con este rol</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Estadísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Usuarios</span>
                                    <Badge variant="secondary">{role.users?.length || 0}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Permisos</span>
                                    <Badge variant="secondary">{role.permissions?.length || 0}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tipo</span>
                                    <Badge variant={getSystemRoleBadge(role.name) ? 'default' : 'outline'}>
                                        {getSystemRoleBadge(role.name) ? 'Sistema' : 'Personalizado'}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Role Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Historial
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Creado</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-6">
                                        {formatDate(role.created_at)}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Última Actualización</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground ml-6">
                                        {formatDate(role.updated_at)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-3">
                                    <Button asChild className="w-full">
                                        <Link href={route('admin.roles.edit', role.id)}>
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar Rol
                                        </Link>
                                    </Button>

                                    <Button variant="outline" asChild className="w-full">
                                        <Link href={route('admin.roles.index')}>
                                            Ver Todos los Roles
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Helper component for labels
function Label({ children }: { children: React.ReactNode }) {
    return <span className="text-sm font-medium text-muted-foreground">{children}</span>;
}
