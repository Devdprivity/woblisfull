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
import { Role, Plan } from '@/types';
import { ArrowLeft, User, Eye, Mail, Building2, IdCard } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    account_type: string;
    company_name?: string;
    company_rut?: string;
    company_address?: string;
    company_phone?: string;
    plan_id?: number;
    role_id?: number;
    status: string;
    [key: string]: string | number | boolean | undefined;
}

interface UserCreateProps {
    roles: Role[];
    plans: Plan[];
}

export default function UserCreate({ roles, plans }: UserCreateProps) {
    const { data, setData, post, processing, errors } = useForm<UserData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        account_type: 'client',
        company_name: '',
        company_rut: '',
        company_address: '',
        company_phone: '',
        plan_id: undefined,
        role_id: undefined,
        status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.users.store'));
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

    return (
        <AppLayout>
            <Head title="Crear Usuario" />

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
                            <h1 className="text-2xl font-bold">Crear Usuario</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Crear un nuevo usuario en el sistema
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
                                        Datos personales del usuario
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Nombre Completo</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Juan Pérez"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Correo Electrónico</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="juan@ejemplo.com"
                                                required
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="password">Contraseña</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div>
                                            <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="••••••••"
                                                required
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="account_type">Tipo de Cuenta</Label>
                                            <Select
                                                value={data.account_type}
                                                onValueChange={(value) => setData('account_type', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="client">Cliente</SelectItem>
                                                    <SelectItem value="company">Empresa</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.account_type} />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Estado</Label>
                                            <Select
                                                value={data.status}
                                                onValueChange={(value) => setData('status', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar estado" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Activo</SelectItem>
                                                    <SelectItem value="pending">Pendiente</SelectItem>
                                                    <SelectItem value="suspended">Suspendido</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.status} />
                                        </div>

                                        <div>
                                            <Label htmlFor="role_id">Rol</Label>
                                            <Select
                                                value={data.role_id?.toString() || 'none'}
                                                onValueChange={(value) => setData('role_id', value === 'none' ? undefined : parseInt(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar rol" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Sin rol específico</SelectItem>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.id} value={role.id.toString()}>
                                                            {role.display_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.role_id} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Company Information - Only if account_type is company */}
                            {data.account_type === 'company' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Building2 className="h-5 w-5" />
                                            Información de la Empresa
                                        </CardTitle>
                                        <CardDescription>
                                            Datos empresariales
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="company_name">Nombre de la Empresa</Label>
                                                <Input
                                                    id="company_name"
                                                    type="text"
                                                    value={data.company_name || ''}
                                                    onChange={(e) => setData('company_name', e.target.value)}
                                                    placeholder="Mi Empresa Ltda."
                                                />
                                                <InputError message={errors.company_name} />
                                            </div>

                                            <div>
                                                <Label htmlFor="company_rut">RUT de la Empresa</Label>
                                                <Input
                                                    id="company_rut"
                                                    type="text"
                                                    value={data.company_rut || ''}
                                                    onChange={(e) => setData('company_rut', e.target.value)}
                                                    placeholder="12.345.678-9"
                                                />
                                                <InputError message={errors.company_rut} />
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="company_address">Dirección</Label>
                                            <Input
                                                id="company_address"
                                                type="text"
                                                value={data.company_address || ''}
                                                onChange={(e) => setData('company_address', e.target.value)}
                                                placeholder="Av. Providencia 1234, Santiago"
                                            />
                                            <InputError message={errors.company_address} />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="company_phone">Teléfono</Label>
                                                <Input
                                                    id="company_phone"
                                                    type="text"
                                                    value={data.company_phone || ''}
                                                    onChange={(e) => setData('company_phone', e.target.value)}
                                                    placeholder="+56 2 2234 5678"
                                                />
                                                <InputError message={errors.company_phone} />
                                            </div>

                                            <div>
                                                <Label htmlFor="plan_id">Plan</Label>
                                                <Select
                                                    value={data.plan_id?.toString() || 'none'}
                                                    onValueChange={(value) => setData('plan_id', value === 'none' ? undefined : parseInt(value))}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar plan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Sin plan</SelectItem>
                                                        {plans.filter(plan => plan.is_active).map((plan) => (
                                                            <SelectItem key={plan.id} value={plan.id.toString()}>
                                                                {plan.name} - ${plan.price.toLocaleString()}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.plan_id} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('admin.users.index')}>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creando...' : 'Crear Usuario'}
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
                                    Cómo se verá el usuario
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">
                                                {data.name || 'Nombre del Usuario'}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {data.email || 'correo@ejemplo.com'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {getAccountTypeBadge(data.account_type)}
                                        {getStatusBadge(data.status)}
                                        {data.role_id && roles.find(r => r.id === data.role_id) && (
                                            <Badge variant="outline">
                                                {roles.find(r => r.id === data.role_id)?.display_name}
                                            </Badge>
                                        )}
                                    </div>

                                    {data.account_type === 'company' && data.company_name && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                            <p className="flex items-center gap-1">
                                                <Building2 className="h-3 w-3" />
                                                <strong>Empresa:</strong> {data.company_name}
                                            </p>
                                            {data.company_rut && (
                                                <p className="flex items-center gap-1">
                                                    <IdCard className="h-3 w-3" />
                                                    <strong>RUT:</strong> {data.company_rut}
                                                </p>
                                            )}
                                            {data.plan_id && plans.find(p => p.id === data.plan_id) && (
                                                <p>
                                                    <strong>Plan:</strong> {plans.find(p => p.id === data.plan_id)?.name}
                                                </p>
                                            )}
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
