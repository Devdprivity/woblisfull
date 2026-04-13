import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    account_type: 'client' | 'company';
    status: 'pending' | 'active' | 'suspended';
    company_name?: string;
    avatar?: string;
    role?: {
        name: string;
        display_name: string;
    };
    plan?: {
        name: string;
        price: number;
        responses_included: number;
    };
}

interface DashboardProps {
    user: User;
}

export default function Dashboard({ user }: DashboardProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-500">Activo</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500">Pendiente</Badge>;
            case 'suspended':
                return <Badge className="bg-red-500">Suspendido</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard - Zenit" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">

                {/* Welcome Section */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ¡Bienvenido, {user.name}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {user.account_type === 'company'
                            ? `Gestiona tu cuenta empresarial${user.company_name ? ' de ' + user.company_name : ''}`
                            : 'Explora todas las funcionalidades de Zenit'
                        }
                    </p>
                </div>

                {/* User Info Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">

                    {/* Account Info */}
                    <Card className="p-6">
                        <div className="flex items-center space-x-4">
                            {user.avatar && (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    {getStatusBadge(user.status)}
                                    <Badge variant="outline">
                                        {user.role?.display_name || 'Usuario'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Account Type */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-2">Tipo de Cuenta</h3>
                        <div className="space-y-2">
                            <p className="text-2xl font-bold text-[#7FFF00]">
                                {user.account_type === 'company' ? 'Empresa' : 'Cliente Individual'}
                            </p>
                            {user.company_name && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.company_name}
                                </p>
                            )}
                        </div>
                    </Card>

                    {/* Plan Info or Quick Actions */}
                    {user.plan ? (
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Plan Actual</h3>
                            <div className="space-y-2">
                                <p className="text-xl font-bold">{user.plan.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {user.plan.responses_included} respuestas incluidas
                                </p>
                                <p className="text-lg font-semibold text-[#7FFF00]">
                                    ${user.plan.price.toLocaleString('es-CL')}
                                </p>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-2">Acciones Rápidas</h3>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Explora nuestro blog y mantente al día
                                </p>
                                <a
                                    href={route('blog.index')}
                                    className="inline-block bg-[#7FFF00] text-black px-4 py-2 rounded-lg font-semibold hover:bg-[#6FEF00] transition-colors"
                                >
                                    Ver Blog
                                </a>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Company Pending Message */}
                {user.account_type === 'company' && user.status === 'pending' && (
                    <Card className="p-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                                    Cuenta Pendiente de Activación
                                </h3>
                                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                                    Tu cuenta empresarial está siendo revisada por nuestro equipo. Te contactaremos dentro de 24 horas hábiles.
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Main Content Area */}
                <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Panel Principal</h2>
                        <div className="text-center py-12">
                            <PlaceholderPattern className="mx-auto w-32 h-32 stroke-neutral-900/20 dark:stroke-neutral-100/20 mb-4" />
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.account_type === 'company' && user.status === 'active'
                                    ? 'Aquí podrás gestionar tus encuestas y ver reportes.'
                                    : user.account_type === 'company' && user.status === 'pending'
                                    ? 'Una vez activada tu cuenta, podrás acceder a todas las funcionalidades.'
                                    : 'Contenido personalizado próximamente.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
