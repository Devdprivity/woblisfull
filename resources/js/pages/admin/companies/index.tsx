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
import { Building2, CheckCircle, Eye, MoreHorizontal, Pause, Play, Search, XCircle } from 'lucide-react';
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

interface CompaniesIndexProps {
    companies: {
        data: (User & { role: Role; plan?: Plan })[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    stats: {
        total: number;
        pending: number;
        active: number;
        suspended: number;
    };
    filters: {
        status?: string;
        search?: string;
    };
    plans: Plan[];
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

    return (
        <Badge variant="outline" className={variants[status as keyof typeof variants]}>
            {labels[status as keyof typeof labels]}
        </Badge>
    );
};

export default function CompaniesIndex({
    companies = { data: [], links: [], meta: { current_page: 1, from: 0, last_page: 1, per_page: 15, to: 0, total: 0 } },
    stats = { total: 0, pending: 0, active: 0, suspended: 0 },
    filters = {}
}: CompaniesIndexProps) {
    const [searchValue, setSearchValue] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || 'all');

    const { post } = useForm();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchValue) params.append('search', searchValue);
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

        router.get(route('admin.companies.index', {}), Object.fromEntries(params));
    };

    const handleFilter = (key: string, value: string) => {
        const params = new URLSearchParams();
        if (searchValue) params.append('search', searchValue);
        if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter);

        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.get(route('admin.companies.index', {}), Object.fromEntries(params));
    };

    const handleClearFilters = () => {
        setSearchValue('');
        setStatusFilter('all');
        router.get(route('admin.companies.index'));
    };

    const handleActivateCompany = (company: User) => {
        post(route('admin.companies.activate', company.id));
    };

    const handleSuspendCompany = (company: User) => {
        post(route('admin.companies.suspend', company.id));
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
                { title: 'Gestión de Empresas', href: '/admin/companies' },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title="Gestión de Empresas"
                            description="Administra todas las empresas del sistema"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total || 0}</div>
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
                            <CardTitle className="text-sm font-medium">Activas</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats?.active || 0}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Suspendidas</CardTitle>
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
                            Filtra y busca empresas específicas
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, empresa..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
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
                                    <SelectItem value="active">Activas</SelectItem>
                                    <SelectItem value="suspended">Suspendidas</SelectItem>
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

                {/* Companies Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Empresas ({companies?.meta?.total || 0})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {companies?.data?.map((company) => (
                                <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarImage src={company.avatar} />
                                            <AvatarFallback>{getInitials(company.company_name || company.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h3 className="font-medium">{company.company_name}</h3>
                                                <StatusBadge status={company.status} />
                                            </div>
                                            <p className="text-sm text-muted-foreground">{company.name} - {company.email}</p>
                                            {company.company_rut && (
                                                <p className="text-sm text-muted-foreground">
                                                    RUT: {company.company_rut}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-1">
                                                {company.plan && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {company.plan.name} - ${company.plan.price.toLocaleString()}
                                                    </Badge>
                                                )}
                                                {company.activated_at && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Activada: {new Date(company.activated_at).toLocaleDateString()}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href={route('admin.companies.show', company.id)}>
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
                                                {company.status === 'pending' && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleActivateCompany(company)}
                                                        className="text-green-600"
                                                    >
                                                        <Play className="h-4 w-4 mr-2" />
                                                        Activar
                                                    </DropdownMenuItem>
                                                )}
                                                {company.status === 'active' && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleSuspendCompany(company)}
                                                        className="text-red-600"
                                                    >
                                                        <Pause className="h-4 w-4 mr-2" />
                                                        Suspender
                                                    </DropdownMenuItem>
                                                )}
                                                {company.status === 'suspended' && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleActivateCompany(company)}
                                                        className="text-green-600"
                                                    >
                                                        <Play className="h-4 w-4 mr-2" />
                                                        Reactivar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center py-8 text-muted-foreground">
                                    No hay empresas para mostrar
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {companies?.links && companies.links.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <div className="flex space-x-1">
                                    {companies.links.map((link, index) => (
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
