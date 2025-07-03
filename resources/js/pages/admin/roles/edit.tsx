import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Shield, AlertTriangle } from 'lucide-react';

interface RoleEditProps {
    role: Role;
    availablePermissions: string[];
}

export default function RoleEdit({ role, availablePermissions = [] }: RoleEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        display_name: role.display_name,
        description: role.description || '',
        permissions: role.permissions || [],
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
    };

    const handlePermissionChange = (permission: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permission]);
        } else {
            setData('permissions', data.permissions.filter(p => p !== permission));
        }
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

    const getSystemRoleBadge = (roleName: string) => {
        const systemRoles = ['admin', 'client', 'company_pending', 'company_active'];
        return systemRoles.includes(roleName);
    };

    const permissionGroups = groupPermissionsByCategory(availablePermissions);

    return (
        <AppLayout>
            <Head title={`Editar Rol: ${role.display_name}`} />

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
                                <Heading title={`Editar Rol: ${role.display_name}`} />
                                {getSystemRoleBadge(role.name) && (
                                    <Badge variant="outline">Sistema</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                ID: {role.id} • Nombre: {role.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Role Warning */}
                {getSystemRoleBadge(role.name) && (
                    <Card className="border-amber-200 bg-amber-50">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600" />
                                <div>
                                    <h4 className="font-medium text-amber-800">Rol del Sistema</h4>
                                    <p className="text-sm text-amber-700">
                                        Este es un rol del sistema. Los cambios pueden afectar el funcionamiento de la aplicación.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Información Básica</CardTitle>
                                    <CardDescription>
                                        Modifica la información básica del rol
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre del Rol</Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="ej: custom_role"
                                                className={errors.name ? 'border-red-500' : ''}
                                                disabled={getSystemRoleBadge(role.name)}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-600">{errors.name}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {getSystemRoleBadge(role.name)
                                                    ? 'Los roles del sistema no pueden cambiar su nombre'
                                                    : 'Solo letras, números y guiones bajos'
                                                }
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="display_name">Nombre de Visualización</Label>
                                            <Input
                                                id="display_name"
                                                value={data.display_name}
                                                onChange={(e) => setData('display_name', e.target.value)}
                                                placeholder="ej: Rol Personalizado"
                                                className={errors.display_name ? 'border-red-500' : ''}
                                            />
                                            {errors.display_name && (
                                                <p className="text-sm text-red-600">{errors.display_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe las responsabilidades de este rol..."
                                            rows={3}
                                            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
                                        />
                                        {errors.description && (
                                            <p className="text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Permissions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Permisos ({data.permissions.length})
                                    </CardTitle>
                                    <CardDescription>
                                        Selecciona los permisos que tendrá este rol
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {Object.entries(permissionGroups).map(([category, permissions]) => (
                                        <div key={category} className="space-y-3">
                                            <h4 className="font-medium capitalize">
                                                {category === 'general' ? 'Permisos Generales' : `Permisos de ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {permissions.map((permission) => (
                                                    <div key={permission} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={permission}
                                                            checked={data.permissions.includes(permission)}
                                                            onCheckedChange={(checked) =>
                                                                handlePermissionChange(permission, checked as boolean)
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={permission}
                                                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                                                        >
                                                            <Badge
                                                                variant={getPermissionColor(permission)}
                                                                className="text-xs"
                                                            >
                                                                {formatPermissionName(permission)}
                                                            </Badge>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {availablePermissions.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p>No hay permisos disponibles</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Vista Previa</CardTitle>
                                    <CardDescription>
                                        Cómo se verá el rol actualizado
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">
                                                {data.display_name}
                                            </h3>
                                            <Badge variant="secondary" className="text-xs">
                                                {data.name}
                                            </Badge>
                                            {getSystemRoleBadge(role.name) && (
                                                <Badge variant="outline" className="text-xs">
                                                    Sistema
                                                </Badge>
                                            )}
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            {data.description || 'Sin descripción'}
                                        </p>

                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Shield className="h-3 w-3" />
                                            {data.permissions.length} permisos
                                        </div>

                                        {data.permissions.length > 0 && (
                                            <div className="space-y-2">
                                                <span className="text-sm font-medium">Permisos:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {data.permissions.slice(0, 3).map((permission, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant={getPermissionColor(permission)}
                                                            className="text-xs"
                                                        >
                                                            {formatPermissionName(permission)}
                                                        </Badge>
                                                    ))}
                                                    {data.permissions.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{data.permissions.length - 3} más
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link href={route('admin.roles.show', role.id)}>
                                                Ver Rol
                                            </Link>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            asChild
                                            className="w-full"
                                        >
                                            <Link href={route('admin.roles.index')}>
                                                Cancelar
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
