import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type Role } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Plus, Search, Users, UserCog, Shield, Trash2, Edit, Eye } from 'lucide-react';
import { useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface RoleWithCount extends Role {
    users_count?: number;
}

interface RolesIndexProps {
    roles: {
        data: RoleWithCount[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: {
        total: number;
        with_users: number;
        permissions_avg: number;
    };
    filters: {
        search?: string;
    };
}

export default function RolesIndex({
    roles = { data: [], links: [], meta: { current_page: 1, from: 0, last_page: 1, per_page: 15, to: 0, total: 0 } },
    stats = { total: 0, with_users: 0, permissions_avg: 0 },
    filters = {}
}: RolesIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const { delete: destroy } = useForm();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('admin.roles.index'), { search: searchTerm }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDeleteRole = (role: RoleWithCount) => {
        if (confirm(`¿Estás seguro de que deseas eliminar el rol "${role.display_name}"?`)) {
            destroy(route('admin.roles.destroy', role.id), {
                preserveScroll: true,
            });
        }
    };

    const formatPermissionName = (permission: string) => {
        // Convert snake_case to readable format
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

    return (
        <AppLayout>
            <Head title="Gestión de Roles y Permisos" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Heading title="Gestión de Roles y Permisos" />
                    <Button asChild>
                        <Link href={route('admin.roles.create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Rol
                        </Link>
                    </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Roles</CardTitle>
                            <UserCog className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground">Roles configurados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Roles con Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.with_users?.toLocaleString() || 0}</div>
                            <p className="text-xs text-muted-foreground">Roles activos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Permisos Promedio</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.permissions_avg || 0}</div>
                            <p className="text-xs text-muted-foreground">Por rol</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Buscar Roles</CardTitle>
                        <CardDescription>
                            Busca roles por nombre, nombre de visualización o descripción
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Buscar roles..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Button type="submit">Buscar</Button>
                            {searchTerm && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm('');
                                        router.get(route('admin.roles.index'));
                                    }}
                                >
                                    Limpiar
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Roles List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Roles ({roles?.meta?.total || 0})</CardTitle>
                        <CardDescription>
                            Gestiona los roles y permisos del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {roles?.data?.map((role) => (
                                <div key={role.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{role.display_name}</h3>
                                            {getSystemRoleBadge(role.name) && (
                                                <Badge variant="outline" className="text-xs">
                                                    Sistema
                                                </Badge>
                                            )}
                                            <Badge variant="secondary" className="text-xs">
                                                {role.name}
                                            </Badge>
                                        </div>

                                        {role.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {role.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Users className="h-3 w-3" />
                                                {role.users_count || 0} usuarios
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                {role.permissions?.length || 0} permisos
                                            </span>
                                        </div>

                                        {role.permissions && role.permissions.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {role.permissions.slice(0, 5).map((permission, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant={getPermissionColor(permission)}
                                                        className="text-xs"
                                                    >
                                                        {formatPermissionName(permission)}
                                                    </Badge>
                                                ))}
                                                {role.permissions.length > 5 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{role.permissions.length - 5} más
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={route('admin.roles.show', role.id)}>
                                                <Eye className="h-3 w-3" />
                                            </Link>
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('admin.roles.edit', role.id)}>
                                                        <Edit className="h-3 w-3 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                {!getSystemRoleBadge(role.name) && (
                                                    <DropdownMenuItem
                                                        className="text-red-600"
                                                        onClick={() => handleDeleteRole(role)}
                                                        disabled={(role.users_count || 0) > 0}
                                                    >
                                                        <Trash2 className="h-3 w-3 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay roles para mostrar
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {roles?.links && roles.links.length > 3 && (
                            <div className="flex justify-center mt-6 space-x-1">
                                {roles.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
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
