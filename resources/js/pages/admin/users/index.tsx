import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type Plan, type Role, type User } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { Building2, CheckCircle, Eye, MoreHorizontal, Pause, Plus, Search, Users, XCircle } from 'lucide-react';
import { useState } from 'react';

interface PaginationLink {
    url?: string;
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

interface UsersIndexProps {
    users: {
        data: (User & { role: Role; plan?: Plan })[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: {
        total: number;
        clients: number;
        companies: number;
        pending: number;
        active: number;
        suspended: number;
    };
    filters: {
        account_type?: string;
        status?: string;
        role?: string;
        search?: string;
    };
    roles: Role[];
}

const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        active: 'bg-green-100 text-green-800 border-green-200',
        suspended: 'bg-red-100 text-red-800 border-red-200',
    };

    const labels = {
        pending: 'Pendiente',
        active: 'Activo',
        suspended: 'Suspendido',
    };

    return (
        <Badge variant="outline" className={variants[status as keyof typeof variants]}>
            {labels[status as keyof typeof labels]}
        </Badge>
    );
};

const AccountTypeBadge = ({ type }: { type: string }) => {
    const variants = {
        client: 'bg-blue-100 text-blue-800 border-blue-200',
        company: 'bg-purple-100 text-purple-800 border-purple-200',
    };

    const labels = {
        client: 'Cliente',
        company: 'Empresa',
    };

    return (
        <Badge variant="outline" className={variants[type as keyof typeof variants]}>
            {labels[type as keyof typeof labels]}
        </Badge>
    );
};

export default function UsersIndex({
    users = { data: [], links: [], meta: { current_page: 1, from: 0, last_page: 1, per_page: 15, to: 0, total: 0 } },
    stats = { total: 0, clients: 0, companies: 0, pending: 0, active: 0, suspended: 0 },
    filters = {},
    roles = []
}: UsersIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [accountTypeFilter, setAccountTypeFilter] = useState(filters.account_type || 'all');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
    const [roleFilter, setRoleFilter] = useState(filters.role || 'all');

    const { delete: deleteUser } = useForm();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValue) params.append('search', searchValue);
        if (accountTypeFilter && accountTypeFilter !== 'all') params.append('account_type', accountTypeFilter);
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
        if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);

        router.get(route('admin.users.index', {}), Object.fromEntries(params));
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams();
        if (searchValue) params.append('search', searchValue);
        if (accountTypeFilter && accountTypeFilter !== 'all') params.append('account_type', accountTypeFilter);
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);
        if (roleFilter && roleFilter !== 'all') params.append('role', roleFilter);

        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.get(route('admin.users.index', {}), Object.fromEntries(params));
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setAccountTypeFilter('all');
        setStatusFilter('all');
        setRoleFilter('all');
        router.get(route('admin.users.index'));
    };

    const handleDeleteUser = (user: User) => {
        deleteUser(route('admin.users.destroy', user.id));
    };

    const handleToggleStatus = (user: User) => {
        router.post(route('admin.users.toggle-status', user.id));
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Gestión de Usuarios', href: '/admin/users' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title="Gestión de Usuarios"
                            description="Administra todos los usuarios del sistema"
                        />
                    </div>
                    <Button asChild>
                        <Link href={route('admin.users.create')}>
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Usuario
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                            <Users className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats?.clients || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Empresas</CardTitle>
                            <Building2 className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{stats?.companies || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                            <XCircle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Activos</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suspendidos</CardTitle>
                            <Pause className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.suspended || 0}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>
                            Filtra y busca usuarios específicos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, email..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={accountTypeFilter} onValueChange={(value) => {
                                setAccountTypeFilter(value);
                                handleFilter('account_type', value === 'all' ? '' : value);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo de cuenta" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                    <SelectItem value="client">Clientes</SelectItem>
                                    <SelectItem value="company">Empresas</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={(value) => {
                                setStatusFilter(value);
                                handleFilter('status', value === 'all' ? '' : value);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los estados</SelectItem>
                                    <SelectItem value="pending">Pendientes</SelectItem>
                                    <SelectItem value="active">Activos</SelectItem>
                                    <SelectItem value="suspended">Suspendidos</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={roleFilter} onValueChange={(value) => {
                                setRoleFilter(value);
                                handleFilter('role', value === 'all' ? '' : value);
                            }}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Rol" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los roles</SelectItem>
                                    {roles?.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.display_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                <Button variant="default" onClick={handleSearch} className="flex-1">
                                    Buscar
                                </Button>
                                <Button variant="outline" onClick={handleClearFilters}>
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios ({users?.meta?.total || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users?.data?.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium">{user.name}</h3>
                                                <AccountTypeBadge type={user.account_type} />
                                                <StatusBadge status={user.status} />
                                            </div>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            {user.company_name && (
                                                <p className="text-sm text-muted-foreground">
                                                    <Building2 className="inline h-3 w-3 mr-1" />
                                                    {user.company_name}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">
                                                    {user.role?.display_name || 'Sin rol'}
                                                </Badge>
                                                {user.plan && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {user.plan.name}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.users.show', user.id)}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('admin.users.edit', user.id)}>
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                                    {user.status === 'active' ? 'Suspender' : 'Activar'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay usuarios para mostrar
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {users?.links && users.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex space-x-1">
                                    {users.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
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
